const fs = require('fs');
const path = require('path');

const DEFAULT_ROUTES_FOLDER = '../routes';

/**
 * Loads all JS modules from the `routesFolderPath` and applies them to the koa `app`
 *
 * @category BackEndUtils
 *
 * @param {object} app Instance of `new Koa()`
 * @param {string} routesFolderPath Folder that host all BackEnd API routes
 */
async function applyAllRoutes(app, routesFolderPath = DEFAULT_ROUTES_FOLDER) {
  const basePath = path.join(__dirname, routesFolderPath);
  fs.readdirSync(basePath)
      .forEach((itemPath) => {
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
