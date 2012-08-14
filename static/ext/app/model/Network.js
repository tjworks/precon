Ext.define('Precon.model.Network', {
    extend: 'Ext.data.Model',
    fields: [
	     	{name: '_id'}
            ,{name: 'name'}           
           //{name: 'ctime'},
           ,{name:'include'}
           ,{name: 'creator'}           
           ,{name: 'source'}
           ,{name: 'group'}           
    ]
});