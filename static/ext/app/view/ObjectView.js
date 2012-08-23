

Ext.define('Precon.view.ObjectView' ,{
    extend: 'Ext.view.View',
    alias : 'widget.objectview',
    title : '',    
	config: {
			layout: 'anchor',
		    defaults: {
		        anchor: '100%',
		        bodyPadding:10
		    }
	},	
	constructor: function(config) {
			console.log("config is ", config)
			
			var obj = config.object
			if(obj.getRawdata) obj = obj.getRawdata()
			
			var fields = []
			for(var p in obj) fields.push( {name: p} )				
			var store = Ext.create('Ext.data.ArrayStore', {
			        fields: fields,
			        data: []
			    });
			
			config.store = store
			
			//config.tpl = objectViewTemplates[ precon.getObjectType(obj._id)  ] || objectViewTemplates.generic
			
			store.add(obj)
			return this.callParent(arguments);
			
    }
});

Ext.define('Precon.view.PublicationView', {
	extend: 'Precon.view.ObjectView',
	tpl: new Ext.XTemplate(
			'<tpl for=".">',
			'<table><tr><th>Title:</td><td>{name}</td></tr>',
			'<tr><th>Authors:</th><td>{author_list}</td></tr>',
			'<tr><th>Abstract:</th><td id="publication-abstract">{processed_abstract}</td></tr>',		
			'</table>',
			'</tpl>'),
	constructor: function(config){
			console.log("config is! ", config)			
			var obj = config.object
			if(obj.getRawdata) obj = obj.getRawdata()			
			obj.processed_abstract = precon.util.processAbstract(obj)	
			
			var authors = ''
			if(obj.authors){
				obj.authors.forEach(function(author){
					if(authors) authors+=", ";
					authors += (author.first?author.first.substring(0,1):'') +" "+ author.last
				});			
			}
			obj.author_list = authors
			
			return this.callParent(arguments);
	}
})
Ext.define('Precon.view.EntityView', {
	extend: 'Precon.view.ObjectView',
	tpl: new Ext.XTemplate(
			'<tpl for=".">',
			'<table><tr><th>Entity Name:</td><td>{name}</td></tr>',
			'<tr><th>Symbol:</th><td>{symbol}</td></tr>',
			'<tr><th>Synonyms:</th><td></td></tr>',
			'<tr><th>Organism:</th><td></td></tr>',
			'</table>',
			'</tpl>')
});
Ext.define('Precon.view.NetworkView', {
	extend: 'Precon.view.ObjectView',
	tpl: new Ext.XTemplate(
			'<tpl for=".">',
			'<table><tr><th>Network Name:</td><td>{name}</td></tr>',
			'<tr><th>Creator:</th><td>{owner}</td></tr>',
			'<tr><th>Group:</th><td>{group}</td></tr>',
			'<tr><th>Last Changed Time:</th><td>{update_tm}</td></tr>',
			'</table>',
			'</tpl>')
});
