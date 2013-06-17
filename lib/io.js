/**
 * Module Dependencies
 */

var Pool = require('./pool');

/**
 * Export `IO`
 */

module.exports = IO;

/**
 * Pools, segmented by path
 */

var pool = new Pool;

/**
 * Clients, segmented by "path|name"
 */

var clients = {};

/**
 * Initialize `IO`
 */

function IO(socket) {
  if (!(this instanceof IO)) return new IO(socket);
  this.socket = socket;

  var req = socket.transport.request,
      path = this.path = req.query.pathname;

  // only permit sockets with pathnames
  if(!path) return socket.close();

  // add socket to path
  pool.push(path, socket);

  // handle incoming messages
  socket.on('message', this.message.bind(this));

  // cleanup
  socket.on('close', function() {
    pool.remove(path, socket);
  });
}

/**
 * Called when a message is recieved
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.message = function(message) {
  var path = this.path;
  var json = JSON.parse(message)
  var sockets = pool.pull(path);

  for (var i = 0, socket; socket = sockets[i]; i++) {
    if(socket === this.socket) continue;
    socket.send(message)
  };

  return this;
};
