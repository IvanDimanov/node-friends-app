const config = require('../config');

describe('config()', () => {
  it('should return a valid `url` property', () => {
    expect(config).to.be.an('object');
    expect(config.url).to.be.a('string');
    expect(config.url.startsWith('postgres://')).to.equal(true);
  });
});
