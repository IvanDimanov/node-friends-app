const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

const config = require('../config/config');

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');

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

instance.id = uuid();
instance.types = Sequelize;
instance.formatLogging = Sequelize.formatLogging;

const getInstance = () => instance;

module.exports = {
  Sequelize,
  getInstance,
};
