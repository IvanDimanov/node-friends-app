'use strict';

module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * definition:
   *   Permission:
   *     description:
   *       String flags that will show which user can do what.
   *
   *     properties:
   *       id:
   *         type: string
   *         format: uuid
   *
   *       key:
   *         type: string
   *         description: Internally used reference for the permission
   *         example: canCreateGroups, canInviteOthersToOwnGroups
   *
   *       label:
   *         type: string
   *         description: A UI short explanation of the permission
   *         example: Create Groups
   *
   *       description:
   *         type: string
   *         description: A UI long explanation of the permission
   *         example: Be able to create your own groups
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
  const Permissions = sequelize.define('Permissions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    key: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.STRING,
    },
    description: {
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

  return Permissions;
};
