const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const usersRouter = require('../users');

const apiMethod = 'GET';
const apiPath = '/api/v1/users/:id/invitations';

describe(apiPath, () => {
  let layer;
  let emit;
  let usersUpdate;

  let userId;
  let user;
  let permissions;
  let invitations;
  let userFindOne;
  let UserPermissionsFindAll;
  let PermissionsFindAll;
  let InvitationsFindAll;

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
    invitations = [{toJSON: () => ({id: 1})}, {toJSON: () => ({id: 2})}, {toJSON: () => ({id: 3})}];
    userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
    UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
    PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));
    InvitationsFindAll = sinon.stub().returns(Promise.resolve(invitations));

    layer = ((usersRouter || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
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
        Invitations: {findAll: InvitationsFindAll},
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
    InvitationsFindAll = undefined;

    ctx = undefined;
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

  it('should throw when user wants to get a list of group invitations for other user', async () => {
    let thrownError;
    ctx.params = {
      id: '22678093-1ad2-467b-9de0-a86d45a433ff',
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

  it('should throw when user wants to get a list his group invitations but has no permission for it', async () => {
    let thrownError;
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

  it('should return list of group invitations when user has permission for it', async () => {
    ctx.state.userPermissions = ['canReadJoinedGroups'];

    await koaRouterRunner(layer.stack, ctx);

    expect(InvitationsFindAll.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( invitations.map((invitation) => invitation.toJSON()) ));
  });

  it('should return empty list of group invitations when user has permission for it but there is nothing in the DB', async () => {
    InvitationsFindAll = sinon.stub().returns(Promise.resolve());
    ctx.postgres.Invitations.findAll = InvitationsFindAll;
    ctx.state.userPermissions = ['canReadJoinedGroups'];

    await koaRouterRunner(layer.stack, ctx);

    expect(InvitationsFindAll.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal('[]');
  });
});
