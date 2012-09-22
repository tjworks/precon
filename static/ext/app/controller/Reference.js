(function(){
	
function highlightConnectionRef(con, on){
	var refs = con.get('refs')
	var ids = refs.pubmed? refs.pubmed: []
	Ext.getCmp("refgrid").highlight(ids, on)
}


Ext.define('Precon.controller.Reference', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.ReferenceGrid'],
    init: function() {
     		log.debug("ReferenceController.init"); 
     		this.control({
     				"#refgrid": {
     					
     					itemclick:{        		
     		        		fn:function(evt, rec){        	
     		        			log.debug("Clicked literature!", arguments)
     		        		}
     		        	},        	      
     		        	itemmouseenter:function(view, row){
     		        		mygraph.highlight( row.data._id, true)
     		        	},
     		        	itemmouseleave:function(view, row){
     		        		mygraph.highlight( row.data._id, false)
     		        	}
     				}
     		});     	
    },      
	onLaunch: function(){
		log.debug("ReferenceController.onlaunch")	
		this.grid = Ext.getCmp("refgrid");
		var self= this		
		
		mygraph.on("mouseover",function(evt, target){
			//log.debug("mouseover", target.__data__)
			if(target.__data__.getClass() == 'connection')
				highlightConnectionRef(target.__data__, true)				
		});
		mygraph.on("mouseout",function(evt, target){
			//log.debug("mouseover", target.__data__)
			if(target.__data__.getClass() == 'connection')
				highlightConnectionRef(target.__data__, false)				
		});
		
		this.getGraphModel().on('add.network', function(){
			self.updateReference()
		})
		mygraph.getModel().on("selectionchanged", self.selectReferences)
		
	},
	selectReferences: function(){
		var grid =  Ext.getCmp("refgrid")
		var selmodel =  grid.getSelectionModel()
		selmodel.deselectAll();
		_.each( mygraph.getModel().getSelections(), function(item,  self ){			
			var refs = item.get('refs')
			var pubids = refs.pubmed? refs.pubmed: []			
	    	for(var i=0;i<pubids.length;i++){        		
	    		pubid = pubids[i]
	    		if(pubid.indexOf("publ")<0) pubid = 'publ'+ pubid
	    		var index = grid.getStore().find('_id', pubid)
	    		if(index>=0 ) selmodel.select(index, true)	
	    	}			 
		});		
		//Ext.getCmp("network-grid").highlight( ids, true)
    },
	updateReference:function(){
		log.debug("Updating references!")
		var self = this
		var literatureGrid = Ext.getCmp("refgrid")
		//var sel = graphModel.getSelections('connection')
		var all_refs = {}
		app.graphModel.getConnections().forEach(function(con){
			// combine all the references
			var ref = con.get('refs');
			for(var i in ref){
				all_refs[i] = all_refs[i] || []
				all_refs[i] = _.union (all_refs[i], ref[i])
			}
		});
		// for now we only deal with pubmed
		p = all_refs['pubmed']	
		
		if(!p || p.length== 0) return
		
		pids = [] 
		// add 'publ' prefix for pubmed refs
		p.forEach(function(pid){
			pid = pid.trim()
			pids.push(  ( pid.indexOf('publ') ==0 ? pid:'publ' + pid) )
		})
		precon.getObjects(pids, function(results){
			results.forEach(function(pub){
				if(literatureGrid.getStore().findExact("_id", pub._id) <0  ){ // add only if not already exists
					log.debug("Add ref ", pub._id, pub)
					pub.authors = pub.authors && pub.authors.length>0? pub.authors:[]
				 	var a = ''
				 	if(_.isArray(pub.authors)){					 	
				 		pub.authors.forEach(function(v){
					 		var name = v.first || ''
					 		if(name) name=name.substring(0,1)
					 		name+=" " + v.last   				 		
					 		a+= (a?', ':'') + name
						 	})
						 pub.authors = a
						 
						 pub.processed_abstract = precon.util.processAbstract(pub)
				 	}
					literatureGrid.getStore().add(pub)
				} // end if
			}); // end forEach						
	    }); // end getObjects
			
	} // end function
	,exportReference:function(selected){		
		var ids = [] 
		var grid= Ext.getCmp("refgrid")
		if(selected)
			var recs = grid.getSelectionModel().getSelection(); // selected refs
		else 
			recs = grid.getStore().getRange(); // all refs
		_.each(recs,  function( rec, indx){
			ids.push( rec.get('_id') )
		});
		console.log('Exporting ' + ids)
		if(ids.length>0){
			precon.util.downloadFile('/api/reference/export/'+ ids.join(",")+".ris", {title:'Downloading file...'})
		}		
	}
});




})();