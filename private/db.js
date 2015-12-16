/**
* message retour ko sur la forme : <nomDeLaFonction>_<l+numeroDeLigne>_<koOUok>
*/

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var ID_MONGO = 'mongodb://projetSportif:alex123456789aze@dogen.mongohq.com:10036/ProjetEsme';

//collections
var COLLECTIONNAME = 'pronosSportifAdd Document';
//messages d'erreur
var ERR_CONNECTION_BASE = 'erreur lors de la connection à la base de données';
var CATEGORIE_ERREUR = 'ERROR';
var CATEGORIE_OK = 'SUCCESS';


// Ajout AM 16/12/15 23h
exports.signup = function(b,res){
	var NOM_METHODE = 'SIGNUP';
	MongoClient.connect(ID_MONGO, function(err, db) {
	if(err) {//en cas d'erreur de connection
		res.writeHead(503, {"Content-Type": "application/json" });
		res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		return;
	}else{
		res.writeHead(200, {"Content-Type": "application/json" });
		var collection = db.collection(COLLECTIONNAME);
		collection.insert(b,function(err, doc){
			if(err){				
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"register-doublon"}));
				db.close();
			}else{				
				res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE}));
				db.close();
			}
		});
	}
});
};


/**
* RCU - 09/08/2015 - Ajout fonction sign-in, pour se connecter à son compte
* parametres entres : login et password
* collection DB : bourse_users
************************************************************************************
*
*/
exports.signin = function(data, res){//fonction pour ajouter un USER
	var NOM_METHODE = "SIGNIN";
	MongoClient.connect(ID_MONGO, function(err, db) {
	    if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
	    }		
		var collection = db.collection(COLLECTIONNAME);
		collection.find({login:data.formLogin, pwd:data.formPassword}).toArray(function(err, results){			
			if (err) {
				throw err;
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "2", err_message:ERR_CONNECTION_BASE}));
			}
		if (results[0]){//si on trouve bien le login et le PW associé dans la base de donnée 
			var cookieValue =  data.formLogin.substring(0,3) + Math.floor(Math.random() * 100000000);//pour cookieName
			if (data.formRememberMe == true){//si la case rememberme est cochée
				var cookieExpire = new Date(new Date().getTime()+604800000).toUTCString();
			}
			else{
				var cookieExpire = new Date(new Date().getTime()+900000).toUTCString();//si rememberme pas cochee
			}			
			collection.update(
				{login:data.formLogin, pwd:data.formPassword},
				{$set:
					{					 					 
					 rememberme: data.formRememberMe,
					 cookieValue: cookieValue
					}
				},
				{upsert: false},function(err){
				if (err){
					throw err;
					res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "3", err_message:'erreur methode update inconnue'}));
				}
			});
			res.writeHead(200, {"Content-Type": "'text/plain'", "Set-Cookie" : 'cookieName='+cookieValue+';expires='+cookieExpire});//on ecrit le cookie chez le client					
			res.end(JSON.stringify({categorie:CATEGORIE_OK,suc_methode:NOM_METHODE}));
		}else{
			res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "4", err_message:'Login or password are false !'}));
		}
		db.close;
		});	    
	});
};
// fin RCU - 09/08/2015 - Ajout fonction sign-in, pour se connecter à son compte

/**
* RCU - 09/08/2015 - Ajout fonction qui verifie l'existence d'un cookie dans la DB
* parametres entree : c : le cookie du client, dans le header, fct : la fct renvoye au routeur
* collection : bourse_users
************************************************************************************
*/
exports.valid_cookie = function(c, obj, fct){
	var NOM_METHODE = 'valid_cookie';
	if (c){
		MongoClient.connect(ID_MONGO, function(err, db) {
		if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "71", err_message:ERR_CONNECTION_BASE}));
	    }	
		var collection = db.collection(COLLECTIONNAME);
		c = c.split("cookieName=");//car cookieName=rom19282839" par excemple donc on eneleve le cookieName
		 collection.find({cookieValue: c[1]}).toArray(function(err, results) {
		 if (err){		 	
		 	obj[fct](false);	 
		 }else if (results[0]){		 	
		 	obj[fct](true);	 
		 }else if (!results[0]){		 	
		 	obj[fct](false);	 
		 }		 
	 });	
	})
	}else{
		obj[fct](false);	 
	}
};
// fin RCU - 09/08/2015 - Ajout fonction qui verifie l'existence d'un cookie dans la DB


