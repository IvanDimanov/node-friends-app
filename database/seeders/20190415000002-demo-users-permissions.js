'use strict';

const uuid = require('uuid/v4');

const {permissions} = require('./20190415000000-permissions');
const {users} = require('./20190415000001-demo-users');

const adultEmails = [
  'john@smith.com',
  'jane@smith.com',
  'bob@grey.com',
];

const teenEmails = [
  'ana@stone.com',
];

const childEmails = [
  'judy@smith.com',
];

const teenPermissionKeys = [
  'canReadOwnUser',
  'canWriteOwnFirstName',
  'canWriteOwnLastName',
  'canWriteOwnEmail',
  'canWriteOwnPassword',
];

const childPermissionKeys = [
  'canReadOwnUser',
];

const adults = users.filter(({email}) => adultEmails.includes(email));
const teens = users.filter(({email}) => teenEmails.includes(email));
const children = users.filter(({email}) => childEmails.includes(email));

const adultPermissionIds = permissions.map(({id}) => id);
const teenPermissionIds = permissions.filter(({key}) => teenPermissionKeys.includes(key)).map(({id}) => id);
const childPermissionIds = permissions.filter(({key}) => childPermissionKeys.includes(key)).map(({id}) => id);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adultUserPermissions = [];
    adults.forEach(({id: userId}) => {
      adultPermissionIds.forEach((permissionId) => adultUserPermissions.push({
        id: uuid(),
        userId,
        permissionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });
    await queryInterface.bulkInsert('UserPermissions', adultUserPermissions, {});

    const teenUserPermissions = [];
    teens.forEach(({id: userId}) => {
      teenPermissionIds.forEach((permissionId) => teenUserPermissions.push({
        id: uuid(),
        userId,
        permissionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });
    await queryInterface.bulkInsert('UserPermissions', teenUserPermissions, {});

    const childUserPermissions = [];
    children.forEach(({id: userId}) => {
      childPermissionIds.forEach((permissionId) => childUserPermissions.push({
        id: uuid(),
        userId,
        permissionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });
    await queryInterface.bulkInsert('UserPermissions', childUserPermissions, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserPermissions', {
      userId: {
        [Sequelize.Op.in]: users.map(({id}) => id),
      },
    }, {});
  },
};
