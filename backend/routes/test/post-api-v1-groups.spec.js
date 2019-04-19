const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const groupsRouter = require('../groups');

const apiMethod = 'POST';
const apiPath = '/api/v1/groups';

describe(apiPath, () => {
  let layer;
  let emit;
  let usersUpdate;

  let userId;
  let user;
  let groupId;
  let permissions;
  let invitations;
  let invitation;
  let group;
  let userFindOne;
  let UserPermissionsFindAll;
  let PermissionsFindAll;
  let InvitationsFindAll;
  let InvitationsFindOne;
  let InvitationsCreate;
  let GroupsFindOne;
  let GroupsCreate;

  let ctx;

  beforeEach(() => {
    userId = '4b3f6c4f-2e1f-4e20-aded-e635a8cf5eed';
    user = {
      id: userId,
      firstName: 'Adam',
      lastName: 'Stone',
      email: 'adam@stone.com', hashedPassword: '2ddd8d97fc8ea808bd68bcb06eedff5ebbcd32d5f7470dbbe1c5b067b5981aca',
    };
    groupId = '81150ce6-6f2c-44f4-9713-f06828728ff9';
    permissions = [{key: 'A'}, {key: 'B'}, {key: 'C'}];
    invitations = [{toJSON: () => ({id: 1})}, {toJSON: () => ({id: 2})}, {toJSON: () => ({id: 3})}];
    invitation = {toJSON: () => ({id: 1})};
    group = {toJSON: () => ({id: groupId})};
    userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
    UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
    PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));
    InvitationsFindAll = sinon.stub().returns(Promise.resolve(invitations));
    InvitationsFindOne = sinon.stub().returns(Promise.resolve(invitation));
    InvitationsCreate = sinon.stub().returns(Promise.resolve(invitation));
    GroupsFindOne = sinon.stub().returns(Promise.resolve(group));
    GroupsCreate = sinon.stub().returns(Promise.resolve(group));

    layer = ((groupsRouter || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes(apiMethod));
    emit = sinon.spy();
    usersUpdate = sinon.spy();

    ctx = {
      app: {emit},
      request: {
        body: {},
      },
      params: {},
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
        Invitations: {findAll: InvitationsFindAll, findOne: InvitationsFindOne, create: InvitationsCreate},
        Groups: {findOne: GroupsFindOne, create: GroupsCreate},
      },
    };
  });

  afterEach(() => {
    layer = undefined;
    emit = undefined;
    usersUpdate = undefined;

    userId = undefined;
    user = undefined;
    groupId = undefined;
    permissions = undefined;
    invitation = undefined;
    group = undefined;
    userFindOne = undefined;
    UserPermissionsFindAll = undefined;
    PermissionsFindAll = undefined;
    InvitationsFindAll = undefined;
    InvitationsFindOne = undefined;
    InvitationsCreate = undefined;
    GroupsFindOne = undefined;
    GroupsCreate = undefined;

    ctx = undefined;
  });

  it('should be in groupsRouter', () => {
    expect(layer).to.be.an('object');
  });

  it('should be POST', () => {
    expect(layer.methods).to.include('POST');
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

  it('should throw when user wants to create a group but has no permission for it', async () => {
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

  it('should throw for missing POST request body', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
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

  it('should throw for missing group name from POST request body', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {};

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_NAME');
  });

  it('should throw for invalid group name from POST request body #1', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_NAME');
  });

  it('should throw for invalid group name from POST request body #2', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_NAME');
  });

  it('should throw for invalid group name from POST request body #3', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 7,
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_NAME');
  });

  it('should throw for missing group type from POST request body', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_TYPE');
  });

  it('should throw for invalid group type from POST request body #1', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: 7,
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_TYPE');
  });

  it('should throw for invalid group type from POST request body #2', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: {},
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_TYPE');
  });

  it('should throw when all group info is valid but there is a DB creation problem', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: 'test',
    };
    ctx.postgres.Groups.create = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(500);
    expect(thrownError.code).to.equal('GROUP_CREATE_FAILED');
  });

  it('should send group invitation when the group is created', async () => {
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: 'test',
    };

    await koaRouterRunner(layer.stack, ctx);

    expect(GroupsCreate.calledBefore(InvitationsCreate)).to.be.true;
  });

  it('should throw when group is created but invitation cannot be created coz of DB creation problem', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canCreateGroups'];
    ctx.request.body = {
      name: 'Test group',
      type: 'test',
    };
    ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(500);
    expect(thrownError.code).to.equal('INVITATION_CREATE_FAILED');
  });

  it('should return the created group when user sent group valid data, has permission to create groups, and DB is working',
      async () => {
        ctx.state.userPermissions = ['canCreateGroups'];
        ctx.request.body = {
          name: 'Test group',
          type: 'test',
        };

        await koaRouterRunner(layer.stack, ctx);

        expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( group.toJSON() ));
      }
  );
});
