$(function() {
	$("#selectone").button().click( function(){ 
		g_whichButton = g_selectOneButton;
		console.log("changed to select button") ;
	});

	$("#selectmultiple").button().click( function(){ 
		g_whichButton = g_selectMultiButton; 
	});

	$("#selectgroup").button().click( function(){ 
		g_whichButton = g_selectGroupButton; 
	});

	$("#selectcancel").button().click( function(){ 
		g_whichButton = g_noButton; 
		Unselect();
		console.log("canceled...") ;
	});

	$("#movebutton").button().click( function(){ 
		g_whichButton = g_moveButton;		
		$("#propertiesWindowTop").html("Moving selected objects"); 
	});

	$("#groupbutton").button().click( function(){ 
		g_whichButton = g_groupButton; 
	});

	$("#deletebutton").button().click( function(){ 
		//g_whichButton = g_delSelectedButton;
		//FIXXXXXXXXXX 
		deleteSelected();
		Unselect(); 
	});

	$("#deleteallbutton").button().click( function(){ 
		deleteAll();	
		g_whichButton = g_noButton; 
	});					

	$("#modifycancel").button().click( function(){ 
		g_whichButton = g_noButton;
		Unselect(); 
	});

	$("#createnode").button().click( function(){ 
		g_whichButton = g_createNodeButton;
		Unselect();
		console.log("changed to create node button") ; 
	});

	$("#createline").button().click( function(){ 
		g_whichButton = g_createLineButton;
		Unselect();
		console.log("changed to create line button") ; 
	});

	$("#createpolyline").button().click( function(){ 
		g_whichButton = g_createPlineButton;
		Unselect();
		console.log("changed to create polyline button") ; 
	});

	$("#createface").button().click( function(){ 
		g_whichButton = g_createFaceButton;
		Unselect();
		console.log("changed to create face button") ; 
	});

	$("#importfile").button().click( function(){ 
		//g_whichButton = g_importButton;
		Unselect();

		//dae.updateMatrix();
		//dae.updateMatrixWorld();
		AddDaeVertices(dae); 
	});				

	$("#createcancel").button().click( function(){ 
		g_whichButton = g_noButton;
		Unselect();
	});
		

	$("#stkrbtn_like").button().click( function(){ 
		g_whichButton = g_stkrbtn_like;
		Unselect();
	});
		

	$("#stkrbtn_note").button().click( function(){ 
		g_whichButton = g_stkrbtn_note;
		Unselect();
	});
		

	$("#stkrbtn_tree").button().click( function(){ 
		g_whichButton = g_stkrbtn_tree;
		Unselect();
	});
		

	$("#stkrbtn_person").button().click( function(){ 
		g_whichButton = g_stkrbtn_person;
		Unselect();
	});
		

	$("#stkrbtn_dislike").button().click( function(){ 
		g_whichButton = g_stkrbtn_dislike;
		Unselect();
	});
		

	$("#stkrcancel").button().click( function(){ 
		g_whichButton = g_noButton;
		Unselect();
	});


});

function enableModifyButtons(){
	$("#movebutton").button("enable");
	$("#groupbutton").button("enable");
	$("#deletebutton").button("enable");
}

function disableModifyButtons(){
	$("#movebutton").button("disable");
	$("#groupbutton").button("disable");
	$("#deletebutton").button("disable");
}