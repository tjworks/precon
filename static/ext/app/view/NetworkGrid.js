var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
	    groupHeaderTpl: '<input type="checkbox" name="filterByGroup" group="{name}" checked> Group: {name} ({rows.length})', //print the number of items in the group
	    startCollapsed: false // start all groups collapsed	  
	});


Ext.define('Precon.view.NetworkGrid' ,{
    extend: 'Ext.grid.Panel',
    requires: [
        //'Ext.selection.CheckboxModel'
    ],
    //selModel: Ext.create('Ext.selection.CheckboxModel'),
    features: [groupingFeature],
    alias : 'widget.networkgrid',

    title : 'Networks in Graph',
	
	//define the data
	store: 'Networks',
	
	constructor: function(config) {
			//this.initConfig(config);
			return this.callParent(arguments);
	}, 
		
    initComponent: function() {
              this.columns = [
								{
								    text     : '<input type=checkbox name="filterAll" checked> All', 
								    width    : 60, 
								    sortable : false, 
								    renderer : function(val,meta, record) {                				
								    				 return "<input class='filterByNetwork' belongtogroup='" + record.get("group") +"' type=checkbox "+ (val?"checked":"")+ " name='filterByNetwork' value='"+  record.get("_id") + "'>"
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
								    text     : 'Creator', 
								    width    : 70, 
								    sortable : true, 
								    dataIndex: 'owner'
								   // renderer: change
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
    listeners:{
    	//  couldn't figure out why it doesn't work if move this chunk of listener code to the controller
    	click: {
			 element:'el',	
			 fn:function(evt, item){        	     				 
    			//console.log("Clicked!", arguments)
    			if(item.type == 'checkbox'){
    				filterNetwork(item, groupingFeature)  
    			}        			     	
			 }
		 }       	
    }
});