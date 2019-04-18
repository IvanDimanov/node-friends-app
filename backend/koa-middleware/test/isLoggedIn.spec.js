const sinon = require('sinon');
const isLoggedIn = require('../isLoggedIn');

describe('isLoggedIn()', () => {
  it('should return a {Function}', () => {
    expect(isLoggedIn()).to.be.an.instanceof(Function);
  });

  it('should emit an error when no user is saved in context', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}};

    await isLoggedIn()(ctx, next);

    expect(emit.calledOnceWith('error')).to.equal(true);
  });

  it('should not call `next()` when no user is saved in context', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {}};

    await isLoggedIn()(ctx, next);

    expect(next.called).to.equal(false);
  });

  it('should not emit an error when user is saved in context', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {user: {id: 'test'}}};

    await isLoggedIn()(ctx, next);

    expect(emit.called).to.equal(false);
  });

  it('should call `next()` when user is saved in context', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {user: {id: 'test'}}};

    await isLoggedIn()(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });
});
