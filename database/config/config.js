const LOCALHOST_DB_POSTGRESQL_URL = 'postgres://postgres@localhost:5432/node-friends-app';

/**
 * Generates a valid DB connection info object.
 * @return {Object} All info needed to connect Sequalize to DB
 */
function getConfig() {
  return {
    url: process.env.DB_POSTGRESQL_URL || LOCALHOST_DB_POSTGRESQL_URL,
  };
}

module.exports = {
  getConfig,
  ...getConfig(),
};
