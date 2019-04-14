const http = require('http');

const port = 8000 || process.env.PORT;

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  response.end(`Hello World from ${request.url}\n`);
});

/* Check if the this file is called for starting the app or called for getting the `server` */
if (require.main === module) {
  server.listen(port, () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
} else {
  module.exports = server;
}
