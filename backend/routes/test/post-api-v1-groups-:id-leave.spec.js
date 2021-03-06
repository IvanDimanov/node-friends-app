const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const groupsRouter = require('../groups');

const apiMethod = 'POST';
const apiPath = '/api/v1/groups/:id/leave';

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
  let InvitationsUpdate;
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
    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    group = {toJSON: () => ({id: groupId})};
    userFindOne = sinon.stub().returns(Promise.resolve({toJSON: () => user}));
    UserPermissionsFindAll = sinon.stub().returns(Promise.resolve([{permissionId: 'test'}]));
    PermissionsFindAll = sinon.stub().returns(Promise.resolve(permissions));
    InvitationsFindAll = sinon.stub().returns(Promise.resolve(invitations));
    InvitationsFindOne = sinon.stub().returns(Promise.resolve(invitation));
    InvitationsCreate = sinon.stub().returns(Promise.resolve(invitation));
    InvitationsUpdate = sinon.stub().returns(Promise.resolve(invitation));
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
      params: {
        id: groupId,
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
        Invitations: {
          findAll: InvitationsFindAll,
          findOne: InvitationsFindOne,
          create: InvitationsCreate,
          update: InvitationsUpdate,
        },
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
    InvitationsUpdate = undefined;
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

  it('should throw on invalid group id URL param #1', async () => {
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

  it('should throw on invalid group id URL param #2', async () => {
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

  it('should throw on invalid group id URL param #3', async () => {
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

  it('should throw when user wants to leave a group he created but has no permission for it', async () => {
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

  it('should throw when user wants to leave a group but he has no invitation for it', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];
    ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('NOT_IN_GROUP');
  });

  it('should throw when user wants to leave a group that he is not part of', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];
    ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('NOT_IN_GROUP');
  });

  it('should throw when user wants to leave a group that he was kicked from', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];
    const invitation = {status: 'kicked'};
    ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve({toJSON: () => invitation}));

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('NOT_IN_GROUP');
  });

  it('should throw when user wants to leave a group but his invitation is with unknown status', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];
    const invitation = {status: 'test-123'};
    ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve({toJSON: () => invitation}));

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('NOT_IN_GROUP');
  });

  it('should throw when user wants to leave a group but the group is not in DB', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];
    ctx.postgres.Groups.findOne = sinon.stub().returns(Promise.resolve());

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(404);
    expect(thrownError.code).to.equal('NO_GROUP');
  });

  it('should throw when user wants to leave a group he created but he has no permission for it', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOthersGroups'];

    group = {toJSON: () => ({id: groupId, createdByUserId: userId})};
    ctx.postgres.Groups.findOne = sinon.stub().returns(Promise.resolve(group));

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(403);
    expect(thrownError.code).to.equal('NO_PERMISSION');
  });

  it('should throw when user wants to leave a group he did not created but he has no permission for it', async () => {
    let thrownError;
    ctx.state.userPermissions = ['canLeaveOwnGroups'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(403);
    expect(thrownError.code).to.equal('NO_PERMISSION');
  });

  it('should update invitation when user wants to leave a group he created and has permission for it', async () => {
    ctx.state.userPermissions = ['canLeaveOwnGroups'];

    group = {toJSON: () => ({id: groupId, createdByUserId: userId})};
    ctx.postgres.Groups.findOne = sinon.stub().returns(Promise.resolve(group));

    await koaRouterRunner(layer.stack, ctx);

    expect(InvitationsUpdate.calledOnce).to.be.true;
  });

  it('should return the group when user wants to leave a group he did not created and has permission for it', async () => {
    ctx.state.userPermissions = ['canLeaveOthersGroups'];

    await koaRouterRunner(layer.stack, ctx);

    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( group.toJSON() ));
  });
});
