const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const usersRouter = require('../users');

const apiMethod = 'POST';
const apiPath = '/api/v1/users/login';

describe(apiPath, () => {
  let layer;
  let emit;

  const userId = 'test-user';
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
      },
      postgres: {
        Users: {findOne: userFindOne},
        UserPermissions: {findAll: UserPermissionsFindAll},
        Permissions: {findAll: PermissionsFindAll},
      },
    };
  });

  let ORIGINAL_JWT_SECRET;

  beforeEach(() => {
    ORIGINAL_JWT_SECRET = process.env.JWT_SECRET;
  });

  afterEach(() => {
    process.env.JWT_SECRET = ORIGINAL_JWT_SECRET;
  });


  it('should be in usersRouter', () => {
    expect(layer).to.be.an('object');
  });

  it('should be POST', () => {
    expect(layer.methods).to.include('POST');
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

  it('should throw for sent invalid email #1', async () => {
    let thrownError;
    ctx.request.body = {};

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid email #2', async () => {
    let thrownError;
    ctx.request.body = {
      email: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid email #3', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid email #4', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid email #5', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid email #6', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test.',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_EMAIL');
  });

  it('should throw for sent invalid password #1', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test.com',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_PASSWORD');
  });

  it('should throw for sent invalid password #2', async () => {
    let thrownError;
    ctx.request.body = {
      email: 'test@test.com',
      password: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_PASSWORD');
  });

  it('should throw when email is not found in the DB', async () => {
    let thrownError;
    ctx.postgres.Users.findOne = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(401);
    expect(thrownError.code).to.equal('NO_MATCH');
  });

  it('should throw when password is not the one found in the DB', async () => {
    let thrownError;
    const user = {id: userId, hashedPassword: ''};
    ctx.postgres.Users.findOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(401);
    expect(thrownError.code).to.equal('NO_MATCH');
  });

  it('should return JSON with `JWT` when email and password match in the DB', async () => {
    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.be.an('object');
    expect(ctx.body.JWT).to.be.a('string');
    expect(ctx.body.JWT).to.include('Bearer ');
  });

  it('should return JSON with `JWT` when email and password match in the DB, and JWT_SECRET is set', async () => {
    process.env.JWT_SECRET = 'test';

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.be.an('object');
    expect(ctx.body.JWT).to.be.a('string');
    expect(ctx.body.JWT).to.include('Bearer ');
  });

  it('should return JSON with `JWT` when email and password match in the DB, and JWT_SECRET is not set', async () => {
    process.env.JWT_SECRET = '';

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.body).to.be.an('object');
    expect(ctx.body.JWT).to.be.a('string');
    expect(ctx.body.JWT).to.include('Bearer ');
  });
});
