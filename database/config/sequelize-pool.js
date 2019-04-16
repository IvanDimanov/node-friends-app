const Sequelize = require('sequelize');
const config = require('../config/config');

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');

const getInstance = () => {
  const instance = new Sequelize(config.url, {
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 10,
    },
    dialectOptions: {
      ssl: true,
    },
  });

  instance.types = Sequelize;
  instance.formatLogging = Sequelize.formatLogging;

  return instance;
};

module.exports = {
  Sequelize,
  getInstance,
};
