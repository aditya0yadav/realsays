const { sequelize, connectDB } = require('./src/config/database');
const { AttributeDefinition } = require('./src/models');
const attributeDefinitions = require('./database/seeders/004-attribute-definitions');

const seed = async () => {
    try {
        console.log('Starting manual seeding...');
        await connectDB();

        console.log('Seeding Attribute Definitions...');
        for (const def of attributeDefinitions) {
            await AttributeDefinition.upsert(def);
            console.log(`  Synced attribute: ${def.key}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
