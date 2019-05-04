var servidor = 'localhost:1003';
var socket = io.connect(servidor);

$('#zonamensaje').hide();

socket.on('connect', function() {
    $('#status').html('Conectado');
});

socket.on('disconnect', function(reason) {
    $('#status').html('Desconectado');
    $('#chat').html('');
    $('#usuarios').html('');
    $('#zonalogin').show();
    $('#zonamensaje').hide();
});

socket.on('onLogin', function() {
    $('#zonalogin').hide();
    $('#zonamensaje').show();
});

socket.on('ReqUsers', function(data) {
    var clients = data.clients;

    $('#usuarios').html('');
    for (var i = 0; i < clients.length; i++) {
        $('#usuarios').append(clients[i].name + '<br>');
    }
});

socket.on('message', function(data) {
    $('#chat').append(data.usuario + ' dice: ' + data.mensaje + '<br>');
});

$('#btnEnviar').click(function() {
    var mensaje = $('#mesanje').val();
    socket.emit('mensaje', { mensaje: mensaje, for: 'na' });
});

$('#btnConectar').click(function() {
    var usuario = $('#usuario').val();
    socket.emit('login', { nombre: usuario });
});