import { Sequelize } from 'sequelize';

// Initialize Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: console.log,
});

// Import models after sequelize is defined
import Home from '../models/home';
import About from '../models/about';
import Resource from '../models/resource';

// Initialize models
Home.initModel(sequelize);
About.initModel(sequelize);
Resource.initModel(sequelize);

const models = { Home, About, Resource };

// Sync all models
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Failed to sync database:', error);
    throw error;
  }
})();

export default sequelize;
export { sequelize, Home, About, Resource, models };