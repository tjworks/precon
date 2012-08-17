Ext.define('Precon.view.NetworkGrid' ,{
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.selection.CheckboxModel'
    ],
    selModel: Ext.create('Ext.selection.CheckboxModel',
    {
        listeners: {
          //  selectionchange: 
            //    _graphController.networkGridClicked(sm,selections)
    }}),
    
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
                            /*
                              {
                                                                text     : 'Show in Graph', 
                                                                width    : 100, 
                                                                sortable : true, 
                                                                renderer : function(val,meta, record) {                	
                                                                                // console.log('the input box is ');
                                                                                 //console.log(val+" "+meta+" "+record);			
                                                                                 return "<input type=checkbox "+ (val?"checked":"")+ " id='networkId' value='"+  record.get("_id") + "'>"
                                                                },
                                                                dataIndex: 'include'
                                                            },*/
                            
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