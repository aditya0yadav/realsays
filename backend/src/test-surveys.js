const { sequelize, connectDB } = require('./config/database');
const surveyService = require('./modules/survey/services/survey.service');
const seedingService = require('./services/seeding.service');
const { User, Panelist, PersonaAttribute, AttributeDefinition } = require('./models');

async function testFetchAndMatch() {
    try {
        console.log('--- Starting Survey Match & Persist Test ---');

        await connectDB();
        await sequelize.sync();
        await seedingService.seedSurveyProviders();

        // 1. Refresh Registry (In-Memory)
        console.log('\nStep 1: Refreshing Survey Registry (In-Memory)...');
        await surveyService.refreshSurveyRegistry(true);

        // 2. Mock a User and Panelist
        console.log('\nStep 2: Mocking User and Panelist for Matching...');
        const [user] = await User.findOrCreate({
            where: { email: 'test@example.com' },
            defaults: {
                password_hash: 'mock_hash',
                role: 'panelist'
            }
        });

        const [panelist] = await Panelist.findOrCreate({
            where: { user_id: user.id },
            defaults: {
                first_name: 'Test',
                last_name: 'User'
            }
        });

        // 3. Test Matching (No attributes yet, should filter out restricted surveys)
        console.log('\nStep 3: Fetching matched surveys for Panelist...');
        const matched = await surveyService.getAllSurveys(panelist.id);
        console.log(`Matched Surveys: ${matched.length}`);

        // 4. Test Persistence on "Visit"
        if (matched.length > 0) {
            const first = matched[0];
            console.log(`\nStep 4: Simulating visit to survey ${first.providerSurveyId}...`);
            const persisted = await surveyService.persistSurveyOnVisit(first.provider, first.providerSurveyId);
            console.log('Persisted Survey in DB:', persisted.id);

            // Verify count in DB
            const count = await sequelize.query("SELECT count(*) as count FROM surveys", { type: sequelize.QueryTypes.SELECT });
            console.log(`Current Surveys in DB: ${count[0].count}`);
        } else {
            console.log('No surveys matched. This is expected if qualifications are strict and profile is empty.');
        }

        console.log(`\n--- Test Complete ---`);
        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

testFetchAndMatch();
