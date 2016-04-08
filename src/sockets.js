var socketJwt = require('socketio-jwt')
// This is evil, but we're only using sutro in our app and only temporarily so it's ok
var find = require('lodash.find')

var io
exports.init = function (_io, secret) {
  io = _io
  io.use(socketJwt.authorize({
    secret: secret,
    handshake: true
  }))

  io.on('connection', function (socket) {
    socket.userId = socket.decoded_token.id
    socket.sessionId = socket.handshake.query.sessionId

    if (!socket.sessionId) {
      socket.emit('error', 'sessionId must be passed up with connection string')
      socket.disconnect()
    }
  })
}

exports.findSessionSocket = function findSessionSocket (sessionId) {
  return find(io.sockets.connected, function (socket, socketId) {
    return socket.sessionId === sessionId
  })
}
