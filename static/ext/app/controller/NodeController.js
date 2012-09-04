Ext.define('Precon.controller.NodeController', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.NodeUpdatePanel'],
     views: [
    	'NodeUpdatePanel'
    ],    
    init: function() {
    	    nodeupdatecontroller=this;
     		this.control({
     				"nodeupdatepanel button": {
     					click: function(btn){ 
     						console.log('clicked btn', arguments)     						 
			                 var formpanel  = btn.up('nodeupdatepanel')
			                 
			                 formpanel.getForm().getFields().each(function(f){
			                	 var data = f.getModelData()
			                	 //console.log(f);
			                	 console.log(data);
			                	 for(var i in data){
				                	 formpanel.bindObject.set(i, data[i])
				                 }
			                 })
     						 
			                 formpanel.bindObject.save(function(data){
			                	 if(data && data.indexOf('node') ==0)
			                		 alert("Successfully updated connection")
			                	 else
			                		 alert("Error: "+ data)
			                 })
			                 
			                 app.graphModel.trigger('change.node', {node:formpanel.bindObject} )
     					}
     				},
     				'nodeupdatepanel': {
     					show: function(p) {
     						    var controller=this;
     						    console.log(this);
						   	 	var view=p;
								console.log(view);
								var idfld=view.down('textfield');
								var grpfld=idfld.next('textfield');
								var labelfld=grpfld.next('textfield');
								var entfld=labelfld.next('textfield');
								var rolefld=entfld.next('textfield');
								var ctmfld=rolefld.next('textfield');
								var utmfld=ctmfld.next('textfield');
							    grpfld.removeListener('change',this.handlerFn);
								labelfld.removeListener('change',this.handlerFn);
								entfld.removeListener('change',this.handlerFn);
								rolefld.removeListener('change',this.handlerFn);
								idfld.setValue(view.node._id);
								grpfld.setValue(view.node.group);
								labelfld.setValue(view.node.label);
								entfld.setValue(view.node.entity);
								rolefld.setValue(view.node.role);
								ctmfld.setValue(view.node.create_tm);
								utmfld.setValue(view.node.update_tm);
								grpfld.addListener('change',function() {controller.onChange(view)});
								labelfld.addListener('change',function() {controller.onChange(view)});
								entfld.addListener('change',function() {controller.onChange(view)});
								rolefld.addListener('change',function() {controller.onChange(view)});
						   	 }
						   }
						  
     		});
     		
     		     	
    },
     onChange: function(v) {
						     v.down("button").enable();
						   }      
	
});

