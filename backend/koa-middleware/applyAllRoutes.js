const fs = require('fs');
const path = require('path');

const DEFAULT_ROUTES_FOLDER = '../routes';

/**
 * 
 * @param {*} ctx 
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
