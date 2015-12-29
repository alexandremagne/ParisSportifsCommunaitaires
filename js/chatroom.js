var obj = {};
var data = {} //objet transmis au routeur
var contenuHTML = {} // Contient le code html pour remplacer le gif annimé

obj.start = function(){
	obj.flagScroll = 0;
	setInterval(obj.getMessageChatRoom, 5000);
	obj.envoyerMessageChatRoomFormId();
};

obj.getMessageChatRoom = function(){
	data.action = "GETCHATROOM";
	obj.post(data, obj.log_callback);
};

obj.envoyerMessageChatRoomFormId = function(){
	document.getElementById('envoyerMessageChatRoomFormId').onsubmit = function(event){
		//obj.replace_content_by_animation_GIF_loader('btnChatAjaxLoaderId');
		data.action = "SENDMESSCHATROOM"
		data.message = document.getElementById('btn-input').value;
		obj.post(data, obj.log_callback);
		event.preventDefault();
	};
};

obj.post = function (data, callback) {	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

obj.log_callback = function () {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);			
		if (r.categorie == "SUCCESS"){
			if(r.suc_methode == "GETCHATROOM"){				
				console.log(r);
				obj.remplirChatRoom(r.data);
			}else if(r.suc_methode == "SENDMESSCHATROOM"){
				console.log(r);				
				document.getElementById('btn-input').value = "";
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				obj.remplirChatRoom(r.data);
			}	
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "GETCHATROOM"){
				console.log("error GETCHATROOM");
			}else if(r.err_methode == "SENDMESSCHATROOM"){
				console.log("error SENDMESSCHATROOM");
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}
		}
	}
};

obj.replace_content_by_animation_GIF_loader = function(id){
	contenuHTML.string = document.getElementById(id).innerHTML; // objet contenuHTML créé en haut du doc
	contenuHTML.id = id;
	document.getElementById(id).innerHTML = '<img src="../images/ajax-loader-mid.gif" style="height:auto width:auto" >';
};

obj.remplirChatRoom = function(tab){
	if(document.getElementById("loadStatutId")){//pour enlever le chargement....
		document.getElementById("chatRoomId").innerHTML = "";
	}
	var string = "";
	var stringTmp = "";
	for(var i = 0; i < tab.length; i++){			
		if(i%2 == 0){
			string = '<li class="left clearfix" id="messageIdNumero_'+i+'">'
			+'<span class="chat-img pull-left">'
			+'<img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" class="img-circle">'
			+'</span>'
			+'<div class="chat-body clearfix">'
			+'<div class="header">'
			+'<strong class="primary-font">'+tab[i][0]+'</strong>'
			+'<small class="pull-right text-muted">'
			+'<i class="fa fa-clock-o fa-fw"></i> '+timeSince(tab[i][1])+' ago'
			+'</small>'
			+'</div>'
			+'<p>'
			+''+tab[i][2]+''
			+'</p>'
			+'</div>'
			+'</li>';
		}			
		else{
			string = '<li class="right clearfix" id="messageIdNumero_'+i+'">'
			+'<span class="chat-img pull-right">'
			+'<img src="http://placehold.it/50/FA6F57/fff" alt="User Avatar" class="img-circle">'
			+'</span>'
			+'<div class="chat-body clearfix">'
			+'<div class="header">'
			+'<small class=" text-muted">'
			+'<i class="fa fa-clock-o fa-fw"></i>'+timeSince(tab[i][1])+' ago</small>'
			+'<strong class="pull-right primary-font">'+tab[i][0]+'</strong>'
			+'</div>'
			+'<p>'
			+''+tab[i][2]+''
			+'</p>'
			+'</div>'
			+'</li>'
		}
		if(document.getElementById("chatRoomId").innerHTML == ""){//chat vide -> chargement page
			stringTmp += string;
		}else if(document.getElementById("chatRoomId").innerHTML.indexOf("messageIdNumero_"+i) == -1){//si numero id pas dans le chat
			console.log("nouveau message");						
			document.getElementById("chatRoomId").innerHTML += string;			
			console.log(document.getElementById("scrollElementChat").scrollHeight);
			document.getElementById("scrollElementChat").scrollTop = document.getElementById("scrollElementChat").scrollHeight;
		}else{
			console.log("pas de nouveau message");							
		}
	}
	if(document.getElementById("chatRoomId").innerHTML == ""){//chat vide -> chargement page
		document.getElementById("chatRoomId").innerHTML = stringTmp;
		setTimeout(function(){document.getElementById("scrollElementChat").scrollTop = document.getElementById("scrollElementChat").scrollHeight + 1000},2000);
	}
};


timeSince = function(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }
    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval + ' ' + intervalType;
};

obj.start();