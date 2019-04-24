const createApp = require('../index');

describe('Main server', () => {
  it('should be an {object}', () => {
    expect(createApp()).to.be.an('object');
  });

  it('should have `.listen()` even when CORS is allowed', () => {
    process.env.ALLOW_CORS = true;
    expect(createApp().listen).to.be.a('function');
  });
});
