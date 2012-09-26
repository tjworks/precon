Ext.define('Precon.model.Network', {
    extend: 'Ext.data.Model',
    fields: [
	     	{name: '_id'}
            ,{name: 'name'}           
           //{name: 'ctime'},
           ,{name:'include'}
           ,{name: 'owner'}           
           ,{name: 'source'}
           ,{name: 'group'} 
           ,{name: 'update_tm'}
    ]
});


Ext.define('Precon.model.ConnectionType', {
    extend: 'Ext.data.Model',
    fields: [
	     	
            {name: 'name'}           
           ,{name: 'value'}
    ]
});

Ext.define('Precon.model.Node', {
    extend: 'Ext.data.Model',
    fields: [
	     	
            {name: '_id'}           
           ,{name: 'label'}
    ]
});



Ext.define('Precon.model.Reference', {
   extend: 'Ext.data.Model',
   fields: [         
         {name:'_id'},
         {name: 'name'},
         {name: 'authors'},
         {name:'abstract'},
         {name:'entities'},
         {name:'processed_abstract'}
      ]
});
