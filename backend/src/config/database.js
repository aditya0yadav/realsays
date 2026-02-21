require('dotenv').config({ quiet: true });
const { Sequelize } = require('sequelize');
const path = require('path');
const seedingService = require('../services/seeding.service');

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            // Useful for some remote MySQL setups
            connectTimeout: 60000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected successfully');

        await sequelize.sync({ alter: false });

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
