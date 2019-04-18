const sinon = require('sinon');
const jwtToUser = require('../jwtToUser');

describe('jwtToUser', () => {
  it('should be a {Function}', () => {
    expect(jwtToUser).to.be.an.instanceof(Function);
  });

  it('should not call DB when there is no JWT', async () => {
    const userFindOne = sinon.stub().returns(Promise.resolve());
    const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve());
    const PermissionsFindAll = sinon.stub().returns(Promise.resolve());

    const ctx = {postgres: {
      Users: {findOne: userFindOne},
      UserPermissions: {findAll: UserPermissionsFindAll},
      Permissions: {findAll: PermissionsFindAll},
    }};

    const next = sinon.spy();

    await jwtToUser(ctx, next);

    expect(userFindOne.called).to.equal(false);
    expect(UserPermissionsFindAll.called).to.equal(false);
    expect(PermissionsFindAll.called).to.equal(false);
  });

  it('should call `next()` even if there is no JWT', async () => {
    const userFindOne = sinon.stub().returns(Promise.resolve());
    const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve());
    const PermissionsFindAll = sinon.stub().returns(Promise.resolve());

    const ctx = {postgres: {
      Users: {findOne: userFindOne},
      UserPermissions: {findAll: UserPermissionsFindAll},
      Permissions: {findAll: PermissionsFindAll},
    }};

    const next = sinon.spy();

    await jwtToUser(ctx, next);

    expect(next.calledOnce).to.equal(true);
  });

  it('should set default empty `user` and `userPermissions` even if there is no JWT', async () => {
    const userFindOne = sinon.stub().returns(Promise.resolve());
    const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve());
    const PermissionsFindAll = sinon.stub().returns(Promise.resolve());

    const ctx = {postgres: {
      Users: {findOne: userFindOne},
      UserPermissions: {findAll: UserPermissionsFindAll},
      Permissions: {findAll: PermissionsFindAll},
    }};

    const next = sinon.spy();

    await jwtToUser(ctx, next);

    expect(JSON.stringify(ctx.state.user)).to.equal('{}');
    expect(JSON.stringify(ctx.state.userPermissions)).to.equal('[]');
  });

  it('should call DB before calling `next()` when JWT is set', async () => {
    const userId = 'test-user';
    const userFindOne = sinon.stub().returns(Promise.resolve());
    const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve());
    const PermissionsFindAll = sinon.stub().returns(Promise.resolve());

    const ctx = {
      state: {
        jwtdata: {userId},
      },
      postgres: {
        Users: {findOne: userFindOne},
        UserPermissions: {findAll: UserPermissionsFindAll},
        Permissions: {findAll: PermissionsFindAll},
      },
    };

    const next = sinon.spy();

    await jwtToUser(ctx, next);

    expect(userFindOne.calledBefore(next)).to.equal(true);
    expect(UserPermissionsFindAll.calledBefore(next)).to.equal(true);
    expect(PermissionsFindAll.calledBefore(next)).to.equal(true);
  });

  it('should set default `user` and `userPermissions` when JWT is set', async () => {
    const userId = 'test-user';
    const user = {id: userId, test: 'value'};
    const permissions = [{key: 'A'}, {key: 'B'}, {key: 'C'}];
    const userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
    const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
    const PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));

    const ctx = {
      state: {
        jwtdata: {userId},
      },
      postgres: {
        Users: {findOne: userFindOne},
        UserPermissions: {findAll: UserPermissionsFindAll},
        Permissions: {findAll: PermissionsFindAll},
      },
    };

    const next = sinon.spy();

    await jwtToUser(ctx, next);

    expect( ctx.state.user ).to.equal(user);
    expect(JSON.stringify( ctx.state.userPermissions )).to.equal(JSON.stringify( permissions.map(({key}) => key) ));
  });
});
