const {getConfig} = require('../config');

describe('config()', () => {
  let ORIGINAL_DB_POSTGRESQL_URL;

  beforeEach(() => {
    ORIGINAL_DB_POSTGRESQL_URL = process.env.DB_POSTGRESQL_URL;
  });

  afterEach(() => {
    process.env.DB_POSTGRESQL_URL = ORIGINAL_DB_POSTGRESQL_URL;
  });

  it('should return a valid `url` property', () => {
    const config = getConfig();

    expect(config).to.be.an('object');
    expect(config.url).to.be.a('string');
    expect(config.url.startsWith('postgres://')).to.equal(true);
  });

  it('should return a valid `url` property when there is no set Env var', () => {
    process.env.DB_POSTGRESQL_URL = '';

    const config = getConfig();

    expect(config).to.be.an('object');
    expect(config.url).to.be.a('string');
    expect(config.url.startsWith('postgres://')).to.equal(true);
  });

  it('should return test `url` property when set as Env var', () => {
    const TEST_DB_POSTGRESQL_URL = 'postgres://test@test:5432/test';
    process.env.DB_POSTGRESQL_URL = TEST_DB_POSTGRESQL_URL;

    const config = getConfig();

    expect(config.url).to.equal(TEST_DB_POSTGRESQL_URL);
  });
});
