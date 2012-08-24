Ext.define('Precon.view.NodeCreatePanel' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.nodecreatepanel',
    title : '',
	config: {
			bodyPadding: 5,
		    width: 350,
		    title: 'Enter entity name represented by the new node',
		    id:'nodecreatewin',
		    autoHeight:true,
		    extentStore:null,
		    closeAction: 'hide',
			items: [ 
                           	 {
		                        //the width of this field in the HBox layout is set directly
		                        //the other 2 items are given flex: 1, so will share the rest of the space
		                        xtype:          'combo',
		                        mode:           'remote',
		                        triggerAction:  'all',
		                        editable:       true,
		                        id: 			'entityname',
		                        fieldLabel:     'Entity name',
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
                           	 /**
                           	 ,
                           	 {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'remote',
                                triggerAction:  'all',
                                editable:       true,
                                id: 			'nodename1_c',
                                fieldLabel:     'Node Label',
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
                           	 }*/
						],
						buttons : 
						  			 [
										 {
											xtype : 'button',
											text : 'Create',
											handler : function() {
													var n = {}													
													n.entity = $( "#entityname-inputEl" ).attr("entityId")
													n.label =  Ext.getCmp('entityname').getValue() || n.entity													
													if (n.label!="") {		
														//nodeData.label =  Ext.getCmp('nodename1_c').getValue() 														
														var ret = _graphModel.addNode( n);
														if(ret.get("id") != n._id ){											
															$d( "[id="+ ret.get("id") +"]" ).classed('state-highlight',true)			
															alert("The node you wish to add already exists: " + ret.get("label"))
															$d( "[id="+ ret.get("id") +"]" ).classed('state-highlight',false)
															return;
														}
														Ext.getCmp('entityname').setValue("");
														//this.up('window').hide()
														nodeCreateWindow.hide();
													}	
												}
										}, {
											xtype : 'button',
											text : 'Cancel',
											handler : function() {												
												//this.up('window').hide();
												nodeCreateWindow.hide();
											}
										}
									 ] 
	},
	
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
    }
});
		

