'use strict';

const {users} = require('./20190415000001-demo-users');
const {groups} = require('./20190415000003-demo-groups');

const userJohn = users.find(({email}) => email === 'john@smith.com') || {};
const userJane = users.find(({email}) => email === 'jane@smith.com') || {};
const userJudy = users.find(({email}) => email === 'judy@smith.com') || {};
const userBob = users.find(({email}) => email === 'bob@grey.com') || {};

const invitations = [{
  id: '22678093-1ad2-467b-9de0-a86d45a433ff',
  type: 'creator',
  description: 'Auto-generated and accepted when User created the group',
  fromUserId: userJohn.id,
  toUserId: userJohn.id,
  groupId: groups[0].id,
  status: 'accepted',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '797986e8-e3ca-4ea7-b670-bb4d088212be',
  type: 'request',
  description: 'Hunny, can you please join our family group',
  fromUserId: userJohn.id,
  toUserId: userJane.id,
  groupId: groups[0].id,
  status: 'accepted',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '884fb745-0335-4f53-a147-5c7efed9e4a3',
  type: 'request',
  description: 'Sunshine, can you please join our family group',
  fromUserId: userJohn.id,
  toUserId: userJudy.id,
  groupId: groups[0].id,
  status: 'accepted',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '1a2cc8fd-4115-4614-84f2-2dc01c3ef970',
  type: 'creator',
  description: 'Auto-generated and accepted when User created the group',
  fromUserId: userBob.id,
  toUserId: userBob.id,
  groupId: groups[1].id,
  status: 'accepted',
  createdAt: new Date(),
  updatedAt: new Date(),
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Invitations', invitations, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Invitations', {
      id: {
        [Sequelize.Op.in]: invitations.map(({id}) => id),
      },
    }, {});
  },

  invitations,
};
