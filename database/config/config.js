const LOCALHOST_DB_POSTGRESQL_URL = 'postgres://postgres@localhost:5432/node-friends-app';

module.exports = {
  url: process.env.DB_POSTGRESQL_URL || LOCALHOST_DB_POSTGRESQL_URL,
};
