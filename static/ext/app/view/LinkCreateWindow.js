Ext.define('Precon.view.LinkCreateWindow' ,
	{
	extend:'Ext.window.Window',
    bodyPadding: 5,
    width: 350,
    title: 'Link Create',
    id:'linkCreateWindow',
    autoHeight:true,
    extentStore:null,
    closeAction: 'hide',
    items: [ 
           	 {
                //the width of this field in the HBox layout is set directly
                //the other 2 items are given flex: 1, so will share the rest of the space
                xtype:          'combo',
                mode:           'remote',
                triggerAction:  'all',
                editable:       true,
                id: 			'linkname1_c',
                fieldLabel:     'Source Node',
                name:           'name',
                displayField:   'label',
                valueField:     'label',
                queryParam: 	'query',
                hideTrigger:	true,
                selectOnFocus: 	true,
                store:          
                	Ext.create('Ext.data.Store', {
                        fields : ['label', 'value'],
                        idProperty:'label',
                        url: '',
						root: 'data'
                        /*
						data   : [
																	{name : 'Gene',   value: 'gene'},
																	{name : 'Link',  value: 'link'},
																	{name : 'Disease', value: 'disease'}
																]*/
						
                })
           	 },
           	 {
                //the width of this field in the HBox layout is set directly
                //the other 2 items are given flex: 1, so will share the rest of the space
                xtype:          'combo',
                mode:           'remote',
                triggerAction:  'all',
                editable:       true,
                hidden:			false,
                id: 			'linkname2_c',
                fieldLabel:     'Target Node',
                name:           'name',
                displayField:   'label',
                valueField:     'label',
                queryParam: 	'query',
                hideTrigger:	true,
                selectOnFocus: 	true,
                store:          
                	Ext.create('Ext.data.Store', {
                        fields : ['label', 'value'],
                        idProperty:'label',
                        url: '',
						root: 'data'
                        /*
						data   : [
																	{name : 'Gene',   value: 'gene'},
																	{name : 'Link',  value: 'link'},
																	{name : 'Disease', value: 'disease'}
																]*/
						
                })
           	 },
           	  {
                //the width of this field in the HBox layout is set directly
                //the other 2 items are given flex: 1, so will share the rest of the space
                xtype:          'combo',
                mode:           'local',
                value:          'mrs',
                triggerAction:  'all',
                forceSelection: true,
                hidden:			false,
                editable:       false,
                id: 			'linktype_c',
                fieldLabel:     'Link Type',
                name:           'Type',
                displayField:   'name',
                value: 			'Gene',
                valueField:     'value',
                queryMode: 'local',
                store:     Precon.store.ConnectionType
           	 }
		],
		buttons : 
		  			 [
						 {
							xtype : 'button',
							text : 'Create',
							handler : function() {
											// TBD: type, ref etc
											var nodes=[];
											nodearray.forEach(function(anode){
												if (anode.getLabel().toLowerCase()==Ext.getCmp('linkname1_c').getValue().toLowerCase()) {
													nodes.push(anode);
													log.debug(anode.getLabel()+"<===>"+anode.getId());
													//node1=new precon.Node({"label":'""'+anode.getLabel()+'"', "_id":'"'+anode.getId()+'"'});
												}
												if (anode.getLabel().toLowerCase()==Ext.getCmp('linkname2_c').getValue().toLowerCase()) {
													nodes.push(anode);
													//node2=new precon.Node({"label":'""'+anode.getLabel()+'"', "_id":'"'+anode.getId()+'"'});
												}
											});
											//log.debug(node1);
											//log.debug(node2);
											if (nodes.length>=2) {																
												app.graphModel.connectNodes(nodes[0], nodes[1], Ext.getCmp('linktype_c').getValue());
												Ext.getCmp('linkname2_c').setValue("");
												Ext.getCmp('linkname1_c').setValue("");
												linkCreateWindow.hide();
											}
											else
												alert("please choose at least two nodes to continue!");	
								}
						}, {
							xtype : 'button',
							text : 'Cancel',
							handler : function() {
								linkCreateWindow.hide();
							}
						}
					 ] 
});
  