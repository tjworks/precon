Ext.define('Precon.view.SaveGraphWindow', {
	extend:'Ext.window.Window',
	bodyPadding: 10,
    width: 600,
    title: 'Save Network Graph',
    id:'saveGraphWindow',
    autoHeight:true,
    extentStore:null,
    closeAction: 'hide',
    listeners:{
    	afterrender: {
	    	element:'',
	    	fn: function(){				    		
	    	}		
	    }
    }, 
    items: [ {
    	      xtype:'label',
    	      id:'validation-msg',
    	      styleHtmlCls:'state-error',
    	      style:'color:red'
    		 },
            
           	 {
                //the width of this field in the HBox layout is set directly
                //the other 2 items are given flex: 1, so will share the rest of the space
                xtype:          'combo',
                mode:           'remote',
                triggerAction:  'all',
                editable:       true,
                width:			550,
                id: 			'graphname',
                fieldLabel:     'Network Name',
                name:           'name',
                displayField:   'label',
                valueField:     'label',
                queryParam: 	'query',
                hideTrigger:	true,
                selectOnFocus: 	true,
                store:          
                	Ext.create('Ext.data.Store', {
                        fields : ['label', 'value'],
                        idProperty:'label',
                        url: '',
						root: 'data'		                                
                })
           	 }                       	
		],
		buttons : 
		  			 [
						 {
							xtype : 'button',										
							text : 'Save',
							id:'saveNetworkBtn',
							handler : function() {				
								Ext.getCmp("validation-msg").setText("")
								if( Ext.getCmp("graphname").getValue()){
									var graphModel = app.graphModel
									graphModel.getGraphNetwork().set("name", Ext.getCmp("graphname").getValue());
									var errors = graphModel.validate();
									if(errors.length>0){
										Ext.getCmp("validation-msg").setText(errors.join(" "))
										return;
									}
									Ext.getCmp("saveNetworkBtn").setDisabled(true)
									graphModel.save(function(data, textStatus, jqXHR){
										log.debug("post result", data, textStatus)
										Ext.getCmp("saveNetworkBtn").setDisabled(false)
										if(data.indexOf("netw") ==0){													
											precon.getNetwork(data, function(network){
												graphModel.setGraphNetwork(network, true);
											}, true)
											alert("Successfully saved network graph")
										}
										else alert(textStatus+": "+ data)
										
										saveGraphWindow.hide();
									})												
								}																																	
							}
						}, {
							xtype : 'button',
							text : 'Cancel',
							handler : function() {
								saveGraphWindow.hide();
							}
						}
					 ] 
});