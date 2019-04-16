'use strict';

const {users} = require('./20190415000001-demo-users');

const userJohn = users.find(({email}) => email === 'john@smith.com') || {};
const userBob = users.find(({email}) => email === 'bob@grey.com') || {};

const groups = [{
  id: 'a03a09ba-647d-4631-b09f-7452296fbd2c',
  name: 'Smith`s',
  type: 'family',
  createdByUserId: userJohn.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '4b3f6c4f-2e1f-4e20-aded-e635a8cf5eed',
  name: 'Sky',
  type: 'hobby',
  createdByUserId: userBob.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', groups, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Groups', {
      id: {
        [Sequelize.Op.in]: groups.map(({id}) => id),
      },
    }, {});
  },

  groups,
};
