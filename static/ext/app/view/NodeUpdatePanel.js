Ext.define('Precon.view.NodeUpdatePanel' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.nodeupdatepanel',
    title : '',
	config: {
			layout: 'anchor',
		    defaults: {
		        anchor: '100%',
		        bodyPadding:10
		    },
		    defaultType: 'textfield',
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
		                    fieldLabel: 'update_tm',
		                    name: 'update_tm',
		                    //value:obj.update_tm
		                    value:''
		                }
				]
	},
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
    }
});
		

