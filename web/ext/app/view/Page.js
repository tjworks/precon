Ext.define('xlang.view.Page', {
	extend: 'Ext.container.Container',
	alias: 'widget.page',			
	cls: 'page',
	initComponent: function(){
		console.log("Page " + this.id+" init");
		this.callParent()
	},
	listeners: {
		afterrender:function(){
			console.log("Page " + this.id+" rendered");
		}
	}
});
