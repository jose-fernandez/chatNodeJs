
var socket = io();

var keyCont=-1;
var inc=88;
var cont=0;

var nick;
var status;
var avatar;
var validName;

var jsonUser;




// IMG INPUT MATERIAL DESIGN

var fileInputTextDiv = document.getElementById('file_input_text_div');
var fileInput = document.getElementById('file_input_file');
var fileInputText = document.getElementById('file_input_text');

fileInput.addEventListener('change', changeInputText);
fileInput.addEventListener('change', changeState);

function changeInputText() {
  var str = fileInput.value;
  var i;
  if (str.lastIndexOf('\\')) {
    i = str.lastIndexOf('\\') + 1;
  } else if (str.lastIndexOf('/')) {
    i = str.lastIndexOf('/') + 1;
  }
  fileInputText.value = str.slice(i, str.length);
  if((/\.(gif|jpg|jpeg|png|ico)$/i).test($("#file_input_text").val())){
  $("#m").attr("placeholder","Pulsa enter para enviar imagen");
  $('body').append('<style>::-webkit-input-placeholder{color:#009688;}</style>');
  }else{
  	$("#m").attr("placeholder",`${$("#file_input_text").val()} no es una imagen.`);
  	$('body').append('<style>::-webkit-input-placeholder{color:red;font-weight:bold}</style>');
  }

  $("#m").focus();
}

function changeState() {
  if (fileInputText.value.length != 0) {
    if (!fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.add('is-focused');
    }
  } else {
    if (fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.remove('is-focused');
    }
  }
}

// END

function srcImage(){
	var listAv=document.querySelectorAll("div>a");
	for (var i=0;i<listAv.length;i++){
		if(listAv[i].style[0]=="box-shadow")
			avatar=$(`a.${i}>span>span.mdl-chip__contact>img`).attr("src");
	}
}

$('#name').keydown(function(e){
	if(e.keyCode==13)
		return false;
	else
		socket.emit("check", $("#name").val());

});

$('.botonF1').hover(function(){
  $('.btn').addClass('animacionVer');
});
$('.btn').click(function(){
  $('.btn').removeClass('animacionVer');
});
$('.botonF4').click(function(){
  $("#m").focus();
});

$('.init').click(function(){
	srcImage();
	nick = $("#name").val();
	status = $("#status").val();
	jsonUser={"nick":nick,"status":status,"avatar":avatar};
	enter();
});

socket.on("checked", function(valid){
	validName=valid;
	if(!validName)
		$(".checkIt").replaceWith(`<img class="checkIt" src="images/cross.png" style="width: 35px;">`);
	else
		$(".checkIt").replaceWith(`<img class="checkIt" src="images/tick.png" style="width: 35px;">`);
	if($("#name").val() && $("#status").val() && cont==1 && validName)
  		$('.init').prop('disabled', false);
  	else
  		$('.init').prop('disabled', true);
});

function enter(){
	$('.mdl-progress').css("display",'block');
	$('.container1').css("display",'none');
	$('.container2').css("display",'block');
	$("footer").css("display", "none");
	socket.emit('enter', jsonUser);
}


$('.avat').click(function(){
	if($(this).css("box-shadow").length>10){
		$(this).css("box-shadow",'none');
		cont--;
	}else{
  		$(this).css("box-shadow",'0 20px 20px 0 rgba(0, 150, 136,0.8)');
  		cont++;
	}
  	if($("#name").val() && $("#status").val() && cont==1 && validName)
  		$('.init').prop('disabled', false);
  	else
  		$('.init').prop('disabled', true);
});

$('#status').keydown(function(e){
	if(e.keyCode==13)
		return false;
	else{
	  	if($("#name").val() && $("#status").val() && cont==1 && validName)
	  		$('.init').prop('disabled', false);
	  	else
	  		$('.init').prop('disabled', true);
	}
});

$('form').submit(function(e){
	$('body').append('<style>::-webkit-input-placeholder{color:grey;}</style>');
	
	if($("#m").attr("placeholder")[0]=="P"){
		//Get the first (and only one) file element
	    //that is included in the original event
	    var file = $("input[type=file]")[0].files[0];
	    reader = new FileReader();
	    //When the file has been read...
	    reader.onload = function(evt){
        //Because of how the file was read,
        //evt.target.result contains the image in base64 format
        //Nothing special, just creates an img element
        //and appends it to the DOM so my UI shows
        //that I posted an image.
        //send the image via Socket.io
        	socket.emit('user image', evt.target.result);
    	};
	    //And now, read the image and base64
	    reader.readAsDataURL(file);  
	}
	$("#m").attr("placeholder","Escribe un mensaje aquí...");
	if($("#m").val()==="")
		return false;
	

	e.preventDefault();
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	socket.emit("writing", false);

	$("#messages").animate({ scrollTop: $("ul").height()+inc}, "slow");
	inc+=388;
});

$('#m').keydown(function(){
	keyCont++;
	if (keyCont>2){
		socket.emit("writing", true);
		keyCont=0;
	}
});



socket.on('chat message', function(msg, json){
	$('#messages').append(`<li class="mdl-list__item mdl-list__item--three-line">
							<span class="mdl-list__item-primary-content">
  								<i class="material-icons mdl-list__item-avatar">
  									<img class="avatar 1" style="width:50px" src="${json.avatar}">
								</i>
  								<span><strong>${json.nick}</strong></span>
							    <span class="mdl-list__item-text-body">
							        ${msg}
							    </span>
							</span>
						</li>`);
});

socket.on('user image', function(json, base64Image) {
	var img= base64Image.substr(11,13);

	if(img.substr(0,4)==="jpg;"||
		img.substr(0,4)==="png;"||
		img.substr(0,4)==="jpeg"||
		img.substr(0,4)==="gif;"||
		img.substr(0,4)==="ico;"){
	$('#messages').append(`<li class="mdl-list__item mdl-list__item--three-line" style="height:388px">
							<span class="mdl-list__item-primary-content" style="margin-bottom:300px">
  								<i class="material-icons mdl-list__item-avatar">
  									<img class="avatar 1" style="width:50px" src="${json.avatar}">
								</i>
  								<span><strong>${json.nick}</strong></span>
							    <span class="mdl-list__item-text-body">
							        <a href="${base64Image}" target="_blank"><img class="shareImg" src="${base64Image}"/></a>
							    </span>
							</span>
						</li>`);
	}
});



socket.on('new user', function(count, json, list){

	$(".online>div").replaceWith(`<div class="material-icons mdl-badge 
		mdl-badge--overlap" data-badge="${count}">account_box</div>`);
	$('.bubbleInfo').replaceWith(`<span class="bubbleInfo">
				      ${json.nick} se ha conectado
				    </span>`);
	setTimeout(function(){
		$(".bubbleInfo").fadeOut(1000);
	},1000);
	users(list, json);
});
socket.on('user out', function(count, json, list){
	users(list, json);
	$(".online>div").replaceWith(`<div class="material-icons mdl-badge 
		mdl-badge--overlap" data-badge="${count}">account_box</div>`);
	$('.bubbleInfo').replaceWith(`<span class="bubbleInfo">
				      ${json.nick} se ha desconectado
				    </span>`);
	setTimeout(function(){
		$(".bubbleInfo").fadeOut(1000);
	},1000);
});

socket.on("user writing", function(foo, json){
	if(foo)
		$('.bubbleInfo').replaceWith(`<span class="bubbleInfo">
				      ${json.nick} está escribiendo...
				    </span>`);
	else
		$('.bubbleInfo').replaceWith(`<span style="display:none" class="bubbleInfo">
				    </span>`);		
});


function users(list, json){
	$(".user").remove();
	for(let i=0;i<list.length;i++)
		$('nav.mdl-navigation').append(`<a class="user mdl-navigation__link">

              								<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white" style="width:50px;height:50px">
              									<img class="avatar 1" style="width:50px" src="${list[i].avatar}">
              								</span>
              								<div class="info">
       											<span><strong>${list[i].nick}</strong></span>
       											<span>${list[i].status}</span>
       										</div>
        								</a>`);		

}

