require('dotenv').config({ quiet: true });
const { Sequelize } = require('sequelize');
const path = require('path');
const seedingService = require('../services/seeding.service');

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database/dev.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false
});

const connectDB = async () => {
    try {
        await sequelize.sync();

        // Run seeding
        await seedingService.seedAttributeDefinitions();
        await seedingService.seedSurveyProviders();
        await seedingService.seedSurveyMappings();
        await seedingService.seedTestPanelist();

    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
