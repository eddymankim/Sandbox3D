function loadJqueryDialogs(){
	//Load the main slide-out menu
    $('.slide-out-div').tabSlideOut({
        tabHandle: '.handle',
        pathToTabImage: 'imgs/mainmenutab.png',
        imageHeight: '50px',
        imageWidth: '150px',
        tabLocation: 'top',
        speed: 300, 
        action: 'click',
        topPos: '0px',  
        leftPos: '5px',
        fixedPosition: false
    });

    //Load slide-out menu checkboxes (buttons)
    $("#toggleSelectToolbar").button().click( function(){ $('#selectToolbar').dialog("open")});
    $("#toggleModifyToolbar").button().click( function(){ $('#modifyToolbar').dialog("open")});
    $("#toggleCreateToolbar").button().click( function(){ $('#createToolbar').dialog("open")});
    $("#toggleStickersToolbar").button().click( function(){ $('#stickersToolbar').dialog("open")});
    $("#toggleViewToolbar").button().click( function(){ $('#viewToolbar').dialog("open")});
    $("#toggleWorkplaneToolbar").button().click( function(){ $('#workplaneToolbar').dialog("open")});
	$("#togglePropertiesWindow").button().click( function(){ $('#propertiesWindow').dialog("open")});
	$("#toggleChatWindow").button().click( function(){ $('#chatWindow').dialog("open")});
	$("#toggleOnlineUserWindow").button().click( function(){ $('#onlineUserWindow').dialog("open")});
	$("#toggleProjectInfoWindow").button().click( function(){ $('#projectInfoWindow').dialog("open")});
	$("#toggleHideAllDialog").button().click( function(){ hideJqueryDialogs(); });

	//prevent orbit when dragging around JqueryUI dialog windows
	$("#selectToolbar").bind( "dialogdrag", function(event, ui) {	g_movecamera = false; });
	$("#modifyToolbar").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
	$("#createToolbar").bind( "dialogdrag", function(event, ui) { g_movecamera = false;	});
	$("#stickersToolbar").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
    $("#viewToolbar").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
    $("#workplaneToolbar").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
	$("#propertiesWindow").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
	$("#chatWindow").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
	$("#onlineUserWindow").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });
	$("#projectInfoWindow").bind( "dialogdrag", function(event, ui) { g_movecamera = false; });

	//prevent orbit when resizing JqueryUI dialog windows
	$("#selectToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#modifyToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#createToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#stickersToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false;	});
    $("#viewToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
    $("#workplaneToolbar").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#propertiesWindow").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#chatWindow").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#onlineUserWindow").bind( "dialogresize", function(event, ui) { g_movecamera = false; });
	$("#projectInfoWindow").bind( "dialogresize", function(event, ui) { g_movecamera = false; });

	//-------------App Toolbars and windows------------//
	//Select toolbar window and buttons
	$('#selectToolbar').dialog({
		resizable: false,
		autoOpen: true,
		width: 108,
		height: 47,
		minHeight: 47,
		minWidth: 42,
		zIndex: 200,
		position: [5,54]
	});
	$("#selectone").button({icons: {primary: "customselectoneicon"}, text:false});
	$("#selectmultiple").button({icons: {primary: "customselectmultipleicon"}, text:false});
	$("#selectgroup").button({icons: {primary: "customselectgroupicon"}, text:false});
	$("#selectcancel").button({icons: {primary: "ui-icon-circle-close"}, text:false});
	
	//Modify toolbar window and buttons
	$('#modifyToolbar').dialog({
		resizable: false,
		autoOpen: true,
		width: 135,
		height: 47,
		minHeight: 47,
		minWidth: 42,
		zIndex: 200,
		position: [5,110]
	});					
	$("#movebutton").button({icons: {primary: "ui-icon-arrow-4"}, text:false, disabled:true});
	$("#groupbutton").button({icons: {primary: "customgroupbuttonicon"}, text:false, disabled:true});
	$("#deletebutton").button({icons: {primary: "customdeletebuttonicon"}, text:false, disabled:true});
	$("#deleteallbutton").button({icons: {primary: "customdeleteallbuttonicon"}, text:false});					
	$("#modifycancel").button({icons: {primary: "ui-icon-circle-close"}, text:false});

	//Create toolbar window and buttons
	$('#createToolbar').dialog({
		resizable: false,
		autoOpen: true,
		width: 162,
		height: 47,
		minHeight: 47,
		minWidth: 42,
		zIndex: 200,
		position: [5,166]
	});						
	$("#createnode").button({icons: {primary: "customcreatenodeicon"}, text:false});
	$("#createline").button({icons: {primary: "customcreatelineicon"}, text:false});
	$("#createpolyline").button({icons: {primary: "customcreatepolylineicon"}, text:false});
	$("#createface").button({icons: {primary: "customcreatefaceicon"}, text:false});
	$("#importfile").button({icons: {primary: "ui-icon-folder-open"}, text:false});					
	$("#createcancel").button({icons: {primary: "ui-icon-circle-close"}, text:false});

	$('#stickersToolbar').dialog({
		resizable: false,
		autoOpen: true,
		width: 162,
		height: 47,
		minHeight: 47,
		minWidth: 42,
		zIndex: 200,
		position: [5,222]
	});	
	$("#stkrbtn_like").button({icons: {primary: "customstickerlikeicon"}, text:false});
	$("#stkrbtn_dislike").button({icons: {primary: "customstickerdislikeicon"}, text:false});
	$("#stkrbtn_note").button({icons: {primary: "customstickernoteicon"}, text:false});
	$("#stkrbtn_tree").button({icons: {primary: "customstickertreeicon"}, text:false});
	$("#stkrbtn_person").button({icons: {primary: "customstickerpersicon"}, text:false});					
	$("#stkrcancel").button({icons: {primary: "ui-icon-circle-close"}, text:false});

	$('#viewToolbar').dialog({
		resizable: false,
		autoOpen: false,
		width: 162,
		height: 47,
		minHeight: 47,
		minWidth: 42,
		zIndex: 200,
		position: [5,278]
	});	

	$('#onlineUserWindow').dialog({
		autoOpen: true,
		resizable: false,
		width: 230,
		height: 92,
		minHeight: 90,
		minWidth: 170,
		zIndex: 200,
		position: ['right','top']
	});

	$('#propertiesWindow').dialog({
		autoOpen: true,
		resizable: false,
		width: 230,
		height: 150,
		minHeight: 90,
		minWidth: 170,
		zIndex: 200,
		position: ['right',259]
	});
	$("#appendcomment").button();
	$("#propertiesWindowTop").html("Nothing selected...");

	$('#chatWindow').dialog({
		autoOpen: true,
		resizable: false,
		width: 230,
		height: 150,
		minHeight: 90,
		minWidth: 170,
		zIndex: 200,
		position: ['right',100]
	});
	$("#sendchat").button();

	//NOWJS chat implementation
	$("#sendchat").click(function(){
		if($("#chat-input").val() != ""){
			now.distributeMessage($("#chat-input").val());
		}
		$("#chat-input").val("");
	});
	now.receiveMessage = function(name, message){
		$("#chatWindowTop").prepend(name + ": " + message+"<br>");
	}

	$("#appendcomment").click(function(){
		//implement comment upload function here
	});

	//bind enter key input
	$('#chat-input').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			$("#sendchat").button().click();
		}
	});

	$('#comment-input').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			$("#appendcomment").button().click();
			$("#comment-input").val("");
		}
	});

	//------------- Cursortextbox ------------//
	//Show and hide the cursortextbox
	$(":button").mouseover(function(){ $('#cursortextbox').css('z-index', 2000); });
	$(":button").mouseout(function() { $('#cursortextbox').css('z-index', -1); });
	//descriptions for all buttons
	$("#selectone").button().mousemove(function(event){			$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Select one node"); });
	$("#selectmultiple").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Select multiple nodes by dragging your mouse"); });
	$("#selectgroup").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Select by group"); });
	$("#selectcancel").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Cancel current tool and clear all selections"); });

	$("#movebutton").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Move selected node(s)"); });
	$("#groupbutton").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Group selected node(s)"); });
	$("#deletebutton").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Delete selected node(s)"); });
	$("#deleteallbutton").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Delete everything, press again if nothing happens"); });
	$("#modifycancel").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Cancel current tool and clear all selections"); });

	$("#createnode").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Create nodes"); });
	$("#createline").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Create lines"); });
	$("#createpolyline").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Create a polyline, press C to close polyline"); });
	$("#createface").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Create triangles"); });
	$("#importfile").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Load a collada file"); });
	$("#createcancel").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Cancel current tool and clear all selections"); });


	$("#stkrbtn_like").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Place a LIKE sticker!"); });
	$("#stkrbtn_note").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Place a NOTE sticker!"); });
	$("#stkrbtn_tree").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Place a TREE sticker!"); });
	$("#stkrbtn_person").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Place a PERSON sticker!"); });
	$("#stkrbtn_dislike").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Place a DISLIKE sticker!"); });
	$("#stkrcancel").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Cancel current tool and clear all selections"); });


    $("#toggleSelectToolbar").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show tools for selecting"); });
    $("#toggleModifyToolbar").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show tools for modifying"); });
    $("#toggleCreateToolbar").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show tools for creating"); });
    $("#toggleStickersToolbar").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show stickers"); });
    $("#toggleViewToolbar").button().mousemove(function(event){			$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show render options"); });
    $("#toggleWorkplaneToolbar").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show workplane options"); });
	$("#togglePropertiesWindow").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show properties window"); });
	$("#toggleChatWindow").button().mousemove(function(event){			$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show chat window"); });
	$("#toggleOnlineUserWindow").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Show list of online users"); });
	$("#toggleProjectInfoWindow").button().mousemove(function(event){	$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("More about this project"); });
	$("#toggleHideAllDialog").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX + 10, top:event.pageY + 10,});  $('#cursortextbox').html("Hide all windows"); });

	$("#sendchat").button().mousemove(function(event){			$('#cursortextbox').css({left:event.pageX - 55, top:event.pageY + 10,});  $('#cursortextbox').html("Send it!"); });
	$("#chat-input").click(function(event){ $("#chat-input").focus(); });
	$("#appendcomment").button().mousemove(function(event){		$('#cursortextbox').css({left:event.pageX - 100, top:event.pageY + 10,});  $('#cursortextbox').html("Attach a comment"); });
	$("#comment-input").click(function(event){ $("#comment-input").focus(); });
}

function hideJqueryDialogs(){
	$("#selectToolbar").dialog( "close" );
	$("#modifyToolbar").dialog( "close" );
	$("#createToolbar").dialog( "close" );
	$("#stickersToolbar").dialog( "close" );
    $("#viewToolbar").dialog( "close" );
    $("#workplaneToolbar").dialog( "close" );
	$("#propertiesWindow").dialog( "close" );
	$("#chatWindow").dialog( "close" );
	$("#onlineUserWindow").dialog( "close" );
	$("#projectInfoWindow").dialog( "close" );
}