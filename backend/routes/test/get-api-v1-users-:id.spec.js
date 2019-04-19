const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const usersRouter = require('../users');

const apiMethod = 'GET';
const apiPath = '/api/v1/users/:id';

describe(apiPath, () => {
  let layer;
  let emit;

  const userId = '4b3f6c4f-2e1f-4e20-aded-e635a8cf5eed';
  const user = {id: userId, hashedPassword: '2ddd8d97fc8ea808bd68bcb06eedff5ebbcd32d5f7470dbbe1c5b067b5981aca'};
  const permissions = [{key: 'A'}, {key: 'B'}, {key: 'C'}];
  const userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
  const UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
  const PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));

  let ctx;

  beforeEach(() => {
    layer = ((usersRouter || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();

    ctx = {
      app: {emit},
      request: {
        body: {
          email: 'test@test.com',
          password: 'password',
        },
      },
      params: {
        id: userId,
      },
      logger: {
        log: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        warning: () => {},
        danger: () => {},
        error: () => {},
      },
      state: {
        jwtdata: {userId},
        user,
        userPermissions: permissions.map(({key}) => key),
      },
      postgres: {
        Users: {findOne: userFindOne},
        UserPermissions: {findAll: UserPermissionsFindAll},
        Permissions: {findAll: PermissionsFindAll},
      },
    };
  });

  it('should be in usersRouter', () => {
    expect(layer).to.be.an('object');
  });

  it('should be GET', () => {
    expect(layer.methods).to.include('GET');
  });

  it('should not throw when user is not logged in', async () => {
    let thrownError;
    ctx.state = {};

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.undefined;
  });

  it('should emit app error when user is not logged in', async () => {
    ctx.state = {};

    await koaRouterRunner(layer.stack, ctx);

    expect(emit.calledOnceWith('error')).to.equal(true);
  });

  it('should throw on invalid user id URL param #1', async () => {
    let thrownError;
    ctx.params = {};

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_ID');
  });

  it('should throw on invalid user id URL param #2', async () => {
    let thrownError;
    ctx.params = {
      id: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_ID');
  });

  it('should throw on invalid user id URL param #3', async () => {
    let thrownError;
    ctx.params = {
      id: 'test',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_ID');
  });

  it('should throw when user wants to see his own user data but has no permission for it', async () => {
    let thrownError;
    ctx.params = {
      id: userId,
    };
    ctx.state.userPermissions = [];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(403);
    expect(thrownError.code).to.equal('NO_PERMISSION');
  });

  it('should return the user data when user wants to see his own user data and has permission for it', async () => {
    ctx.params = {
      id: userId,
    };
    ctx.state.userPermissions = ['canReadOwnUser'];

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.equal(ctx.state.user);
  });

  it('should throw when user wants to see other user data but has no permission for it', async () => {
    let thrownError;
    ctx.params = {
      id: 'a03a09ba-647d-4631-b09f-7452296fbd2c',
    };
    ctx.state.userPermissions = [];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(403);
    expect(thrownError.code).to.equal('NO_PERMISSION');
  });

  it('should throw when user data is not found in DB', async () => {
    let thrownError;
    ctx.params = {
      id: 'a03a09ba-647d-4631-b09f-7452296fbd2c',
    };
    ctx.state.userPermissions = ['canReadOthersUser'];
    ctx.postgres.Users.findOne = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(404);
    expect(thrownError.code).to.equal('USER_NO_FOUND');
  });

  it('should return the user data when user wants to see other user data and has permission for it', async () => {
    const userId = 'a03a09ba-647d-4631-b09f-7452296fbd2c';
    const user = {id: userId, hashedPassword: 'test'};
    ctx.params = {
      id: userId,
    };
    ctx.state.userPermissions = ['canReadOthersUser'];
    ctx.postgres.Users.findOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.equal(user);
  });
});
