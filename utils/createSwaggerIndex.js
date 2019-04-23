const fs = require('fs');
const path = require('path');

const TEMPLATE_PLACEHOLDER = '<-- This is where the Swagger JSON will be placed -->';

const swaggerSpec = require('../swagger-ui-dist/swagger.spec.json');
const indexPath = path.join(__dirname, '../swagger-ui-dist/index.html');
const indexTemplatePath = path.join(__dirname, '../swagger-ui-dist/index.template.html');

const templateContent = fs.readFileSync(indexTemplatePath, 'utf-8');
const specContent = templateContent.replace(TEMPLATE_PLACEHOLDER, JSON.stringify(swaggerSpec, undefined, 2));

fs.writeFileSync(indexPath, specContent, 'utf-8');
