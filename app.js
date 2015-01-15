var fs = require('fs');
var qs = require('querystring');
var http = require('http');
var url = require('url');
var path = require('path');
var nowjs = require("now");
var connect = require("connect");
var db = require('mongojs').connect('mongodb://localhost/analytics');
var ObjectId = db.ObjectId;
//var db = require('mongojs').connect('mongodb://nodejitsu:14ff5d09d4c0cc99d05d1819622bcecd@flame.mongohq.com:27038/nodejitsudb180315606108');

// ----------------------------------------
// GLOBALS
// ----------------------------------------
var mUsers = db.collection('mUsers'),
	mObjectTyps = db.collection('mObjectTyps'),
	mGeomObjects = db.collection('mGeomObjects');

var NodeTypeId=1,
	LineTypeId=2,
	FaceTypeId=3;

var g_onlineUsers = [];

var GuestId="";

//var app = connect();

//app.use(connect.static(__dirname + '/public'));

//var httpApp =  http.createServer(app).listen(8080);

// ----------------------------------------
// INITIALIZE DATABASE
// ----------------------------------------

mObjectTyps.find({'Name' : 'Node'}, ['_id'], function (err, docs) {
	//console.log("nodeobjtypdocslen=%d", docs.length);
	if (!err && docs.length!=0) {
		console.log("node objtyps already exists on database");
	}
	else {
	    mObjectTyps.save({Name:'Node', GlobalID:NodeTypeId});
	}
});

mObjectTyps.find({'Name' : 'Line'}, ['_id'], function (err, docs) {
	//console.log("lineobjtypdocslen=%d", docs.length);
	if (!err && docs.length!=0) {
		console.log("line objtyps already exists on database");
	}
	else {
	    mObjectTyps.save({Name:'Line', GlobalID:LineTypeId});
	}
});

mObjectTyps.find({'Name' : 'Face'}, ['_id'], function (err, docs) {
	//console.log("faceobjtypdocslen=%d", docs.length);
	if (!err && docs.length!=0) {
		console.log("face objtyps already exists on database");
	}
	else {
	    mObjectTyps.save({Name:'Face', GlobalID:FaceTypeId});
	}
});

mUsers.find({'username' : 'Guest'}, ['_id'], function (err, docs) {
	console.log("userdocslen=%d", docs.length);
	if (!err && docs.length!=0) {
		GuestId=docs[0]._id;
	    //console output to display the current value of the global, GuestId
		console.log("GuestId already exists= "+ GuestId.toHexString());
	}
	else {
		//Create a new entry
		console.log("Guest doesn't exist, creating a new database entry");
		var tempdoc = {username: "Guest", posx:300.0, posy:300.0, posz:200.0};
		mUsers.save(tempdoc);
		GuestId=tempdoc._id;
		console.log("newly generated _id: "+tempdoc._id);
	}
});

// ----------------------------------------
// FUNCTIONS
// ----------------------------------------

function CreateNewObject(req, res, requestData) {
	var currenttime = new Date();
	//change to single number representation
	currenttime = currenttime.getTime();
    var POST = qs.parse(requestData);
    var obtype=Number(POST.OBJECTTYPE);

    //Change so that it is not GuestId!!!
	var newobj = {
		CreationTime: currenttime,
		ModifiedTime: currenttime,
		User: GuestId,
		geom: {}
	};

	console.log("attempting to add object of type "+obtype);
	
    switch (obtype) {
		case NodeTypeId:
			StoreNode(res, newobj, POST);
		break;
		case LineTypeId:
			StoreLine(res, newobj, POST);
		break;
		case FaceTypeId:
			StoreFace(res, newobj, POST);
		break;
	}

	mGeomObjects.save(newobj); 	
	res.write(JSON.stringify(newobj));
}

function StoreNode(_res, _obj, _post) {
	
 	_obj.Type=NodeTypeId;

    var newnode = {
		X:	Number(_post.X),
		Y:	Number(_post.Y),
		Z:	Number(_post.Z),
		X0:	Number(_post.X),
		Y0:	Number(_post.Y),
		Z0:	Number(_post.Z)
    };

    _obj.geom=newnode;
}

function StoreLine(_res, _obj, _post) {
	_obj.Type=LineTypeId;

    var newline = {
    		N0:	_post.N0,
    		N1:	_post.N1
    };

    _obj.geom=newline;    	

	console.log("line successfully added");	
}


function StoreFace(_res, _obj, _post) {
	_obj.Type=FaceTypeId;

    var newface = {
    		N0:	_post.N0,
    		N1:	_post.N1,
    		N2:	_post.N2
    };

    _obj.geom=newface;    	

	console.log("face successfully added");	
}

// ----------------------------------------
// ROUTING
// ----------------------------------------
var server = http.createServer(function(req, res){

	//Store the requested pathname for routing
	var pathname = url.parse(req.url).pathname;
	var fullpath = path.join(process.cwd(), pathname);

	/*if(pathname == "/nowjs/now.js"){
		res.end(fs.readFileSync(__dirname+'/now.js'));
	}*/

	if (pathname == "/Login") {
		res.writeHead(200, {'Content-Type':'application/json'});

		var requestData = '';
		req.on('data', function (data) {
		    requestData += data;
		});

		req.on('end', function () {
		    var POST = qs.parse(requestData);

			console.log("trying to login as "+POST.username);

			mUsers.find({username : POST.username}, function (err, docs) {
				if(err){
					console.log("Error looking for screenname on database");
					res.end();
				}
				else if (docs.length!=0) {
					console.log("This screenname already exists");
					//send the found document to the client
					res.end(JSON.stringify(docs[0]));
		        }
		        else {
		        	//Create a new entry
					console.log("This screenname doesn't exist, creating a new database entry");
		        	var tempdoc = {username: POST.username, posx:300.0, posy:300.0, posz:200.0};
		        	mUsers.save(tempdoc);
					console.log("newly generated _id: "+tempdoc._id);
					//send the newly created document to the client
					res.end(JSON.stringify(tempdoc));
		        }
			});
		});
		return;
	}

	if (pathname == "/Create") {

		res.writeHead(200, { 'Content-Type': 'application/json' });
		
	    var requestData = '';
	    req.on('data', function (data) {
	        requestData += data;
	    });
	 
	    req.on('end', function () {
			CreateNewObject(req, res, requestData);
			res.end();
	    });
	    return;
	}

	if (pathname == "/ClearMongoDB"){

		res.writeHead(200, {'Content-Type' : 'text/html'});

		req.on('end', function () {
			console.log("clearDB requested..");
			mGeomObjects.remove({}, function (err) {
					if(!err) console.log("database clearing...");
					else console.log("failed");
			});

			res.end();
		});
		return;
	}

	if (pathname == "/RequestServerUpdate") {
		res.writeHead(200, {'Content-Type':'application/json'});

		var requestData = '';
		req.on('data', function (data) {
		    requestData += data;
		});

		req.on('end', function () {
		    var POST = qs.parse(requestData);

		    /*mGeomObjects
		    .where('ModifiedTime').gt(POST.lastsynctime)
			.run(
				function (err, docs) {
					if (err) {
		        		res.end();
		    		} 
		    		else {
		 				res.end(JSON.stringify(docs)); 
			     	}
			     }
		 	);*/

    		console.log(POST.lastsynctime);
    		////////////HELLLPPPPPP
			mGeomObjects.find({ "ModifiedTime" :{$gt:Number(POST.lastsynctime)} }, function(err,docs){
				if (err || !docs) {
	        		res.end();
	        		console.log("didn't work");
	    		} 
	    		else {
	 				res.end(JSON.stringify(docs)); 
	        		console.log(JSON.stringify(docs));
		     	}
			});
		/*mGeomObjects.find({ }, function(err,docs){
				if (err || !docs) {
	        		res.end();
	        		console.log("didn't work");
	    		} 
	    		else {
	 				res.end(JSON.stringify(docs)); 
	        		console.log(JSON.stringify(docs));
		     	}
			});*/
		});

		return;
	}

	/*if (pathname == "/updateNodeXYZ") {

		res.writeHead(200, {'Content-Type':'application/json'});

	    var requestData = '';
	    req.on('data', function (data) {
	        requestData += data;
	    });
	 
	    req.on('end', function () {
	        var POST = qs.parse(requestData);
	        var condition = {_id: ObjectId(POST._id)},//FIXXXXX FLIPPED???
	        	update = {$set:{ "ModifiedTime": POST.ModifiedTime , "geom.X":POST.Z , "geom.Y":POST.X , "geom.Z":POST.Y }},
	        	options = {multi:false};

			console.log(update);

			mGeomObjects.update(
	    		condition,
	    		update,
	    		options,
	    		function (err, numAffected) {
	    			if (err) {
	            		res.end();
	        		} 
	        		else {
	        			console.log("successfully edited"+numAffected);
	     				//res.end(JSON.stringify(docs)); 
	     				res.end();
			     	}
				}
			);
			//mGeomObjects.save();
		});
	    return;
	}*/

	path.exists(fullpath, 
		function(exists) {
		    if (!exists) {
		        res.writeHead(404, {'Content-Type': 'text/plain'});			        
		        res.write("pathname="+pathname);
		        res.write("fullpath="+fullpath);
		        res.end("<h1>Page not found</h1>");
		        return;
		    }
	 
	    	fs.readFile(fullpath, "binary", 
	    		function(err, data) {
			        if (err) {
			            res.writeHead(500, {'Content-Type': 'text/plain'});
			            res.end("<h1>Page cannot be read</h1>");
			            return;
			        }
			 
			        res.writeHead(200, {'Content-Type' : 'text/html'});
			        res.write(data, "binary");
			        res.end();
	    		}
	    	);
		}
	);
});

server.listen(process.env.VCAP_APP_PORT || 8080);

// ----------------------------------------
// NOWJS STUFF
// ----------------------------------------
//var everyone = nowjs.initialize(server);
//var everyone = nowjs.initialize(server, {socketio: {transports: ["xhr-polling"]}});
var everyone = nowjs.initialize(server, {socketio: {transports: ['xhr-polling', 'jsonp-polling']}});

//var everyone = nowjs.initialize(server, {socketio: {transports: ["xhr-polling"]}});

everyone.now.UserList=[];

/*everyone.connected(function(){
  everyone.now.UserList[this.now.]
});*/

everyone.disconnected(function(){
  console.log("Left: " + this.now.UserData.name);
  everyone.now.UserList[this.now.UserData.id]=undefined;
  //everyone.now.UserList.splice(this.now.UserData.id,1);
  //everyone.now.OnUserLeave(this.now.UserData);
  everyone.now.OnUserListChanged();
});

everyone.now.OnNewUser = function(user){
	everyone.now.UserList[user.id]=user;
	everyone.now.OnUserListChanged();
	console.log("Joined: " + this.now.UserData.name);
};

everyone.now.OnUserLeave = function(user){
	//everyone.now.UserList[user.id]=undefined;
	everyone.now.UserList.splice(user.id,1);	
	console.log("left2: " + user.name);
	everyone.now.OnUserListChanged();
};

everyone.now.distributeMessage = function(message){
	everyone.now.receiveMessage(this.now.UserData.name, message);
};

everyone.now.AddNewNode = function(x,y,z,userid, clientID, stkr){
	var currenttime = (new Date()).getTime();
	//currenttime = currenttime.getTime();

	var newobj = {
		CreationTime: currenttime,
		ModifiedTime: currenttime,
		User: userid,
		geom: {}
	};

	newobj.Type=NodeTypeId;

    if(stkr){
	    var newnode = {
			X:	Number(x),
			Y:	Number(y),
			Z:	Number(z),
			X0:	Number(x),
			Y0:	Number(y),
			Z0:	Number(z),
			stkr: Number(stkr)
	    };
    }
    else{
	    var newnode = {
			X:	Number(x),
			Y:	Number(y),
			Z:	Number(z),
			X0:	Number(x),
			Y0:	Number(y),
			Z0:	Number(z)
	    };
	}

    newobj.geom=newnode;

    mGeomObjects.save(newobj); 	

    newobj.clientID=clientID;

    everyone.now.BroadCastNewObject(newobj);

    //doesn't work??
    //return newobj;
}

everyone.now.AddNewLine = function(_N0, _N1, userid, clientID){
	var currenttime = (new Date()).getTime();
	//currenttime = currenttime.getTime();

	var newobj = {
		CreationTime: currenttime,
		ModifiedTime: currenttime,
		User: userid,
		geom: {}
	};

	newobj.Type=LineTypeId;

    var newline = {
		N0:	_N0,
		N1: _N1
    };



    newobj.geom=newline;

    mGeomObjects.save(newobj); 	

    newobj.clientID=clientID;

    everyone.now.BroadCastNewObject(newobj);

}

everyone.now.AddNewFace = function(_N0, _N1, _N2, userid, clientID){
	var currenttime = (new Date()).getTime();
	//currenttime = currenttime.getTime();

	var newobj = {
		CreationTime: currenttime,
		ModifiedTime: currenttime,
		User: userid,
		geom: {}
	};

	newobj.Type=FaceTypeId;

    var newface = {
		N0:	_N0,
		N1: _N1,
		N2: _N2
    };



    newobj.geom=newface;

    mGeomObjects.save(newobj); 	

    newobj.clientID=clientID;

    everyone.now.BroadCastNewObject(newobj);

}

everyone.now.updateNodeXYZ = function(x, y, z, _id, ModifiedTime){
	var condition = {"_id": ObjectId(_id)},//FIXXXXX FLIPPED???
    	update = {$set:{ "ModifiedTime": ModifiedTime , "geom.X":z , "geom.Y":x , "geom.Z":y }},
    	options = {multi:false};

	mGeomObjects.update(
		condition,
		update,
		options,
		function (err, numAffected) {
			if (err) {
				console.log("problems!!");
    		} 
    		else {
    			console.log("successfully edited"+numAffected);
	     	}
		}
	);
}

everyone.now.UserPositionChanged = function(id, pos){

	everyone.now.UserList[id].pos=pos;
	everyone.now.UpdateUserPosition(id, pos);

	//update database with new position
	mUsers.update({_id : ObjectId(id)}, {$set:{ posx : pos.x , posy : pos.z, posz : pos.y, }},  function (err, updated) {
		if (err || !updated){
			console.log("failed to update user position");
		}
		else{
			console.log("updated user position");
		}
	});
}

everyone.now.deleteAll = function(){
	console.log("clearDB requested..");
	
	everyone.now.deleteAllLocal();

	mGeomObjects.remove({}, function (err) {
			if(!err) console.log("database clearing...");
			else console.log("failed");
	});	
}

everyone.now.deleteSelected = function(selection){
	console.log("delete requested..");
	
	everyone.now.deleteSelectedLocal(selection);

	for (var k=0; k<selection.length;++k){

		mGeomObjects.remove({_id : ObjectId(selection.Data._id)}, function (err) {
			if(!err) console.log("database clearing...");
			else console.log("failed");
		});	

	}
}

