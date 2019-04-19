const Router = require('koa-router');
const usersRouter = require('../users');

describe('api/v1/users usersRouter', () => {
  it('should be a {Router} koa-router', () => {
    expect(usersRouter).to.be.an.instanceof(Router);
  });
});
