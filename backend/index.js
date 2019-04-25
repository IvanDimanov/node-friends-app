const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');


const port = process.env.PORT || 8000;

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
