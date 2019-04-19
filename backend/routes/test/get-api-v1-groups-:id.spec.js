const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const groupsRouter = require('../groups');

const apiPath = '/api/v1/groups/:id';
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
  let GroupsFindOne;

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
    GroupsFindOne = sinon.stub().returns(Promise.resolve(group));

    layer = ((groupsRouter || {}).stack || []).find(({path, methods}) => path === apiPath && methods.includes('GET'));
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
        Invitations: {findAll: InvitationsFindAll, findOne: InvitationsFindOne},
        Groups: {findOne: GroupsFindOne},
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
    GroupsFindOne = undefined;

    ctx = undefined;
  });

  it('should be in groupsRouter', () => {
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

  it('should throw when user wants to read a group but has no permission for it', async () => {
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

  it('should throw when user wants to read a group he is not part of', async () => {
    let thrownError;
    InvitationsFindOne = sinon.stub().returns(Promise.resolve());
    ctx.postgres.Invitations.findOne = InvitationsFindOne;
    ctx.state.userPermissions = ['canReadJoinedGroups'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(InvitationsFindOne.calledOnce).to.be.true;
    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(401);
    expect(thrownError.code).to.equal('NOT_IN_GROUP');
  });

  it('should throw when user has invitation to group that is deleted from the DB', async () => {
    let thrownError;
    GroupsFindOne = sinon.stub().returns(Promise.resolve());
    ctx.postgres.Groups.findOne = GroupsFindOne;
    ctx.state.userPermissions = ['canReadJoinedGroups'];

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(GroupsFindOne.calledOnce).to.be.true;
    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(404);
    expect(thrownError.code).to.equal('NO_GROUP');
  });

  it('should return group when user has permission to see it, has an invitation to it, and the group exists in the DB',
      async () => {
        ctx.state.userPermissions = ['canReadJoinedGroups'];

        await koaRouterRunner(layer.stack, ctx);

        expect(JSON.stringify( ctx.body )).to.equal(`{"id":"${groupId}"}`);
      }
  );
});
