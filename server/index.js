var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var users=[];
var validName=true;
var jsonUser={"nick":"","status":"","avatar":""};

var deliver=require('delivery');


app.use(express.static('public'));


io.sockets.on('connection', function(socket){
  socket.info={"nick":"","status":"","avatar":""};

  socket.on('user image', function (msg) {
        //Received an image: broadcast to all
        io.sockets.emit('user image', socket.info, msg);
    });



  socket.on("check", function(name){
    
    for (var i=0; i<users.length; i++) {
      if(users[i].nick==name){
        validName=false;
        break;
      }else
        validName=true;
    }
    socket.emit("checked", validName);
  });

  socket.on('enter', function(json){
    socket.info=json;
    console.log(socket.info);
    users.push(json);
    io.sockets.emit("new user", users.length, socket.info, users);

  });

  
  socket.on('chat message', function(msg){
    io.sockets.emit('chat message', msg, socket.info);
  });

  socket.on("disconnect", function(){
    for (var i=0; i<users.length; i++) {
      if(users[i].nick==socket.info.nick){
        users.splice(i,1);
        break;
      }
    }
    io.sockets.emit("user out", users.length, socket.info, users);
  });
  
  socket.on("writing", function(foo){
    console.log(foo);
    io.sockets.emit("user writing", foo, socket.info);
  });

});

const PORT = process.env.PORT || '3343';

http.listen(PORT, function() {
  const port = process.env.PORT || '3343';
  console.log(`Listening on port ${PORT}`);
});