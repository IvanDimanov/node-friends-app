'use strict';

module.exports = (sequelize, DataTypes) => {
  const Invitations = sequelize.define('Invitations', {
    id: DataTypes.UUID,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    fromUserId: DataTypes.UUID,
    toUserId: DataTypes.UUID,
    status: DataTypes.STRING,
  }, {});

  return Invitations;
};
