var previewStore = Ext.create('Ext.data.ArrayStore', {
							storeId: 'previewStore',
    						fields: ['nodeA','direction','nodeB', 'idA', 'idB', 'line'],    		               
    						data: []
    		          })
Ext.define('Precon.view.Container', {
	extend:'Ext.container.Container',
	autoEl: {
		tag:'div',		
	}
}) ;  		          
Ext.define('Precon.view.ImporterWindow', {
	extend:'Ext.window.Window',
	bodyPadding: 10,
    width: 800,
    height: 700,
    icon:'/ext/resources/images/upload.png',
    title: 'Upload Network',
    id:'importerWindow',
    //autoHeight:true,
    extentStore:null,
    closeAction: 'hide',
    listeners:{
    	afterrender: {
	    	element:'',
	    	fn: function(){				    		
	    	}		
	    }
    }, 
    items: [ {
    			xtype:'container',
    			id:'uploadbox',
    			items:[{
    					xtype:'container',
    					html:"Drag and drop the network file to this box, or use the browse button to select the file. &nbsp;&nbsp;<a href='/assets/sample-network.csv' target='downloadwin'>Sample Network File</a>",
    					style:{
    						margin:'5px 0px',
    						fontSize:'1.2em'
    					}
    					},
    					
        	           {
					        xtype: 'filefield',
					        name: 'networkfile',
					        fieldLabel: '',					        
					        labelWidth: 100,
					        msgTarget: 'side',
					        //allowBlank: false,
					        anchor: '100%',
					        width:500,
					        buttonText: 'Browse...',
					        listeners:{
					        	change: function(fileEm){  app.getController("Importer").processFile( fileEm.fileInputEl.dom.files )   }
					        }
					    }
					   
					   ]
    		},
    		{
    			xtype:'container',
    			layout:'fit',
    			height:450,
    			items:[
						{
						    xtype: 'gridpanel',    		   
						    title : 'Preview',
							id: 'importerGrid',
							width:'auto',
							autoScroll:true,
							
							//define the data
							store:   Ext.data.StoreManager.lookup('previewStore'),
						    columns: [
										{
										    text     : 'Line #', 
										    width    : 50, 
										    sortable : false,     										   
										    dataIndex: 'line',
										    editable:true
										},
										{
										    text     : 'Node A', 
										    width    : 100, 
										    sortable : true,     										   
										    dataIndex: 'nodeA',
										    editable:true,
										    renderer: function(val, meta, record){
												return record.get("idA")?val:'<span class="state-error">'+val+'</span>'
											}
										},
										{
											text: 'Valid',
											width:50,
											sortable:false,
											dataIndex: 'idA',
											renderer: function(val, meta, record){
												return val?"<img src='/ext/resources/images/ok-16.png'>":"<img src='/ext/resources/images/cross-16.png'>"
											}
										},
										{
										    text     : 'Direction',
										    width:80,
										    sortable : false,                 
										    dataIndex: 'direction',
										    renderer: function(val, meta, record){
										    	return "<b>"+ val+"</b>"
										    }
										    	
										},							
										{
										    text     : 'Node B', 
										    width    : 100, 							    
										    sortable : true, 
										    dataIndex: 'nodeB',
										    editable:true,
										    renderer: function(val, meta, record){
												return record.get("idB")?val:'<span class="state-error">'+val+'</span>'
											}
										},
										{
											text: 'Valid',
											width:50,
											sortable:false,
											dataIndex: 'idB',
											renderer: function(val, meta, record){
												return val?"<img src='/ext/resources/images/ok-16.png'>":"<img src='/ext/resources/images/cross-16.png'>"
											}
										},
							]
						     ,
						    viewConfig: {
						        emptyText: '',
						        deferEmptyText: false,
						        markDirty: false
						    }
						}
    			       ]
    		}
    		,{
    			xtype:'container',
    			id:'previewSummary',
    			style:{
    				margin:'5px'
    			},
    			html:"<b>Total links:</b><span id='previewTotalLinks'>0</span> <b>Total Nodes</b>: <span id='previewTotalNodes'>0</span> "+
    				"<b>Errors found</b>: <span id='previewInvalidCounts' class='state-error'>0</span> " +
    				"<span><input type='checkbox' id='chkboxIgnoreError'> Ignore errors</span>"
    		 }
    		/**
    		,{
    			xtype:"checkbox",			
                boxLabel  : 'Ignore errors',
                name      : 'topping',
                inputValue: '1',
                id        : 'chkboxIgnoreError',
                handler: function(){ app.getController("Importer").toggleImportButton()}
            }*/
                         	
		],
		buttons : 
		  			 [
						 /**{
							xtype : 'button',										
							text : 'Re-Validate',
							id:'btnValidate',
							handler : function() { app.getController("Importer").validate() }
						} */
						{
								xtype : 'button',										
								text : 'Import',
								id:'btnImport',
								disabled:true,
								handler : function() { app.getController("Importer").doImport() }
						}
						 , {
							xtype : 'button',
							text : 'Cancel',
							handler : function() {
								//app.getController("Importer").hide()
								this.up("window").hide()
							}
						}
					 ] 
});