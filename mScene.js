var NodeTypeId=1;
var LineTypeId=2;
var FaceTypeId=3;


function mScene(context){
	this.Objects=new Array();
	this.Actions={};
	this.lastsynctime=0;
	this.thecontext=context;
	this.checking=false;
}

mScene.prototype.RequestServerUpdate=function() {
	var scene=this;
	var currenttime = new Date();
	currenttime = currenttime.getTime();
	
	$.ajax({
        url : "/RequestServerUpdate",
        type : "POST",
        dataType: "json",
        data : ({"lastsynctime": scene.lastsynctime}),
            success: function(response){

           		for(var i=0; i<response.length; ++i){
           			if (response[i].Type!=NodeTypeId) continue;
           			scene.AddObjectFromDatabase(response[i]);
           		}
            	

            	for(var i=0; i<response.length; ++i){
           			if (response[i].Type==NodeTypeId) continue;
           			scene.AddObjectFromDatabase(response[i]);
           		}
            	scene.Render(scene.thecontext);
				
				scene.lastsynctime = currenttime;

				//for debugging ok to delete
            	console.log("lastsynctime=");
            	console.log(scene.lastsynctime);
			  },
			error: function(){
			    console.log('failure');
			}
    });
}

var globalDummyID=0;

function preNewNode(scene, x, y, z, stkr){
	this.ready=false;
	this.newobject=null;


	/*var prenode=this ;
	//change this to server time
	var currenttime2 = new Date(scene.lastsynctime);
	$.ajax({
        url : "/Create",
        type : "POST",
        dataType: "json",
        data : ({"OBJECTTYPE": NodeTypeId, "X" : x, "Y": y, "Z": z}),
        success: function(response){
       
        	prenode.newobject=scene.AddObjectFromDatabase(response);
        	prenode.ready=true;
        	scene.CheckActions();
			scene.Render(scene.thecontext);

			//for debugging ok to delete
			console.log("lastsynctime=");
        	//console.log(this.lastsynctime);
        	console.log(currenttime2);
        	 
		  },
		  error: function(){
		    console.log('failure');
		  }
    });*/

    //scene.Actions.push(this);


    globalDummyID++;
    scene.Actions[globalDummyID]=this;
    now.AddNewNode(x, y, z, now.UserData.id, globalDummyID, stkr);
}

function preNewLine(scene, pn0, pn1){
	this.ready=false;
	this.pending=false;
	this.newobject=null;
	this.pren0=pn0;
	this.pren1=pn1;

	globalDummyID++;
	scene.Actions[globalDummyID]=this;
}

function preNewFace(scene, pn0, pn1, pn2){
	this.ready=false;
	this.pending=false;
	this.newobject=null;
	this.pren0=pn0;
	this.pren1=pn1;
	this.pren2=pn2;

	globalDummyID++;
	scene.Actions[globalDummyID]=this;
}

preNewNode.prototype.CheckMe=function(scene){
	return this.ready;
}

preNewLine.prototype.CheckMe=function(scene){
	if (this.ready) return true;
	if (!this.pren0.ready || !this.pren1.ready || this.pending) return false;
	if (!this.pending) {


		now.AddNewLine(this.pren0.newobject.Id(), this.pren1.newobject.Id());
		/*var preline=this;
		$.ajax({
        url : "/Create",
        type : "POST",
        dataType: "json",
        data : ({"OBJECTTYPE": LineTypeId, "N0" : preline.pren0.newobject.Id(), "N1": preline.pren1.newobject.Id()}),
        success: function(response){
       
        	
			console.log("line added!");
        	preline.newobject=scene.AddObjectFromDatabase(response);

			scene.CheckActions();
			scene.Render(scene.thecontext);
			preline.ready=true;
			preline.pending=false;

		  },
		  error: function(){
		    console.log('failure');
		  }
    	});*/


		this.pending=true;
		return false;
	}

	return this.ready;
}

preNewFace.prototype.CheckMe=function(scene){
	if (this.ready) return true;
	if (!this.pren0.ready || !this.pren1.ready || !this.pren2.ready || this.pending) return false;
	if (!this.pending) {


		now.AddNewFace(this.pren0.newobject.Id(), this.pren1.newobject.Id(), this.pren2.newobject.Id());
		
		/*var preface=this;
		$.ajax({
        url : "/Create",
        type : "POST",
        dataType: "json",
        data : ({"OBJECTTYPE": FaceTypeId, "N0" : preface.pren0.newobject.Id(), "N1": preface.pren1.newobject.Id(), "N2": preface.pren2.newobject.Id()}),
        success: function(response){
       
        	
			console.log("face added!");
        	preface.newobject=scene.AddObjectFromDatabase(response);

			scene.CheckActions();
			scene.Render(scene.thecontext);
			preface.ready=true;
			preface.pending=false;

		  },
		  error: function(){
		    console.log('failure');
		  }
    	});*/


		this.pending=true;
		return false;
	}

	return this.ready;
}

mScene.prototype.CheckActions=function(){
	if(this.checking) return;
	this.checking=true;
	for(var i in this.Actions) {
		if (this.Actions[i].CheckMe(this)) {			
        	delete this.Actions[i];       
		}
	}
	this.checking=false;
}

mScene.prototype.AddObjectFromDatabase=function(jsondata) {
	var scene=this;
	//Find the Object with the incoming _id in the form of jsondata
	//in the "this.Objects" array and store it in "obj"
	var obj=this.FindObject(jsondata._id);

	//If nothing was stored in "obj," then create a new mObject with
	//the incoming data and push it to "this.Objects" array 
	if (obj==null) {
		//do we need to pass the current scene also?
		obj=new mObject(jsondata, scene);
		this.Objects.push(obj);

		//add to local array if it is a node type, for later to create lines, faces, etc
		//if(obj)
	}
	else {
		obj.UpdateFromDatabase(jsondata);
		//obj.Data=jsondata;
	}
	//PROBLEM:
	//jsondata.ModifiedTime is ISO date format
	//this.lastsynctime is javascript native format? not sure.
	//AFTER FIX:
	//now the time is represented as a single number, milliseconds since 1970/01/01
	if (this.lastsynctime==null || this.lastsynctime<jsondata.ModifiedTime) {
		this.lastsynctime=jsondata.ModifiedTime;
	}

	if(jsondata.User==now.UserData.id && jsondata.clientID!=undefined && this.Actions[jsondata.clientID]!=undefined) {
			var Act=this.Actions[jsondata.clientID];

			Act.newobject=obj;
        	Act.ready=true;
        	this.CheckActions();
			this.Render(scene.thecontext);


	}

	return obj;
}

mScene.prototype.FindObject=function(objID) {
	for(var i=0; i<this.Objects.length; ++i){
		if (this.Objects[i].Id()==objID) return this.Objects[i];
	}
	return null;
}

mScene.prototype.Render=function(canvas){
	//if(g_loaded){
		for(var i=0; i<this.Objects.length; ++i){
			this.Objects[i].Render(canvas);
		}
	//}
}

mScene.prototype.updateNodeXYZ=function(threejsobj, _id) {
	var scene=this;
	var currenttime = new Date();
	var currenttimesimple = currenttime.getTime();
	var X = Number(threejsobj.position.x),
		Y = Number(threejsobj.position.y),
		Z = Number(threejsobj.position.z),
		id = _id;

	/*$.ajax({
        url : "/updateNodeXYZ",
        type : "POST",
        dataType: "json",
        data : ({"ModifiedTime": currenttimesimple, "X": X, "Y": Y, "Z": Z, "_id": id}),
            success: function(response){
           		//for debugging ok to delete
            	console.log("success sending new node coordinates/modifiedtime to db");
			  },
			error: function(){
			    console.log('failure');
			}
    });*/

    now.updateNodeXYZ(X, Y, Z, id, currenttimesimple);
}

//not really using this
mScene.prototype.ClearMongoDB=function() {
	//var temp = false;
	//make the ajax call to tell mongodb to clear collection
	$.ajax({
        url : "/ClearMongoDB",
        type : "POST",
        success: function(response){
           		//for debugging ok to delete
            	console.log("successfully clearedMongoDB");            	
			  }
    });
    //go through all mObjects and ask them to delete themselves from the threejs scene
    /*for(var i=0; i<this.Objects.length; ++i){
		this.Objects[i].RemoveYourSelf();
	}*/
	//since we are done with everything we need to do for ClearMongoDB call, let's reset the global, g_cleared back to false
	//g_cleared = false;

    //clear the local array of geometries
    //this.Objects.length = 0;
    //var scene=this;
	//scene.Render(scene.thecontext);
}

mScene.prototype.AddNode=function(x, y, z) {
	//var temp;
	
	//now.AddNewNode(x,y,z,now.UserData.id);
	
	//return temp;
	//return 0;
    return new preNewNode(this, x,y,z);
}


mScene.prototype.AddLine=function(n0, n1) {
	return new preNewLine(this, n0, n1);
}

mScene.prototype.AddFace=function(n0, n1, n2) {
	return new preNewFace(this, n0, n1, n2);
}

mScene.prototype.AddLikeSticker=function(x, y, z, stkr) {
    return new preNewNode(this, x,y,z,stkr);
}
