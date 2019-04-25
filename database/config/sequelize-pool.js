const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

const config = require('../config/config');

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');

const instance = {};

instance.id = uuid();
instance.types = Sequelize;
instance.formatLogging = Sequelize.formatLogging;

const getInstance = () => instance;

module.exports = {
  Sequelize,
  getInstance,
};
