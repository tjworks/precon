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
		                    value: obj._id,
		                    disabled: true
		                },{
		                    fieldLabel: 'Group',
		                    name: 'group',
		                    value:obj.group
		                },
		                {
		                    fieldLabel: 'Label',
		                    name: 'label',
		                    allowBlank:false,
		                    value:obj.label
		                },{
		                    fieldLabel: 'Entity',
		                    name: 'entity',
		                    value:obj.entity
		                },
		                {
		                    fieldLabel: 'Role',
		                    name: 'role',
		                    allowBlank:false,
		                    value:obj.role
		                },{
		                    fieldLabel: 'update_tm',
		                    name: 'update_tm',
		                    value:obj.update_tm
		                }
				]
	},
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
    }
});
		

