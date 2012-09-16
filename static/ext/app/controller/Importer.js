Ext.define('Precon.controller.Importer', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.ImporterWindow'],
    init: function() {
     		log.debug("Importer.init"); 
     		this.control({         			
     			
     		});     	
    },    
	onLaunch: function(){
		log.debug("Importer.onlaunch")	
		var self= this
	},
	createWindow: function(){
		var vyew = this.getView('ImporterWindow').create()
		vyew.show();
		var self = this;
		 $("#uploadbox").bind('dragover',function() {$(this).addClass('hover'); return false;})
		 				 .bind("dragend",function () { $(this).removeClass('hover'); return false;})  
		 				 .bind("drop",function(e) {  
		 					  
					          $(this).removeClass("hover")  
					          e.preventDefault();  
					          $("#uploadbox input[type=text]").attr('value', e.originalEvent.dataTransfer.files[0].name)
					          self.processFile( e.originalEvent.dataTransfer.files );					            
		});   		 
		return vyew
	},
	hide: function(){
		this.win.hide()
	},
	showWindow: function(){
		this.win = this.win || this.createWindow()
		this.win.show();
				
	},
	// handle the uploaded file
	processFile: function(files){
		if(!files){
			 log.error("No uplodated files to process");
			 return
		}
		file = files[0];  
		var reader = new FileReader();  
		var self=this;
		reader.onload = function (evt) {  
		  	content =  evt.target.result;
		  	var lines = content.split(/[\r\n]+/);
			var pat = /(.+)(--|->|<-|<->)(.+)/ 
			
			var store = Ext.getCmp("importerGrid").getStore();
			store.removeAll();
			var lineNo = 0;
			
	        for(var i=0;i<lines.length;i++){
	            line = lines[i]
	            line = $.trim(line)
	            lineNo++
	            if(line.indexOf("#") == 0) continue;
	            
	            var record=  {line: lineNo }
	            var matcher = pat.exec(line);
	            if(!matcher){
	            	record.error = "Invalid line"
	            	continue;
	            }            	
	            record.nodeA = $.trim( matcher[1] )
	            record.nodeB = $.trim( matcher[3] )
	            record.direction = $.trim( matcher[2] )
	            
	            store.add(record)
	        }// end for
	        if(store.getCount() == 0 ){
	        	Ext.Msg.alert('Warning', 'Unable to parse file')
	        }
	        else
	        	self.validate();  
		}  
		reader.readAsText(file);           		    
	}// end function process
	,validate:function(){
		var store = Ext.getCmp("importerGrid").getStore();
        msgbox = Ext.Msg.wait('', 'Validating nodes...', {interval:100,increments:1});
        var nodes = [];
        store.each(function(record){
        	if(! record.get("idA") && _.indexOf(nodes,record.get('nodeA').toLowerCase())<0)
        		nodes.push(record.get('nodeA').toLowerCase());
        	if(! record.get("idB") && _.indexOf(nodes,record.get('nodeB').toLowerCase())<0)
        		nodes.push(record.get('nodeB').toLowerCase());
        });
        var self = this
        // call server to validate the nodes
        precon.invoke('entityService.validate', nodes, function(result){
        	// result is a hash of symbol->_id
        	msgbox.hide();
        	for(var k in result){
        		store.each(function(rec){
        			if(rec.get('nodeA').toLowerCase() == k ) rec.set('idA', result[k]);
        			if(rec.get('nodeB').toLowerCase() == k ) rec.set('idB', result[k]);
        		})
        	}
        	self.errorCount = 0;
        	store.each(function(rec){
        		if(!rec.get("idA")  || ! rec.get("idB")){
        			self.errorCount++;
            		return false
        		}        		
        	});
        	self.toggleImportButton();
        });        
	},
	toggleImportButton:function(){
		console.log("Toggling", self.hasError,Ext.getCmp("chkboxIgnoreError").getValue() )
		if( (!this.errorCount) || Ext.getCmp("chkboxIgnoreError").getValue() ) 
			Ext.getCmp("btnImport").enable();
		else
			Ext.getCmp("btnImport").disable();
	}
	,doImport:function(){
		
	}
	
});

 
 
 