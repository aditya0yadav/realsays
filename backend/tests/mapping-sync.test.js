const { connectDB } = require('../src/config/database');
const MappingService = require('../src/modules/survey/services/mapping.service');
const SurveyMatchingService = require('../src/modules/survey/services/surveyMatching.service');
const { SurveyProvider, SurveyAttributeMapping, SurveyOptionMapping } = require('../src/models');

async function testMapping() {
    try {
        await connectDB();
        console.log('--- Mapping Sync Test ---');

        // 1. Sync Zamplia Demographics (should identify already synced)
        const result = await MappingService.syncZampliaDemographics();
        console.log('Sync Result:', result);

        // 2. Setup a manual mapping for testing logic
        // Link internal 'gender' to Zamplia 'Gender' (Case sensitive!)
        const attrMapping = await MappingService.linkAttribute('zamplia', 'gender', 'Gender');
        console.log('Linked attribute mapping:', attrMapping.id);

        // Link internal 'male' to Zamplia code '1' 
        const optMapping = await MappingService.linkOption(attrMapping.id, 'male', '1');
        console.log('Linked option mapping:', optMapping.id, '-> male is code 1');

        // 3. Test Matching Logic with this mapping
        const mockPanelist = {
            attributes: [
                { definition: { key: 'gender' }, value: 'male' }
            ]
        };

        const mockSurvey = {
            provider: 'zamplia',
            qualifications: [
                { key: 'Gender', allowed_values: ['1'] } // Survey expects code '1'
            ]
        };

        // Real mapping structure expected by SurveyService
        const formattedMappings = {
            'zamplia': {
                'Gender': {
                    internal_key: 'gender',
                    options: { 'male': '1' }
                }
            }
        };

        console.log('\n--- Running Match with Mapped Values ---');
        const matchResult = SurveyMatchingService.match(mockPanelist, mockSurvey, formattedMappings);
        console.log('Match Result:', JSON.stringify(matchResult, null, 2));

        if (matchResult.isMatch) {
            console.log('\n✅ SUCCESS: End-to-end mapping test passed!');
        } else {
            console.log('\n❌ FAILURE: End-to-end mapping test failed.');
            console.log('Reasons:', matchResult.failedReasons);
        }

        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

testMapping();
