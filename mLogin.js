//Greeting Dialog box, user must enter screen name first
function ScreenNameLogin(){

	$("#greetingbox").dialog({
		autoOpen 		: true,
		modal 			: true, 
		resizable 		: false,
		draggable 	 	: false,
		closeOnEscape 	: false,
		width 			: 300,
		height 			: 340,
		open 			: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); $(".ui-dialog-titlebar").hide();},
	});

	//Detect user's enter key to submit screenname
	$('#screenname').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			$("#submitscreenname").button().click();
		}
	});

	//Submit the user input, close the modal dialog and expose the rest of the app
	$("#submitscreenname").button().click( function(){

		g_user.name = $("#screenname").val();
		
		console.log("looking for "+g_user.name+" on the database");

		$.ajax({
	        url : "/Login",
	        type : "POST",
	        dataType: "json",
	        data : ({"username": g_user.name}),
	        success: function(response){
	        
	       		//locally store the user _id for later interactions with the database
	       		g_user._id = response._id;

	       		console.log("Client _id set as: "+g_user._id);
	       		console.log("Client screenname set as: "+g_user.name);

	       		//Register Screenname with NOWJS
	       		now.UserData={name:g_user.name, id:g_user._id, pos:(new THREE.Vector3( /*x*/response.posx, /*z*/response.posz, /*y*/response.posy ))};
	       		//now.UserList[g_user._id]={name:g_user.name, id:g_user._id};
 				//now.name = g_user.name;
 				now.OnNewUser(now.UserData);

 				//display username in chat window
 				$("#chatWindowTop").prepend("<b>Hello "+ g_user.name +", Welcome to SandBox3D!</b><br>");
		  	},
			error: function(){
				console.log('failure');
			}
	    });

		$("#screenname").val("");
		$('#greetingbox').dialog('close');
	});
}