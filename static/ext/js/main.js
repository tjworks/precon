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
    'Ext.ux.OneChartLiveSearchGridPanel',
    'Ext.ux.form.MultiSelect'
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

Ext.onReady(function(){
    console.log("!!! setup auto")
    $( "#ingraph-search-inputEl" ).autocomplete({
          source: validateKeyword,
          minLength:2,
          select: function(event, ui) {
              console.log("selected ", ui)
              precon.searchNetworks(ui.item._id, function(networks){ loadNetworks(networks, false)})
          }         
        });
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
			                                                        nodeCreate();
			                                                    }
			                                               },
			                                           
														   {
															    xtype: 'button', 
															    text : 'Create Link',
															    //iconCls:'x-btn-inner link',
															    icon:"/ext/resources/images/link.png",
															    tooltip:'Display available geocoders',
															    handler : function() {
																   linkCreate()
															    }
														  },
													   
			                                               {
			                                                    xtype: 'button', 
			                                                    text : 'Remove Node/Link',
			                                                    //iconCls:'x-btn-inner remove',
			                                                    icon:"/ext/resources/images/link_.png",
			                                                    tooltip:'Display available geocoders',
			                                                    handler : function() {
			                                                        openRemoveWindow();
			                                                    }
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
		                                               {
													        text: 'Show Legend',
													        enableToggle: true,
													        icon:"/ext/resources/images/legend.png",
													        id:'legendToggleBtn',
													        toggleHandler: toggleLegend
													    },
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
			                                            Ext.getCmp("legendToggleBtn").toggle();
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
								                text: 'Find and add related studies to the list',
								                tooltip: '',
								                //iconStyle:'color:#04408C; font-size:11px',
								                icon:"/ext/resources/images/find.png",
								                handler: function() {alert('peng !!!!');}
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
        
    gtip.showAt([e.clientX+5,e.clientY]);
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

function createContextMenu(obj) {	
    var contextMenu = new Ext.menu.Menu({
                  items: [

	                          {
	                              text: 'Center me',
	                              handler:function() {
	                            	  console.log("Centered on", obj)
	                            	  if(obj.get('entity'))
		                            	  precon.searchNetworks( obj.get('entity'), function(nets){ loadNetworks(nets, true, true) })
	                              }, 
	                              iconCls:'update'
	                          },
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
    return contextMenu
   
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
/*
 * Render the double-clicked node/link info into a form on the right side
 * @param obj the json data of the clicked object
 */
function showObject(obj){
	if('getRawdata' in obj) obj = obj.getRawdata()
	
	var tab =  Ext.getCmp("infopanel").getComponent(obj._id)
	if(!tab){
		var html = renderObject(obj)
		var title =  obj.name || obj.title || obj.label
		var title = precon.util.shortTitle(title)
		//process the node rendering
		if (precon.getObjectType(obj._id)=="node") {
			var objPanel = Ext.create('Ext.form.Panel', 
			 {
				layout: 'anchor',
			    defaults: {
			        anchor: '100%',
			        bodyPadding:10
			    },
			    defaultType: 'textfield',
				items:[
					  		{
			                    fieldLabel: 'id',
			                    name: 'id',
			                    value: obj._id,
			                    disabled: true
			                },{
			                    fieldLabel: 'Group',
			                    name: 'group',
			                    value:obj.group
			                },
			                {
			                    fieldLabel: 'Label',
			                    name: 'label',
			                    allowBlank:false,
			                    value:obj.label
			                },{
			                    fieldLabel: 'Entity',
			                    name: 'entity',
			                    value:obj.entity
			                },
			                {
			                    fieldLabel: 'Role',
			                    name: 'role',
			                    allowBlank:false,
			                    value:obj.role
			                },{
			                    fieldLabel: 'update_tm',
			                    name: 'update_tm',
			                    value:obj.update_tm
			                }
					]
			});
			tab = Ext.getCmp("infopanel").add(
				{
					title:title,
					layout:'fit',
					id:obj._id,
					closable:true,
					defaults: {
			        	anchor: '100%',
			        	bodyPadding:20
			   		},
					items:[objPanel],
					fbar: [
				          {
				              text: 'Update Node',
				              handler: function () {
				              	  alert("peng peng");
				                  var tabs = this.up('tabpanel');
				              }
				          }
				      ]
				}
			);
		}
		else if (precon.getObjectType(obj._id)=="connection") {
				//var getName=function(id) {precon.getObject(id,function(obj){obj.name})};
			    var formnodes=[];
			    obj.nodes.forEach(function(anode) {
			    	precon.getObject(anode,function(obj){console.log(obj);formnodes.push([obj.label,obj.label])})
			    	//formnodestemp.push([anode,anode])}
			    	});
				var objPanel = Ext.create('Ext.form.Panel', 
				 {
					layout: 'anchor',
					buttonAlign:'left',
				    defaults: {
				        anchor: '100%',
				        bodyPadding:10
				    },
				    defaultType: 'textfield',
					items:[
								  {
									  fieldLabel: 'Id',
									  name: 'id',
									  value: obj._id,
									  disabled: true
								  },{
									  fieldLabel: 'Label',
									  name: 'label',
									  value:obj.label
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
                                fieldLabel:     'Type',
                                name:           'Type',
                                displayField:   'name',
                                value: 			obj.type,
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                         {name : 'beinguptaken',   value: 'beinguptaken'},
                                         {name : 'activates',  value: 'activates'},
                                         {name : 'inhibits', value: 'inhibits'},
                                         {name : 'beinguptaken',   value: 'stimulats'},
                                         {name : 'activates',  value: 'association'},
                                         {name : 'inhibits', value: 'physical_interaction'},
                                          {name : 'beinguptaken',   value: 'predicted'},
                                          {name : 'activates',  value: 'activates'},
                                          {name : 'inhibits', value: 'pathway'}
                                    ]
                                })
                           	 },
								/*
								  {
																	  fieldLabel: 'Type',
																	  name: 'type',
																	  value:obj.type
																  },*/
								  {
									  fieldLabel: 'Network',
									  name: 'network',
									  id:'linkupdateform_'+obj.label,
									  //allowBlank:false,
									  value:obj.network,
									  listeners: {
									  	afterrender: {
									  		fn:function(){ var d=Ext.getCmp('linkupdateform_'+obj.label); precon.getObject(d.getValue(),function(obj){d.setValue(obj.name)})}
									  	}
									  }
								  },
								  {
									   anchor: '100%',
							           xtype: 'multiselect',
							           msgTarget: 'side',
							           id:'linkupdateform_m'+obj.label,
							           fieldLabel: 'Nodes',
							           name: 'Nodes',
							           allowBlank: false,
							           store: formnodes,
							           ddReorder: true,
							           listeners: {
									  	afterrender: {
									  		fn:function(){ var d=Ext.getCmp('linkupdateform_m'+obj.label); console.log(d);}
									  	}
									  }
								  },
								  {
									  fieldLabel: 'Ref Pubmed',
									  name: 'Pubmed',
									  value:obj.refs.pubmed
								  }
								 /*
								  {
																		 xtype: 'fieldcontainer',
																		 fieldLabel: 'Refs',
																		 layout: 'vbox',
																		 combineErrors: true,
																		 defaultType: 'textfield',
																		 defaults: {
																			 //hideLabel: 'true'
																		 },
																		 items: [{
																			 name: 'Intact',
																			 fieldLabel: 'Intact',
																			 flex: 2,
																			 value:obj.refs.intact
																		 }, {
																			 name: 'Pubmed',
																			 fieldLabel: 'Pubmed',
																			 flex: 3,
																			 value:obj.refs.pubmed
																		 }]
																	 }
																 */
								 
						],
						fbar: [
							'->',
					          {
					              text: 'Update Node',
					              handler: function () {
					              	  alert("peng peng");
					                  var tabs = this.up('tabpanel');
					              }
					          },
					          '->'
					      ],
					      listeners: [
					      {}
					      ]
					      
				});
				tab = Ext.getCmp("infopanel").add(
					{
						title:title,
						layout:'fit',
						id:obj._id,
						closable:true,
						defaults: {
				        	anchor: '100%',
				        	bodyPadding:20
				   		},
						items:[objPanel]
						
					}
				);
		} else
		{
			tab = Ext.getCmp("infopanel").add({
				title:title,
				html:html,
				id:obj._id,
				autoScroll:true,
				closable:true
			})
		}
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
		
		var entities = obj.entities || [];
		ab = obj.abstract;
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
		//obj.label = obj.source.getLabel() + " - " + obj.target.getLabel()
		obj.label = obj.nodes[0] + " - " + obj.nodes[1] 
	}

    //stop rendering node, switch it panel items	
	if (precon.getObjectType(obj._id)!="node")
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
	loadNetworks(networkObjects, true)	
}
/**
 * 
 * @param networkObjects
 * @param toGraph: whether to draw on graph immediately
 * @param toReplace: remove existing before adding new one
 */
function loadNetworks(networkObjects, toGraph, toReplace){
	
	if(!networkObjects) return
	if(toReplace){
		graphModel.removeAll();
		networkStore.removeAll();
	}
	networkObjects.forEach(function(network){		
		if(networkStore.findExact("_id", network.get('_id')) <0  ){ // add only if not already exists
			if(toGraph) graphModel.addNetwork( network);
			obj = network.getRawdata()
			obj.include = toGraph		
			networkStore.add( obj )
		}		
	})	
}


function createNetworkGrid(){
	if(window.networkGrid) return;
	
	networkStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: '_id'}
            ,{name: 'name'}           
           //{name: 'ctime'},
           ,{name:'include'}
           ,{name: 'creator'}           
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
                text     : 'Show in Graph', 
                width    : 100, 
                sortable : true, 
                renderer : function(val,meta, record) {                				
                				 return "<input type=checkbox "+ (val?"checked":"")+ " name='networkId' value='"+  record.get("_id") + "'>"
                },
                dataIndex: 'include'
            },
            {
                text     : 'Study',
                flex     : 1,
                sortable : false,                 
                dataIndex: 'name'
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
                text     : 'Network', 
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
        },
        listeners: {
        	click:{
        		element:'el',
        		fn:function(view, item){        	
        			console.log(item, item.name, item.value, item.checked)
        			if(item.name == 'networkId' ){
        				if(item.checked)
        					graphModel.addNetwork( item.value )
        				else
        					graphModel.removeNetwork( item.value )
        			}
        		}
        	},        	
        	itemdblclick:function(view, row){
        		console.log("double Clicked network: " + row.data._id)      
        		showObject(row.data)
        		
        	},
        	itemmouseenter:function(view, row){
        		var netId = row.data._id        	        		
        		_.each( $("path[network*="+netId+"]"),  function(em){
        			$d(em).classed("state-highlight", true)
        		})
        		//$("path").filter(":not([network*="+netId+"])").hide()
        	},
        	itemmouseleave:function(view, row){
        		var netId = row.data._id
        		_.each( $("path[network*="+netId+"]"), function(em){
        			$d(em).classed("state-highlight", false)
        		})
        		//$("g.node").filter(":not([network*="+netId+"])").show()
        		//$("path").filter(":not([network*="+netId+"])").show()        		
        	}
        }
    });
		 
}

/*
 * Toggle the show/hide of legend window. If legend window is not created, it will create it first
 * 
 */
function toggleLegend(item,pressed) {
	if (typeof legendWindow=="undefined")
		legendWindow=Ext.create('Ext.window.Window', 
				{
				    bodyPadding: 5,
				    width: 155,
				    height:205,
				    x:2,
				    y:Ext.getCmp("legendToggleBtn").getEl().getXY()[1]-210,
				    animCollapse:true,
				    resizable:false,
				    animateTarget:'legendToggleBtn',
				    collapseDirection:'bottom',
				    //collapsible:true,
				    title: 'Graph Legend',
				    hidden:true,
				    id:'legendWindow',
				    autoHeight:true,
				    closeAction: 'hide',
				    html: '<img src="/ext/resources/images/legend.png" width="150" height="200" alt="this is legend image"/>',
				    listeners: {
				    	close: { 
				    		fn: function () {
				    				Ext.getCmp("legendToggleBtn").toggle();
				    			}
				    	}
				    }
				});
		if (pressed) {
			legendWindow.show();
			item.setText("Hide Legend");
		}
		else {
			legendWindow.hide();
			item.setText("Show Legend");
		} 
}

function nodeCreate() {
	
	if (typeof nodeCreateWindow=="undefined")

		nodeCreateWindow=Ext.create('Ext.window.Window', 
				{
				    bodyPadding: 5,
				    width: 350,
				    title: 'Node Create',
				    id:'nodeCreateWindow',
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
                                id: 			'nodename1_c',
                                fieldLabel:     'Node Name',
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
                           	 }
						],
						buttons : 
						  			 [
										 {
											xtype : 'button',
											text : 'Create',
											handler : function() {
													if (Ext.getCmp('nodename1_c').getValue()!="") {
														graphModel.addNode( {_id:precon.randomId("node"), label: Ext.getCmp('nodename1_c').getValue() } );
														Ext.getCmp('nodename1_c').setValue("");
														nodeCreateWindow.hide();
													}	
												}
										}, {
											xtype : 'button',
											text : 'Cancel',
											handler : function() {
												nodeCreateWindow.hide();
											}
										}
									 ] 
				}
				
				);
		   nodeCreateWindow.show();
}

function linkCreate() {
	
	if (typeof linkCreateWindow=="undefined")

		linkCreateWindow=Ext.create('Ext.window.Window', 
				{
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
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                         {name : 'beinguptaken',   value: 'beinguptaken'},
                                         {name : 'activates',  value: 'activates'},
                                         {name : 'inhibits', value: 'inhibits'},
                                         {name : 'beinguptaken',   value: 'stimulats'},
                                         {name : 'activates',  value: 'association'},
                                         {name : 'inhibits', value: 'physical_interaction'},
                                          {name : 'beinguptaken',   value: 'predicted'},
                                          {name : 'activates',  value: 'activates'},
                                          {name : 'inhibits', value: 'pathway'}
                                    ]
                                }),
                                listeners: {
                                }
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
																	console.log(anode.getLabel()+"<===>"+anode.getId());
																	//node1=new precon.Node({"label":'""'+anode.getLabel()+'"', "_id":'"'+anode.getId()+'"'});
																}
																if (anode.getLabel().toLowerCase()==Ext.getCmp('linkname2_c').getValue().toLowerCase()) {
																	nodes.push(anode);
																	//node2=new precon.Node({"label":'""'+anode.getLabel()+'"', "_id":'"'+anode.getId()+'"'});
																}
															});
															//console.log(node1);
															//console.log(node2);
															if (nodes.length>=2) {
																var con = {nodes: [nodes[0], nodes[1]],type:Ext.getCmp('linktype_c').getValue()}
																graphModel.addConnection(con);
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
				}
				
				);
				
		//initialize the linkCreateWindow with selections
		var selections = graphModel.getSelections()
		var nodes = []
		selections.forEach(function(obj){
			if(obj instanceof precon.Node) 
				nodes.push(obj)
		})
		if(nodes.length>=2){
			Ext.getCmp("linkname1_c").setValue(nodes[0].getLabel());
			Ext.getCmp("linkname2_c").setValue(nodes[1].getLabel());
		}		
		else if(nodes.length>=1){
			Ext.getCmp("linkname1_c").setValue(nodes[0].getLabel());
		}		
				
		   linkCreateWindow.show();
}

function openCreateWindow() {
	
	if (typeof nodeCreateWindow=="undefined")

		nodeCreateWindow=Ext.create('Ext.window.Window', 
				{
				    bodyPadding: 5,
				    width: 350,
				    title: 'Entity Create',
				    id:'nodeCreateWindow',
				    autoHeight:true,
				    extentStore:null,
				    closeAction: 'hide',
				    items: [ 
				    	// defines the field set of street address locator
					       {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                id: 			'entitytype_c',
                                fieldLabel:     'Entity Type',
                                name:           'Type',
                                displayField:   'name',
                                value: 			'Gene',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                        {name : 'Gene',   value: 'gene'},
                                        {name : 'Link',  value: 'link'},
                                        {name : 'Disease', value: 'disease'}
                                    ]
                                }),
                                listeners: {
                                	change : {
                                		fn: function(f,v) {
                                			console.log("combo changed")
                                			console.log(f);
                                			console.log(v);
                                			if (v=='link') {
                                				if (typeof Ext.getCmp('entityname2_c') !="undefined" && typeof Ext.getCmp('entityname1_c') !="undefined") {
	                                				Ext.getCmp('entityname2_c').show();
	                                				Ext.getCmp('entitylink_c').show();
	                                				Ext.getCmp('entityname1_c').setFieldLabel("Source Node");
                                				}
                                			}
                                			else {
                                				if (typeof Ext.getCmp('entityname2_c') !="undefined" && typeof Ext.getCmp('entityname1_c') !="undefined") {
                                					Ext.getCmp('entityname2_c').hide();
                                					Ext.getCmp('entitylink_c').hide();
                                					Ext.getCmp('entityname1_c').setFieldLabel("Entity Name");
                                				}
                                			}
                                			
                                		}
                                	}
                                }
                           	 },
                           	 {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'remote',
                                triggerAction:  'all',
                                editable:       true,
                                id: 			'entityname1_c',
                                fieldLabel:     'Entity Name',
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
	                                    url: fakeReturn(),
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
                                hidden:			true,
                                id: 			'entityname2_c',
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
	                                    url: fakeReturn(),
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
                                hidden:			true,
                                editable:       false,
                                id: 			'entitylink_c',
                                fieldLabel:     'Link Type',
                                name:           'Type',
                                displayField:   'name',
                                value: 			'Gene',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                         {name : 'beinguptaken',   value: 'beinguptaken'},
                                         {name : 'activates',  value: 'activates'},
                                         {name : 'inhibits', value: 'inhibits'},
                                         {name : 'beinguptaken',   value: 'stimulats'},
                                         {name : 'activates',  value: 'association'},
                                         {name : 'inhibits', value: 'physical_interaction'},
                                          {name : 'beinguptaken',   value: 'predicted'},
                                          {name : 'activates',  value: 'activates'},
                                          {name : 'inhibits', value: 'pathway'}
                                    ]
                                }),
                                listeners: {
                                }
                           	 }
						],
						listens: {
							afterrender: {
								element:'',
								fn:function() {
									 $( "#searchtxt" ).autocomplete({
									      source: validateKeyword,
									      minLength:2,
									      select: function(event, ui) {
									    	  console.log("selected ", ui)
									    	  document.location='/graph/'+ ui.item._id	    	  
									      }	    	
									    });
								}
							}
						},
						buttons : 
						  			 [
										 {
											xtype : 'button',
											text : 'Create',
											handler : function() {
													if (Ext.getCmp('entitytype_c').getValue()=="link") {
														mygraph.addLink(Ext.getCmp('entityname1_c').getValue(),Ext.getCmp('entityname1_c').getValue(),Ext.getCmp('entitylink_c').getValue());
															// TBD: type, ref etc
															var node1=null,
																node2=null;
															nodearray.forEach(function(anode){
																if (anode.getLabel().toLowerCase()==Ext.getCmp('entityname1_c').getValue().toLowerCase()) node1=anode;
																if (anode.getLabel().toLowerCase()==Ext.getCmp('entityname2_c').getValue().toLowerCase()) node2=anode;
															});
															if (node1 & node2) {
																var con = {nodes: [node1, node2]}
																graphModel.addConnection(con);
															}
															else
																alert("Node cannot be found");	
													}
													
													if (Ext.getCmp('entitytype_c').getValue()=="gene") {
														graphModel.addNode( {_id:"Entity_"+Ext.getCmp('entityname1_c').getValue()+Math.random()*100, label: Ext.getCmp('entityname1_c').getValue() } );
													}	
												}
										}, {
											xtype : 'button',
											text : 'Cancel',
											handler : function() {
												nodeCreateWindow.hide();
											}
										}
									 ] 
				}
				
				);
		   nodeCreateWindow.show();
}


function openRemoveWindow() {
	
	if (typeof nodeRemoveWindow=="undefined")
		nodeRemoveWindow=Ext.create('Ext.window.Window', 
				{
				    bodyPadding: 5,
				    width: 350,
				    title: 'Entity Remove',
				    id:'nodeRemoveWindow',
				    autoHeight:true,
				    closeAction: 'hide',
				    extentStore:null,
				    items: [ 
				    	// defines the field set of street address locator
					       {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'local',
                                value:          'mrs',
                                triggerAction:  'all',
                                forceSelection: true,
                                editable:       false,
                                id: 			'entitytype_d',
                                fieldLabel:     'Entity Type',
                                name:           'Type',
                                displayField:   'name',
                                value: 			'gene',
                                valueField:     'value',
                                queryMode: 'local',
                                store:          Ext.create('Ext.data.Store', {
                                    fields : ['name', 'value'],
                                    data   : [
                                        {name : 'Gene',   value: 'gene'},
                                        {name : 'Link',  value: 'link'},
                                        {name : 'Disease', value: 'disease'}
                                    ]
                                }),
                                listeners: {
                                	change : {
                                		fn: function(f,v) {
                                		}
                                	}
                                }
                           	 },
                           	 {
                                //the width of this field in the HBox layout is set directly
                                //the other 2 items are given flex: 1, so will share the rest of the space
                                xtype:          'combo',
                                mode:           'remote',
                                triggerAction:  'all',
                                editable:       true,
                                id: 			'entityname1_d',
                                fieldLabel:     'Entity Name',
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
	                                    url: fakeReturn(),
		    							root: 'data'
	                                    /*
										data   : [
																					{name : 'Gene',   value: 'gene'},
																					{name : 'Link',  value: 'link'},
																					{name : 'Disease', value: 'disease'}
																				]*/
										
                                })
                           	 }
						],
						listens: {
							afterrender: {
								element:'',
								fn:function() {
									 $( "#searchtxt" ).autocomplete({
									      source: validateKeyword,
									      minLength:2,
									      select: function(event, ui) {
									    	  console.log("selected ", ui)
									    	  document.location='/graph/'+ ui.item._id	    	  
									      }	    	
									    });
								}
							}
						},
						buttons : 
						  			 [
										 {
											xtype : 'button',
											text : 'Remove',
											handler : function() {
													if (Ext.getCmp('entitytype_d').getValue()=="link") {
														graphModel.removeConnection(Ext.getCmp('entityname1_d').getValue());
													}
													
													if (Ext.getCmp('entitytype_d').getValue()=="gene") {
														graphModel.removeNode(Ext.getCmp('entityname1_d').getValue());
													}	
												}
										}, {
											xtype : 'button',
											text : 'Cancel',
											handler : function() {
												nodeRemoveWindow.hide();
											}
										}
									 ] 
				}
				
				);
		   nodeRemoveWindow.show();
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
            console.log("Contexted", target.__data__)
            contextMenu = createContextMenu(target.__data__)
            contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
		});
		mygraph.on("mouseover",function(evt, target){
            // alert('mouse over lines '+d.id);            
            
            //showTips(d3.event);
		});
		
		graphModel = new precon.NetworkGraph()
		mygraph.setModel(graphModel)
		
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
      
   