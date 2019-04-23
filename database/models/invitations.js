'use strict';

module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * definition:
   *   Invitation:
   *     description:
   *       Shows a relation between a User and a Group.
   *       An invitation can in general be - accepted, pending, kicked, or not existing.
   *
   *     properties:
   *       id:
   *         type: string
   *         format: uuid
   *
   *       type:
   *         type: string
   *         description: Internally used as to distinct invitations that were sent from user-to-user and
   *                      invitations that were sent from system-to-user.
   *         example: creator, request
   *
   *       description:
   *         type: string
   *         description: A short message sent to welcome the invited user.
   *         example: Hey Bob - can you join our hobby group
   *
   *       fromUserId:
   *         type: string
   *         format: uuid
   *         description: Who sent the invitation.
   *
   *       toUserId:
   *         type: string
   *         format: uuid
   *         description: Who is invited.
   *
   *       groupId:
   *         type: string
   *         format: uuid
   *
   *       status:
   *         type: string
   *         format: uuid
   *         description: What is the relation between `toUserId` and `groupId`.
   *         example: accepted, pending, kicked
   *
   *       createdAt:
   *         type: string
   *         format: date-time
   *
   *       updatedAt:
   *         type: string
   *         format: date-time
   *
   *       deletedAt:
   *         type: string
   *         format: date-time
   */
  const Invitations = sequelize.define('Invitations', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    fromUserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    toUserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    groupId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {});

  return Invitations;
};
