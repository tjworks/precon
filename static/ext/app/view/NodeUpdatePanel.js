Ext.define('Precon.view.NodeUpdatePanel' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.nodeupdatepanel',
    title : '',
	config: {
		 	data:null,
			layout: 'anchor',
		    defaultType: 'textfield',
		    buttonAlign:'left',
		    defaults: {
    				        anchor: '100%',
    				        bodyPadding:10
    				    },
			items:[
				  		{
		                    fieldLabel: 'id',
		                    name: 'id',
		                    //value: obj._id,
		                    value:'',
		                    disabled: true
		                },{
		                    fieldLabel: 'Group',
		                    name: 'group',
		                    //value:obj.group
		                    value:''
		                },
		                {
		                    fieldLabel: 'Label',
		                    name: 'label',
		                    allowBlank:false,
		                    //value:obj.label
		                    value:''
		                },{
		                    fieldLabel: 'Entity',
		                    name: 'entity',
		                    //value:obj.entity
		                    value:''
		                },
		                {
		                    fieldLabel: 'Role',
		                    name: 'role',
		                    allowBlank:false,
		                    //value:obj.role
		                    value:''
		                },{
		                    fieldLabel: 'Create Time',
		                    name: 'create_tm',
		                    //value:obj.update_tm
		                    value:''
		                },
		                {
		                    fieldLabel: 'Update Time',
		                    name: 'update_tm',
		                    //value:obj.update_tm
		                    value:''
		                },
		                 {
                               		 xtype:'button',
                               		 text:'Save Changes',
                               		 disabled:true
                          }
				],
				fbar: [
					/*
					{ type: 'button', text: 'Save Changes', disabled: true },
										'->'*/
					
				]
	},
	constructor: function(config) {
			//this.initConfig(config);
			if(config.data) this.bindObject = config.data
			return this.callParent(arguments);
   },
   listeners: {
   	}
   
});
		

