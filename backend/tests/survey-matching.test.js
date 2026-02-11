const SurveyMatchingService = require('../src/modules/survey/services/surveyMatching.service');

// 1. Define Mock Panelist Profile
const mockPanelist = {
    id: 'test-panelist-id',
    attributes: [
        { definition: { key: 'age' }, value: 25 },
        { definition: { key: 'gender' }, value: 'male' },
        { definition: { key: 'marital_status' }, value: 'single' },
        { definition: { key: 'country' }, value: 'USA' }
    ]
};

// 2. Define Mock Surveys (Pre-defined as requested)
const mockSurveys = [
    {
        providerSurveyId: 'S1',
        title: 'Tech Gadget Survey',
        payout: 5.0,
        qualifications: [
            { key: 'age', allowed_values: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { key: 'gender', allowed_values: ['male'] },
            { key: 'country', allowed_values: ['USA'] }
        ]
    },
    {
        providerSurveyId: 'S2',
        title: 'Single Lifestyle Habits',
        payout: 3.5,
        qualifications: [
            { key: 'marital_status', allowed_values: ['single'] },
            { key: 'age', allowed_values: [18, 19, 20, 21, 22, 23, 24, 25] },
            { key: 'country', allowed_values: ['USA', 'UK', 'CA'] }
        ]
    },
    {
        providerSurveyId: 'S3',
        title: 'International Travel Survey',
        payout: 10.0,
        qualifications: [
            { key: 'country', allowed_values: ['USA', 'Germany', 'France'] },
            { key: 'age', allowed_values: [30, 31, 32, 33, 34, 35] } // User is 25, this should mismatch
        ]
    },
    {
        providerSurveyId: 'S4',
        title: 'Global Coffee Study',
        payout: 1.0,
        qualifications: [
            { key: 'country', allowed_values: ['India', 'Brazil'] }, // User is USA, mismatch
            { key: 'gender', allowed_values: ['female'] } // User is male, mismatch
        ]
    },
    {
        providerSurveyId: 'S5',
        title: 'General Consumer Poll',
        payout: 2.0,
        qualifications: [] // No reqs, 100% score
    },
    { providerSurveyId: 'S6', title: 'US Retail Insights', payout: 1.2, qualifications: [{ key: 'country', allowed_values: ['USA'] }] },
    { providerSurveyId: 'S7', title: 'Male Grooming Research', payout: 1.5, qualifications: [{ key: 'gender', allowed_values: ['male'] }] },
    { providerSurveyId: 'S8', title: 'Solo Living Study', payout: 2.5, qualifications: [{ key: 'marital_status', allowed_values: ['single'] }] },
    { providerSurveyId: 'S9', title: 'Quarter Century Club', payout: 4.0, qualifications: [{ key: 'age', allowed_values: [25] }] },
    { providerSurveyId: 'S10', title: 'Canadian Weather Survey', payout: 0.5, qualifications: [{ key: 'country', allowed_values: ['Canada'] }] }, // Mismatch
    { providerSurveyId: 'S11', title: 'Marriage & Finance', payout: 6.0, qualifications: [{ key: 'marital_status', allowed_values: ['married'] }] }, // Mismatch
    {
        providerSurveyId: 'S12', title: 'Perfect Match Survey', payout: 8.0, qualifications: [
            { key: 'age', allowed_values: [25] },
            { key: 'gender', allowed_values: ['male'] },
            { key: 'marital_status', allowed_values: ['single'] },
            { key: 'country', allowed_values: ['USA'] }
        ]
    }
];

// 3. Execution Logic
console.log('--- Survey Matching Test ---');
console.log(`User Profile: Age: 25, Gender: male, Marital Status: single, Country: USA`);
console.log('--------------------------------------------------\n');

const results = mockSurveys.map(survey => {
    const matchResult = SurveyMatchingService.match(mockPanelist, survey);
    return {
        id: survey.providerSurveyId,
        title: survey.title,
        payout: survey.payout,
        score: matchResult.score,
        isMatch: matchResult.isMatch,
        failedReasons: matchResult.failedReasons || [],
        qualifications: survey.qualifications.map(q => `${q.key}: [${q.allowed_values.join(', ')}]`).join(' | ') || 'None'
    };
});

// 4. Sort by score (primary) and payout (secondary) and take top 10
const top10 = results
    .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.payout - a.payout;
    })
    .slice(0, 10);

console.log('Top 10 Highest Scoring Surveys:\n');
console.table(top10.map(r => ({
    ID: r.id,
    Title: r.title,
    Payout: `$${r.payout.toFixed(2)}`,
    Score: r.score.toFixed(0) + '%',
    Match: r.isMatch ? '✅ (Perfect)' : '❌ (Partial)'
})));

console.log('\n--- Normalization Data & Detailed View (Top 10) ---');
top10.forEach((r, index) => {
    console.log(`${index + 1}. [${r.id}] ${r.title}`);
    console.log(`   Score: ${r.score.toFixed(0)}% | Payout: $${r.payout.toFixed(2)}`);
    console.log(`   Requirements: ${r.qualifications}`);
    if (r.failedReasons.length > 0) {
        console.log(`   Failed Reasons: ${r.failedReasons.join(', ')}`);
    }
    console.log('--------------------------------------------------');
});

console.log('\n--- Verification Complete ---');
