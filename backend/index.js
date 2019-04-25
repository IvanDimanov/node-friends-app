const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');
const jwtToUser = require('./koa-middleware/jwtToUser');
const notFound = require('./koa-middleware/notFound');
const onError = require('./koa-middleware/onError');
const {applyAllRoutes} = require('./koa-middleware/applyAllRoutes');

const getDbModels = require('../database/models');

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  process.stdout.write(`Request on ${Date.now()}\n`);
  console.log(`console: Request on ${Date.now()}`);


  res.setHeader('Content-Type', 'text/plain');
  res.end(`Time ${new Date().toISOString()}\n`);
});

server.listen(port, () => {
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);

  console.log(`console: Server running at ${port}`);
  console.log(`console: Server running at ${port}`);
  console.log(`console: Server running at ${port}`);
});
