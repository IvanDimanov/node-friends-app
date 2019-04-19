const sinon = require('sinon');

const koaRouterRunner = require('./koaRouterRunner');
const HttpError = require('../../koa-middleware/HttpError');
const groupsRouter = require('../groups');

const apiMethod = 'POST';
const apiPath = '/api/v1/groups/:groupId/invite/:userId';

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
        groupId,
        userId,
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
    expect(thrownError.code).to.equal('INVALID_INPUT_GROUP_ID');
  });

  it('should throw on invalid group id URL param #2', async () => {
    let thrownError;
    ctx.params = {
      groupId: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_GROUP_ID');
  });

  it('should throw on invalid group id URL param #3', async () => {
    let thrownError;
    ctx.params = {
      groupId: 'test',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_GROUP_ID');
  });

  it('should throw on invalid user id URL param #1', async () => {
    let thrownError;
    ctx.params = {
      groupId,
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_USER_ID');
  });

  it('should throw on invalid user id URL param #2', async () => {
    let thrownError;
    ctx.params = {
      groupId,
      userId: '',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_USER_ID');
  });

  it('should throw on invalid user id URL param #3', async () => {
    let thrownError;
    ctx.params = {
      groupId,
      userId: 'test',
    };

    try {
      await koaRouterRunner(layer.stack, ctx);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.an.instanceof(HttpError);
    expect(thrownError.status).to.equal(400);
    expect(thrownError.code).to.equal('INVALID_INPUT_USER_ID');
  });

  it('should throw when user wants to invite another user to a group he created but has no permission for it', async () => {
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

  it('should throw when user wants to invite another user to a group he created but the group is not in the DB',
      async () => {
        let thrownError;
        ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];
        ctx.postgres.Groups.findOne = sinon.stub().returns(Promise.resolve());

        try {
          await koaRouterRunner(layer.stack, ctx);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).to.be.an.instanceof(HttpError);
        expect(thrownError.status).to.equal(404);
        expect(thrownError.code).to.equal('NO_GROUP');
      }
  );

  it('should throw when user wants to invite another user to a group he is not part of #1',
      async () => {
        let thrownError;
        ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];
        ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve());

        try {
          await koaRouterRunner(layer.stack, ctx);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).to.be.an.instanceof(HttpError);
        expect(thrownError.status).to.equal(404);
        expect(thrownError.code).to.equal('NOT_IN_GROUP');
      }
  );

  it('should throw when user wants to invite another user to a group he is not part of #2',
      async () => {
        let thrownError;
        ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];
        invitation = {toJSON: () => ({id: 1, status: 'pending'})};
        ctx.postgres.Invitations.findOne = sinon.stub().returns(Promise.resolve());

        try {
          await koaRouterRunner(layer.stack, ctx);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).to.be.an.instanceof(HttpError);
        expect(thrownError.status).to.equal(404);
        expect(thrownError.code).to.equal('NOT_IN_GROUP');
      }
  );

  it('should throw when user A wants to invite user B to a group but user B is already in the group',
      async () => {
        let thrownError;
        ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

        invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
        const userBInvitation = {toJSON: () => ({id: 2, status: 'accepted'})};

        ctx.postgres.Invitations.findOne = sinon.stub();
        ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
        ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve(userBInvitation));

        try {
          await koaRouterRunner(layer.stack, ctx);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).to.be.an.instanceof(HttpError);
        expect(thrownError.status).to.equal(400);
        expect(thrownError.code).to.equal('ALREADY_JOINED');
      }
  );

  it('should update user B invitation when user A wants to invite user B to a group but ' +
    'user B already has a non-accepted invitation',
  async () => {
    ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    const userBInvitation = {toJSON: () => ({id: 2, status: 'kicked'})};

    ctx.postgres.Invitations.findOne = sinon.stub();
    ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
    ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve(userBInvitation));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.postgres.Invitations.update.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal('{"id":2,"status":"pending"}');
  });

  it('should throw when user want to invite another user, has all valid data, and permissions but there is a DB problem',
      async () => {
        let thrownError;
        ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

        invitation = {toJSON: () => ({id: 1, status: 'accepted'})};

        ctx.postgres.Invitations.findOne = sinon.stub();
        ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
        ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve());
        ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve());

        try {
          await koaRouterRunner(layer.stack, ctx);
        } catch (error) {
          thrownError = error;
        }

        expect(thrownError).to.be.an.instanceof(HttpError);
        expect(thrownError.status).to.equal(500);
        expect(thrownError.code).to.equal('INVITATION_CREATE_FAILED');
      }
  );

  it('should create invitation for user B when user A wants to invite user B to a group and ' +
    'user B do not have an invitation for it #1',
  async () => {
    ctx.request = undefined;
    ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    const newInvitation = {toJSON: () => ({id: 3, status: 'pending'})};

    ctx.postgres.Invitations.findOne = sinon.stub();
    ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
    ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve());
    ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve(newInvitation));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.postgres.Invitations.create.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( newInvitation.toJSON() ));
  });

  it('should create invitation for user B when user A wants to invite user B to a group and ' +
    'user B do not have an invitation for it #2',
  async () => {
    ctx.request.body = undefined;
    ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    const newInvitation = {toJSON: () => ({id: 3, status: 'pending'})};

    ctx.postgres.Invitations.findOne = sinon.stub();
    ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
    ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve());
    ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve(newInvitation));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.postgres.Invitations.create.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( newInvitation.toJSON() ));
  });

  it('should create invitation for user B when user A wants to invite user B to a group and ' +
    'user B do not have an invitation for it #3',
  async () => {
    ctx.request.body.description = undefined;
    ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    const newInvitation = {toJSON: () => ({id: 3, status: 'pending'})};

    ctx.postgres.Invitations.findOne = sinon.stub();
    ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
    ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve());
    ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve(newInvitation));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.postgres.Invitations.create.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( newInvitation.toJSON() ));
  });

  it('should create invitation for user B when user A wants to invite user B to a group and ' +
    'user B do not have an invitation for it #4',
  async () => {
    ctx.request.body.description = 'test';
    ctx.state.userPermissions = ['canInviteOthersToOwnGroups'];

    invitation = {toJSON: () => ({id: 1, status: 'accepted'})};
    const newInvitation = {toJSON: () => ({id: 3, status: 'pending'})};

    ctx.postgres.Invitations.findOne = sinon.stub();
    ctx.postgres.Invitations.findOne.onCall(0).returns(Promise.resolve(invitation));
    ctx.postgres.Invitations.findOne.onCall(1).returns(Promise.resolve());
    ctx.postgres.Invitations.create = sinon.stub().returns(Promise.resolve(newInvitation));

    await koaRouterRunner(layer.stack, ctx);

    expect(ctx.postgres.Invitations.create.calledOnce).to.be.true;
    expect(JSON.stringify( ctx.body )).to.equal(JSON.stringify( newInvitation.toJSON() ));
  });
});
