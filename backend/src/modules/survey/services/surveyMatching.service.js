/**
 * Service to match users with surveys based on their profile attributes
 */
class SurveyMatchingService {
    /**
     * Matches a user's attributes against a survey's qualifications
     * @param {Object} panelist User's panelist data including attributes
     * @param {Object} survey Survey data including qualifications
     * @param {Object} mappings Pre-loaded mappings keyed by provider
     * @returns {Object} { isMatch: boolean, score: number, reasons: Array }
     */
    static match(panelist, survey, mappings = {}) {
        let qualifications = survey.qualifications || [];
        const userAttributes = panelist.attributes || [];
        const providerSlug = survey.provider;

        // Ensure qualifications is an array
        if (!Array.isArray(qualifications)) {
            qualifications = [];
        }

        // Default match if no qualifications specified
        if (qualifications.length === 0) {
            return { isMatch: true, score: 100, reasons: ['No qualifications required'] };
        }

        let matches = 0;
        const totalReqs = qualifications.length;
        const failedReasons = [];

        for (const req of qualifications) {
            const reqKey = req.key || req.id;

            // 1. Find the mapping for this provider and question
            // Try matching by the provider_question_key or provider_question_id
            const providerMappings = mappings[providerSlug] || {};
            const attrMapping = providerMappings[reqKey] || providerMappings[req.id];

            const internalKey = attrMapping?.internal_key || reqKey;

            // 2. Find user attribute by the internal key
            const userAttr = userAttributes.find(a => a.definition?.key === internalKey);

            if (!userAttr) {
                failedReasons.push(`Missing attribute: ${internalKey}`);
                continue;
            }

            // 3. Translate user value if mapping exists
            let userValue = userAttr ? userAttr.value : null;
            if (attrMapping?.options && userValue !== null) {
                const options = attrMapping.options;
                // Case-insensitive lookup for options
                const translated = options[userValue] ||
                    options[String(userValue).toLowerCase()] ||
                    options[String(userValue).charAt(0).toUpperCase() + String(userValue).slice(1)];

                if (translated !== undefined) {
                    userValue = translated;
                }
            }

            // 4. Check requirement
            const isPassing = this.checkRequirement(req, userValue);

            if (isPassing) {
                matches++;
            } else {
                const reason = `Mismatch for ${reqKey}: user has ${JSON.stringify(userValue)}, expected ${JSON.stringify(req.allowed_values || { min: req.min, max: req.max })}`;
                failedReasons.push(reason);
            }
        }

        const score = totalReqs > 0 ? (matches / totalReqs) * 100 : 100;

        return {
            isMatch: score === 100,
            score,
            failedReasons
        };
    }

    /**
     * Helper to check if a value satisfies a requirement
     */
    static checkRequirement(req, userValue) {
        if (req.type === 'list') {
            return Array.isArray(req.allowed_values) && req.allowed_values.includes(String(userValue));
        }

        if (req.type === 'range') {
            const val = Number(userValue);
            return !isNaN(val) && val >= req.min && val <= req.max;
        }

        if (req.type === 'text') {
            if (req.allowed_values && req.allowed_values.length > 0) {
                const range = String(req.allowed_values[0]);
                if (range.includes('-')) {
                    const [min, max] = range.replace(/\s/g, '').split('-').map(Number);
                    const val = Number(userValue);
                    return !isNaN(val) && val >= min && val <= max;
                }
                return req.allowed_values.includes(String(userValue));
            }
            return true;
        }

        return true;
    }
}

module.exports = SurveyMatchingService;
