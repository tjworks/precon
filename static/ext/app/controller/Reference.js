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
	,exportReference:function(){
		console.log("Exporting")
		var ids = [] 
		 Ext.getCmp("refgrid").getStore().each(function(rec){
			ids.push( rec.get('_id') )
		});
		console.log('Exporting ' + ids)
		if(ids.length>0){
			precon.util.downloadFile('/api/reference/export/'+ ids.join(",")+".ris", {title:'Downloading file...'})
		}		
	}
});




})();