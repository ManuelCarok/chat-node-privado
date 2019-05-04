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
            for (var i = 0; i < clients.length; i++) {
                if (clients[i]['id'] === client.id) {
                    io.emit('message', { mensaje: data.mensaje, usuario: clients[i].name });
                }
            }
        } else {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i]['name'] === data.for) {

                    for (var j = 0; j < clients.length; j++) {
                        if (clients[j]['id'] === client.id) {
                            client.broadcast.to(clients[i]['id']).emit('message', { mensaje: data.mensaje + ' [PRIVADO]', usuario: clients[j].name });
                        }
                    }

                }
            }
        }
    });

    client.on('disconnect', function(data) {

        for (var i = 0; i < clients.length; i++) {
            if (clients[i]['id'] === client.id) {
                io.emit('message', { mensaje: 'El usuario ' + clients[i]['name'] + ' se ha desconectado', usuario: 'Servidor' });
            }
        }

        fix(client);
        io.emit('ReqUsers', { clients: clients });
    });

    client.on('login', function(data) {
        fix(client);
        clients.push({ name: data.nombre, id: client.id });
        client.join(client.id);

        client.emit('onLogin');

        // Emite a todos menos a ti
        client.broadcast.emit('message', { mensaje: 'El usuario ' + data.nombre + ' se ha conectado', usuario: 'Servidor' });

        // Se emite a todos
        io.emit('ReqUsers', { clients: clients });
    });

    function fix(client) {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i]['id'] === client.id) {
                var index = clients.indexOf([i]);
                clients.splice([i], 1);
            }
        }
    }
});


console.log('Servidor conectado');