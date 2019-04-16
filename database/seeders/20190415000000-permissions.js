'use strict';

const permissions = [{
  id: '8cce4664-f3f8-40ab-8b97-42ecf785a27c',
  key: 'canReadOwnUser',
  label: 'Read Own User',
  description: 'Be able to read all of your own user info',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '5475e045-a1ca-4952-9249-301c5fe7becf',
  key: 'canWriteOwnFirstName',
  label: 'Update First name',
  description: 'Be able to write your own first name',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '7de95f09-0d33-4c5a-b26f-d771191112ea',
  key: 'canWriteOwnLastName',
  label: 'Update Last name',
  description: 'Be able to write your own last name',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'aa21c066-3f0a-4d21-863d-1fcb6024e81a',
  key: 'canWriteOwnEmail',
  label: 'Update Email',
  description: 'Be able to write your own email address',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'e7d9f232-dc49-41eb-9c8d-b13a99ea9d94',
  key: 'canWriteOwnPassword',
  label: 'Update Password',
  description: 'Be able to write your own password',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'ee34f3c2-ff41-4bfb-b554-44dcc2bf41cd',
  key: 'canReadOthersUser',
  label: 'Read Others User',
  description: 'Be able to read the user of others',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '93a066f0-f4ee-45a9-a43e-a3ca19641310',
  key: 'canCreateGroups',
  label: 'Create Groups',
  description: 'Be able to create your own groups',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '50516f25-6dc7-4bf8-bfba-33c49144fb7e',
  key: 'canReadJoinedGroups',
  label: 'Read joined Groups',
  description: 'Be able to read a list of groups you joined',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '48a6bb17-2b3f-41d2-b286-8c8ed35b17da',
  key: 'canJoinOwnGroups',
  label: 'Join Own groups',
  description: 'Be able to join the groups you created',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '1ecebebd-2531-4a47-a1af-a03e3f8666ca',
  key: 'canLeaveOwnGroups',
  label: 'Leave Own groups',
  description: 'Be able to leave the groups you created',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'ed237ee2-c6e9-46da-ade8-742ffa268de7',
  key: 'canJoinOthersGroups',
  label: 'Join other groups',
  description: 'Be able to join groups that other users created',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '70850909-5c25-4d8e-8d8c-3a525b6752e5',
  key: 'canLeaveOthersGroups',
  label: 'Leave other groups',
  description: 'Be able to leave groups that other users created',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: '9413d66d-8296-4e4d-924b-ff1ff2e570d7',
  key: 'canInviteOthersToOwnGroups',
  label: 'Invite to own groups',
  description: 'Be able to invite other users to groups you created',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 'bf62dee4-7554-460d-87c3-1a18b5edf16e',
  key: 'canKickOthersFromOwnGroups',
  label: 'Kick from own groups',
  description: 'Be able to kick other users from groups you created',
  createdAt: new Date(),
  updatedAt: new Date(),
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permissions', permissions, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', {
      id: {
        [Sequelize.Op.in]: permissions.map(({id}) => id),
      },
    }, {});
  },

  permissions,
};
