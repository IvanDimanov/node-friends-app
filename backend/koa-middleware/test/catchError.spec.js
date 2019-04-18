const sinon = require('sinon');
const catchError = require('../catchError');

describe('catchError()', () => {
  it('should return a {Function}', () => {
    expect(catchError()).to.be.an.instanceof(Function);
  });

  it('should call `next()`', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}};

    await catchError()(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });

  it('should not throw even if `next()` throws', async () => {
    const emit = sinon.spy();
    const next = sinon.stub().throws();
    const ctx = {app: {emit}};

    expect(() => catchError()(ctx, next)).to.not.throw();
    expect(next.calledOnce).to.equal(true);
  });

  it('should emit the error to the app when `next()` throws', async () => {
    const error = new Error('Test');
    const emit = sinon.spy();
    const next = sinon.stub().throws(error);
    const ctx = {app: {emit}};

    expect(() => catchError()(ctx, next)).to.not.throw();
    expect(emit.calledOnceWithExactly('error', error, ctx)).to.equal(true);
  });
});
