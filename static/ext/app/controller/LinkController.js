(function(){

Ext.define('Precon.controller.LinkController', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.LinkUpdatePanel', 'Precon.view.ReferenceEditor'],
    init: function() {
     		 
     		this.control({
     				"#save-link-btn": {
     					click: function(btn){ 
     						       //console.log('clicked btn', arguments)     						 
			                 var formpanel  = btn.up('linkupdatepanel')
			                 
			                 formpanel.getForm().getFields().each(function(f){
			                	 var data = f.getModelData()
			                	 for(var i in data){
				                	 formpanel.bindObject.set(i, data[i])
				                 }
			                 })
     						       // update references
     						       var refstore = formpanel.down("refeditor").getStore();
     						       var pids = []
     						       refstore.each(function(rec){
     						         pids.push(rec.get("_id").substring(4))
     						       });
     						       formpanel.bindObject.set("refs", {pubmed: pids });
     						       
			                 formpanel.bindObject.save(function(data){
			                	 if(data && data.indexOf('conn') ==0){
			                	   //Ext.Msg.alert("INFO", "Successfully updated connection");
                           app.graphModel.trigger('change.connection', {connection:formpanel.bindObject} )
                           formpanel.up("window").hide();
                           formpanel.up("window").destroy();
			                	 }
			                	 else
			                		 Ext.Msg.alert("ERROR",data);
			                 })
     					}
     				},
     				'linkupdatepanel': {
     					afterrender: function(formpanel){     						
     					    var con = formpanel.bindObject
     					    if(!con) return
     					    formpanel.getForm().loadRecord({data: con.getRawdata()} )
     					    var label = '' ;
     					    _.each(con.getNodes(), function(node){
     					        label = label? label+", ":label;
     					        label += node.get("label")
     					    })
     					    formpanel.getForm().findField("linknodes").setValue(label);
     					    $("#add-ref-input-inputEl").val("");
     					    if(!precon.util.isMe( con.get('owner') )){
     					    	//Ext.getCmp("save-link-btn"). setDisabled(true)
     					    }
     					}
     				},
     				'refeditor':{
     				  click:function(){
     				    //console.log("click ", arguments)
     				  },
     				  itemclick:function(){
     				    //console.log("ref item click", arguments)
     				  }
     				  
     				}
     		});     	
    }, // end init
    // create and show the link update window
    show: function(con){
       //var getName=function(id) {precon.getObject(id,function(obj){obj.name})};
       // ref store
        var self = this;
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
        refstore.removeAll();
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
	  ,showVoteWindow: function(con){
        var self = this;
        votewin = Ext.create('Precon.view.LinkVoteWindow',{data:con});
        votewin.show();
    }
    ,handleVote:function(btn){
      
    }      
});




})();