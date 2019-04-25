const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');

const delay = require('../utils/delay');

const port = process.env.PORT || 8000;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;

  process.stdout.write(`Request on ${Date.now()}\n`);
  console.log(`console: Request on ${Date.now()}`);

  await delay(2000);

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
