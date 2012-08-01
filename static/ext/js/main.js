 Ext.Loader.setConfig({
            enabled: true,
            disableCaching: true,
            paths: {
                'Ext.ux': '/ext/extjs/ux'
            }
    });
    
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.ux.statusbar.StatusBar',
    'Ext.ux.RowExpander',
    'Ext.selection.CheckboxModel',
    'Ext.tip.QuickTipManager',
    'Ext.ux.LiveSearchGridPanel'
]);

                
Ext.onReady(function(){
	
	//render the year date format
	function renderYear(value,p,record) {
		console.log("test");
		return new Date(value);
	}
	
	// sample static data for the store
    var literatureData = [
         ['Adler, A. I., E. J. Shaw, et al','2009', 'Newer agents for blood glucose control in type 2 diabetes: summary of NICE guidance',' BMJ 338: b1668','Abstract for one: The consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Dowling, R. J., M. Zakikhani, et al.','2007', 'Metformin inhibits mammalian target of rapamycin-dependent translation initiation in breast cancer cells','Cancer research 67(22): 10804-10812','Abstract for 2: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Libby, G., L. A. Donnelly, et al.','2009', 'New users of metformin are at low risk of incident cancer: a cohort study among people with type 2 diabetes.','Diabetes care 32(9): 1620-1625','Abstract for 3: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Miller, R. A. and M. J. Birnbaum','2010', 'An energetic tale of AMPK-independent effects of metformin','The Journal of clinical investigation 120(7): 2267-2270','Abstract for 4: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Nathan, D. M., J. B. Buse, et al.','2009', 'Medical management of hyperglycemia in type 2 diabetes: a consensus algorithm for the initiation and adjustment of therapy: a consensus statement of the American Diabetes Association and the European Association for the Study of Diabetes.','Diabetes care 32(1): 193-203'],
         ['Shu, Y., S. A. Sheardown, et al.','2007', 'Effect of genetic variation in the organic cation transporter 1 (OCT1) on metformin action.','The Journal of clinical investigation 117(5): 1422-1431','Abstract for 5: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Viollet, B., B. Guigas, et al.','2009', 'AMP-activated protein kinase in the regulation of hepatic energy metabolism: from physiology to therapeutic perspectives','Acta physiologica 196(1): 81-98','Abstract for 6: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
          ['Adler, A. I., E. J. Shaw, et al','2009', 'Newer agents for blood glucose control in type 2 diabetes: summary of NICE guidance',' BMJ 338: b1668','Abstract for one: The consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Dowling, R. J., M. Zakikhani, et al.','2007', 'Metformin inhibits mammalian target of rapamycin-dependent translation initiation in breast cancer cells','Cancer research 67(22): 10804-10812','Abstract for 2: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Libby, G., L. A. Donnelly, et al.','2009', 'New users of metformin are at low risk of incident cancer: a cohort study among people with type 2 diabetes.','Diabetes care 32(9): 1620-1625','Abstract for 3: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Miller, R. A. and M. J. Birnbaum','2010', 'An energetic tale of AMPK-independent effects of metformin','The Journal of clinical investigation 120(7): 2267-2270','Abstract for 4: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Nathan, D. M., J. B. Buse, et al.','2009', 'Medical management of hyperglycemia in type 2 diabetes: a consensus algorithm for the initiation and adjustment of therapy: a consensus statement of the American Diabetes Association and the European Association for the Study of Diabetes.','Diabetes care 32(1): 193-203'],
         ['Shu, Y., S. A. Sheardown, et al.','2007', 'Effect of genetic variation in the organic cation transporter 1 (OCT1) on metformin action.','The Journal of clinical investigation 117(5): 1422-1431','Abstract for 5: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.'],
         ['Viollet, B., B. Guigas, et al.','2009', 'AMP-activated protein kinase in the regulation of hepatic energy metabolism: from physiology to therapeutic perspectives','Acta physiologica 196(1): 81-98','Abstract for 6: he consensus algorithm for the medical management of type 2 diabetes was published in August 2006 with the expectation that it would be updated, based on the availability of new interventions and new evidence to establish their clinical role. The authors continue to endorse the principles used to develop the algorithm and its major features. We are sensitive to the risks of changing the algorithm cavalierly or too frequently, without compelling new information. An update to the consensus algorithm published in January 2008 specifically addressed safety issues surrounding the thiazolidinediones. In this revision, we focus on the new classes of medications that now have more clinical data and experience.']
  
    ];
    
    // create the data store
    var literatureStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'author'},
           {name: 'year'},
           {name: 'title'},
           {name: 'reference'},
           {name:'abstract'}
        ],
        data: literatureData
    });
    
    // create the Grid, see Ext.
   var literatureGrid=Ext.create('Ext.ux.LiveSearchGridPanel', {
        store: literatureStore,
        columnLines: true,
        columns: [
            {
                text     : 'author',
               // flex     : 1,
                sortable : false, 
                width: 85,
                dataIndex: 'author'
            },
            {
                text     : 'year', 
                width    : 45, 
                sortable : true, 
                //renderer : 'usMoney', 
               // renderer: renderYear,
                dataIndex: 'year'
            },
            {
                text     : 'title', 
                width    : 75, 
                flex:1,
                sortable : true, 
                dataIndex: 'title'
               // renderer: change
            },
            {
                text     : 'reference', 
                width    : 75, 
                sortable : true, 
                dataIndex: 'reference'
                //renderer: pctChange
             }
        ],
        height: 450,
        width: 'auto',
        title: '',
       // renderTo: Ext.getBody(),
        viewConfig: {
            stripeRows: true
        },
        plugins: [ {
        	ptype:'rowexpander',
        	rowBodyTpl:[
        	 '<b>Author</b>: {author}<br><b>',
        	 'Year:</b> {year}<br>',
        	 '<b>Reference:</b> {reference}</br>',
        	 '<b>Abstract:</b><br>{abstract}'
        	]	
        }]
    });


// sample static data for the store
    var networkData = [
         ['AMPK function studies','7/30/2012', 'Xiongjiu Liao', 'This network was created for demo purpose'],
         ['Metforming studies','7/29/2012', 'J.T.', 'This network was created for teaching course 101.111'],
          ['AMPK function studies','7/30/2012', 'Xiongjiu Liao', 'This network was created for demo purpose'],
         ['Metforming studies','7/29/2012', 'J.T.', 'This network was created for teaching course 101.111']
    ];
    
    // create the data store
    var literatureStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'name'},
           {name: 'ctime'},
           {name: 'creator'},
           {name: 'description'}
        ],
        data: networkData
    });
    
    // create the Grid, see Ext.
   var networkGrid=Ext.create('Ext.ux.LiveSearchGridPanel', {
        store: literatureStore,
        columnLines: true,
        columns: [
            {
                text     : 'Network Name',
               // flex     : 1,
                sortable : false, 
                width: 85,
                dataIndex: 'name'
            },
            {
                text     : 'Create Date', 
                width    : 75, 
                sortable : true, 
                renderer : 'renderYear', 
                dataIndex: 'ctime'
            },
            {
                text     : 'Creator', 
                width    : 75, 
                sortable : true, 
                dataIndex: 'creator'
               // renderer: change
            },
            {
                text     : 'Description', 
                width    : 75, 
                flex:1,
                sortable : true, 
                dataIndex: 'description'
               // renderer: change
            }
        ],
        height: 450,
        width: 'auto',
        title: '',
       // renderTo: Ext.getBody(),
        viewConfig: {
        	id:'gv',
            stripeRows: false
        }
    });

	Ext.create('Ext.Viewport', {
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
	                                                    iconCls:'x-btn-inner node',
	                                                    tooltip:'Display available geocoders',
	                                                    handler : function() {
	                                                        console.log("test");
	                                                    }
	                                               },
	                                               {
	                                                    xtype: 'button', 
	                                                    text : 'Create Link',
	                                                    iconCls:'x-btn-inner link',
	                                                    tooltip:'Display available geocoders',
	                                                    handler : function() {
	                                                        console.log("test identify");
	                                                    }
	                                               },
	                                               {
	                                                    xtype: 'button', 
	                                                    text : 'Remove Node/Link',
	                                                    iconCls:'x-btn-inner remove',
	                                                    tooltip:'Display available geocoders',
	                                                    handler : function() {
	                                                        console.log("test");
	                                                    }
	                                               },
	                                               {
	                                                    text : 'Links',
	                                                    iconCls:'x-btn-inner links',
	                                                    handler : function() {
	                                                        console.log("test");
	                                                    },
	                                                    menu : [
	                                                            {
	                                                                text : 'About Our Company',
	                                                                cls : '',
	                                                                handler : function() {
	                                                                    window
	                                                                            .open(
	                                                                                    'http://www.co.pierce.wa.us/pc/abtus/ourorg/at/at.htm',
	                                                                                    'metaData');
	                                                                }
	                                                            },
	                                                            {
	                                                                text : 'Feedbacks',
	                                                                cls : '',
	                                                                handler : function() {
	                                                                    window
	                                                                            .open(
	                                                                                    'http://www.co.pierce.wa.us/pc/abtus/ourorg/aud/',
	                                                                                    'metaData');
	                                                                }
	                                                            }
	                                                    ]
	                                               },
	                                               {
	                                                    xtype: 'button', 
	                                                    text : 'Help',
	                                                    iconCls:'x-btn-inner help',
	                                                    tooltip:'Display available geocoders',
	                                                    handler : function() {
	                                                        console.log("test");
	                                                    }
	                                                }
	                                        ]
	                            },
	                            {
	                                xtype: 'toolbar',
	                                dock: 'bottom',
	                                items: [
	                                            {xtype:"tbspacer", width:200, id:"tbarspace"},
	                                            {xtype:"label", width:100},
	                                            {xtype:"textfield", width:400, fieldLabel:"Names to filter", labelAlign:"right",allowBlank:true},
	                                            { xtype: 'button', text: '', iconCls:"filter",
	                                               handler: function() {
	                                                      alert("Peng!!!!!!!!!!!!");
	                                               }
	                                             }
	                                       ]
	                            }
	                         ],
	                         listeners: {
	                             afterrender: {
	                                 element:'',
	                                 fn: function() {
	                                     
	                                     //update the button toolbar space width
	                                     setTimeout(function(){
	                                            Ext.getCmp("tbarspace").setWidth(Ext.get("west-body").getWidth(true)*0.4);
	                                            createGraph();
	                                        },300);
	                                        setTimeout(function(){
	                                            fireEvents();
	                                        },600);
	                                     console.log('western panel rendered');
	                        //Ext.getCmp('west').getEl().on('contextmenu', function(e) {
	                                                    
	                                     }
	                             },
	                             resize: {
	                                 element:'',
	                                 fn:function() {
	                                     createGraph();
	                                 }
	                             }
	                         }
	                      },{
	                        region: 'center',
	                        //border: false,
	                        title:"",
	                        //align:'stretch',
	                        layout:"border",
	                        items:[
	                            { 
	                                //xtype: 'panel',
	                                region:'north',
	                                title:'Networks Selections',
	                                split:true,
	                                height: 200,
	                                collapsible:true,
	                                items:[networkGrid]
	                                //html:'here lists the networks'
	                            },
	                            {
	                            	xtype:'tabpanel',
	                            	region:'center',
	                            	plain: true,
	                            	collapsible:true,
	                            	title:'Network Entity',
	                            	
	                            	activeTab:0,
	                            	split:true,
	                            	items: [
	                                	 {
	                                	 	title:'Entity Info',
	                                	 	autoScroll:true,
	                                	 	html:'<b>Entity Name</b>: AMPK<br><b>Entity Type:</b>Node<br><b>Entity Other infos:</b>blah blah <br><blah>'
	                                	 },
	                                	 {
	                                            title:'Entity Literature',
	                                            autoScroll:true,
	                                            items:[literatureGrid]
	                                    }
	                            	]
	                            },
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
	                                	 	html:'<table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">T.J Tang </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xudong Dai </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">John Dong</a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table>'
	                                	 },
	                                	 {
	                                            title:'Most Recent',
	                                            autoScroll:true,
	                                            html:'<table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xuanxuan Tang </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">Xudong Dai </a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table><br><table width="363" height="40" border="0" style="background-color:#CCFFFF"><tr><td width="51" rowspan="2"><div align="center"><img src="resources/images/edit-user.png" width="24" height="24" /></div></td><td width="302"><a href="one-chart.com" class="style3">John Dong</a></td></tr><tr><td height="24"><span class="style2">Partner at One-chart.com </span></td></tr><tr><td width="51"><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/star.png" width="16" height="16" /><img src="resources/images/dark_star.png" width="16" height="16" /></td><td><em>"<a href="#">Expernet is a well-designed company...."</a></em></td></tr></table>'
	                                    }
	                            	]
	                            }
	                          
	                        ]
	                      }]
            })
    });
    
function showLiterature(name) {
    alert("this will display literatures on the right");
}

function showTips(e) {
    //var htmlcontent='Entity Name: '+e.target.name+'</br>Related Literatures: <a onclick=showLiterature("'+e.target.name+'")>5</a>';
    var htmlcontent='Entity Name: <b>AMPK</b></br>Literatures Found: <a onclick=showLiterature("'+e.target.name+'")><b>15</b></a>';
    if (typeof gtip=="undefined")
        gtip = Ext.create('Ext.tip.ToolTip', {
                  target: 'svg',
                  html: htmlcontent
        });
        
    gtip.showAt([e.clientX+5,e.clientY]);
    
    //console.log(e.target);
}   

function addSelectStyle(el) {
    //el.setStyle("stroke","yellow");
    //el.setStyle("stroke-width",4);
    //el.style("stroke")="yellow";
    //console.log(el);
}

function hideTips() {
        Ext.Function.createThrottled(gtip.hide(),1500);
    }

function fireEvents() {
    
    d3.selectAll("g").on("mouseover",function(d){
               // alert('mouse over lines '+d.id);
               console.log(d);
               addSelectStyle(d3.event.currentTarget);
                showTips(d3.event);
    });
           
    d3.selectAll("g").on("dbclick",function(d){
                //alert('double clicked nodes '+d.id);
                //console.log(d3.event);
                }
        );  
    
    d3.selectAll("g").on("mouseout",function(d){
               // alert('mouse over lines '+d.id);
              //  console.log(d3.event);
                hideTips();
    });
           
    contextMenu = new Ext.menu.Menu({
                  items: [
                            
                            {
                                text: 'Update Selected',
                                handler:function(menuItem,menu) { CreateDiaolog('link'); }, 
                                iconCls:'update'
                            },
                            {
                                text: 'Remove Selected',
                                handler:function(menuItem,menu) { CreateDiaolog('link'); }, 
                                iconCls:'remove'
                            },
                            {
                                text: 'Create Node/Link',
                                handler:function(menuItem,menu) { CreateDiaolog('link'); }, 
                                iconCls:'create'
                            }
                  ]
    });
    
    d3.selectAll("g").on("contextmenu",function(d){
              d3.event.preventDefault();
              contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
    });
    
    d3.selectAll("svg").on("contextmenu",function(d){
              d3.event.preventDefault();
    });
            
    /*
    Ext.select("g").on('contextmenu', function(e) {                                                                    
                e.preventDefault();
               // alert(e.target.toString())
                alert(e.clientX+"---"+e.clientY);
                contextMenu.show();
                contextMenu.setXY([e.clientX,e.clientY]);
        });*/
    
}  

function readJson(dataJson) {
	
	
}

function createGraph() {
    Ext.select("svg").remove();
    graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
    //graph = new myGraph("#west-body");
    graph.addNode("Metforming");
    graph.addNode("AMPK");
    graph.addNode("blood glucose concentration");
    graph.addNode("Organic cation transporter 1 (OCT1)");
    graph.addNode("glucose synthesis");
    graph.addNode("lipid synthesis");
    graph.addNode("protein synthesis");
    graph.addNode("fatty acid oxidation");
    graph.addNode("glucose uptake");
    graph.addNode("respiratory-chain complex 1");
    graph.addNode("fructose-1,6-bisphosphatase");
    graph.addNode("fatty acid synthase");
    graph.addNode("acetyl CoA carboxylase(ACC)");
    graph.addNode("mTORC1");
    graph.addNode("TSC2");
    graph.addNode("cancer risk");
    graph.addNode("prostate cancer risk");
    graph.addNode("pancreatic cancer risk");
    graph.addNode("breast cancer");
    graph.addNode("cancer (cell lines)");
    graph.addNode("cancer (animal models)");
    graph.addNode("type 2 diabete");
    graph.addNode("angiogenesis");

    graph.addLink("Metforming", "blood glucose concentration","decreases");
    graph.addLink("Metforming", "Organic cation transporter 1 (OCT1)","beinguptaken");
    graph.addLink("Metforming", "AMPK","activates");
    graph.addLink("Metforming", "respiratory-chain complex 1","association");
    graph.addLink("Metforming", "fructose-1,6-bisphosphatase","association");
    graph.addLink("Metforming", "cancer risk","association");
    graph.addLink("Metforming", "prostate cancer risk","association");
    graph.addLink("Metforming", "pancreatic cancer risk","pathway");
    graph.addLink("Metforming", "breast cancer","inhibits");
    graph.addLink("Metforming", "cancer (cell lines)","inhibits");
    graph.addLink("Metforming", "cancer (animal models)","inhibits");
    graph.addLink("Metforming", "type 2 diabete","inhibits");
    graph.addLink("Metforming", "angiogenesis","inhibits");
    graph.addLink("AMPK", "glucose synthesis","inhibits");
    graph.addLink("AMPK", "lipid synthesis","inhibits");
    graph.addLink("AMPK", "protein synthesis","inhibits");
    graph.addLink("AMPK", "fatty acid oxidation","stimulats");
    graph.addLink("AMPK", "glucose uptake","stimulats");
    graph.addLink("AMPK", "respiratory-chain complex 1","decreases");
    graph.addLink("AMPK", "fatty acid synthase","decreases");
    graph.addLink("AMPK", "acetyl CoA carboxylase(ACC)","inhibits");
    graph.addLink("AMPK", "mTORC1","inhibits");
    graph.addLink("AMPK", "TSC2","activates");
    

    
    /*
    graph.addLink("Cause", "Effect","predicted");
        graph.addNode("A");
        graph.addNode("B");
        graph.addLink("A", "B","pathway");
        graph.addNode("Stand Alone");*/
    
    
}
    /*
$(document).ready(function() {
    
    
    
    graph = new myGraph("#mygraph");
    
    // You can do this from the console as much as you like...
    graph.addNode("Cause");
    graph.addNode("Effect");
    graph.addLink("Cause", "Effect","predicted");
    graph.addNode("A");
    graph.addNode("B");
    graph.addLink("A", "B","pathway");
    graph.addNode("Stand Alone");
    
    var menu1 = [ 
            {'Create Node':function(menuItem,menu) { alert("You clicked Option 1!"); } }, 
            {'Create Link':function(menuItem,menu) { alert("You clicked Option 2!"); } },
            $.contextMenu.separator, 
            {'Remove Node':function(menuItem,menu) { alert("You clicked Option 2!"); } }, 
            {'Remove Link':function(menuItem,menu) { alert("You clicked Option 2!"); } },
            $.contextMenu.separator, 
            {'Find Node':function(menuItem,menu) { alert("You clicked Option 2!"); } },
            {'Find Link':function(menuItem,menu) { alert("You clicked Option 2!"); } },
            ]; 
        
        $(function() { $('#mygraph').contextMenu(menu1,{theme:'vista'}); });
        */
    
    /*
    var menu3 = [ 
                {'Add Node':{ 
                    onclick:function(menuItem,menu) { CreateDiaolog('a_node'); }, 
                    icon:'resources/images/node.png'
                    } 
                }, 
                {'Add Link':{ 
                    onclick:function(menuItem,menu) { CreateDiaolog('a_link'); }, 
                    icon:'resources/images/link.png'
                    } 
                }, 
                $.contextMenu.separator, 
                {'Rmove Node':{ 
                    onclick:function(menuItem,menu) { alert("You clicked me!"); }, 
                    icon:'resources/images/node_.png'
                    } 
                }, 
                {'Remove Link':{ 
                    onclick:function(menuItem,menu) { if(confirm('Are you sure?')){$(this).remove();} }, 
                    icon:'resources/images/link_.png'
                    } 
                } ,
                $.contextMenu.separator,  
                {'Find Node/Link':{ 
                    onclick:function(menuItem,menu) { if(confirm('Are you sure?')){$(this).remove();} }, 
                    icon:'resources/images/find.png'
                    } 
                } 
            ];
        $(function() { $('#mygraph').contextMenu(menu3,{theme:'vista'}); });
    });
        */
      
    
  function CreateDiaolog(type) {
    if (type=="a_node") {
        $.Zebra_Dialog(
           'Node Name: <input type="text" id="dialog_node_name" width=70 /><br/>Node Type: <select id="dialog_node_type" width=70><option>Gene</option><option>Disease</option><option>Medicine</option><option>Audi</option></select>', {
            'type':     'question',
            'title':    'Add Node',
            'buttons':  [
                {caption:'OK', callback: function(){
                        graph.addNode($("#dialog_node_name").val());
                    }
                },
                {caption:'Cancel', callback: function(){}} 
                ]
        });
    }
    
    if (type=="a_link") {
        $.Zebra_Dialog(
           'Source Node Name: <input type="text" id="dialog_link_sname" width=70 /><br/>Target Node Name: <input type="text" id="dialog_link_dname" width=70 /><br/>Link Type: <select id="dialog_link_type" width=70><option>Predicted</option><option>Pairpath</option><option>Pathway</option></select>', {
            'type':     'question',
            'title':    'Add Link',
            'buttons':  [
                {caption:'OK', callback: function(){
                        graph.addLink($("#dialog_link_sname").val(), $("#dialog_link_dname").val(),$("#dialog_link_type").val());
                    }
                },
                {caption:'Cancel', callback: function(){}} 
                ]
        });
    }
    
  }