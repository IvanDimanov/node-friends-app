'use strict';

module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * definition:
   *   User:
   *     description:
   *       The main entity that creates and executes actions.
   *       Such actions can be creating a Group, inviting other User to a Group, login.
   *
   *     properties:
   *       id:
   *         type: string
   *         format: uuid
   *
   *       firstName:
   *         type: string
   *         example: John
   *
   *       lastName:
   *         type: string
   *         example: Smith
   *
   *       email:
   *         type: string
   *         format: email
   *         example: john@smith.com
   *
   *       hashedPassword:
   *         type: string
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
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    hashedPassword: {
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

  Users.associate = () => {};

  return Users;
};
