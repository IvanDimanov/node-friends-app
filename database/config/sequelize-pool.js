const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

const config = require('../config/config');

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');

const getInstance = () => {};

module.exports = {
  Sequelize,
  getInstance,
};
