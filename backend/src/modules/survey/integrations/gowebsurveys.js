const axios = require('axios');

async function fetchGoWebSurveys(config, limit = 50) {
    try {
        const { listUrl, auth } = config;
        const { data } = await axios.get(
            listUrl,
            {
                headers: {
                    'Authorization': auth.app_key,
                    'payload': auth.app_id,
                    'Accept': 'application/json'
                }
            }
        );

        if (!data || !data.surveys) return [];

        return data.surveys
            .slice(0, limit)
            .map(normalizeGoWebSurvey);
    } catch (error) {
        console.error('Error fetching GoWebSurveys:', error.message);
        return [];
    }
}

function normalizeGoWebSurvey(survey) {
    return {
        provider: "goweb",
        providerSurveyId: survey.surveyID,
        title: survey.projectBrief || 'No Description available',
        payout: parseFloat(survey.surveyCPI) || 0,
        duration: survey.LOI ? `${survey.LOI} mins` : 'Flexible',
        qualifications: [], // GoWeb usually sends these via a separate qualification endpoint
        quota: { target_count: survey.surveyTargetCount },
        status: 'active',
        raw_data: survey
    };
}

async function fetchGoWebQualifications(config, surveyId) {
    try {
        const { qualification_url, auth } = config;
        if (!qualification_url) return {};

        const { data } = await axios.post(
            qualification_url,
            {
                surveyID: surveyId
            },
            {
                headers: {
                    'Authorization': auth.app_key,
                    'payload': auth.app_id,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        // GoWeb returns nested data in 'targeting'
        return data?.targeting || {};
    } catch (error) {
        console.error(`Error fetching GoWeb Qualifications for ${surveyId}:`, error.message);
        return {};
    }
}

async function registerSurvey(config, surveyId, panelistId, ipAddress, clickId) {
    try {
        const { baseUrl, auth } = config;
        const registerUrl = `${baseUrl}/register`;

        // Use a default or config backend URL for callbacks
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const callbackBase = `${backendUrl}/api/survey/callback/goweb?clickId=${clickId}`;

        const payload = {
            surveyID: parseInt(surveyId),
            SuccessLink: `${callbackBase}&status=success&uid=${panelistId}`,
            disQualifiedLink: `${callbackBase}&status=disqualify&uid=${panelistId}`,
            TermLink: `${callbackBase}&status=terminate&uid=${panelistId}`,
            OverQuotaLink: `${callbackBase}&status=overquota&uid=${panelistId}`,
            useStaticLink: 0
        };

        const { data } = await axios.post(
            registerUrl,
            payload,
            {
                headers: {
                    'Authorization': auth.app_key,
                    'payload': String(auth.app_id),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (data.surveyInfo?.[0]?.SurveyEntryUrl) {
            // Note: The user mentioned 'pid' is used for user identification.
            // GoWeb usually appends &pid= to the SurveyEntryUrl if we need to pass something.
            // But since we registered specific links with clickId, we are good.
            return data.surveyInfo[0].SurveyEntryUrl;
        }

        throw new Error(data.apiMessages || 'Failed to register GoWeb survey');
    } catch (error) {
        console.error(`Error registering GoWeb survey ${surveyId}:`, error.message);
        throw error;
    }
}

module.exports = { fetchGoWebSurveys, fetchGoWebQualifications, registerSurvey };
