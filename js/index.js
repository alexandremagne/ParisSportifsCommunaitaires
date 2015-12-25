var obj = {};
var data = {} //objet transmis au routeur
var contenuHTML = {} // Contient le code html pour remplacer le gif annimé

obj.start = function(){
	obj.remplirDateFormulaire();
	obj.formSignin();
	obj.formSignup();
};

obj.remplirDateFormulaire = function(){
	for(var i = new Date().getFullYear(); i >1900; i--){
		document.getElementById("register_birthdate_year").innerHTML+= "<option value="+i+">"+i+"</option>";
	}
	for(var i = 1; i <32; i++){
		document.getElementById("register_birthdate_day").innerHTML+= "<option value="+i+">"+i+"</option>";
	}
};

obj.formSignin = function(){
	document.getElementById('formSignin').onsubmit = function(event){
		obj.replace_content_by_animation_GIF_loader('signinAjaxLoader');
		data.action = "signin"
		data.formLogin = document.getElementById('formLogin').value.toLowerCase();
		data.formPassword = document.getElementById('formPassword').value;
		data.formRememberMe = document.getElementById('formRememberMe').checked;
		obj.post(data, obj.log_callback);
		event.preventDefault();
	};
};

obj.formSignup = function(){
	document.getElementById('formSignup').onsubmit = function(event){
		data.action = "signup"; // action a traité pour le routeur
		data.pseudo = document.getElementById('register_name').value;
		//data.firstname = document.getElementById('register_firstname').value;
		data.register_birthdate_day = document.getElementById('register_birthdate_day').value;
		data.register_birthdate_month = document.getElementById('register_birthdate_month').value;
		data.register_birthdate_year = document.getElementById('register_birthdate_year').value;
		//data.male = document.getElementById("register_male").checked;
		data.email = document.getElementById('register_email').value;
		data.pwd = document.getElementById('register_password').value;
		data.c_pwd = document.getElementById('register_confirm_password').value;

		if(data.pwd != data.c_pwd){ //si pwd != confirm pwd
			document.getElementById('problem_confirm_pwd').innerHTML="<strong>You have entered different passwords!</strong>";//on affiche le message d'erreur
			document.getElementById('couleur_register_pwd').className="form-group col-md-6 has-error";//mettre case en rouge pwd et c pwd
			document.getElementById('couleur_register_confirm_pwd').className="form-group col-md-6 has-error";
		}else{//pwd et confirm password sont les même
			document.getElementById('problem_confirm_pwd').innerHTML="";//on supprime le message d'erreur au cas où il y ait
			document.getElementById('couleur_register_pwd').className="form-group col-md-6 has-success";//mettre case en vert pwd et c pwd
			document.getElementById('couleur_register_confirm_pwd').className="form-group col-md-6 has-success";
			obj.replace_content_by_animation_GIF_loader("signupButtonAjaxLoader");//pour remplacer le bouton par un chargement
			obj.post(data, obj.log_callback);
		}

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
			if(r.suc_methode == "SIGNIN"){				
				document.getElementById(contenuHTML.id).innerHTML = '<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Signed successfully!</strong> you are being redirected !</div>';//pour remettre le bouton originel (car gif qui tourne)
				document.getElementById('colorLogin').className="form-group has-success"; //mettre case en rouge pwd et pseudo (innutile je pense vu que l'on redirige)
				window.location = "/html/accueil.html";
			}else if(r.suc_methode == "SIGNUP"){					
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				
				window.location = "/html/accueil.html";
			}		
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "SIGNIN"){
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				document.getElementById("signinError").innerHTML="Your login or password are false.";
				document.getElementById('colorLogin').className="form-group has-error"; //mettre case en rouge pwd et pseudo
			}else if(r.err_methode == "SIGNUP"){		
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}		
		}
	}
};

obj.replace_content_by_animation_GIF_loader = function(id){
	contenuHTML.string = document.getElementById(id).innerHTML; // objet contenuHTML créé en haut du doc
	contenuHTML.id = id;
	document.getElementById(id).innerHTML = '<img src="./images/ajax-loader-mid.gif" style="height:auto width:auto" >';
};

window.onload = function(){
	obj.start();
};