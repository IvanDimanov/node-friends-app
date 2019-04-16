'use strict';

/* All `hashedPassword` are created with `sha256` on `user.id` + `Pass@123` */
const users = [{
  id: '51eeefbb-dc10-43f7-aa79-f318078ab3be',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@smith.com',
  hashedPassword: '795b2082af950eb82a4c8cd88b6daf63c81b3647cc6f49b30e7a31a77240fe1e',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '0418b353-11b4-41c0-a731-b3951fe6a8c7',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@smith.com',
  hashedPassword: '51dd4a7d540b7056093a5315d7a8ec7f22a4d144b75e81a20670fd7c125f9cd3',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '44227613-f264-495d-ad61-4da9bf1935f9',
  firstName: 'Judy',
  lastName: 'Smith',
  email: 'judy@smith.com',
  hashedPassword: '80216c86772052feac0b282b20c49332b42ecaee3c1297deb34cbc0312968458',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '81150ce6-6f2c-44f4-9713-f06828728ff9',
  firstName: 'Ana',
  lastName: 'Stone',
  email: 'ana@stone.com',
  hashedPassword: '428faa36e17bebe8a5f34fac93629482ba986d999849fede6156840d1ed96f16',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'e2daa8dc-93f2-4c2e-9b34-7ad767ed3c65',
  firstName: 'Bob',
  lastName: 'Grey',
  email: 'bob@grey.com',
  hashedPassword: 'f3f91a8d3a600df6cc6fda16f1aafca3a49f2dc0554d7855aa269e7c75defa6c',
  createdAt: new Date(),
  updatedAt: new Date(),
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      id: {
        [Sequelize.Op.in]: users.map(({id}) => id),
      },
    }, {});
  },

  users,
};
