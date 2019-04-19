const crypto = require('crypto');
const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const usersRouter = require('../users');

const apiPath = '/api/v1/users/:id';
describe(apiPath, () => {
  let layer;
  let emit;
  let usersUpdate;

  let userId;
  let user;
  let permissions;
  let userFindOne;
  let UserPermissionsFindAll;
  let PermissionsFindAll;

  let ctx;

  beforeEach(() => {
    userId = '4b3f6c4f-2e1f-4e20-aded-e635a8cf5eed';
    user = {
      id: userId,
      firstName: 'Adam',
      lastName: 'Stone',
      email: 'adam@stone.com', hashedPassword: '2ddd8d97fc8ea808bd68bcb06eedff5ebbcd32d5f7470dbbe1c5b067b5981aca',
    };
    permissions = [{key: 'A'}, {key: 'B'}, {key: 'C'}];
    userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
    UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
    PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));

    layer = ((usersRouter || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes('PUT'));
    emit = sinon.spy();
    usersUpdate = sinon.spy();

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
        Users: {findOne: userFindOne, update: usersUpdate},
        UserPermissions: {findAll: UserPermissionsFindAll},
        Permissions: {findAll: PermissionsFindAll},
      },
    };
  });

  afterEach(() => {
    layer = undefined;
    emit = undefined;
    usersUpdate = undefined;

    userId = undefined;
    user = undefined;
    permissions = undefined;
    userFindOne = undefined;
    UserPermissionsFindAll = undefined;
    PermissionsFindAll = undefined;

    ctx = undefined;
  });

  it('should be in usersRouter', () => {
    expect(layer).to.be.an('object');
  });

  it('should be PUT', () => {
    expect(layer.methods).to.include('PUT');
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

  it('should throw for missing POST request body', async () => {
    let thrownError;
    delete ctx.request.body;

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT');
  });

  it('should throw when user wants to update the user data of somebody else', async () => {
    let thrownError;
    ctx.params = {
      id: 'a03a09ba-647d-4631-b09f-7452296fbd2c',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(403);
    expect(thrownError.code).to.equal('NO_PERMISSION');
  });

  it('should throw when user wants to update his first name but has no permission for it', async () => {
    let thrownError;
    ctx.request.body = {
      firstName: user.firstName + 'update',
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

  it('should throw when user wants to update his first name, permission for it but sends invalid first name', async () => {
    let thrownError;
    ctx.request.body = {
      firstName: 7,
    };
    ctx.state.userPermissions = ['canWriteOwnFirstName'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_FIRST_NAME');
  });

  it('should update user`s first name when he has permission for it', async () => {
    ctx.request.body = {
      firstName: user.firstName + 'update',
    };
    ctx.state.userPermissions = ['canWriteOwnFirstName'];

    await koaRouterRunner(layer.stack, ctx);

    expect(usersUpdate.calledOnce).to.be.true;
    expect(ctx.state.user.firstName).to.equal(ctx.request.body.firstName);
  });

  it('should throw when user wants to update his last name but has no permission for it', async () => {
    let thrownError;
    ctx.request.body = {
      lastName: user.lastName + 'update',
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

  it('should throw when user wants to update his last name, permission for it but sends invalid last name', async () => {
    let thrownError;
    ctx.request.body = {
      lastName: 7,
    };
    ctx.state.userPermissions = ['canWriteOwnLastName'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_LAST_NAME');
  });

  it('should update user`s last name when he has permission for it', async () => {
    ctx.request.body = {
      lastName: user.lastName + 'update',
    };
    ctx.state.userPermissions = ['canWriteOwnLastName'];

    await koaRouterRunner(layer.stack, ctx);

    expect(usersUpdate.calledOnce).to.be.true;
    expect(ctx.state.user.lastName).to.equal(ctx.request.body.lastName);
  });

  it('should throw when user wants to update his email but has no permission for it', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test.com',
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

  it('should throw when user wants to update his email, permission for it but sends invalid email #1', async () => {
    let thrownError;
    ctx.request.body = {
      email: 7,
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw when user wants to update his email, permission for it but sends invalid email #2', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test',
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw when user wants to update his email, permission for it but sends invalid email #3', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@',
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw when user wants to update his email, permission for it but sends invalid email #4', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test',
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw when user wants to update his email, permission for it but sends invalid email #5', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test.',
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should update user`s email when he has permission for it', async () => {
    ctx.request.body = {
      email: 'test@test.com',
    };
    ctx.state.userPermissions = ['canWriteOwnEmail'];

    await koaRouterRunner(layer.stack, ctx);

    expect(usersUpdate.calledOnce).to.be.true;
    expect(ctx.state.user.email).to.equal(ctx.request.body.email);
  });

  it('should throw when user wants to update his password but has no permission for it', async () => {
    let thrownError;
    ctx.request.body = {
      password: user.password + 'update',
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

  it('should throw when user wants to update his password, permission for it but sends invalid password #1', async () => {
    let thrownError;
    ctx.request.body = {
      password: 7,
    };
    ctx.state.userPermissions = ['canWriteOwnPassword'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_PASSWORD');
  });

  it('should throw when user wants to update his password, permission for it but sends invalid password #2', async () => {
    let thrownError;
    ctx.request.body = {
      password: 123,
    };
    ctx.state.userPermissions = ['canWriteOwnPassword'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_PASSWORD');
  });

  it('should throw when user wants to update his password, permission for it but sends invalid password #3', async () => {
    let thrownError;
    ctx.request.body = {
      password: 'admin12',
    };
    ctx.state.userPermissions = ['canWriteOwnPassword'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_PASSWORD');
  });

  it('should update user`s password when he has permission for it', async () => {
    ctx.request.body = {
      password: 'new)Password-123',
    };
    ctx.state.userPermissions = ['canWriteOwnPassword'];
    const hashedPassword = crypto
        .createHmac('sha256', ctx.state.user.id)
        .update(ctx.request.body.password)
        .digest('hex');

    await koaRouterRunner(layer.stack, ctx);

    expect(usersUpdate.calledOnce).to.be.true;
    expect(ctx.state.user.hashedPassword).to.equal(hashedPassword);
  });

  it('should return empty object when user has no permission to read his own user data', async () => {
    ctx.request.body = {};
    ctx.state.userPermissions = [];

    await koaRouterRunner(layer.stack, ctx);

    expect(JSON.stringify(ctx.body)).to.equal('{}');
  });

  it('should return user data when user has permission to read his own user data', async () => {
    ctx.request.body = {};
    ctx.state.userPermissions = ['canReadOwnUser'];

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.equal(ctx.state.user);
  });
});
