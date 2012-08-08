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
    'Ext.ux.LiveSearchGridPanel',
    'Ext.ux.OneChartLiveSearchGridPanel'
]);

                
Ext.onReady(function(){
    
     
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
    literatureGrid=Ext.create('Ext.ux.LiveSearchGridPanel', {
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
    
    nodesJson = []
    linksJson = []
    createNetworkGrid()
    if (typeof viewport=="undefined") createViewPort();
 
   //init the Network Graph
   initApp();	

});


function createViewPort() {
			viewport=Ext.create('Ext.Viewport', {
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
			                                                    //iconCls:'x-btn-inner node',
			                                                    icon:"/ext/resources/images/node.png",
			                                                    tooltip:'Display available geocoders',
			                                                    handler : function() {
			                                                        console.log("test");
			                                                    }
			                                               },
			                                               {
			                                                    xtype: 'button', 
			                                                    text : 'Create Link',
			                                                    //iconCls:'x-btn-inner link',
			                                                    icon:"/ext/resources/images/link.png",
			                                                    tooltip:'Display available geocoders',
			                                                    handler : function() {
			                                                        createLink()
			                                                    }
			                                               },
			                                               {
			                                                    xtype: 'button', 
			                                                    text : 'Remove Node/Link',
			                                                    //iconCls:'x-btn-inner remove',
			                                                    icon:"/ext/resources/images/link_.png",
			                                                    tooltip:'Display available geocoders',
			                                                    handler : function() {
			                                                        console.log("test");
			                                                    }
			                                               },
			                                               {
			                                                    text : 'Links',
			                                                    //iconCls:'x-btn-inner links',
			                                                    icon:"/ext/resources/images/links.png",
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
			                                                    //iconCls:'x-btn-inner help',
			                                                    icon:"/ext/resources/images/help.png",
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
			                                            { xtype: 'button', text: '', 
			                                               //iconCls:"filter",
			                                               icon:"/ext/resources/images/find.png",
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
			                        tbar:[{
								                xtype: 'button',
								                text: 'Search Database By:',
								                tooltip: 'Find Previous Row',
								                //iconStyle:'color:#04408C; font-size:11px',
								                icon:"/ext/resources/images/find.png",
								                handler: function() {alert('peng !!!!');}
								            },
								            {
								                 xtype: 'textfield',
								                 name: 'searchInterestField',
								                 hideLabel: true,
								                 width: 200,
								                 listeners: {
								                 }
								            }],
			                        items:[
			                            { 
			                                //xtype: 'panel',
			                            	xtype:'tabpanel',
			                                region:'north',
			                                title:'Overview',
			                                split:true,
			                                height: 200,
			                                autoScroll:true,
			                                collapsible:true,
			                                items:[networkGrid] //networkGrid
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
		            }); // end of createViewport

	// fire event
	$(document).trigger(precon.event.ViewportCreated)
}   // end function

function showTips(e) {
    //var htmlcontent='Entity Name: '+e.target.name+'</br>Related Literatures: <a onclick=showLiterature("'+e.target.name+'")>5</a>';
    var htmlcontent='Entity Name: <b>AMPK</b></br>Literatures Found: <a onclick=showLiterature("'+e.target.name+'")><b>15</b></a>';
    if (typeof gtip=="undefined")
        gtip = Ext.create('Ext.tip.ToolTip', {
                  target: 'svg',
                  html: htmlcontent
        });
        
    gtip.showAt([e.clientX+10,e.clientY+10]);
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
	// see the events binding in createGraph()	
    /**
    d3.selectAll("g").on("mouseover",function(d){
               // alert('mouse over lines '+d.id);
               console.log(d);
               addSelectStyle(d3.event.currentTarget);
                showTips(d3.event);
    });
           
    d3.selectAll("g").on("click",function(d){
    	if(d3.event.detail > 1){
    		// double clicked
    		showObject(d)
    	}    	   
    });  
    
    d3.selectAll("g").on("mouseout",function(d){
               // alert('mouse over lines '+d.id);
              //  console.log(d3.event);
                hideTips();
    });
    */       
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

/**
 * Call precon.client.quickSearch to get a list of networks
 * 
 * No returns. This function will initialize/update the network table.
 * 
 */
function initApp() {
	// events binding 
	$(document).bind(precon.event.ViewportCreated, showMainObject)
	
	
	objid = getObjectIdFromUrl()	
	if (objid){
		precon.searchNetworks(objid, initNetwork);			
	}
	
	showMainObject()
}

// get the object id from the URL, if it's available
function getObjectIdFromUrl(){
	var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
	if(matcher) return matcher[1]
	return ''
}

function showMainObject(){	
	objid = getObjectIdFromUrl()
	if(!objid) return
	precon.getObject(objid, function(obj){
		var html = renderObject(obj)
		var title =  obj.name || obj.title || obj.label
		Ext.getCmp("west").setTitle( precon.getObjectType(objid) + ": "+  title)
		title = precon.util.shortTitle(title)
		var tab = Ext.getCmp("infopanel").add({
			title:'Summary',
			html:html,
			autoScroll:true,
			closable:true
		})
		Ext.getCmp("infopanel").setActiveTab(tab)	
		
		$("#publication-abstract").find(".entity-name").click( addNodeFromAbstract)
	});	
}
function addNodeFromAbstract(evt, obj){
	var label = $(this).text() 
	id ='enti_' +
	
	label.replace(/[()\s]/g, '')
	graphModel.addNode( {_id:id, label: label } )
}
function createLink(){
	var selections = graphModel.getSelections()
	var nodes = []
	selections.forEach(function(obj){
		if(obj instanceof precon.Node) 
			nodes.push(obj)
	})
	if(nodes.length!=2){
		alert("You must select exactly 2 nodes first")
		return;
	}
	// TBD: type, ref etc
	var con = {nodes: [nodes[0], nodes[1]]}
	graphModel.addConnection(con);	
}
function showObject(obj){
	if('getRawdata' in obj) obj = obj.getRawdata()
	
	var tab =  Ext.getCmp("infopanel").getComponent(obj._id)
	if(!tab){
		var html = renderObject(obj)
		var title =  obj.name || obj.title || obj.label
		var title = precon.util.shortTitle(title)
		tab = Ext.getCmp("infopanel").add({
			title:title,
			html:html,
			id:obj._id,
			autoScroll:true,
			closable:true
		})
	}
	Ext.getCmp("infopanel").setActiveTab(tab)
	
}

function renderObject(obj){
	console.log("Rendering object: ", obj)
	if(precon.getObjectType(obj._id) =='publication' ){
		var authors = ''
		if(obj.authors){
			obj.authors.forEach(function(author){
				if(authors) authors+=", ";
				authors += (author.first?author.first.substring(0,1):'') +" "+ author.last
			});			
		}
		
		
		html="<table><tr><th>Title:</td><td>"+obj.name+"</td></tr>"
		html+="<tr><th>Authors:</th><td>" + authors +"</td></tr>"
		
		var entities = obj.entities || []
		ab = obj.abstract
		entities.forEach(function(en){
			var re = new RegExp("("+ en.name+")", 'gi')
			ab = ab.replace(re, '<a href="#" class="entity-name">$1</a>')  
		});
		
		html+="<tr><th>Abstract:</th><td id='publication-abstract'>" + ab +"</td></tr>"		
		
		html+="</table>"
		return html
	}	
	else if(precon.getObjectType(obj._id) =='connection' ){
		//TBD: temp hack
		obj.label = obj.source.getLabel() + " - " + obj.target.getLabel() 
	}
	
	return precon.util.formatObject(obj)
	
}

/**
 * Call precon.client.quickSearch to get a list of networks
 * 
 * No returns. This function will initialize/update the network table.
 * 
 */
function initNetwork(networkObjects) {
// sample static data for the store
   console.log('here is the returns from JT. ');
   console.log(networkObjects);
	if(!networkObjects || networkObjects.length == 0){
		console.log("Error: no result")
		return
	}
	
	
	
	networkObjects.forEach(function(netObj){
		var n = new precon.Network(netObj)
		graphModel.addNetwork(n);
	});	    
}
function createNetworkGrid(){
	if(window.networkGrid) return;
	
	networkStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'name'},           
           {name: 'ctime'},
           {name: 'creator'}           
           ,{name: 'source'}
           ,{name: 'group'}
           //,{name: 'description'}           
        ],
        data: []       
    });
    
    networkGrid=Ext.create('Ext.ux.OneChartLiveSearchGridPanel', {
        store: networkStore,
        columnLines: true,
        columns: [
            {
                text     : 'Network Name',
                flex     : 1,
                sortable : false,                 
                dataIndex: 'name'
            },
            {
                text     : 'Create Date', 
                width    : 70, 
                sortable : true, 
                renderer : 'renderYear', 
                dataIndex: 'ctime'
            },
            {
                text     : 'Creator', 
                width    : 70, 
                sortable : true, 
                dataIndex: 'creator'
               // renderer: change
            },
            {
                text     : 'Source', 
                width    : 75, 
                flex:1,
                sortable : true, 
                dataIndex: 'source'
               // renderer: change
            },
            {
                text     : 'Group', 
                width    : 75, 
                flex:1,
                sortable : true, 
                dataIndex: 'group'
               // renderer: change
            }
        ],
        height: 'auto',
        width: 'auto',
        title: 'Network List',
       // renderTo: Ext.getBody(),
        viewConfig: {
        	id:'gv',
            stripeRows: false
        }
    });
		 
}
function createGraph() {
	//console.log("Recreating graph")
    //
    //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
	console.log("Creating graph")    
	//Ext.select("svg").remove();
	//graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
	
	if(!window.mygraph){
		console.log("Creating graph")    
		mygraph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		
		
		mygraph.on("click", function(evt, target){
			//console.log("dblclick", evt, target.__data__)			
		});		
		mygraph.on("dblclick", function(evt, target){
			console.log("dblclick", evt, target.__data__)
			showObject(target.__data__)
		});		
		mygraph.on("contextmenu",function(evt, target){
            d3.event.preventDefault();
            contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
		});
		mygraph.on("mouseover",function(evt, target){
            // alert('mouse over lines '+d.id);            
            
            showTips(d3.event);
		});
		
		graphModel = new precon.NetworkGraph()
		mygraph.setModel(graphModel)
		graphModel.bind("add.network", function(){		
			networkStore.loadData( graphModel.getNetworkList() )	
		})
	}
	else{
		console.log("Redraw graph")    
		// redraw
		//Ext.select("svg").remove();
		mygraph.redraw(Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true))
	}	
    
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
                		// TBD: add to NetworkGraph model object
                        mygraph.addNode($("#dialog_node_name").val());
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
                		// TBD: add to NetworkGraph model object                	
                        mygraph.addLink($("#dialog_link_sname").val(), $("#dialog_link_dname").val(),$("#dialog_link_type").val());
                    }
                },
                {caption:'Cancel', callback: function(){}} 
                ]
        });
    }
    

  }