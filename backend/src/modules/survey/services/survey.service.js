const { fetchGoWebSurveys, fetchGoWebQualifications, registerSurvey: registerGoWeb } = require('../integrations/gowebsurveys');
const { fetchZampliaSurveys, fetchZampliaQualifications, registerSurvey: registerZamplia } = require('../integrations/zamplia');
const { fetchPollsOpinionSurveys } = require('../integrations/pollsopinion');
const { fetchMiratsQuantoSurveys } = require('../integrations/miratsquanto');
const fs = require('fs').promises;
const path = require('path');
const { SurveyProvider, Survey, Panelist, PersonaAttribute, AttributeDefinition } = require('../../../models');
const SurveyMatchingService = require('./surveyMatching.service');

const providerMapper = {
    'goweb': {
        fetchSurveys: fetchGoWebSurveys,
        fetchQualifications: fetchGoWebQualifications,
        register: registerGoWeb
    },
    'zamplia': {
        fetchSurveys: fetchZampliaSurveys,
        fetchQualifications: fetchZampliaQualifications,
        register: registerZamplia
    },
    'pollsopinion': { fetchSurveys: fetchPollsOpinionSurveys },
    'miratsquanto': { fetchSurveys: fetchMiratsQuantoSurveys }
};

// Internal Cache for all fetched surveys (Registry)
let surveyRegistry = {
    data: [],
    lastFetched: null
};
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

/**
 * Main function to get matched surveys for a user
 */
async function getAllSurveys(panelistId, forceFetch = false) {
    try {
        // Ensure registry is warm
        await refreshSurveyRegistry(forceFetch);

        if (!panelistId) return surveyRegistry.data;

        // Fetch user attributes for matching
        const panelist = await Panelist.findByPk(panelistId, {
            include: [{
                model: PersonaAttribute,
                as: 'attributes',
                include: [{ model: AttributeDefinition, as: 'definition' }]
            }]
        });

        if (!panelist) return surveyRegistry.data;

        // Load all mappings for active providers
        const { SurveyAttributeMapping, SurveyOptionMapping } = require('../../../models');
        const allMappings = await SurveyAttributeMapping.findAll({
            include: [{ model: SurveyOptionMapping, as: 'optionMappings' }]
        });

        // Format mappings for fast lookup
        const formattedMappings = {};
        const providers = await SurveyProvider.findAll();
        const providerMap = providers.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

        for (const m of allMappings) {
            const provider = providerMap[m.provider_id];
            if (!provider) continue;

            if (!formattedMappings[provider.slug]) formattedMappings[provider.slug] = {};

            const options = {};
            m.optionMappings.forEach(o => {
                options[o.internal_value] = o.provider_value;
            });

            const mappingData = { internal_key: m.internal_key, options };
            formattedMappings[provider.slug][m.provider_question_key] = mappingData;
            if (m.provider_question_id) {
                formattedMappings[provider.slug][m.provider_question_id] = mappingData;
            }
        }

        // Match and Score all surveys
        return surveyRegistry.data.map(survey => {
            const matchResult = SurveyMatchingService.match(panelist, survey, formattedMappings);
            return {
                ...survey,
                matchScore: matchResult.score,
                isMatch: matchResult.isMatch,
                failedReasons: matchResult.failedReasons // Return why it didn't match perfectly
            };
        }).sort((a, b) => b.matchScore - a.matchScore); // Always show best matches first

    } catch (error) {
        console.error('Error in getAllSurveys:', error.message);
        throw error;
    }
}

/**
 * Initiates a survey for a panelist, generating the entry link
 */
async function initiateSurvey(panelistId, providerSlug, providerSurveyId, ipAddress = '127.0.0.1') {
    const { SurveyClick, SurveyProvider, Survey } = require('../../../models');

    try {

        // 1. Get Provider
        const provider = await SurveyProvider.findOne({ where: { slug: providerSlug } });
        if (!provider) throw new Error(`Provider ${providerSlug} not found`);

        // 2. Try to find the survey in our DB (optional but good for tracking)
        const survey = await Survey.findOne({
            where: { provider_id: provider.id, provider_survey_id: String(providerSurveyId) }
        });

        // 3. Create a Click Record
        const click = await SurveyClick.create({
            panelist_id: panelistId,
            provider_id: provider.id,
            provider_survey_id: String(providerSurveyId),
            survey_id: survey ? survey.id : null,
            ip_address: ipAddress,
            status: 'pending'
        });

        // 4. Call Provider Registration Logic
        const mapper = providerMapper[providerSlug];
        if (!mapper || !mapper.register) {
            throw new Error(`Provider ${providerSlug} does not support registration yet.`);
        }

        const config = {
            baseUrl: provider.base_url,
            auth: provider.auth_config,
            listUrl: provider.list_url,
            qualification_url: provider.qualification_url
        };

        const entryLink = await mapper.register(config, providerSurveyId, panelistId, ipAddress, click.id);

        // 5. Update Click with generated link
        await click.update({ entry_link: entryLink });

        return {
            clickId: click.id,
            entryLink
        };

    } catch (error) {
        console.error('Error in initiateSurvey:', error.message);
        throw error;
    }
}

/**
 * Standardizes a survey object to a predefined structure
 */
function standardizeSurvey(s, providerSlug) {
    // Basic extraction with fallbacks
    return {
        provider: providerSlug,
        providerSurveyId: String(s.providerSurveyId || s.surveyID || s.SurveyId),
        title: s.title || s.projectBrief || s.Name || 'Survey Mission',
        payout: parseFloat(s.payout || s.surveyCPI || s.CPI) || 0,
        duration: s.duration || (s.LOI ? `${s.LOI} mins` : 'Flexible'),
        qualifications: Array.isArray(s.qualifications) ? s.qualifications : [],
        quota: {
            required: parseInt(s.quota?.target_count || s.quota?.total_required || s.surveyTargetCount || s.TotalCompleteRequired) || 0,
            remaining: parseInt(s.quota?.remaining || s.surveyRemainingCount || s.RemainingCompleteRequired) || 0
        },
        status: s.status || 'active',
        // Preserve raw data for matching/audit but standardized everything else
        raw_data: s.raw_data || s
    };
}

/**
 * Background/Manual task to pull surveys from all providers into memory
 */
async function refreshSurveyRegistry(forceFetch = false) {
    try {
        const now = Date.now();
        if (!forceFetch && surveyRegistry.lastFetched && (now - surveyRegistry.lastFetched < CACHE_DURATION)) {
            return;
        }

        const activeProviders = await SurveyProvider.findAll({ where: { is_active: true } });

        const fetchPromises = activeProviders.map(async (provider) => {
            const mapper = providerMapper[provider.slug];
            if (!mapper) return [];

            const config = {
                baseUrl: provider.base_url,
                auth: provider.auth_config,
                listUrl: provider.list_url,
                qualification_url: provider.qualification_url
            };

            const surveys = await mapper.fetchSurveys(config, 10);

            // Enrich with qualifications
            if (mapper.fetchQualifications) {
                if (provider.slug === 'goweb') {
                    // GoWeb is per-survey qualification fetch
                    await Promise.all(surveys.map(async (s) => {
                        const rawTargeting = await mapper.fetchQualifications(config, s.providerSurveyId);

                        if (rawTargeting && Object.keys(rawTargeting).length > 0) {
                            s.qualifications = normalizeGoWebQualifications(rawTargeting);
                        } else {
                            s.qualifications = [];
                        }
                    }));
                }
                else {
                    // Zamplia is per-survey
                    await Promise.all(surveys.map(async (s) => {
                        const rawQuals = await mapper.fetchQualifications(config, s.providerSurveyId);

                        if (rawQuals && rawQuals.length > 0) {
                            // Standardize Zamplia quals
                            s.qualifications = rawQuals.map(q => {
                                const allowedValues = q.AnswerCodes ? q.AnswerCodes.map(a => {
                                    // Robust extraction of the answer code/ID
                                    const code = a.AnswerCode ?? a.AnswerID ?? a.answercode ?? a.Code ?? a.Id ?? (typeof a !== 'object' ? a : null);
                                    if (code === null || code === undefined || code === 'undefined' || typeof code === 'object') return null;
                                    return String(code);
                                }).filter(v => v !== null) : [];

                                return {
                                    key: q.DemographicName,
                                    id: String(q.QuestionID),
                                    type: q.QuestionType === 'Radio' || q.QuestionType === 'MultiSelect' ? 'list' : 'text',
                                    allowed_values: allowedValues
                                };
                            });
                        } else {
                            s.qualifications = [];
                        }
                    }));
                }
            }

            return surveys.map(s => ({ ...s, providerId: provider.id }));
        });

        const results = await Promise.all(fetchPromises);
        // Standardize all results before saving to registry
        const flattened = results.flat();
        surveyRegistry.data = flattened.map(s => standardizeSurvey(s, s.provider));
        surveyRegistry.lastFetched = Date.now();

        // Persist to file for debugging/audit
        try {
            // Include matching results for a test panelist if available
            let matchAudit = [];
            try {
                const testPanelist = await Panelist.findOne({
                    where: { first_name: 'Prod', last_name: 'Test' }, // Our test user from readiness script
                    include: [{
                        model: PersonaAttribute,
                        as: 'attributes',
                        include: [{ model: AttributeDefinition, as: 'definition' }]
                    }]
                });

                if (testPanelist) {
                    const { SurveyAttributeMapping, SurveyOptionMapping } = require('../../../models');
                    const allMappings = await SurveyAttributeMapping.findAll({
                        include: [{ model: SurveyOptionMapping, as: 'optionMappings' }]
                    });

                    const providersMap = (await SurveyProvider.findAll()).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
                    const formattedMappings = {};

                    for (const m of allMappings) {
                        const provider = providersMap[m.provider_id];
                        if (!provider) continue;
                        if (!formattedMappings[provider.slug]) formattedMappings[provider.slug] = {};

                        const options = {};
                        m.optionMappings.forEach(o => { options[o.internal_value] = o.provider_value; });

                        const mappingData = { internal_key: m.internal_key, options };
                        formattedMappings[provider.slug][m.provider_question_key] = mappingData;
                        if (m.provider_question_id) {
                            formattedMappings[provider.slug][m.provider_question_id] = mappingData;
                        }
                    }

                    // Map scores directly onto a copy of the data for logging
                    const enrichedData = surveyRegistry.data.map(s => {
                        const result = SurveyMatchingService.match(testPanelist, s, formattedMappings);
                        return {
                            ...s,
                            auditMatch: {
                                isMatch: result.isMatch,
                                score: result.score,
                                failedReasons: result.failedReasons
                            }
                        };
                    });

                    matchAudit = enrichedData;
                }
                // Use enriched data for the JSON persistence
            } catch (e) {
                console.warn('Survey Service: Match audit failed:', e.message);
            }

            const cachePath = path.join(__dirname, '../../../../survey-cache.json');
            await fs.writeFile(cachePath, JSON.stringify({
                lastFetched: surveyRegistry.lastFetched,
                count: surveyRegistry.data.length,
                data: matchAudit.length > 0 ? matchAudit : surveyRegistry.data,
                auditTimestamp: new Date().toISOString()
            }, null, 2));
        } catch (fsError) {
            console.warn('Survey Service: Failed to persist registry to file:', fsError.message);
        }

    } catch (error) {
        console.error('Survey Service: Error refreshing registry:', error.message);
        throw error;
    }
}

/**
 * Persists a survey to the DB only when the user decides to visit/take it
 */
async function persistSurveyOnVisit(providerSlug, providerSurveyId) {
    const surveyData = surveyRegistry.data.find(s =>
        s.provider === providerSlug && s.providerSurveyId === providerSurveyId
    );

    if (!surveyData) {
        // If not in cache, check if already in DB
        return await Survey.findOne({ where: { provider_survey_id: providerSurveyId } });
    }

    const [survey, created] = await Survey.findOrCreate({
        where: {
            provider_id: surveyData.providerId,
            provider_survey_id: surveyData.providerSurveyId
        },
        defaults: {
            provider_id: surveyData.providerId,
            provider_survey_id: surveyData.providerSurveyId,
            title: surveyData.title,
            payout: surveyData.payout,
            qualifications: surveyData.qualifications,
            quota: surveyData.quota,
            status: 'active',
            raw_data: surveyData.raw_data
        }
    });

    return survey;
}

/**
 * Normalizes GoWeb targeting object into our qualification format
 */
function normalizeGoWebQualifications(targeting) {
    if (!targeting || typeof targeting !== 'object') return [];

    const quals = [];
    for (const [key, options] of Object.entries(targeting)) {
        if (!Array.isArray(options)) continue;

        if (key === 'age') {
            options.forEach(opt => {
                if (opt.min !== undefined && opt.max !== undefined) {
                    quals.push({
                        key: 'age',
                        type: 'range',
                        min: parseInt(opt.min),
                        max: parseInt(opt.max)
                    });
                }
            });
        } else {
            const allowedValues = options.map(opt => opt.profileAnswerKey).filter(Boolean);
            if (allowedValues.length > 0) {
                quals.push({
                    key: key,
                    type: 'list',
                    allowed_values: allowedValues
                });
            }
        }
    }
    return quals;
}

// Only start background refresh in production
if (process.env.NODE_ENV === 'production') {
    setInterval(() => refreshSurveyRegistry().catch(console.error), CACHE_DURATION);
}

async function initializeSurveyService() {
    await refreshSurveyRegistry(true); // Force first fetch on startup
}

module.exports = { getAllSurveys, refreshSurveyRegistry, persistSurveyOnVisit, initializeSurveyService };
