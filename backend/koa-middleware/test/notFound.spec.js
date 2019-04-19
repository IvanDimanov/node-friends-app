const sinon = require('sinon');
const notFound = require('../notFound');

describe('notFound', () => {
  it('should be a {Function}', () => {
    expect(notFound).to.be.a('function');
  });

  it('should not emit error to the app when context does not have status of `404`', () => {
    const emit = sinon.spy();
    const ctx = {app: {emit}};

    notFound(ctx);

    expect(emit.calledOnce).to.equal(false);
  });

  it('should emit error to the app when context has status of `404`', () => {
    const emit = sinon.spy();
    const ctx = {app: {emit}, request: {}, status: 404};

    notFound(ctx);

    expect(emit.calledOnce).to.equal(true);
  });
});
