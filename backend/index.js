const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');
const jwtToUser = require('./koa-middleware/jwtToUser');

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  process.stdout.write(`Request on ${Date.now()}\n`);
  console.log(`console: Request on ${Date.now()}`);


  res.setHeader('Content-Type', 'text/plain');
  res.end(`Hello World 7 ${Date.now()}\n`);
});

server.listen(port, () => {
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);

  console.log(`console: Server running at ${port}`);
  console.log(`console: Server running at ${port}`);
  console.log(`console: Server running at ${port}`);
});
