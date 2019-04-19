const Router = require('koa-router');
const groupsRouter = require('../groups');

describe('api/v1/groups groupsRouter', () => {
  it('should be a {Router} koa-router', () => {
    expect(groupsRouter).to.be.an.instanceof(Router);
  });
});
