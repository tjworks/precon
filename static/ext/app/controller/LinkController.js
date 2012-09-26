(function(){

Ext.define('Precon.controller.LinkController', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.LinkUpdatePanel', 'Precon.view.ReferenceEditor'],
    init: function() {
     		 
     		this.control({
     				"#save-link-btn": {
     					click: function(btn){ 
     						console.log('clicked btn', arguments)     						 
			                 var formpanel  = btn.up('linkupdatepanel')
			                 
			                 formpanel.getForm().getFields().each(function(f){
			                	 var data = f.getModelData()
			                	 for(var i in data){
				                	 formpanel.bindObject.set(i, data[i])
				                 }
			                 })
     						 
			                 formpanel.bindObject.save(function(data){
			                	 if(data && data.indexOf('conn') ==0)
			                		 alert("Successfully updated connection")
			                	 else
			                		 alert("Error: "+ data)
			                 })
			                 
			                 app.graphModel.trigger('change.connection', {connection:formpanel.bindObject} )
     					}
     				},
     				'linkupdatepanel': {
     					afterrender: function(formpanel){     						
     					    var con = formpanel.bindObject
     					    formpanel.getForm().loadRecord({data: con.getRawdata()} )
     					    formpanel.getForm().findField('nodes').getStore().loadData([ con.getNodes()[0].getRawdata(), con.getNodes()[1].getRawdata()])
     					    if(!con) return
     					    if(!precon.util.isMe( con.get('owner') )){
     					    	//Ext.getCmp("save-link-btn"). setDisabled(true)
     					    }
     					}
     				},
     				'refeditor':{
     				  click:function(){
     				    console.log("click ", arguments)
     				  },
     				  itemclick:function(){
     				    console.log("ref item click", arguments)
     				  }
     				  
     				}
     		});     	
    }, // end init
    // create and show the link update window
    show: function(con){
       //var getName=function(id) {precon.getObject(id,function(obj){obj.name})};
       // ref store
       mycon = con
        var self = this;
        var formnodes=[];
        obj.nodes.forEach(function(anode) {
            var label = self.getGraphModel().findNode(getId(anode)).get("label")
            formnodes.push([label, label])
            //precon.getObject(getId(anode),function(obj){log.debug(obj);formnodes.push([obj.label,obj.label])})
            //formnodestemp.push([anode,anode])}
            });
        
        linkUpdatePanel = Ext.create('widget.linkupdatepanel',{data:con});
        tmpwin = Ext.create('Precon.view.Window', {
            items:[linkUpdatePanel],
            title:'Link Details',
            width:700
          });
        tmpwin.show();
        
        var conrefs = con.get('refs')
        conrefs = conrefs.pubmed? conrefs.pubmed : []
        conrefs = _.isArray(conrefs)? conrefs: [conrefs]
        var refstore = tmpwin.down("refeditor").getStore();
        tmpstore = Ext.getCmp("refgrid").getStore();
        tmpstore.each(function(rec){
            var rid = rec.get('_id');
            rid = rid.indexOf('publ') == 0? rid.substring(4):rid
            if (_.indexOf(conrefs, rid) >=0){
              refstore.add(rec);
            }
        });
        
        form = tmpwin.down('linkupdatepanel').getForm()
    }      
	 
});




})();