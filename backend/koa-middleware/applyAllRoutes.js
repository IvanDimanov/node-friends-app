const fs = require('fs');
const path = require('path');

const DEFAULT_ROUTES_FOLDER = '../routes';

const usersRouter = require('../routes/users');
const groupsRouter = require('../routes/groups');

/**
 * Loads all JS modules from the `routesFolderPath` and applies them to the koa `app`
 *
 * @category BackEndUtils
 *
 * @param {object} app Instance of `new Koa()`
 * @param {string} routesFolderPath Folder that host all BackEnd API routes
 */
async function applyAllRoutes2(app, routesFolderPath = DEFAULT_ROUTES_FOLDER) {
  const basePath = path.join(__dirname, routesFolderPath);

  process.stdout.write(`basePath = ${basePath}\n`);

  fs.readdirSync(basePath)
      .forEach((itemPath) => {
        process.stdout.write(`itemPath = ${itemPath}\n`);

        /* Ignore test files and folders */
        if (itemPath === 'test' || itemPath.includes('.spec.')) {
          return;
        }

        const router = require(path.join(basePath, itemPath));
        app
            .use(router.routes())
            .use(router.allowedMethods());
      });
}

module.exports = {
  DEFAULT_ROUTES_FOLDER,
  applyAllRoutes,
};
