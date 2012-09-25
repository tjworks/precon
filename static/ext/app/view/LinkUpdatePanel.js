


Ext.define('Precon.view.LinkUpdatePanel' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.linkupdatepanel',
    id:'link-update-window',
    config: { data: null },
    constructor: function(obj) {
        if(obj.data) this.bindObject = obj.data
        this.callParent(obj);
    },
    listeners:{
      afterrender:function(){
        console.log("after linkupdate paenl render", arguments);
        
      }
      
    },
    title : '',
    layout: 'anchor',  
    border:'0 0 0 0',
    baseCls: 'x-plain',
    					buttonAlign:'left',
    				    defaults: {
    				        anchor: '100%',
    				        bodyPadding:15,
    				        labelAlign:'top',
    				        
    				    },
    				    defaultType: 'textfield',
    					items:[
    								 
    								  {	 
                        xtype:'label',
    									  fieldLabel: 'Owner',
    									  name: 'owner'    									  
    								  },
                        {
                          xtype:'refeditor',
                        },
    								 
    								   {
                          //the width of this field in the HBox layout is set directly
                          //the other 2 items are given flex: 1, so will share the rest of the space
                          xtype:          'combo',
                          mode:           'local',
                          width:			'200',
                          triggerAction:  'all',
                          forceSelection: false,
                          hidden:			false,
                          editable:       true,
                          fieldLabel:     'Link Type',
                          name:           'type',
                          displayField:   'name',
                          //value: 			obj.type,
                          value: 			'',
                          valueField:     'value',
                          queryMode: 'local',
                          store:      Precon.store.ConnectionType
                     	 },                     	  
                     	  
                     	{
                           //the width of this field in the HBox layout is set directly
                           //the other 2 items are given flex: 1, so will share the rest of the space
                           xtype:          'combo',
                           mode:           'local',
                           forceSelection: false,
                           editable:       false,
                           fieldLabel:     'Link Nodes',
                           name:           'nodes',
                           displayField:   'label',
                           multiSelect: true,                                     
                           valueField:     'label',
                           queryMode: 'local',
                           store:      Precon.store.Nodes
                      	 },
                      	  {
                            xtype:'textfield',
                            fieldLabel: 'Label',
                            name: 'label'
                            //value:obj.label               
                          },
                          {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'local',
                                triggerAction:  'all',
                                forceSelection: false,
                                hidden:     false,
                                editable:       false,
                                fieldLabel:     'Belong to Network',
                                name:           'network',
                                displayField:   'name',
                                //value:      obj.type,                                         
                                valueField:     '_id',
                                queryMode: 'local',
                                store:     'Networks'
                          },
    								  /**
    								  {
    									   anchor: '100%',
    							           xtype: 'multiselect',
    							           msgTarget: 'side',
    							           //id:'linkupdateform_m'+obj.label,
    							           id:'linkupdateform_m',
    							           fieldLabel: 'Nodes',
    							           name: 'Nodes',
    							           allowBlank: false,
    							           //store: formnodes,
    							           store: null,
    							           ddReorder: true,
    							           listeners: {
    									  	afterrender: {
    									  		//fn:function(){ var d=Ext.getCmp('linkupdateform_m'+obj.label); log.debug(d);}
    									  	}
    									  }
    								  },
    								 */
                               	 {
                               		 xtype:'button',
                               		 text:'Save Changes'
                               	 }
    						]
    				    /**,
    						fbar: [
    							'->',
    					          {
    					              text: 'Save Changes'    					             
    					          },
    					          '->'
    					      ]*/
});
		

