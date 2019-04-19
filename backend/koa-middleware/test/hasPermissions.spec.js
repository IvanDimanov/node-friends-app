const sinon = require('sinon');
const hasPermissions = require('../hasPermissions');

describe('hasPermissions()', () => {
  it('should return a {Function}', () => {
    expect(hasPermissions()).to.be.a('function');
  });

  it('should call `next()` when no permissions are requested #1', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: []}};

    await hasPermissions()(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });

  it('should call `next()` when no permissions are requested #2', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: []}};

    await hasPermissions([])(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });

  it('should not call `next()` when permissions are not met #1', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: []}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(next.called).to.equal(false);
  });

  it('should not call `next()` when permissions are not met #2', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-2']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(next.called).to.equal(false);
  });

  it('should not call `next()` when permissions are not met #3', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1']}};

    await hasPermissions(['test-1', 'test-2'])(ctx, next);

    expect(next.called).to.equal(false);
  });

  it('should emit an error when permissions are not met #1', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: []}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(emit.calledOnceWith('error')).to.equal(true);
  });

  it('should emit an error when permissions are not met #2', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-2']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(emit.calledOnceWith('error')).to.equal(true);
  });

  it('should emit an error when permissions are not met #3', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1']}};

    await hasPermissions(['test-1', 'test-2'])(ctx, next);

    expect(emit.calledOnceWith('error')).to.equal(true);
  });

  it('should not emit an error when permissions are met #1', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(emit.called).to.equal(false);
  });

  it('should not emit an error when permissions are met #2', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1', 'test-2']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(emit.called).to.equal(false);
  });

  it('should not emit an error when permissions are met #3', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1', 'test-2']}};

    await hasPermissions(['test-1', 'test-2'])(ctx, next);

    expect(emit.called).to.equal(false);
  });

  it('should call `next()` when permissions are met #1', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(next.called).to.equal(true);
  });

  it('should call `next()` when permissions are met #2', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1', 'test-2']}};

    await hasPermissions(['test-1'])(ctx, next);

    expect(next.called).to.equal(true);
  });

  it('should call `next()` when permissions are met #3', async () => {
    const emit = sinon.spy();
    const next = sinon.spy();
    const ctx = {app: {emit}, state: {userPermissions: ['test-1', 'test-2']}};

    await hasPermissions(['test-1', 'test-2'])(ctx, next);

    expect(next.called).to.equal(true);
  });
});
