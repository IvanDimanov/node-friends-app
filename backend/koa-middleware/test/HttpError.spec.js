const HttpError = require('../HttpError');

describe('HttpError', () => {
  it('should extend {Error}', () => {
    expect(new HttpError()).to.be.an.instanceof(Error);
  });

  it('should have unique `id` property', () => {
    const error1 = new HttpError();
    const error2 = new HttpError();
    const error3 = new HttpError();

    expect(error1.id).not.to.equal(error2.id);
    expect(error1.id).not.to.equal(error3.id);
    expect(error2.id).not.to.equal(error3.id);
  });

  it('should have `status` property', () => {
    const status = 401;
    const error = new HttpError(status);

    expect(error.status).to.equal(status);
  });

  it('should have `code` property', () => {
    const status = 401;
    const code = 'TEST';
    const error = new HttpError(status, code);

    expect(error.code).to.equal(code);
  });

  it('should have `message` property', () => {
    const status = 401;
    const code = 'TEST';
    const message = 'Test error';
    const error = new HttpError(status, code, message);

    expect(error.message).to.equal(message);
  });

  it('should have `data` property', () => {
    const status = 401;
    const code = 'TEST';
    const message = 'Test error';
    const data = {key: 'test'};
    const error = new HttpError(status, code, message, data);

    expect(error.data).to.equal(data);
  });
});
