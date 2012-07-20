Ext.define('xlang.view.CytoPage', {
			extend: 'xlang.view.Page',
			alias: 'widget.cytopage',
			//requires:['xlang.view.LanguageList'],
			cls: 'page',
			//id: 'cytoscapeweb',
			layout:'fit',
        	items:[
	        		{ 	xtype:'container',
	        			html:"<div id='cytoscapeweb'></div><div id='cyoverlay'></div>" }			        		
	        	]        
				
	});

 