require('dotenv').config({ quiet: true });
const app = require('../app');

const { connectDB } = require('./database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, async () => {

            // Start the fetching process only after server is bound and DB is ready
            const { initializeSurveyService } = require('../modules/survey/services/survey.service');
            initializeSurveyService().catch(err => console.error('Failed to initialize survey service:', err));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
