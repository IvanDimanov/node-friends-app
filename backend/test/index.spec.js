const server = require('../index');

describe('Main server', () => {
  it('should be an {object}', () => {
    expect(typeof server).equal('object');
  });

  it('should have `.listen()`', () => {
    expect(typeof server.listen).equal('function');
  });

  it('should have `.close()`', () => {
    expect(typeof server.close).equal('function');
  });
});
