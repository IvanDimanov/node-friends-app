const sinon = require('sinon');
const onError = require('../onError');

describe('onError', () => {
  it('should be a {Function}', () => {
    expect(onError).to.be.a('function');
  });

  it('should log the sent `error` stack and ID', () => {
    const errorId = 'test-id';
    const error = new Error('Test error');
    error.id = errorId;

    const errorLogger = sinon.spy();
    const ctx = {logger: {error: errorLogger}, request: {}};

    onError(error, ctx);

    expect(errorLogger.calledOnceWith(error.stack, {errorId})).to.equal(true);
  });

  it('should set the `error` status to context', () => {
    const status = 401;
    const error = new Error('Test error');
    error.status = status;

    const errorLogger = sinon.spy();
    const ctx = {logger: {error: errorLogger}, request: {}};

    onError(error, ctx);

    expect(ctx.status).to.equal(status);
  });

  it('should create context body object', () => {
    const error = new Error('Test error');
    const errorLogger = sinon.spy();
    const ctx = {logger: {error: errorLogger}, request: {}};

    onError(error, ctx);

    expect(ctx.body).to.be.a('object');
  });

  it('should set the `error` code to context body object', () => {
    const code = 'Test';
    const error = new Error('Test error');
    error.code = code;

    const errorLogger = sinon.spy();
    const ctx = {logger: {error: errorLogger}, request: {}};

    onError(error, ctx);

    expect(ctx.body.errorCode).to.equal(code);
  });
});
