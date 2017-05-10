module.exports = function (server, sessionMiddleware) {
    var io = require('socket.io')(server);
    var redis = require('redis');
    var client = redis.createClient();

    client.subscribe('images');

    // compartir la session de express con socket.io
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    client.on('message', (channel, message) => {
        console.log(message);
        if(message === 'images') {
            io.emit('new image', message)
        }
    });

    // socket io connect
    io.sockets.on('connection', (socket) => {
        console.log(socket.request.session.user._id); // ya que comparte la misma session con express, hay accesl al usuario
    })
}
