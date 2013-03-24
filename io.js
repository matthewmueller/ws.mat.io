/**
 * Export `IO`
 */

module.exports = IO;

/**
 * Clients
 */

var clients = {};

/**
 * Initialize `IO`
 */

function IO(socket) {
  if(!(this instanceof IO)) return new IO(socket);
  this.socket = socket;

  var req = socket.transport.request,
      path = this.path = req.query.pathname;

  if(!clients[path]) clients[path] = [];
  clients[path].push(socket);

  // handle incoming messages
  socket.on('message', this.message.bind(this));

  // cleanup
  socket.on('close', function() {
    var i = clients[path].indexOf(socket);
    if(~i) clients[path].splice(i, 1);
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
  var socket = this.socket;
  var group = clients[path];

  for (var i = 0, len = group.length; i < len; i++) {
    if(group[i] === socket) continue;
    group[i].send(message)
  };

  return this;
};
