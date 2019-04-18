const server = require('../index');

describe('Main server', () => {
  it('should be an {object}', () => {
    expect(server).to.be.an('object');
  });

  it('should have `.listen()`', () => {
    expect(server.listen).to.be.a('function');
  });
});
