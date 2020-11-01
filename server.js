const http = require('http');
const app = require ('./app');

app.set('port', process.env.PORT || process.env.DB_port)
const server = http.createServer(app);

server.listen(process.env.PORT || process.env.DB_port);