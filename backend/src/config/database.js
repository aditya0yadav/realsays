require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = isDevelopment
    ? new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database/dev.sqlite'),
        logging: console.log
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database Connected: Using ${isDevelopment ? 'SQLite' : 'PostgreSQL'}`);
        // Temporarily using force: true in dev to ensure all columns (like email_verified) are created
        await sequelize.sync({ force: isDevelopment });
        console.log('Sequelize Models Synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
