const http = require('http');

const port = 8000 || process.env.PORT;

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  response.end(`Hello World from ${request.url}\n`);
});

/* Check if this file is called for starting the app or called as additional module to already started app */
if (process.env.NODE_ENV === 'test') {
  module.exports = server;
} else {
  server.listen(port, () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
}
