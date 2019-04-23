'use strict';

module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * definition:
   *   Group:
   *     description:
   *       List of users.
   *
   *     properties:
   *       id:
   *         type: string
   *         format: uuid
   *
   *       name:
   *         type: string
   *
   *       type:
   *         type: string
   *
   *       createdByUserId:
   *         type: string
   *         format: uuid
   *         description: Who was the user to created this group. He might no longer be in the group.
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
  const Groups = sequelize.define('Groups', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    createdByUserId: {
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

  return Groups;
};
