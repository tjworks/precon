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
      
       /*
        this.store = {
                         fields: ['name', 'email'],
                         data  : [
                             {name: 'Ed',    email: 'ed@sencha.com'},
                             {name: 'Tommy', email: 'tommy@sencha.com'}
                         ]
                     };*/
       
      
            /*
              this.columns = [
                              {header: 'Name',  dataIndex: 'name',  flex: 1},
                              {header: 'Email', dataIndex: 'email', flex: 1}
                          ];*/
            
      
     
              this.callParent(arguments);
      
    }
});