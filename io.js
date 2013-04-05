/**
 * Export `IO`
 */

module.exports = IO;

/**
 * Pools, segmented by path
 */

var pools = {};

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
      path = this.path = req.query.pathname,
      name = this.name = req.query.name;

  // only permit sockets with pathnames
  if(!path) return socket.close();

  // if the socket has given a name, place in clients
  if (name) {
    var key = path + '|' + name;
    if(clients[key]) {
      return socket.send('{"event":"nak"}');
    } else {
      socket.send('{"event":"ack"}');
      clients[key] = socket;
    }
  }

  // add to pool
  if (!pools[path]) pools[path] = [];
  pools[path].push(socket);

  // handle incoming messages
  socket.on('message', this.message.bind(this));

  // cleanup
  socket.on('close', function() {
    var i = pools[path].indexOf(socket);
    if (~i) pools[path].splice(i, 1);
    if(name) delete clients[path + '|' + name]
  });
}

/**
 * Called when a message is recieved
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.message = function(message) {
  var path = this.path,
      socket = this.socket,
      group = pools[path],
      json = JSON.parse(message),
      client;

  if (json.to && (client = clients[path + '|' + json.to])) {
    client.send(message);
    return this;
  }

  for (var i = 0, len = group.length; i < len; i++) {
    if(group[i] === socket) continue;
    group[i].send(message)
  };

  return this;
};
