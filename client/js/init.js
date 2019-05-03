var servidor = 'localhost:1003';
var socket = io.connect(servidor);

socket.on('connect', function() {
    $('#status').html('Conectado');
});

socket.on('disconnect', function(reason) {
    $('#status').html('Desconectado');
});

socket.on('ReqUsers', function(data) {
    var clients = data.clients;

    $('#usuarios').html();
    for (var i = 0; i < clients.length; i++) {
        $('#usuarios').append(clients[i].name + '<br>');
    }
});

socket.on('message', function(data) {
    $('#chat').append('Mensaje: ' + data.mensaje + '<br>');
});

$('#btnEnviar').click(function() {
    var mensaje = $('#mesanje').val();
    socket.emit('mensaje', { mensaje: mensaje, for: 'na' });
});

$('#btnConectar').click(function() {
    var usuario = $('#usuario').val();
    socket.emit('login', { nombre: usuario });
});