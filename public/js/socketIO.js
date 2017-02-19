var nick=prompt("¿Cómo te llamas?");
	  var socket = io();
	  $('form').submit(function(e){
      e.preventDefault();
	    socket.emit('chat message', $('#m').val(), nick);
	    $('#m').val('');
	  });
	  $('input').keydown(function(){
	  	socket.emit("writing", nick);
	  })
	  
	  socket.on('chat message', function(msg, nick){
   		$('#messages').append($('<li>').text(nick+' dice: '+msg));
  	});
	  socket.on('new user', function(msg, cont){
   		$('#messages').append($('<li>').text(msg+`. Hay ${cont} usuarios`));
  	});
	  socket.on('user out', function(msg, cont){
   		$('#messages').append($('<li>').text(msg+`. Quedan ${cont} usuarios`));
  	});
	  socket.on("user writing", function(msg){
	  	$('#w').replaceWith(msg);
	  })