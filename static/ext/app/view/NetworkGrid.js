Ext.define('Precon.view.NetworkGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.networkgrid',

    title : 'All Users',
	
	//define the data
	store: 'Networks',
	
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
		},
		
    initComponent: function() {
              this.columns = [
                              {
					                text     : 'Show in Graph', 
					                width    : 100, 
					                sortable : true, 
					                renderer : function(val,meta, record) {                				
					                				 return "<input type=checkbox "+ (val?"checked":"")+ " name='networkId' value='"+  record.get("_id") + "'>"
					                },
					                dataIndex: 'include'
					            },
					            {
					                text     : 'Study',
					                flex     : 1,
					                sortable : false,                 
					                dataIndex: 'name'
					            },
					            {
					                text     : 'Creator', 
					                width    : 70, 
					                sortable : true, 
					                dataIndex: 'creator'
					               // renderer: change
					            },
					            {
					                text     : 'Source', 
					                width    : 75, 
					                flex:1,
					                sortable : true, 
					                dataIndex: 'source'
					               // renderer: change
					            },
					            {
					                text     : 'Network', 
					                width    : 75, 
					                flex:1,
					                sortable : true, 
					                dataIndex: 'group'
					               // renderer: change
					            }
                          ];
     
              this.callParent(arguments);
    }
});