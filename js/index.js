var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cont=0;


app.use(express.static('public'));

io.on('connection', function(socket){
	cont++;
  io.sockets.emit("new user", "Un nuevo usuario se ha conectado", cont);

  socket.on('chat message', function(msg, nick){
    io.sockets.emit('chat message', msg, nick);
  });

  socket.on("disconnect", function(){
  	cont--;
  	io.sockets.emit("user out", "Un usuario se ha desconectado", cont);
  });
  socket.on("writing", function(nick){
  	io.sockets.emit("user writing", `${nick} is writing...`);
  });
});

http.listen(process.env.PORT || "3000", function(){
  console.log('listening on *:3000');
});