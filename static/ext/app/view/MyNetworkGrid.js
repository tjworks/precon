
Ext.define('Precon.view.MyNetworkGrid' ,{
    extend: 'Ext.grid.Panel',
    requires: [   ],
    //selModel: Ext.create('Ext.selection.CheckboxModel'),
    alias : 'widget.mynetworkgrid',

    title : 'My Networks',
	
	//define the data
	store: 'MyNetworks',
	
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
	}, 
		
    initComponent: function() {
              this.columns = [
								{
								    text     : '', 
								    width    : 60, 
								    sortable : false, 
								    renderer : function(val,meta, record) {                				
								    				 return "<input type=checkbox "+ (val?"checked":"")+ " name='filterByNetwork' value='"+  record.get("_id") + "'>"
								    },
								    dataIndex: 'include'
								},
								{
								    text     : 'Network',
								    flex     : 1,
								    sortable : true,                 
								    dataIndex: 'name'
								},							
								{
								    text     : 'Source', 
								    width    : 75, 
								    flex:1,
								    sortable : true, 
								    dataIndex: 'source'
								   // renderer: change
								}
                          ];
     
              this.callParent(arguments);
    },
    viewConfig: {
        emptyText: 'No network available, are you logged in?',
        deferEmptyText: false
    }
});