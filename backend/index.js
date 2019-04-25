const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World 11\n');
});

server.listen(port, () => {
  process.stdout.write(`Server running at ${port}\n`);
});
