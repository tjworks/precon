Ext.Loader.setConfig({enabled:true});
Ext.application({
    name: 'xlang',
    //autoCreateViewport: true,
    appFolder:'/ext/app',
    //models: ['Skill', 'ActiveUser'],    
    //stores: ['Skills'],
    
    controllers: ['GraphController'], //['CytoController'],
	requires:['xlang.view.CytoPage','xlang.view.Page'],
    launch: function() {
       console.log("Ext application launching");
    	 //Ext.create('xlang.view.LanguageList', {});
    	 //Ext.create('Ext.container.Container', {
    	var pagecontainer = Ext.create('Ext.panel.Panel', {			    
			    id:'pagecontainer',
				height:'90%',
			    activeTab:0,
			    border:0,
			    plain: true,
			    bodyBorder:false,
			    layout:'card',
			    bbar: [
//			           {
//			               id: 'move-prev',
//			               text: 'Back!',
//			               handler: function(btn) {
//			                   pagecontainer.getLayout().setActiveItem(0);
//			               }
//			           },
			           {
			        	   html:'Upload Network File',
			        	   handler: function(btn){
			        		   console.log("clicked ", btn)
			        		   console.log($("#fileinput"))
			        		   $("#fileinput").click();
			        		   
			        		   /**
			        		   <a href="#" id="fileSelect">Select some files</a>
			        		   The code that handles the click event can look like this:

			        		   view plainprint?
			        		   var fileSelect = document.getElementById("fileSelect"),  
			        		     fileElem = document.getElementById("fileElem");  
			        		     
			        		   fileSelect.addEventListener("click", function (e) {  
			        		     if (fileElem) {  
			        		       fileElem.click();  
			        		     }  
			        		     e.preventDefault(); // prevent navigation to "#"  
			        		   }, false); */  
			        	   }
			           },
			           '->' // greedy spacer so that the buttons are aligned to each side			           
			       ],
			    items: [
			    
			            {
			            	xtype:'container',
			            	layout:'fit',
			            	id:'card1',
			            	width:'100%',
			            	//height:800,
			            	items: [
										{	
											cls:'box',
											xtype:'container',
											id:'searchbox',
											//anchor:'50% 50%',
											width:400,
											height:200,
											layout:'column',	 
													items:[
														
														{
																xtype:'label',
																text: 'Enter Gene Name'			        						,
																columnWidth:0.2
																
														},
												        			 {
																	    	xtype:'textfield',
																	    	//hideLabel:true,
																	    	name:'namefield',
																	    	id:'namefield',
																	    	allowBlank:false,
																	    	columnWidth:0.3
																	    	//fieldLabel:
																	    },
																	   {
																	    	xtype:'label',
																	    	html:'  &nbsp;',
																	    	columnWidth:0.1
																	   },
																		{
																	    	id:'startbtn',
																			xtype:'button',
																			text: u.t("Find"),
																			columnWidth:0.2,
																			handler: function(){
																				$("#searchbox").fadeOut('slow', function(){
																					pagecontainer.getLayout().setActiveItem(1);
																					$("#searchbox").fadeIn();
																				});																				
																				return false;
																			}
																		}
													]
																
												
													
										} // end first tab  
			            	       ]
			            } 
			        
			        ,{    		         	
			        	title:'Result',
			        	xtype:'cytopage',
			        	id:'cytopage'
		    		} 
			        
			    ],
			    renderTo: 'extframe'
			});		 
    	pagecontainer.getLayout().setActiveItem(1); 
    	
    	Ext.EventManager.on(window, 'beforeunload',function(){
    		console.log("Application unloading");    		
    		//$.ajax('http://localhost:3000/logout?uid='+ getUid(), {async:false})
    	}, this); 
    	
    	postLaunch();
    	 
    } // end launch,
	
})


function postLaunch(){
	console.log("postlaunch");
	initFileDrop()
}
function initFileDrop(){
	
	var dropbox = document.querySelector('body')
	dropbox.addEventListener('drop', function(e) {
		e.stopPropagation();  
		e.preventDefault();  		  
		console.log("dropped");
		handleFile(e.dataTransfer.files);
	}, false );
	dropbox.addEventListener("dragenter", function(e){
		console.log("Entered!");
		//Ext.getBody().mask()
		  e.stopPropagation();  
		  e.preventDefault();  
	}, false);  
	dropbox.addEventListener("dragover", function(e){
		  e.stopPropagation();  
		  e.preventDefault();  
	}, false);  
	dropbox.addEventListener("dragleave", function(e){
		console.log("leave");		 	
	}, false);  
}

function handleFile(files){
	 if(!files || !files.length) {
		 console.error("No files to read:", files);
		 return;
	 }
	 var filename = files[0].name
	 var reader = new FileReader();
	  reader.onload = function(evt) {		   
	    console.log("Read file ", evt.target.result);
	    //todo: validation
	    try{
	    	var network = Network.import(evt.target.result);
	    	drawModel(network);
	    	$("#currentFilename").text(filename);
	    }
	    catch(exp){
	    	alert("Error: "+ exp);
	    }
	  };
	  reader.readAsText(files[0]);	
}


window.getSid = function(){
	/**@todo: use cookie or Durpal authenticated */
	var random_id =  obs(pstfgrpnt().join(","));
	return random_id;
}

/**@todo: temp functions*/

window.getUid = function(){	
	var uid = top.Drupal && top.Drupal.settings && top.Drupal.settings.fb_connect &&  top.Drupal.settings.fb_connect.uid;
	return uid || getSid();	 
}
window.getUname= function(){
	return $("input[name=namefield]").attr('value') || getUid(); 
}

function invokeServer( args, callback){
	args = args || {};		
	console.log("invokeServer: ",args)
	socket.emit('invoke', args, function(data){
		console.log("invokeServer response: "+ $.dump(data));			
		callback && callback(data);
	});
}

function evil( stmt, callback){
	var args={}; 	
	args.stmt = stmt
	socket.emit('evil', args, function(data){
		console.log("evil response: ",  $.dump(data));			
		callback && callback(data);
	});
}
//
//
function changePage(pageid){
	var pcontainer = Ext.getCmp('pagecontainer');
	pcontainer.items.each(function(it){
		if(it.id == pageid)
			pcontainer.setActiveTab(it);
	})
	
//	var cpage = $("div.page").filter(":visible");	
//	if(cpage.length){
//		$(document).trigger('pagebeforehide' + cpage.attr("id") ) ;
//		 
//		cpage.fadeOut('fast', function(){
//			$(document).trigger('pagebeforeshow.'+pagename);
//			$('#'+pagename).fadeIn() 
//			}
//		);		 
//	}	 
//	else{
//		$(document).trigger('pagebeforeshow.'+pagename);
//		//$('#'+pagename).css("display", "block");
//		$('#'+pagename).fadeIn();
//	}	 
} 
//
//
//
//	 
//$(function(){
//	$(document).bind('pagebeforeshow.langlist', function(){
//		console.log("Showing langlist page");
//	})
//})	
$.dump =  function (variable,i){
		  i=i || 0;
          var string = '';
          if(typeof variable == 'object' && i < 3){ // 3 is to prevent endless recursion, set higher for more depth
              string += '';
              
              if(variable && variable.length){
            	  for(var k=0;variable.length && k<variable.length;k++)
            		  string+="\n--- #"+k+" --- "+ $.dump(variable[k], i+1);
              }              
              else{
            	  for(var key in variable)
                	  if (variable.hasOwnProperty(key))
                		  string+="\n["+key+"] => "+ $.dump(variable[key], i+1);
              }
              
          } else {
              string = variable.toString();
          }
          return string;
}
 
