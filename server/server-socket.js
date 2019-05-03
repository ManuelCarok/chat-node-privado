var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1003);

function handler(req, res) {
    res.end();
}

var clients = new Array();

io.on('connection', function(client) {
    client.on('mensaje', function(data) {
        if (data.for == 'na') {
            io.emit('message', { mensaje: data.mensaje });
        } else {

        }
    });

    client.on('disconnect', function(data) {
        fix(client);
        io.emit('ReqUsers', { clients: clients });
    });

    client.on('login', function(data) {
        fix(client);
        clients.push({ name: data.nombre, id: client.id });
        client.join(client.id);
        // Emite a todos menos a ti
        client.broadcast.emit('message', { mensaje: 'El usuario ' + data.nombre + ' se ha conectado' });

        // Se emite a todos
        io.emit('ReqUsers', { clients: clients });
    });

    function fix(client) {
        for (var i = 0; i < clients; i++) {
            if (clients[i].id === client.id) {
                var index = clients.indexOf([i]);
                clients.splice([i], 1);
            }
        }
    }
});


console.log('Servidor conectado');