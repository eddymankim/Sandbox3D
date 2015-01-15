
var g_poschanged=false, g_clickedoncontainer=false;

var g_workplanevector= new THREE.Vector3(0.0, 1.0, 0.0);
var g_workplaneposition  = new THREE.Vector3(0.0, 0.0, 0.0);

function WorkPlaneIntersection(l0, dl){
	var dv=new THREE.Vector3(1.0, 0.0, 0.0);
	dv.sub(g_workplaneposition, l0);

	var den=dl.dot(g_workplanevector);
	if (Math.abs(den)<0.0001) return null; //no intersection line segment is parallel to plane 

	var d=dv.dot(g_workplanevector)/den;
	return new THREE.Vector3(l0.x+dl.x*d, l0.y+dl.y*d, l0.z+dl.z*d);
}

//automatic updates every half second
setInterval ( "OnTimer()", 100 );
function OnTimer(){

	if (g_poschanged) {
		//sync with server

		//set g_camera position to the active user, devise a function to switch users on click
		moveTo(/*x*/g_camera.position.x,/*z*/g_camera.position.y,/*y*/g_camera.position.z);

		// NOTES TO IMPLEMENT WORKING PLANE
		
		//var dv=new THREE.Vector3(1.0, 0.0, 0.0);
		//dv.sub(g_camera.targetpoint,g_camera.viewpoint);
		var dv=g_camera.matrix.getColumnZ();

		if (Math.abs(dv.z)>Math.abs(dv.y) && Math.abs(dv.z)>Math.abs(dv.x)) {
			g_workplanevector=new THREE.Vector3(0.0, 0.0, 1.0);
		}
		else if (Math.abs(dv.x)>Math.abs(dv.y)) {
			g_workplanevector=new THREE.Vector3(1.0, 0.0, 0.0);
		}
		else g_workplanevector=new THREE.Vector3(0.0, 1.0, 0.0);

		//console.log("user camera moved, broadcasting to the server");
	}
	g_poschanged=false;
}

// ----------------------------------------
// On Keyboard Down
// ----------------------------------------
function onWindowKeyDown( event ) {
	//keycode 32 is for SPACEBAR
	if ( event.keyCode === 32 ) {
		g_whichButton = g_noButton;
		//g_locked = false;
		//g_movingsomething = false;
		//send the gizmo far away again
		g_axishelper.position.set(10000,10000,10000);
		Unselect();
		//document.getElementById('status').innerHTML	= g_statusboxtext + "All tools and selections disabled.. just viewing";
		//console.log("tools cleared...");
	}
	//keycode 46 is for del key
	if ( event.keyCode === 46 ) {
		/*deleteSelected();					
		g_axishelper.position.set(10000,10000,10000);
		Unselect();
		document.getElementById('status').innerHTML	= g_statusboxtext + "Deleted selected object";
		console.log("DELETED...");*/
	}
};

// ----------------------------------------
// Mouse Down
// ----------------------------------------
function onContainerMouseDown( event ) {
	event.preventDefault();
	g_clickedoncontainer=true;
	//Re-enable controls
	g_movecamera = true;

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	var cnode = PickNode(vector.x, vector.y);
	
	//SELECTION
	//SELECT ONE NODE (WITH SMALL SELECTION RADIUS)
	if ( g_whichButton == g_selectOneButton && cnode!=null){
		SelectNodesSmooth(cnode.GLobj.position, 1.0, 1.0, true);

		//display properties
		var tempcomment;
		if (cnode.Data.geom.Comment != undefined) { tempcomment = cnode.Data.geom.Comment }
		else { tempcomment = "no comment found" }
		$("#propertiesWindowTop").html("One node selected: <br><br>X: " + Math.floor(cnode.Data.geom.X) + "<br> Y: " + Math.floor(cnode.Data.geom.Y) + "<br> Z: " +Math.floor(cnode.Data.geom.Z) + "<br><br> Comment: <b>"+tempcomment+"</b>");
	}	

	if( (g_whichButton == g_selectMultiButton || g_whichButton == g_moveButton) && cnode!=null){

		SelectNodesSmooth(cnode.GLobj.position, 50.0, 1.0, true);
		
		
		$("#propertiesWindowTop").html("<b>"+g_SmoothSelection.length+"</b> nodes selected");
	}	

	for(var i = 0; i < g_SmoothSelection.length; ++i){
			g_SmoothSelection[i].position0=g_SmoothSelection[i].GLobj.position.clone();
		}

	//CHANGE THIS!!!!!!!
	g_projector.unprojectVector( vector, g_camera );

	vector.subSelf( g_camera.position ).normalize();

	if (cnode==null) g_workplaneposition=new THREE.Vector3(0.0, 0.0, 0.0);
	else g_workplaneposition=cnode.GLobj.position.clone();
	var xpoint=WorkPlaneIntersection(g_camera.position,  vector);
	
	//var ray = new THREE.Ray( g_camera.position,  vector);
	//var sceneintersects = ray.intersectObjects( g_scene.children );

	//endpoint vector of line
	//startpoint g_camera.position of line

	//g_workplanevector, g_workplanePosition //plane

	if ( xpoint!=null) {//sceneintersects.length > 0 ) {

		var x,y,z;
		//y = Number(sceneintersects[ 0 ].point.x);
		//z = Number(sceneintersects[ 0 ].point.y);
		//x = Number(sceneintersects[ 0 ].point.z);

		y = Number(xpoint.y);
		z = Number(xpoint.z);
		x = Number(xpoint.x);
		console.log(x+","+y+","+z);
		//WEIRD HERE
		
		g_moveStartPoint=new THREE.Vector3(x,y,z);
		//g_moveStartPoint=cnode.GLobj.position.clone();

		// add to database
		switch (g_whichButton) {

			case g_createNodeButton:
				g_movecamera = false;
				g_theScene.AddNode(z, x, y);
			break;

			case g_createLineButton:
				g_viewing = false;
				if(n0 == null){
			    	n0 = g_theScene.AddNode(z, x, y);
	    		}
	    		else {
			    	n1 = g_theScene.AddNode(z, x, y);
		    		g_theScene.AddLine(n0,n1);
		    		//clear the temporary nodes
		    		n0=null;
		    		n1=null;
				}
			break;

			case g_createPlineButton:
				g_movecamera = false;
				if(n0 == null){
			    	n0 = g_theScene.AddNode(z, x, y);
	    		}
	    		else {
			    	n1 = g_theScene.AddNode(z, x, y);
		    		g_theScene.AddLine(n0,n1);
		    		//clear the temporary nodes
		    		n0=null;
		    		n1=null;
				}
			break;

			case g_createFaceButton:
				g_movecamera = false;
				if(n0 == null){
			    	n0 = g_theScene.AddNode(z, x, y);
	    		}
	    		else if(n1 == null){
			    	n1 = g_theScene.AddNode(z, x, y);
				}
				else{
					n2 = g_theScene.AddNode(z, x, y);
					g_theScene.AddFace(n0,n1,n2);
					//clear the temporary nodes
		    		n0=null;
		    		n1=null;
		    		n2=null;
				}
			break;

			//IS THERE A BETTER WAY TO DO THIS??
			case g_stkrbtn_like:

				g_movecamera = false;
				var ray = new THREE.Ray( g_camera.position,  vector);
				var sceneintersects = ray.intersectObjects( g_scene.children );
				var x,y,z;
				y1 = Number(sceneintersects[ 0 ].point.x);
				z1 = Number(sceneintersects[ 0 ].point.y);
				x1 = Number(sceneintersects[ 0 ].point.z);

				g_theScene.AddLikeSticker(x1, y1, z1, g_sticker_like);

			break;

			case g_stkrbtn_note:
				g_movecamera = false;
				var ray = new THREE.Ray( g_camera.position,  vector);
				var sceneintersects = ray.intersectObjects( g_scene.children );
				var x,y,z;
				y1 = Number(sceneintersects[ 0 ].point.x);
				z1 = Number(sceneintersects[ 0 ].point.y);
				x1 = Number(sceneintersects[ 0 ].point.z);
				g_theScene.AddLikeSticker(x1, y1, z1, g_sticker_note);
			break;

			case g_stkrbtn_tree:
				g_movecamera = false;
				var ray = new THREE.Ray( g_camera.position,  vector);
				var sceneintersects = ray.intersectObjects( g_scene.children );
				var x,y,z;
				y1 = Number(sceneintersects[ 0 ].point.x);
				z1 = Number(sceneintersects[ 0 ].point.y);
				x1 = Number(sceneintersects[ 0 ].point.z);
				g_theScene.AddLikeSticker(x1, y1, z1, g_sticker_tree);
			break;

			case g_stkrbtn_person:
				g_movecamera = false;
				var ray = new THREE.Ray( g_camera.position,  vector);
				var sceneintersects = ray.intersectObjects( g_scene.children );
				var x,y,z;
				y1 = Number(sceneintersects[ 0 ].point.x);
				z1 = Number(sceneintersects[ 0 ].point.y);
				x1 = Number(sceneintersects[ 0 ].point.z);
				g_theScene.AddLikeSticker(x1, y1, z1, g_sticker_person);
			break;

			case g_stkrbtn_dislike:
				g_movecamera = false;
				var ray = new THREE.Ray( g_camera.position,  vector);
				var sceneintersects = ray.intersectObjects( g_scene.children );
				var x,y,z;
				y1 = Number(sceneintersects[ 0 ].point.x);
				z1 = Number(sceneintersects[ 0 ].point.y);
				x1 = Number(sceneintersects[ 0 ].point.z);
				g_theScene.AddLikeSticker(x1, y1, z1, g_sticker_dislike);
			break;
		}
	}
}

// ----------------------------------------
// Mouse Move
// ----------------------------------------
function onContainerMouseMove( event ) {
	event.preventDefault();	
	//To broadcast the user location
	if(g_clickedoncontainer && g_whichButton != g_moveButton) {
		g_poschanged=true;
	}

	var cnode = null;
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	
	if( g_whichButton == g_selectOneButton || g_whichButton == g_selectMultiButton || g_whichButton == g_moveButton){
		cnode=PickNode(vector.x, vector.y);

		//change pointer style if user hovers over a node
		if(cnode != null)g_container.style.cursor = 'pointer';
		else g_container.style.cursor = 'crosshair';
	}

	//CHANGE THIS!!!!!!!
	//g_projector.unprojectVector( vector, g_camera );
	//var ray = new THREE.Ray( g_camera.position, vector.subSelf( g_camera.position ).normalize() );
	//var sceneintersects = ray.intersectObjects( g_scene.children );

	//CHANGE THIS!!!!!!!
	g_projector.unprojectVector( vector, g_camera );

	vector.subSelf( g_camera.position ).normalize();

	var xpoint=WorkPlaneIntersection(g_camera.position,  vector);


	if ( xpoint!=null) {//sceneintersects.length > 0 ) {

		var x,y,z;
		//y = Number(sceneintersects[ 0 ].point.x);
		//z = Number(sceneintersects[ 0 ].point.y);
		//x = Number(sceneintersects[ 0 ].point.z);

		y = Number(xpoint.y);
		z = Number(xpoint.z);
		x = Number(xpoint.x);

		

		if ( g_whichButton == g_moveButton && g_clickedoncontainer){

			g_moveEndPoint=new THREE.Vector3(x,y,z);
			g_cameraControls.enabled = false;

			var dv=new THREE.Vector3();
			dv.sub(g_moveEndPoint, g_moveStartPoint);

			for(var i = 0; i < g_SmoothSelection.length; ++i){

				var dv2=dv.clone();
				dv2.multiplyScalar(g_SmoothSelection[i].SelectionWeight);
				
				g_SmoothSelection[i].GLobj.position.add(g_SmoothSelection[i].position0, dv2);
			}
		}
	}


	if ( g_whichButton == g_selectMultiButton && SELECTED != null && cnode != null){
		g_cameraControls.enabled = false;
	}




}

// ----------------------------------------
// Mouse Up
// ----------------------------------------
function onContainerMouseUp( event ) {
	event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );

	//CHANGE THIS!!!!!!!
	g_projector.unprojectVector( vector, g_camera );
	vector.subSelf( g_camera.position ).normalize();
	var xpoint=WorkPlaneIntersection(g_camera.position,  vector);


	if ( xpoint!=null) {//sceneintersects.length > 0 ) {

		var x,y,z;
		//y = Number(sceneintersects[ 0 ].point.x);
		//z = Number(sceneintersects[ 0 ].point.y);
		//x = Number(sceneintersects[ 0 ].point.z);

		y = Number(xpoint.y);
		z = Number(xpoint.z);
		x = Number(xpoint.x);
		
		//SELECTED.position.set(x,y,z);
		//updateNodeXYZ (SELECTED, SELECTED_id);

		g_moveEndPoint=new THREE.Vector3(x,y,z);

		if ( g_whichButton == g_moveButton && g_clickedoncontainer){
			var dv=new THREE.Vector3();
			var ready = false;
			dv.sub(g_moveEndPoint, g_moveStartPoint);

			for(var i = 0; i < g_SmoothSelection.length; ++i){

				var dv2=dv.clone();
				dv2.multiplyScalar(g_SmoothSelection[i].SelectionWeight);
				
				g_SmoothSelection[i].GLobj.position.add(g_SmoothSelection[i].position0, dv2);
				
				updateNodeXYZ (g_SmoothSelection[i].GLobj, g_SmoothSelection[i].Id() );

				if(i==g_SmoothSelection.length-1) ready = true;
			}
			if(ready) g_theScene.RequestServerUpdate();
		}
		

		g_cameraControls.enabled = true;
	}

	//g_moveEndPoint=null;
	//g_moveStartPoint = null;
	g_clickedoncontainer=false;
}

// ----------------------------------------
// Touch Start
// ----------------------------------------
function onContainerTouchStart( event ) {
	event.preventDefault();

};

// ----------------------------------------
// Pick Node
// ----------------------------------------
function PickNode(x, y) {
	var cnode=null;
	var dist=9999999999999.0;

	//go through all the local copies...
	for (var k=0; k<g_theScene.Objects.length;++k){
		var o=g_theScene.Objects[k];
		if (o.Type!=NodeTypeId) continue;

//PREVENT STICKER SELECTION FOR NOW // REMOVE THIS!!!!
		if(o.Data.geom.stkr)continue;

		o.p2=g_projector.projectVector( new THREE.Vector3(o.Data.geom.Y, o.Data.geom.Z, o.Data.geom.X), g_camera );
		var dx=o.p2.x-x;
		var dy=o.p2.y-y;
		var d=dx*dx+dy*dy;
		if (dist>d) {
			dist=d;
			cnode=o;
		}
	}

	if (dist<0.0005) {

		console.log("node selected!");
		return cnode;
	}
	return null;
}

function Unselect() {
	g_SmoothSelection.length=0;
	g_cameraControls.enabled = true;
	$("#propertiesWindowTop").html("Nothing selected...");

	for (var k=0; k<g_theScene.Objects.length;++k){
		var o=g_theScene.Objects[k];
		if (o.Type!=NodeTypeId) continue;
		if(o.Data.geom.stkr)continue;
		o.SelectionWeight=undefined;
		if(g_haswebgl){
			o.GLobj.scale.x=o.GLobj.scale.y=g_defaultnodesize;
			o.GLobj.map=g_ballimg;
		}
		if(!g_haswebgl){
			o.GLobj.material.program = programStroke;
			o.GLobj.material.color.setHex( 0x000000 );							
			o.GLobj.scale.x=o.GLobj.scale.y=g_defaultnodesize*250;
		}
	}
}

function SelectNodesSmooth(p0, R, D, reset) {
	if (reset) {
		Unselect();
	}

	var R2=R*R;
	for (var k=0; k<g_theScene.Objects.length;++k){
		var o=g_theScene.Objects[k];
		if (o.Type!=NodeTypeId) continue;
		var d2=o.GLobj.position.distanceToSquared(p0);


		if (d2<=R2) {
			
			var newWeight=(1.0-d2/R2);
			if (o.SelectionWeight==undefined || o.SelectionWeight<newWeight) {
//PREVENT STICKER SELECTION FOR NOW // REMOVE THIS!!!!
				if(o.Data.geom.stkr)continue;
				if (o.SelectionWeight==undefined) g_SmoothSelection.push(o);

				o.SelectionWeight=newWeight;
				if(g_haswebgl) {
					o.GLobj.map=g_ballselectedimg;
					o.GLobj.scale.x=o.GLobj.scale.y=g_defaultnodesize+(o.SelectionWeight*g_defaultnodesize);
					//o.GLobj.scale.x = o.SelectionWeight*0.1;
					//o.GLobj.scale.y = o.SelectionWeight*0.1;
				}
				if(!g_haswebgl){
					o.GLobj.material.program = programFill;
					o.GLobj.material.color.setHex( 0xFF0000 );
					o.GLobj.scale.x=o.GLobj.scale.y=(g_defaultnodesize+(o.SelectionWeight*g_defaultnodesize))*250;
				}
			}
		}
		else {
//PREVENT STICKER SELECTION FOR NOW // REMOVE THIS!!!!
			if(o.Data.geom.stkr)continue;
			if(g_haswebgl) {
					
				o.GLobj.map=g_ballimg;
				o.GLobj.scale.x=o.GLobj.scale.y=g_defaultnodesize;

				}
			if(!g_haswebgl){
				o.GLobj.material.program = programStroke;
				o.GLobj.material.color.setHex( 0x000000 );							
				o.GLobj.scale.x=o.GLobj.scale.y=g_defaultnodesize*250;
			}

		}
	}
}

function deleteAll (){
	now.deleteAll();
}

//PROBABLY NOT THE BEST WAY
function deleteSelected (){	
	now.deleteSelected(g_SmoothSelection);
}

function updateNodeXYZ (threejsobj, _id){
	g_theScene.updateNodeXYZ(threejsobj, _id);
}

