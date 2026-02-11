const { connectDB } = require('../src/config/database');
const { refreshSurveyRegistry, getAllSurveys } = require('../src/modules/survey/services/survey.service');
const { Panelist, PersonaAttribute, AttributeDefinition, SurveyProvider, SurveyAttributeMapping, SurveyOptionMapping } = require('../src/models');
const MappingService = require('../src/modules/survey/services/mapping.service');

async function verifyProductionReady() {
    try {
        await connectDB();
        console.log('--- Production Readiness Test ---');

        // 1. Force Refresh Registry (Real API Calls)
        console.log('Fetching live surveys from providers...');
        await refreshSurveyRegistry(true);

        // 2. Setup a realistic test panelist
        // We need a panelist with an attribute that is MAPPED to a provider requirement.
        // Earlier we mapped internal 'gender' -> 'male' to Zamplia 'Gender' -> '1'.

        // Let's ensure this mapping exists in the current DB
        const provider = await SurveyProvider.findOne({ where: { slug: 'zamplia' } });
        if (!provider) {
            console.error('❌ Zamplia provider not found. Please sync providers first.');
            process.exit(1);
        }

        // Ensure we have the mapping for the test
        const [attrMapping] = await SurveyAttributeMapping.findOrCreate({
            where: { provider_id: provider.id, provider_question_key: 'Gender' },
            defaults: { internal_key: 'gender' }
        });
        await MappingService.linkOption(attrMapping.id, 'male', '1');
        await MappingService.linkOption(attrMapping.id, 'female', '2');

        // Create/Find a test user and panelist
        const { User } = require('../src/models');
        const [user] = await User.findOrCreate({
            where: { email: 'prod-test@realsays.com' },
            defaults: { username: 'prodtest', password_hash: 'hashed_password', role: 'panelist', email_verified: true }
        });

        const [panelist] = await Panelist.findOrCreate({
            where: { user_id: user.id },
            defaults: { first_name: 'Prod', last_name: 'Test' }
        });

        // Add attributes
        const [genderDef] = await AttributeDefinition.findOrCreate({
            where: { key: 'gender' },
            defaults: { title: 'Gender', type: 'single_choice' }
        });

        await PersonaAttribute.upsert({
            panelist_id: panelist.id,
            attribute_id: genderDef.id,
            value: 'male' // Internal value
        });

        console.log(`Testing matching for panelist ${panelist.email} (Gender: male)...`);

        // 3. Get All Surveys (This will run the matching engine)
        const matchedSurveys = await getAllSurveys(panelist.id);

        console.log(`\nResults:`);
        console.log(`- Total Live Surveys Fetched: (Check logs above)`);
        console.log(`- Matched Surveys for User: ${matchedSurveys.length}`);

        if (matchedSurveys.length > 0) {
            console.log('\nSample Matched Surveys:');
            matchedSurveys.slice(0, 3).forEach(s => {
                console.log(`✅ [${s.provider}] ${s.title} - $${s.payout} (Score: ${s.matchScore})`);
            });
            console.log('\n✅ SUCCESS: Production pipeline verified with live data!');
        } else {
            console.log('\n⚠️  No matches found with current profile. This might be normal if the live surveys have strict requirements.');
            console.log('Check if your mapped attributes (gender: male) exist in the qualifications of the fetched surveys.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Production Readiness Test Failed:', error);
        process.exit(1);
    }
}

verifyProductionReady();
