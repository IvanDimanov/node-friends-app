const fs = require('fs');
const path = require('path');

const swaggerSpec = require('../swagger-ui-dist/swagger.spec.json');

const INDEX_DEFAULT_PATH = path.join(__dirname, '../swagger-ui-dist/index.html');
const INDEX_TEMPLATE_DEFAULT_PATH = path.join(__dirname, '../swagger-ui-dist/index.template.html');
const SPEC_TEMPLATE_PLACEHOLDER = '<-- This is where the Swagger JSON will be placed -->';

/**
 * Loads Swagger template and creates main Swagger index.html file
 * with all `spec` data loaded from `swagger.spec.json`.
 *
 * @category utils
 *
 * @return {String} The already saved content for the main Swagger index.html file
 */
function createSwaggerIndex() {
  const templateContent = fs.readFileSync(INDEX_TEMPLATE_DEFAULT_PATH, 'utf-8');
  const specContent = templateContent.replace(SPEC_TEMPLATE_PLACEHOLDER, JSON.stringify(swaggerSpec, undefined, 2));

  fs.writeFileSync(INDEX_DEFAULT_PATH, specContent, 'utf-8');

  return specContent;
}

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (require.main === module) {
  createSwaggerIndex();
} else {
  module.exports = {
    createSwaggerIndex,
    INDEX_DEFAULT_PATH,
    INDEX_TEMPLATE_DEFAULT_PATH,
    SPEC_TEMPLATE_PLACEHOLDER,
  };
}
