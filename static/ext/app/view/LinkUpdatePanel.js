Ext.define('Precon.view.LinkUpdatePanel' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.linkupdatepanel',
   
    title : '',
	
    layout: 'anchor',
    					buttonAlign:'left',
    				    defaults: {
    				        anchor: '100%',
    				        bodyPadding:10
    				    },
    				    defaultType: 'textfield',
    					items:[
    								  {
    									  fieldLabel: 'Id',
    									  name: 'id',
    									  //value: obj._id,
    									  value: '',
    									  disabled: true
    								  },{
    									  fieldLabel: 'Label',
    									  name: 'label',
    									  //value:obj.label
    									  value:''
    								  },
    								   {
                                    //the width of this field in the HBox layout is set directly
                                    //the other 2 items are given flex: 1, so will share the rest of the space
                                    xtype:          'combo',
                                    mode:           'local',
                                    value:          'mrs',
                                    triggerAction:  'all',
                                    forceSelection: true,
                                    hidden:			false,
                                    editable:       false,
                                    fieldLabel:     'Type',
                                    name:           'Type',
                                    displayField:   'name',
                                    //value: 			obj.type,
                                    value: 			'',
                                    valueField:     'value',
                                    queryMode: 'local',
                                    store:          Ext.create('Ext.data.Store', {
                                        fields : ['name', 'value'],
                                        data   : [
                                             {name : 'beinguptaken',   value: 'beinguptaken'},
                                             {name : 'activates',  value: 'activates'},
                                             {name : 'inhibits', value: 'inhibits'},
                                             {name : 'stimulats',   value: 'stimulats'},
                                             {name : 'activates',  value: 'association'},
                                             {name : 'physical_interaction', value: 'physical_interaction'},
                                              {name : 'predicted',   value: 'predicted'},
                                              {name : 'activates',  value: 'activates'},
                                              {name : 'pathway', value: 'pathway'}
                                        ]
                                    })
                               	 },
    								  {
    									  fieldLabel: 'Network',
    									  name: 'network',
    									  //id:'linkupdateform_'+obj.label,
    									  id:'linkupdateform_',
    									  //value:obj.network? graphModel.findNetwork(obj.network).get("name"):''							  
    									  value:''							  
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
    									  		//fn:function(){ var d=Ext.getCmp('linkupdateform_m'+obj.label); console.log(d);}
    									  	}
    									  }
    								  },*/
    								  {
    									  fieldLabel: 'Ref Pubmed',
    									  name: 'Pubmed',
    									  //value:obj.refs?obj.refs.pubmed:''
    									  value:''
    								  }
    						],
    						fbar: [
    							'->',
    					          {
    					              text: 'Update Link',
    					              handler: function () {
    					              	  alert("peng peng");
    					                  var tabs = this.up('tabpanel');
    					              }
    					          },
    					          '->'
    					      ]
});
		

