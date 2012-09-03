Ext.define('Precon.store.Networks', {
    extend: 'Ext.data.Store',
    groupField: 'group',
    model: 'Precon.model.Network'
    
    /*
    data: [
            {name: 'Ed',    email: 'ed@sencha.com'},
            {name: 'Tommy', email: 'tommy@sencha.com'}
        ]*/
    
});



Precon.store.ConnectionType = Ext.create('Ext.data.Store', {
    model:'Precon.model.ConnectionType',     
    data   : [
         {name : 'beinguptaken',   value: 'beinguptaken'},
         {name : 'activates',  value: 'activates'},
         {name : 'inhibits', value: 'inhibits'},
         {name : 'stimulats',   value: 'stimulats'},
         {name : 'activates',  value: 'association'},
         {name : 'physical_interaction', value: 'physical_interaction'},
          {name : 'predicted',   value: 'predicted'},
          {name : 'activates',  value: 'activates'},
          {name : 'pathway', value: 'pathway'}
    ]
})


Precon.store.Nodes = Ext.create('Ext.data.Store', {
    model:'Precon.model.Node',     
    data   : []
})
