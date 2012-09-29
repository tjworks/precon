Ext.define('Precon.view.GraphViewport' ,{
    extend: 'Ext.Viewport', 
    id:'viewport',
       requires: [
    	'Precon.view.ZoomSliderView'
    ],
    layout: {
        type: 'border'
        ,padding: '52 0 0 0'
    },
    defaults: {
        split: true
    },
    items: [{
        region: 'west',
        collapsible: false, 
        border: false,
        id:'west',
        title:'Network Graph',
        collapsible:true,
        width: '60%',
        html: '',
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
								{
								    text: 'File',
								    enableToggle: false,
								    //toggleGroup: 'trees',
								    icon:"/ext/resources/images/file-16.png",
								    menu: [
								          {
			                                    xtype: 'button', 
			                                    id:'saveGraphBtn',
			                                    text : 'Save Graph',
			                                    //iconCls:'x-btn-inner remove',
			                                    icon:"/ext/resources/images/save-16.png",
			                                    handler : function() {
			                                        //saveGraph();
			                                    }
			                               },
								         {
									        text: 'Upload Network',
									        id:"menuItemUpload",
									        icon:"/ext/resources/images/upload.png",
									        handler : function() { 
									        	Ext.require('Precon.controller.Importer')
									        	app.getController("Importer").showWindow() }
									     },
								         {
									        text: 'Save as PNG',
									        id:"menuItemPNG",
									        icon:"/ext/resources/images/png.png",
									        handler : function() { app.getController("GraphWin").exportGraph('image/png'); }
								          }
								         /**{
									        text: 'Save as PDF',
									        id:"menuItemPDF",
									        icon:"/ext/resources/images/pdf.png",
									        handler : function() { app.getController("GraphWin").exportGraph('application/pdf'); }
								          }, */
								          ,{			                                 			                                    
                              text : 'Save Graph',
                              icon:"/ext/resources/images/save-16.png",
                              handler : function() { app.getController("GraphWin").saveGraph(); }
                         }
                         ,{
                           text:'Clear Graph',
                           //icon:"",
                           handler:function(){app.getController("GraphWin").clearGraph(); }
                         }
								    ]
								},
                {
                    xtype: 'button', 
                    text : 'Create Node',
                    id:'nodeCreateBtn',
                    icon:"/ext/resources/images/node.png",
                    handler : function() {
                       // nodeCreate();
                    }
               },
                           
							   {
								    xtype: 'button', 
								    text : 'Create Link',
								    id:'linkCreateBtn',
								    //iconCls:'x-btn-inner link',
								    icon:"/ext/resources/images/link.png",
								    handler : function() {
									  // linkCreate()
								    }
							  },
						   
                               {
                                    xtype: 'button', 
                                    text : 'Remove Node/Link',
                                    id:'removeNodeBtn',
                                    //iconCls:'x-btn-inner remove',
                                    icon:"/ext/resources/images/link_.png",
                                    handler : function() {
                                        //openRemoveWindow();
                                    }
                               },
                               {
                                    xtype: 'button', 
                                    text : 'Rec Select',
                                    id:'recSelectBtn',
                                    enableToggle: true,
                                    icon:"/ext/resources/images/rec_select.png",
                                    handler : function() {
                                        //openRemoveWindow();
                                    }
                               },
                            /*
                              {
                                                                xtype: 'button', 
                                                                id:'freezeGraphBtn',
                                                                text : 'Freeze Graph',
                                                                enableToggle:true,
                                                                //iconCls:'x-btn-inner remove',
                                                                icon:"/ext/resources/images/save-16.png",
                                                                handler : function() {
                                                                    //saveGraph();
                                                                }
                                                          },*/
                            
                               {
                                    xtype: 'button', 
                                    text : 'Help',
                                    //iconCls:'x-btn-inner help',
                                    icon:"/ext/resources/images/help.png",
                                    handler : function() {
                                        log.debug("test");
                                    }
                                },
                                {
                                    xtype: 'button', 
                                   // text : 'Less',
                                    data:'less',
                                    id: 'less-btn'
                                    //enableToggle:true,
                                    ,iconCls:'toolbar-icon'
                                    ,icon:"/ext/resources/images/dbl-left.png"
                                    
                                    //toggleGroup:'scopeGroup'
                                   // ,allowDepress:true
                                    //,pressed:true
                                },
                                {
                                  text: '0',
                                  id:'graph-depth'
                                  ,allowDepress:true
                                  ,enableToggle:true
                                }, 
                                {
                                    xtype: 'button', 
                                    //text : 'More',
                                    data:'more',
                                    id: 'more-btn'
                                    //enableToggle:true,
                                    //iconCls:'x-btn-inner help',
                                    ,icon:"/ext/resources/images/dbl-right.png" 
                                   
                                    //toggleGroup:'scopeGroup',
                                    //allowDepress:true

                                },
                                '->',
                               
                               
                                {
                                	xtype:'label',
                                	text:'Loading',
                                	cls:'network-spinner',
                                	id:'spinner-label'
                                },
                                {
                                    //text:'Loading...',
                                	xtype:'image',
                                	id:'spinner-img',
                                	cls:'network-spinner', 
                                    style:{width:'20px',height:'20px'},
                                    //icon:"/ext/resources/images/loading1.gif",
                                    src: "/ext/resources/images/loading.gif"
                                }
                        ]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                           {
						        text: 'Show Legend',
						        enableToggle: true,
						        icon:"/ext/resources/images/legend.png",
						        id:'legendToggleBtn'						        
						        //toggleHandler: toggleLegend
						    },
						    '->',
                            {xtype:"label", id: 'footer_summary', width:400, text:""},
                            '->',
                            {
						        text: 'Animated Tree',
						        enableToggle: true,
						        toggleGroup: 'trees',
						        icon:"/ext/resources/images/legend.png",
						        menu: [
							         {
								        text: 'Arc Link',
								        id:"togglearclink",
								        icon:"/ext/resources/images/legend.png"
								     },
							         {
								        text: 'Straight link',
								        id:"togglestraightlink",
								        icon:"/ext/resources/images/legend.png"
							          }
						        ]
						    },
						     {
						        text: 'Static Tree',
						        icon:"/ext/resources/images/legend.png",
						        menu: [
							         {
								        text: 'Dendrogram',
								        icon:"/ext/resources/images/legend.png",
								        handler:function() {
								        	mygraph.setTreeType("dendrogram");
								        }
								     },
							         {
								        text: 'Cluster Tree',
								        icon:"/ext/resources/images/legend.png",
								        handler:function() {
								        	mygraph.setTreeType("cluster");
								        }
							          }
						        ]
						    }
                       ]
            }
         ],
         listeners: {
         	afterrender: function() {
         		Ext.widget('zoomslider',{renderTo:Ext.get('west-body')});
         	}
         }          
      },{
        region: 'center',
        //border: false,
        title:"",
        //align:'stretch',
        layout:"border",
        tbar:[
	            {
	            	 id:'ingraph-search',
	                 xtype: 'textfield',
	                 name: 'searchInterestField',
	                 hideLabel: true,
	                 width: 300,
	                 listeners: {
	                 }
	            },
	            {
	                xtype: 'button',
	                id:'ingraph-search-btn',
	                text: 'Find and add related networks to the list',
	                tooltip: '',
	                //iconStyle:'color:#04408C; font-size:11px',
	                icon:"/ext/resources/images/find.png"
	                //handler: function() {alert('peng !!!!');}
	            }],
        items:[
            { 
                //xtype: 'panel',
            	xtype:'tabpanel',
                region:'north',
                title:'Overview',
                split:true,
                height: 500,
                autoScroll:true,
                collapsible:true,
                //items:[networkgrid] //networkGrid
                items: [{
                	xtype:'networkgrid'
                },
                {
        			xtype:'referencegrid'
                },
                {
                	xtype:'mynetworkgrid'
                }
                
                ]
                //html:'here lists the networks'
            },
            {
            	xtype:'tabpanel',
            	region:'center',
            	plain: true,
            	collapsible:true,
            	title:'Details',
            	id:'infopanel',
            	activeTab:0,
            	autoScroll:false,
            	split:true,
            	items: [			                                	 
                	 /**{
                            title:'Entity Literature',
                            autoScroll:true,
                            items:[literatureGrid]
                    }*/
            	]
            }
            
            /**,
             {
            	xtype:'tabpanel',
            	region:'south',
            	plain: true,
            	height:200,
            	collapsible:true,
            	title:'Network People',
            	split:true,
            	activeTab:0,
            	autoScroll:true,
            	items: [
                	 {
                	 	title:'Most Pouplar',
                	 	autoScroll:true,
                	 	html:'<table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">T.J Tang </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xudong Dai </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">John Dong</a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table>'
                	 },
                	 {
                            title:'Most Recent',
                            autoScroll:true,
                            html:'<table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xuanxuan Tang </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xudong Dai </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="/ext/resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">John Dong</a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/star.png" width="16" height="16" /><img src="/ext/resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table>'
                    }
            	]
            }
            */
          
        ]
      }]
});