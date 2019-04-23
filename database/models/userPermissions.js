'use strict';

module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * definition:
   *   UserPermission:
   *     description:
   *       This model is 1-to-1 map that shows which Permission is been granted to which User.
   *
   *     properties:
   *       id:
   *         type: string
   *         format: uuid
   *
   *       userId:
   *         type: string
   *         format: uuid
   *         description: The user that is granted a permission
   *
   *       permissionId:
   *         type: string
   *         format: uuid
   *         description: The permission that is granted to the user
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
  const UserPermissions = sequelize.define('UserPermissions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    permissionId: {
      type: DataTypes.UUID,
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

  return UserPermissions;
};
