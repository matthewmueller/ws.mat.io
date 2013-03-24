var express = require('express'),
    engine = require('engine.io'),
    io = require('./io'),
    app = express(),
    es = new engine.Server(),
    server = require('http').createServer(app);

/**
 * Handle the upgrade
 */

server.on('upgrade', function(req, socket, head) {
  es.handleUpgrade(req, socket, head);
});

/**
 * Configuration
 */

app.configure(function() {
  app.use(express.logger('dev'))
  app.use(express.query());
  app.use('/engine.io', es.handleRequest.bind(es));
  app.use(express.errorHandler());
});

/**
 * Handle the connection
 */

es.on('connection', io);

/**
 * Listen if we are calling this file directly
 */
if(!module.parent) {
  var port = process.argv[2] || 9000;
  server.listen(port);
  console.log('Server started on port', port);
}
