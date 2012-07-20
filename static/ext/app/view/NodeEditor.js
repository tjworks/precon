
Ext.define('xlang.view.NodeEditor', {
		extend: 'Ext.window.Window',
		alias: 'widget.nodewin',
		height:150,
		width:300,
		layout:{
			type:'vbox',
			align:'stretch'
		},
		items:

			[{
			    // Fieldset in Column 1 - collapsible via toggle button
			    xtype:'fieldset',	         
			    //title: 'Fieldset 1',
			    itemId:'fields',
			    collapsible: true,
			    defaultType: 'textfield',
			    defaults: {anchor: '100%'},
			    layout: 'anchor',
			    items :[{
			        fieldLabel: 'Label',
			        name: 'nodeLabel',
			        itemId:'nLabel',
			        disabled:true
			    }, {
			        fieldLabel: 'Desc',
			        name: 'nodeDesc'
			    }]
			},
			{
				xtype:'button',
				text:'Save',
				handler: function(){
					 
					 xlang.vis.updateData()
					//win.destroy();
				}
			}],
			
			
		setNode:function(node){
			this.node = node;
			if(node && node.data){
				this.getComponent('fields').getComponent('nLabel').setValue(node.data.id);
			}				
		}
});
