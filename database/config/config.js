const LOCALHOST_DB_POSTGRESQL_URL = 'postgres://postgres@localhost:5432/node-friends-app';

module.exports = {
  /* istanbul ignore next: because it is normal during deployment to always have a set `DB_POSTGRESQL_URL` */
  url: process.env.DB_POSTGRESQL_URL || LOCALHOST_DB_POSTGRESQL_URL,
};
