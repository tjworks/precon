(function(){

Ext.define('Precon.controller.LinkController', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.LinkUpdatePanel'],
    init: function() {
     		 
     		this.control({
     				"linkupdatepanel button": {
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
     					    	// disable the fields for non-owner
     					    	console.log("disabling ", formpanel.getId())
     					    	formpanel.getForm().getFields().each(function(i){i.setDisabled(true)})
     					    }
     					}
     				}
     		});     	
    }      
	
});




})();