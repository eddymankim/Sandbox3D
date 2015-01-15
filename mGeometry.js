var NodeTypeId=1;
var LineTypeId=2;
var FaceTypeId=3;

function mObject(databaseobject, theScene) {
	
	var TheThis=this;
	this.Scene=theScene;
	this.Type=databaseobject.Type;

	this.GLobj=null;


	if (databaseobject.Type==NodeTypeId) {

		this.Render=function(){
			TheThis.GLobj.position.set(Number(TheThis.Data.geom.Y), Number(TheThis.Data.geom.Z), Number(TheThis.Data.geom.X));
		}

		this.UpdateGeometry=function(){

			if(TheThis.GLobj==null) {
				
				if(g_haswebgl) {
					//IF IT IS A STICKER RENDER WITH DIFFERENT IMAGE
					if(TheThis.Data.geom.stkr == g_sticker_like){
						TheThis.GLobj = new THREE.Sprite({ map: g_stickerlikeimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center, affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize*1.8;
						g_scene.add( TheThis.GLobj );
					}
					else if(TheThis.Data.geom.stkr == g_sticker_note){
						TheThis.GLobj = new THREE.Sprite({ map: g_stickernoteimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center, affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize*1.5;
						g_scene.add( TheThis.GLobj );
					}
					else if(TheThis.Data.geom.stkr == g_sticker_tree){
						TheThis.GLobj = new THREE.Sprite({ map: g_stickertreeimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.bottomCenter , affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize*4.0;
						g_scene.add( TheThis.GLobj );
					}
					else if(TheThis.Data.geom.stkr == g_sticker_person){
						TheThis.GLobj = new THREE.Sprite({ map: g_avatarimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.bottomCenter , affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize*4.0;
						g_scene.add( TheThis.GLobj );
					}
					else if(TheThis.Data.geom.stkr == g_sticker_dislike){
						TheThis.GLobj = new THREE.Sprite({ map: g_stickerdislikeimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center , affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize;
						g_scene.add( TheThis.GLobj );
					}
					else{
						TheThis.GLobj = new THREE.Sprite({ map: g_ballimg, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center, affectedByDistance : true});
						TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
						TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize;
						//TheThis.GLobj.scaleByViewport = false;
						g_scene.add( TheThis.GLobj );
					}
				}

				if(!g_haswebgl) {
					TheThis.GLobj = new THREE.Particle( new THREE.ParticleCanvasMaterial({color: 0x000000,program: programStroke}) );
					TheThis.GLobj.position.set(TheThis.Data.geom.Y, TheThis.Data.geom.Z, TheThis.Data.geom.X);
					TheThis.GLobj.scale.x = TheThis.GLobj.scale.y = g_defaultnodesize*250;
					g_scene.add( TheThis.GLobj );
				}
			}
			else {
				TheThis.GLobj.position.set(Number(TheThis.Data.geom.Y), Number(TheThis.Data.geom.Z), Number(TheThis.Data.geom.X));
			}
		}

		this.IsDepedent=function(nd){
			return nd==TheThis;
		} 
	}
    else if (databaseobject.Type==LineTypeId){



    	this.Render=function(){



		}

		this.UpdateGeometry=function(){


			if(this.GLobj==null) {
			
				var tempLine=new THREE.Geometry();
				tempLine.vertices.push(new THREE.Vertex(new THREE.Vector3(Number(TheThis.N0.Data.geom.Y), Number(TheThis.N0.Data.geom.Z), Number(TheThis.N0.Data.geom.X))));
				tempLine.vertices.push(new THREE.Vertex(new THREE.Vector3(Number(TheThis.N1.Data.geom.Y), Number(TheThis.N1.Data.geom.Z), Number(TheThis.N1.Data.geom.X))));
				TheThis.GLobj = new THREE.Line(tempLine, lineMaterial);

				tempLine.dynamic=true;
				TheThis.GLobj.dynamic = true;
				g_scene.add( TheThis.GLobj );
			}
			else {
		

		    	TheThis.GLobj.geometry.vertices[0].position.x = Number(TheThis.N0.Data.geom.Y);
				TheThis.GLobj.geometry.vertices[0].position.y = Number(TheThis.N0.Data.geom.Z);
				TheThis.GLobj.geometry.vertices[0].position.z = Number(TheThis.N0.Data.geom.X);


				TheThis.GLobj.geometry.vertices[1].position.x = Number(TheThis.N1.Data.geom.Y);
				TheThis.GLobj.geometry.vertices[1].position.y = Number(TheThis.N1.Data.geom.Z);
				TheThis.GLobj.geometry.vertices[1].position.z = Number(TheThis.N1.Data.geom.X);

				TheThis.GLobj.geometry.__dirtyVertices = true;
			}
		}

		this.IsDepedent=function(nd){
			return (nd==TheThis.N0 || nd==TheThis.N1);
		} 
    }
    else if (databaseobject.Type==FaceTypeId){


    	this.Render=function(){
    		
		}

		this.UpdateGeometry=function(){

			if(TheThis.GLobj==null) {
				var tempFace=new THREE.Geometry();
			
				tempFace.vertices.push(new THREE.Vertex(new THREE.Vector3(TheThis.N0.Data.geom.Y, TheThis.N0.Data.geom.Z, TheThis.N0.Data.geom.X)));

				tempFace.vertices.push(new THREE.Vertex(new THREE.Vector3(TheThis.N1.Data.geom.Y, TheThis.N1.Data.geom.Z, TheThis.N1.Data.geom.X)));
				tempFace.vertices.push(new THREE.Vertex(new THREE.Vector3(TheThis.N2.Data.geom.Y, TheThis.N2.Data.geom.Z, TheThis.N2.Data.geom.X)));
				tempFace.faces.push(new THREE.Face3(0,1,2, new THREE.Vector3(0,0,1) ));

				tempFace.computeCentroids();
				tempFace.computeFaceNormals();

				tempFace.dynamic=true;


				TheThis.GLobj = new THREE.Mesh(tempFace, new THREE.MeshLambertMaterial( { color: 0xAADFF1} ));
				TheThis.GLobj.doubleSided = true;
				//TheThis.GLobj.dynamic = true;
				//TheThis.GLobj.castShadow = true;
				//TheThis.GLobj.receiveShadow = true;
				g_scene.add( TheThis.GLobj );
			}
			else {
		    	TheThis.GLobj.geometry.vertices[0].position.x = TheThis.N0.Data.geom.Y;
				TheThis.GLobj.geometry.vertices[0].position.y = TheThis.N0.Data.geom.Z;
				TheThis.GLobj.geometry.vertices[0].position.z = TheThis.N0.Data.geom.X;


				TheThis.GLobj.geometry.vertices[1].position.x = TheThis.N1.Data.geom.Y;
				TheThis.GLobj.geometry.vertices[1].position.y = TheThis.N1.Data.geom.Z;
				TheThis.GLobj.geometry.vertices[1].position.z = TheThis.N1.Data.geom.X;

				TheThis.GLobj.geometry.vertices[2].position.x = TheThis.N2.Data.geom.Y;
				TheThis.GLobj.geometry.vertices[2].position.y = TheThis.N2.Data.geom.Z;
				TheThis.GLobj.geometry.vertices[2].position.z = TheThis.N2.Data.geom.X;

				TheThis.GLobj.geometry.__dirtyVertices = true;
				TheThis.GLobj.geometry.__dirtyElements = true;
				TheThis.GLobj.geometry.__dirtyNormals=true;


				//TheThis.GLobj.geometry.computeCentroids();
				//TheThis.GLobj.geometry.computeFaceNormals();

			}

			this.IsDepedent=function(nd){
				return (nd==TheThis.N0 || nd==TheThis.N1 || nd==TheThis.N2);
			} 
		}
    }

	lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, depthTest: true});

	this.UpdateFromDatabase(databaseobject);
    if (TheThis.GLobj!=null) TheThis.GLobj.DatabaseObject=TheThis;
}

mObject.prototype.UpdateFromDatabase=function(databaseobject){
	this.Data=databaseobject;
	var ready=true;
	//FIXXXXXXX
	if (databaseobject.Type==NodeTypeId) {

		this.Data.geom.X=Number(this.Data.geom.X);
		this.Data.geom.Y=Number(this.Data.geom.Y);
		this.Data.geom.Z=Number(this.Data.geom.Z);

		for(var i=0; i<this.Scene.Objects.length; ++i){
			if (this.Scene.Objects[i].Type==NodeTypeId) continue;
			if (this.Scene.Objects[i].IsDepedent(this)) 
				return this.Scene.Objects[i].UpdateGeometry();
		}
	}
	else if (this.Type==LineTypeId){
		this.N0=this.Scene.FindObject(this.Data.geom.N0);
    	this.N1=this.Scene.FindObject(this.Data.geom.N1);

    	/*if (this.N0==null) {
    		ready=false;
    		//ask now js to fetch object with id this.Data.geom.N0
    	}
    	if (this.N1==null) {
    		ready=false;
    		//ask now js to fetch object with id this.Data.geom.N1
    	}*/
    	//place this line to some undefined state [block geometry updates]
    } else if (this.Type==FaceTypeId){
    	this.N0=this.Scene.FindObject(this.Data.geom.N0);
    	this.N1=this.Scene.FindObject(this.Data.geom.N1);
    	this.N2=this.Scene.FindObject(this.Data.geom.N2);
    }

	if (ready) this.UpdateGeometry();
}



mObject.prototype.Id=function() {
	return this.Data._id;
}

mObject.prototype.RemoveYourSelf=function() {
	if (this.Type==NodeTypeId) {
		if(!g_haswebgl) {
			g_scene.remove( this.GLobj );
		}
		if(g_haswebgl) {
			g_scene.remove( this.GLobj );
		}
	}
    else if (this.Type==LineTypeId){    	
		g_scene.remove( this.GLobj );
    }
    else if (this.Type==FaceTypeId){
		g_scene.remove( this.GLobj );
    }
}