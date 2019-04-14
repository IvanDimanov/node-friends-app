const http = require('http');

const port = 8000 || process.env.PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, () => {
  process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
});
