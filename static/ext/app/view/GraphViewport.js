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
                                    xtype: 'button', 
                                    text : 'Create Node',
                                    id:'nodeCreateBtn',
                                    //iconCls:'x-btn-inner node',
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
                               {
                                    xtype: 'button', 
                                    id:'saveGraphBtn',
                                    text : 'Save Graph',
                                    //iconCls:'x-btn-inner remove',
                                    icon:"/ext/resources/images/link_.png",
                                    handler : function() {
                                        //saveGraph();
                                    }
                               },
                               {
                                    xtype: 'button', 
                                    text : 'Help',
                                    //iconCls:'x-btn-inner help',
                                    icon:"/ext/resources/images/help.png",
                                    handler : function() {
                                        log.debug("test");
                                    }
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
						        text: 'C Tree',
						        enableToggle: true,
						        toggleGroup: 'trees',
						        icon:"/ext/resources/images/legend.png",
						        toggleHandler: null
						    },
                            {
						        text: 'S Tree',
						        enableToggle: true,
						        toggleGroup: 'trees',
						        icon:"/ext/resources/images/legend.png",
						        toggleHandler: null
						    },
						    {
						        text: 'H Tree',
						        enableToggle: true,
						        toggleGroup: 'trees',
						        icon:"/ext/resources/images/legend.png",
						        toggleHandler: null
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
	                text: 'Find and add related studies to the list',
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
            	autoScroll:true,
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