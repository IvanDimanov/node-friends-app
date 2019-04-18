'use strict';

module.exports = (sequelize, DataTypes) => {
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
