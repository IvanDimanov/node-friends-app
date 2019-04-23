const nodePackage = require('./package.json');

module.exports = {
  info: {
    title: nodePackage.name,
    version: nodePackage.version,
    description: nodePackage.description,
  },
  host: process.env.SWAGGER_HOST || 'localhost:8000',
  basePath: '/',
  apis: ['./backend/**/*.js', './database/**/*.js'],
};
