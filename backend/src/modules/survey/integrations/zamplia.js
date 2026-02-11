const axios = require('axios');

async function fetchZampliaSurveys(config, limit = 50) {
    try {
        const { listUrl, auth } = config;
        const { data } = await axios.get(
            listUrl,
            {
                headers: {
                    "accept": "application/json",
                    "ZAMP-KEY": auth.app_key
                }
            }
        );

        if (!data || !data.result || !data.result.data) return [];

        return data.result.data
            .slice(0, limit)
            .map(normalizeZampliaSurvey);
    } catch (error) {
        console.error('Error fetching ZampliaSurveys:', error.message);
        return [];
    }
}

function normalizeZampliaSurvey(survey) {
    return {
        provider: "zamplia",
        providerSurveyId: survey.SurveyId,
        title: survey.Name || `Survey #${survey.SurveyId}`,
        payout: parseFloat(survey.CPI) || 0,
        duration: survey.LOI ? `${survey.LOI} mins` : 'Flexible',
        qualifications: [],
        quota: { total_required: survey.TotalCompleteRequired },
        status: "active",
        raw_data: survey
    };
}

async function fetchZampliaQualifications(config, surveyId) {
    try {
        const { qualification_url, auth } = config;
        if (!qualification_url || !surveyId) return [];

        const { data } = await axios.get(
            `${qualification_url}?SurveyId=${surveyId}`,
            {
                headers: {
                    "accept": "application/json",
                    "ZAMP-KEY": auth.app_key
                }
            }
        );

        // Zamplia returns specific qualification JSON for the survey in result.data
        return data?.result?.data || [];
    } catch (error) {
        console.error(`Error fetching Zamplia Qualifications for ${surveyId}:`, error.message);
        return [];
    }
}

async function registerSurvey(config, surveyId, panelistId, ipAddress, clickId) {
    try {
        const { baseUrl, auth } = config;
        // Zamplia uses GenerateLink endpoint
        // TransactionId is our clickId
        const generateUrl = `${baseUrl}/GenerateLink?SurveyId=${surveyId}&IpAddress=${ipAddress}&TransactionId=${clickId}`;

        const { data } = await axios.get(
            generateUrl,
            {
                headers: {
                    "accept": "application/json",
                    "ZAMP-KEY": auth.app_key
                }
            }
        );

        if (data.success && data.result?.data?.[0]?.LiveLink) {
            return data.result.data[0].LiveLink;
        }

        throw new Error(data.message || 'Failed to generate Zamplia link');
    } catch (error) {
        console.error(`Error registering Zamplia survey ${surveyId}:`, error.message);
        throw error;
    }
}

module.exports = { fetchZampliaSurveys, fetchZampliaQualifications, registerSurvey };
