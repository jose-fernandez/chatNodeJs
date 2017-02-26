socket = io();
var cont=0;
var nick;
var status;

$('.botonF1').hover(function(){
  $('.btn').addClass('animacionVer');
});
$('.botonF1').click(function(){
  $('.btn').removeClass('animacionVer');
});
$('.btn').click(function(){
  $('.btn').removeClass('animacionVer');
});

$('.init').click(function(){
  $('.mdl-progress').css("display",'block');
  nick = $("#name").val();

  status = $("#status").val();
  socket.emit('enter', nick, status);
  window.location.href = "chat.html";
});

$('a').click(function(){
	if($(this).css("box-shadow").length>10){
		$(this).css("box-shadow",'none');
		cont--;
	}else{
  		$(this).css("box-shadow",'0 20px 20px 0 rgba(0, 150, 136,0.8)');
  		cont++;
	}
  	if($("#name").val() && $("#status").val() && cont==1)
  		$('.init').prop('disabled', false);
  	else
  		$('.init').prop('disabled', true);
});

$('input').keyup(function(e){

  	if($("#name").val() && $("#status").val() && cont==1)
  		$('.init').prop('disabled', false);
  	else
  		$('.init').prop('disabled', true);
});