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

const postgres = require('../database/models');

const port = process.env.PORT || 8000;



const app = new Koa();

app.context.postgres = postgres;

app
    .use(helmet())
    .use(catchError())
    .use(logger)
    .use(bodyParser())
    .use(jwt({secret: process.env.JWT_SECRET || 'Pass@123', key: 'jwtdata', passthrough: true}))
    .use(jwtToUser);

if (process.env.ALLOW_CORS) {
  app.use(cors());
}

applyAllRoutes(app);

app
    .use(notFound)
    .on('error', onError);



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World 11\n');
});

server.listen(port, () => {
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);
  process.stdout.write(`Server running at ${port}\n`);
  console.log(`Server running at ${port}\n`);
  console.log(`Server running at ${port}\n`);
  console.log(`Server running at ${port}\n`);
});
