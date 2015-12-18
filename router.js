// tmpazeazeazeeazeeromain

// alexandre


// test 3

var util = require("util"); 
var url = require("url"); 
var fs = require("fs");
var db = require("./private/db.js");

/**
* This method is used to process the request * @param req (Object) the request object
* @param resp (Object) the response object */

exports.router = function (req, resp) {
	var inc_request = new srouter(req, resp);
	inc_request.run();
	inc_request = null;
};

/* --------*/

srouter = function (req, resp) {
	 if (req && resp) {
			this.req = req;
			this.resp = resp;
			//console.log("---------: "+util.inspect(req, false, null));
			//console.log("---------: "+util.inspect(resp, false, null));
			this.pathname = "";
			this.filetype = "";
			this.path = "";
			this.image_file = "jpg png jpeg bmp gif"; 
	} else {
			util.log("ERROR - A srouter object need a request and a response object");
			return;
			}
};

srouter.prototype = {
run:
	function () { 
		this.rest_method	();
	},

rest_method:
	function () {
		if (this.req.method == "GET") { 
			this.get_method();
		} else if (this.req.method == "POST") {
			this.post_method();
		} else {
			this.resp.writeHead(501, {"Content-Type": "application/json"});
			this.resp.write(JSON.stringify({message: "Not Implemented"}));
			this.resp.end();
			return;
		}
},



get_method:
	function () {
		var u = url.parse(this.req.url, true, true);
		
		var regexp = new RegExp("[/]+", "g");
		this.pathname = u.pathname.split(regexp);
		this.pathname = this.pathname.splice(1, this.pathname.length - 1); this.filetype = this.pathname[this.pathname.length - 1].split(".");
		this.filetype = this.filetype[this.filetype.length - 1];
		this.path = "." + u.path; //the website is one directory upper than the node server
		
		if (this.pathname[0] == "html")//pour voir dans quel page on va
			{
				db.valid_cookie(this.req.headers.cookie, this, "check_cookie");
			}
		else{			
				this.read_file();
		}
		},

check_cookie:
	function (ret) {		
		if (ret) {				
				this.read_file();			
		}else{
			this.path = "./index.html";
			this.read_file();			
		}
	},

post_method:
	function (){
		var _this = this;
        var buff = "";
        this.req.on("data", function (c) {
            buff += c;
        });
        this.req.on("end", function () {
            _this.go_post(buff);
        });
    },



go_post:
	function (b) {
		b = JSON.parse(b);
		this.b = b;
		if(b.action == "signin") {
			db.signin(b, this.resp);
		}else if(b.action = "signup"){
			var objDb = {};//on cree nouvel objet pour etre sur qu on insere bien ce que l on veut dans la base : pseudo, mail...
			verificationFormulaireRegister(objDb,b);			
			db.signup(objDb, this.resp);
		}else {
			db.valid_cookie(this.req.headers.cookie, this, "cb_cookie");
		}	
},


cb_cookie:
	function (ret) {	
		var b = this.b;
		if (ret) {	
			if (b.action == 'FORMCHECKSYMBOL'){
				stock.getStock(this, "coursActuel");
				return;
			}else if(b.action == "azeaze"){
				db.azeaze(this.resp, this.req.headers.cookie);
			}
			util.log("INFO - Action not found : " + b.ac);
			this.resp.end(JSON.stringify({message:"erreurCookie"}));
		}
				
		
		//this.resp.writeHead(501, {"Content -Type": "application/json"});
		//this.resp.end(JSON.stringify({message: "nocookie"}));
		
	},



read_file:
function () {
	console.log(util.inspect(this.pathname));
	if (!this.pathname[0] || this.pathname[0] == "nodejs") {
		//util.log("ALERT - Hack attempt, resquest on : " + util.inspect(this.pathname)
		this.pathname = "./index.html";
		this.path = "./index.html";
		this.filetype = "html";
	}
	
	if (this.pathname[0] == "data.json") console.log(util.log("========== bonjour"));
	this.load_file();	
},
	
load_file:
	function () {
		var _this = this;
		fs.exists(this.path, function (ex) {
			if (ex) {
				fs.readFile(_this.path, function (e, d) {
					if (e) {
						util.log("ERROR - Problem reading file : " + e);
					} else {
						_this.file = d;
						util.puts("GET on path : " + util.inspect(_this.path));
						_this.file_processing();
			} });
			} else {
				util.log("INFO - File requested not found : " + _this.path);
				_this.resp.writeHead(404, {"Content-Type":"text/html"});
				_this.resp.end(); 
			}
		});
	},
	
file_processing:
	function () {
		if (this.filetype == "htm") {
			this.resp.writeHead(200, {"Content-Type": "text/html"});
		} else if (this.image_file.indexOf(this.filetype) >= 0) {
			this.resp.writeHead(200, { "Content-Type" : "image/" + this.filetype });
		} else {
			this.resp.writeHead(200, { "Content-Type" : "text/" + this.filetype });
		}
		this.file_send();
	},
	
file_send:
function () {
	this.resp.write(this.file);
	this.resp.end();
	}
};

var a = {a: "arg1" , b: 3 };

var verificationFormulaireRegister = function(obj1,obj2){
	obj1.pseudo = obj2.pseudo;
	obj1.email = obj2.email;
	obj1.pwd = obj2.pwd;
	//date creation
	obj1.dateCreation = new Date().getTime();
	obj1.dateDerniereConnexion = new Date().getTime();
	obj1.cd_langue = "fr";//pour le moment, sinon à faire en fonction du navigateur
	obj1.cd_profil = "user";
	obj1.dateLock = -1;
	obj1.flagLock = 0;//non bloqué
	obj1.nombreTentative = 0;
}
