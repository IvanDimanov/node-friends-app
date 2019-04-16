const Router = require('koa-router');
const uuid = require('uuid/v4');

const isLoggedIn = require('../koa-middleware/isLoggedIn');
const HttpError = require('../koa-middleware/HttpError');

const {isValidUuidV4} = require('../../utils/isValidUuidV4');

const router = new Router();

router.get('/api/v1/groups/:id',
    isLoggedIn(),
    async (ctx) => {
      const groupId = ctx.params.id;

      if (!isValidUuidV4(groupId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `Group id "${groupId}" is invalid UUID v4`
        );
      }

      if (!ctx.state.userPermissions.includes('canReadJoinedGroups')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have permission "canReadJoinedGroups" in order to access groups you joined'
        );
      }

      const invitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: ctx.state.user.id,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitation) {
        throw new HttpError(
            401,
            'NOT_IN_GROUP',
            `You are not in group "${groupId}"`
        );
      }

      const group = await ctx.postgres.Groups
          .findOne({
            where: {
              id: groupId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!group) {
        throw new HttpError(
            404,
            'NO_GROUP',
            `Group with id "${groupId}" does not exist`
        );
      }

      ctx.body = group;
    }
);

router.post('/api/v1/groups',
    isLoggedIn(),
    async (ctx) => {
      if (!ctx.state.userPermissions.includes('canCreateGroups')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have permission "canCreateGroups" in order to create your own groups'
        );
      }

      if (!ctx.request.body) {
        throw new HttpError(
            400,
            'INVALID_INPUT',
            `Please send JSON as an input`
        );
      }

      const {name, type} = ctx.request.body;

      if (!name || typeof name !== 'string') {
        throw new HttpError(
            403,
            'INVALID_INPUT_NAME',
            `Name "${name}" is invalid`
        );
      }

      if (!type || typeof type !== 'string') {
        throw new HttpError(
            403,
            'INVALID_INPUT_TYPE',
            `Type "${type}" is invalid`
        );
      }

      const group = await ctx.postgres.Groups
          .create({
            id: uuid(),
            name,
            type,
            createdByUserId: ctx.state.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!group) {
        throw new HttpError(
            500,
            'GROUP_CREATE_FAILED',
            `Unable to create group`
        );
      }

      const invitation = await ctx.postgres.Invitations
          .create({
            id: uuid(),
            type: 'creator',
            description: 'Auto-generated and accepted when User created the group',
            fromUserId: ctx.state.user.id,
            toUserId: ctx.state.user.id,
            groupId: group.id,
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitation) {
        throw new HttpError(
            500,
            'INVITATION_CREATE_FAILED',
            `Unable to invite user to own group`
        );
      }

      ctx.body = group;
    }
);

router.post('/api/v1/groups/:id/join',
    isLoggedIn(),
    async (ctx) => {
      const groupId = ctx.params.id;

      if (!isValidUuidV4(groupId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `Group id "${groupId}" is invalid UUID v4`
        );
      }

      if (!ctx.state.userPermissions.includes('canJoinOwnGroups') &&
          !ctx.state.userPermissions.includes('canJoinOthersGroups')
      ) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have either permission "canJoinOwnGroups" or permission "canJoinOthersGroups" in order to join a group'
        );
      }

      const invitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: ctx.state.user.id,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (invitation && invitation.status === 'accepted') {
        throw new HttpError(
            400,
            'ALREADY_JOINED',
            `You are already in group "${groupId}"`
        );
      }

      if (invitation && invitation.status === 'kicked') {
        throw new HttpError(
            403,
            'KICKED_FROM_GROUP',
            `You cannot join group "${groupId}" because you were kicked from it`
        );
      }

      if (!invitation) {
        throw new HttpError(
            403,
            'NO_INVITATION',
            `You must be invited to group "${groupId}" before you decide to join the group`
        );
      }

      if (invitation && (invitation.status === 'pending' || invitation.status === 'declined')) {
        const group = await ctx.postgres.Groups
            .findOne({
              where: {
                id: groupId,
              },
            })
            .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

        if (!group) {
          throw new HttpError(
              404,
              'NO_GROUP',
              `Group with id "${groupId}" does not exist`
          );
        }

        if (group.createdByUserId === ctx.state.user.id) {
          if (!ctx.state.userPermissions.includes('canJoinOwnGroups')) {
            throw new HttpError(
                403,
                'NO_PERMISSION',
                'You must have permission "canJoinOwnGroups" in order to join your own group'
            );
          }
        } else {
          if (!ctx.state.userPermissions.includes('canJoinOthersGroups')) {
            throw new HttpError(
                403,
                'NO_PERMISSION',
                'You must have permission "canJoinOthersGroups" in order to join groups created by others'
            );
          }
        }

        await ctx.postgres.Invitations
            .update(
                {status: 'accepted'},
                {where: {id: invitation.id}}
            );

        ctx.body = group;
        return;
      }

      throw new HttpError(
          500,
          'UNKNOWN_INVITATION_CASE',
          `We are unable to join you in group "${groupId}" at the moment`
      );
    }
);

router.post('/api/v1/groups/:id/leave',
    isLoggedIn(),
    async (ctx) => {
      const groupId = ctx.params.id;

      if (!isValidUuidV4(groupId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `Group id "${groupId}" is invalid UUID v4`
        );
      }

      if (!ctx.state.userPermissions.includes('canLeaveOwnGroups') &&
          !ctx.state.userPermissions.includes('canLeaveOthersGroups')
      ) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have either permission "canLeaveOwnGroups" or permission "canLeaveOthersGroups" in order to leave a group'
        );
      }

      const invitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: ctx.state.user.id,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitation || invitation.status !== 'accepted') {
        throw new HttpError(
            400,
            'NOT_IN_GROUP',
            `You are not in group "${groupId}"`
        );
      }

      if (invitation.status === 'kicked') {
        throw new HttpError(
            403,
            'KICKED_FROM_GROUP',
            `You cannot leave group "${groupId}" because you were kicked from it`
        );
      }

      const group = await ctx.postgres.Groups
          .findOne({
            where: {
              id: groupId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!group) {
        throw new HttpError(
            404,
            'NO_GROUP',
            `Group with id "${groupId}" does not exist`
        );
      }

      if (group.createdByUserId === ctx.state.user.id) {
        if (!ctx.state.userPermissions.includes('canLeaveOwnGroups')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canLeaveOwnGroups" in order to leave your own group'
          );
        }
      } else {
        if (!ctx.state.userPermissions.includes('canLeaveOthersGroups')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canLeaveOthersGroups" in order to leave groups created by others'
          );
        }
      }

      await ctx.postgres.Invitations
          .update(
              {status: 'declined'},
              {where: {id: invitation.id}}
          );

      ctx.body = group;
    }
);

router.post('/api/v1/groups/:groupId/invite/:userId',
    isLoggedIn(),
    async (ctx) => {
      const groupId = ctx.params.groupId;
      const userId = ctx.params.userId;

      if (!isValidUuidV4(groupId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_GROUP_ID',
            `Group id "${groupId}" is invalid UUID v4`
        );
      }

      if (!isValidUuidV4(userId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_USER_ID',
            `User id "${userId}" is invalid UUID v4`
        );
      }

      if (!ctx.state.userPermissions.includes('canInviteOthersToOwnGroups')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have permission "canInviteOthersToOwnGroups" in order to invite a user to a group'
        );
      }

      const group = await ctx.postgres.Groups
          .findOne({
            where: {
              id: groupId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!group) {
        throw new HttpError(
            404,
            'NO_GROUP',
            `Group with id "${groupId}" does not exist`
        );
      }

      const invitorInvitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: ctx.state.user.id,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitorInvitation || invitorInvitation.status !== 'accepted') {
        throw new HttpError(
            404,
            'NOT_IN_GROUP',
            `You are not in group "${groupId}"`
        );
      }

      const invitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: userId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (invitation) {
        if (invitation.status === 'accepted') {
          throw new HttpError(
              400,
              'ALREADY_JOINED',
              `User "${userId}" is already in group "${groupId}"`
          );
        }

        await ctx.postgres.Invitations
            .update(
                {status: 'pending'},
                {where: {id: invitation.id}}
            );

        invitation.state = 'pending';
        ctx.body = invitation;
        return;
      }

      const description = String(((ctx.request || {}).body || {}).description || '');
      const newInvitation = await ctx.postgres.Invitations
          .create({
            id: uuid(),
            type: 'request',
            description: description || 'Group invitation',
            fromUserId: ctx.state.user.id,
            toUserId: userId,
            groupId: group.id,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!newInvitation) {
        throw new HttpError(
            500,
            'INVITATION_CREATE_FAILED',
            `Unable to invite user to group`
        );
      }

      ctx.body = newInvitation;
    }
);

router.post('/api/v1/groups/:groupId/kick/:userId',
    isLoggedIn(),
    async (ctx) => {
      const groupId = ctx.params.groupId;
      const userId = ctx.params.userId;

      if (!isValidUuidV4(groupId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_GROUP_ID',
            `Group id "${groupId}" is invalid UUID v4`
        );
      }

      if (!isValidUuidV4(userId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_USER_ID',
            `User id "${userId}" is invalid UUID v4`
        );
      }

      if (!ctx.state.userPermissions.includes('canKickOthersFromOwnGroups')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have permission "canKickOthersFromOwnGroups" in order to kick a user from a group'
        );
      }

      const group = await ctx.postgres.Groups
          .findOne({
            where: {
              id: groupId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!group) {
        throw new HttpError(
            404,
            'NO_GROUP',
            `Group with id "${groupId}" does not exist`
        );
      }

      const invitorInvitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: ctx.state.user.id,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitorInvitation || invitorInvitation.status !== 'accepted') {
        throw new HttpError(
            404,
            'NOT_IN_GROUP',
            `You are not in group "${groupId}"`
        );
      }

      const invitation = await ctx.postgres.Invitations
          .findOne({
            where: {
              groupId,
              toUserId: userId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!invitation) {
        throw new HttpError(
            400,
            'NOT_IN_GROUP',
            `User "${userId}" is not in group "${groupId}"`
        );
      }

      if (invitation.status === 'kicked') {
        throw new HttpError(
            400,
            'NOT_IN_GROUP',
            `User "${userId}" is kicked from group "${groupId}"`
        );
      }

      await ctx.postgres.Invitations
          .update(
              {status: 'kicked'},
              {where: {id: invitation.id}}
          );

      invitation.state = 'kicked';
      ctx.body = invitation;
    }
);

module.exports = router;
