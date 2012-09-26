
Ext.define('Precon.controller.GraphWin', {
    extend: 'Precon.controller.BaseController',
    stores:['Networks'],
    models:['Network'],
    views: [
        'NetworkGrid',
        'LinkUpdatePanel',
        'NodeCreatePanel',
        'ReferenceGrid',
        'SaveGraphWindow',
        'LinkCreateWindow',
        'GraphLegendWindow',
        'ObjectView',
        'ZoomSliderView'
    ],    
    requires:['Ext.ux.form.MultiSelect'],
    init: function() {
        log.debug('initializing graphwindow component');
        //initialized the graphModel
        _graphController=this;
        _graphModel = this.getGraphModel();
        this.control({              
            '#west': {
                afterrender:this.afterGraphWinRendered,
                resize: this.onGraphWinResize
            },            
          '#nodeCreateBtn': {
            click: this.nodeCreate
          },
          '#linkCreateBtn':{
            click: this.onLinkCreateBtn  
          },
          '#recSelectBtn' : {
            toggle: this.onRecSelect
          },
          '#saveGraphBtn': {
            click: this.saveGraph
          },
          '#removeNodeBtn':{
              click: function(){
                  this.openRemoveWindow()
              }
          },
          '#legendToggleBtn':{
              toggle: this.toggleLegend
          },
          '#zoomslider': {
              change: this.onZoom
          },
          '#togglestraightlink': {
              click: this.onToggle
          },
          '#togglearclink': {
              click: this.onToggle
          }
        });
   },  
   onToggle: function(btn) {
      if (btn.text.toLowerCase().indexOf("arc")>=0) {
      	mygraph.linklinetype="arc";
      	mygraph.setTreeType("dynamic");
      }
      else {
      	mygraph.linklinetype="straight";
      	mygraph.setTreeType("dynamic");
      }
      mygraph.redraw();
   },
   onZoom: function(s,v,t) {
     // if(v+1<8)
          mygraph.zoom(v/10)
        //console.log(s+"---"+v+"---"+t);
   },
   onRecSelect: function(btn,pressed) {
       var me=this;
        log.debug('rectangle selction is '+pressed);
        if (pressed) {
            mygraph.setRectSelectMode(true);
            Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'crosshair'});
            mygraph.on("dragstart", function(evt, target){me.recSelect('dragstart')});
            mygraph.on("drag", function(evt, target){me.recSelect('drag')});
            mygraph.on("dragend", function(evt, target){me.recSelect('dragend')});  
        }
        else {
            mygraph.setRectSelectMode(false);
            Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'default'});
        }
   },
   recSelect: function (flag) {   
        if (flag=='dragstart') {
            //visg.on('mouseup',function(){_graphController.recSelect('up')}).on('mousemove',function(){_graphController.recSelect('move')});
            if (d3.selectAll('#selectRect')[0].length==0 && d3.event) {
                selectRectangle=visg.append('svg:rect')
                                    .attr('id','selectRect');
            }
            _graphController.rectSelectX0=d3.event.sourceEvent.layerX-0;
            _graphController.rectSelectY0=d3.event.sourceEvent.layerY-0;
            d3.select('#selectRect')    
                .attr('x',d3.event.sourceEvent.layerX)
                .attr('y',d3.event.sourceEvent.layerY)
                .attr('width',2)
                .attr('height',2)
                .attr('fill','none')
                .attr('stroke','red')
                .attr('stroke-width',2)
                .attr('stroke-dasharray','2 2 2 2');
        }
            
        if (flag=='drag') {
            if (d3.event) {
                var flagx=d3.event.x-_graphController.rectSelectX0;
                var flagy=d3.event.y-_graphController.rectSelectY0;
                if (flagx<0 && flagy<0)
                    d3.select('#selectRect')
                                     .attr('x',d3.event.x)
                                     .attr('y',d3.event.y)
                                     .attr('width',Math.abs(d3.event.x-_graphController.rectSelectX0))
                                     .attr('height',Math.abs(d3.event.y-_graphController.rectSelectY0));
               
                else if (flagx>=0 && flagy<0)
                    d3.select('#selectRect')
                                     .attr('y',d3.event.y)
                                     .attr('width',Math.abs(d3.event.x-_graphController.rectSelectX0))
                                     .attr('height',Math.abs(d3.event.y-_graphController.rectSelectY0));
                else if (flagx<0 && flagy>=0)
                    d3.select('#selectRect')
                                     .attr('x',d3.event.x)
                                     .attr('width',Math.abs(d3.event.x-_graphController.rectSelectX0))
                                     .attr('height',Math.abs(d3.event.y-_graphController.rectSelectY0));

                else {
                    // console.log(_graphController.rectSelectX0+"---"+_graphController.rectSelectX0+"----"+d3.event.x+"----"+d3.event.x);
                     d3.select('#selectRect')
                                     .attr('x',_graphController.rectSelectX0)
                                     .attr('y',_graphController.rectSelectY0)
                                     .attr('width',Math.abs(d3.event.x-_graphController.rectSelectX0))
                                     .attr('height',Math.abs(d3.event.y-_graphController.rectSelectY0));
                        //          .attr('width',200)
                        //          .attr('height',200);
                    }
            }
        }
        
        if (flag=='dragend') {
            var x0=d3.select("#selectRect").attr("x");
            var y0=d3.select("#selectRect").attr("y");
            var x1=1*x0+1*d3.select("#selectRect").attr("width");
            var y1=1*y0+1*d3.select("#selectRect").attr("height");
            mygraph.selectWithinRect(x0,y0,x1,y1);
            d3.selectAll('#selectRect').remove();
        }
   },
   
   nodeCreate: function(nodeData) {
        if (typeof nodeCreateWindow=='undefined'){              
            window.nodeCreateWindow =  this.getView('NodeCreatePanel').create()
            nodeCreateWindow.show();
            $( "#entityname-inputEl" ).autocomplete({
              source: validateEntity,
              minLength:2,
              select: function(event, ui) {
                  log.debug("selected entity", ui)
                  $( "#entityname-inputEl" ).attr("entityName", ui.item._id)
                  $( "#entityname-inputEl" ).attr("entityId", ui.item._id)                                       
                  //precon.searchNetworks(ui.item._id, function(networks){ loadNetworks(networks, false)})
              }, 
              search:function(){
                  $( "#entityname-inputEl" ).attr("entityName", '')
                  $( "#entityname-inputEl" ).attr("entityId", '')
              }
            });
        }
        nodeCreateWindow.show();    
        if(nodeData && nodeData.label)
            $( "#entityname-inputEl" ).attr("value",nodeData.label).keydown()       
   },
   onLinkCreateBtn: function(){
        //initialize the linkCreateWindow with selections
        var selections = this.getGraphModel().getSelections("node")
        var nodes = []
        selections.forEach(function(obj){
            if(obj instanceof precon.Node) 
                nodes.push(obj)
        })
        if(nodes.length<2){
            alert("Please select two nodes first")
            return;
        }
        
        var con = this.getGraphModel().connectNodes(nodes[0], nodes[1], 'association')
        this.showObject(con)
        /**window.linkCreateWindow = window.linkCreateWindow || this.getView('LinkCreateWindow').create()
        
        if(nodes.length>=2){
            Ext.getCmp("linkname1_c").setValue(nodes[0].get('label'));
            Ext.getCmp("linkname2_c").setValue(nodes[1].get('label'));
        }                       
        linkCreateWindow.show();
        */  
   },
      
    //
    onNetworkGridRefresh: function() {
        
    },
    
    // get the object id from the URL, if it's available
    getObjectIdFromUrl: function(){
        var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
        if(matcher) return matcher[1]
        return ''
    },  
    showMainObject:function (objid){    
        objid = objid || this.getObjectIdFromUrl()
        if(!objid) return
        var self = this
        precon.getObject(objid, function(obj){
            var html = self.renderObject(obj)
            var title =  obj.name || obj.title || obj.label
            Ext.getCmp("west").setTitle( precon.getObjectType(objid) + ": "+  title)
            title = precon.util.shortTitle(title)
            var tab = Ext.getCmp("infopanel").add({
                title:'Summary',
                items:[html],
                autoScroll:true,
                closable:true
            })
            Ext.getCmp("infopanel").setActiveTab(tab)                       
        });             
    },
    
    addNodeFromAbstract:function(em){
        var label = $(em).text() 
        var group = $(em).attr("group") 
        this.nodeCreate( {label:label, group:group}  )
        
        //label.replace(/[()\s]/g, '')
        //graphModel.addNode( {_id:id, label: label } )
    },
    
    renderObject:function(obj){
        var objType = precon.getObjectType( getId(obj) )
        var v = this.getView(objType.substring(0,1).toUpperCase()+ objType.substring(1) +'View').create({object:obj})
        log.debug("View is ", v)
        return v;       
    },
  
   onGraphWinResize: function() {
       log.debug("resized")
        //put here all codes related with graph window resize related
       this.createGraph()
   },
   
   afterGraphWinRendered: function() {
        //put here all codes related after render event of graph window
        log.debug("graph window is available now");         
        //start to draw the graph
        //setTimeout(function() {_graphController.createGraph()},300);          
        //Toggle the legend button
        //Ext.getCmp("legendToggleBtn").toggle();
   },
   onLaunch: function(){
       log.info("GraphWin.Onlaunch")       
       this.createGraph()
       this.showMainObject()       
       $(document)        
            .ajaxStart(function() {
                log.debug("show")
                Ext.getCmp("spinner-img").show();
                Ext.getCmp("spinner-label").show();
            })
            .ajaxStop(function() {
                log.debug("hide")
                Ext.getCmp("spinner-img").hide();
                Ext.getCmp("spinner-label").hide();
       });
       Ext.getCmp("spinner-img").hide();
       Ext.getCmp("spinner-label").hide();

       // bind graph events 
       var self = this
       $(document).on("mined-entity-clicked", function(evt, em){
           log.debug("mined click", arguments)
           self.addNodeFromAbstract(em)
       })
       
       var self = this
       this.getGraphModel().on('change.graphnetwork', function(){
           console.log("graph changed")
           var t =  'Network: ' + self.getGraphModel().getGraphNetwork().get('name')
           Ext.getCmp("west").setTitle(t)
           try{
               history.pushState({}, t, "/graph/"+self.getGraphModel().getGraphNetwork().get("_id") );
           }
           catch(err){
               log.debug("Unsupported operation: "+ err)
           }
       })
       
       this.getGraphModel().on('add.connection', this.onGraphChange ).on('add.node', this.onGraphChange).on('remove.connection', this.onGraphChange).on('remove.node',this.onGraphChange)
   },
   onGraphChange: function(){
      // update footer_summary
      var html = "Links: " + app.graphModel.getConnections().length + "  Nodes: "+ app.graphModel.getNodes().length
      Ext.getCmp("footer_summary").setText(html);
   },
   createGraph: function() {
        //log.debug("Recreating graph")
        //
        //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
        log.debug("Creating graph")    
        //Ext.select("svg").remove();
        //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
        var self = this
        if(!window.mygraph){
            log.debug("Creating graph ", Ext.get("west-body").getWidth(true), Ext.get("west-body").getHeight(true))    
            mygraph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
            mygraph.on("click", function(evt, target){
                //log.debug("dblclick", evt, target.__data__)
                window.contextMenu && contextMenu.hide()
            });     
            mygraph.on("dblclick", function(evt, target){
                log.debug("dblclick!", evt, target.__data__)
                //showObject(target.__data__)
                if(target.__data__ && target.__data__.get('entity'))
                       precon.searchNetworks( target.__data__.get('entity'), function(nets){ 
                           var netController = self.getController('NetworkGridController')
                           netController.loadNetworks(nets, true, false) 
                           })
                if(target.__data__ instanceof precon.Connection) self.showObject(target.__data__)
                
            });     
            mygraph.on("contextmenu",function(evt, target){
                d3.event.preventDefault();
                log.debug("Contexted", target.__data__)
                contextMenu = self.createContextMenu(target.__data__)
                contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
            });         
            //_graphModel = new precon.NetworkGraph()
            mygraph.setModel(this.getGraphModel())          
        }
        else{
            log.debug("Redraw graph")    
            // redraw
            //Ext.select("svg").remove();
            mygraph.resize(Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true))
        }
        this.toggleFullscreenMode()
   },
   toggleFullscreenMode:function(){    
        var viewport = Ext.getCmp('viewport')
        if(!viewport) return
        if(screen.height === window.outerHeight){
            log.debug("Switch to fullscreen mode")
            // full screen mode         
            viewport.getLayout().padding = '0 0 0 0'
            viewport.doLayout()         
            Ext.getCmp("west").setWidth(Ext.getBody().getSize().width )     
            
            $("#myheader").hide()
            viewport.fullscreen = true
        }
        else{
            if(viewport.fullscreen){
                viewport.fullscreen = false
                log.debug("quit fullscreen mode")           
                viewport.getLayout().padding = '52 0 0 0'
                viewport.doLayout()
                Ext.getCmp("west").setWidth(Ext.getBody().getSize().width *0.6)
                $("#myheader").show()
            }       
        }
    }, // end toggleFullscreen

    createContextMenu:function(obj) {
        contxted = obj
        var self = this
        var items= []
        var label = 'Link'
        if(obj && obj.getClass && obj.getClass() == 'node'){    
            if(obj.get("entity")){
                if(app.graphModel.getSelections('node').length == 2){
                    items.push({
                        text: 'Link Selected Nodes',
                        handler:function() {
                            self.onLinkCreateBtn()                        
                        }                       
                    });
                }               
                items.push({
                            text: 'Expand',
                            handler:function() {
                              log.debug("Centered on", obj)
                              if(obj.get('entity'))
                                  precon.searchNetworks( obj.get('entity'), function(nets){ app.getController('NetworkGridController').loadNetworks(nets, true, true) })
                            }, 
                            iconCls:'update'
                        });
            }
            label = 'Node '
        };
            
        if(obj){
            items.push(                
                      {
                          text: 'View/Edit '+ label,
                          handler:function(menuItem,menu) {
                            self.showObject(obj)
                          }, 
                          iconCls:'update'
                      },
                      {
                          text: 'Remove '+ label+": " + (obj.get('label') || ''),
                          handler:function(menuItem,menu) {  self.openRemoveWindow(obj) }, 
                          iconCls:'remove'
                      })
        }
        items.push(                              
                  
                  {
                      text: 'Create Node',
                      handler:function(menuItem,menu) { self.nodeCreate() }, 
                      iconCls:'create'
                  },
                  {
                      text: 'Clear Cached Data',
                      handler:function(menuItem,menu) { $.jStorage.flush(); alert("Done!"); window.contextMenu && window.contextMenu.hide()}, 
                      iconCls:'create'
                  }
                  
             );    

        contextMenu = new Ext.menu.Menu({items:items});
        return contextMenu
       
    }, // end createContext
    openRemoveWindow: function(selected){
        log.debug("remove node", selected)
        var sel = []
        var graphModel = this.getGraphModel()
        if(selected) sel = [selected]       
        else sel = graphModel.getSelections()   
        if(sel.length == 0){
            alert("Please select node or link you wish to remove first")
            return
        }
        sel.forEach(function(item){
            if(item._class == 'connection')
                graphModel.removeConnection(item)       
        })  
        sel.forEach(function(item){
            if(item._class == 'node')
                graphModel.removeNode(item, null, true)     
        })
        graphModel.clearSelection()

    },
    saveGraph: function(){
        var self = this
        var f = function(){
            log.debug("Continue saveGraph")
            self.saveGraph()
        }
            
        if(!window.user || !window.user.user_id){
            $(document).one(precon.event.UserLogin, f)
            $('a.login-window').click()
            return;
        }
        
        log.debug("Doing saving")
        var graphModel = this.getGraphModel()
        
        var gNetwork = graphModel.getGraphNetwork() 
        if(!gNetwork || gNetwork.get('owner') != window.user.user_id ){
            gNetwork = gNetwork? _.clone(gNetwork): new precon.Network()
            gNetwork.set('id', precon.randomId('network'))
            gNetwork.set('name','' )
            gNetwork.set('owner', window.user.user_id)
            graphModel.setGraphNetwork(gNetwork)
        }
        
        window.saveGraphWindow = window.saveGraphWindow || this.getView('SaveGraphWindow').create()
        
        if(! Ext.getCmp("graphname").getValue()) Ext.getCmp("graphname").setValue(gNetwork.get("name"))
        
        saveGraphWindow.show()  
    } // end saveGraph
    ,
    // export graph to PNG or PDF
    exportGraph: function(format){
        var src = $("svg").parent().html();
        if(!src)
            return app.ui.alert("Graph is empty");                  
        src = src.substring( src.indexOf("<svg"), src.indexOf("</svg>"));
        src+="</svg>"
            
        msgbox = Ext.Msg.wait('', 'Converting graph...', {interval:100,increments:1});
        var filename = Ext.getCmp("west").title || "network"
        filename = filename.replace(/\W/g, '-')
        filename += "." + format.substr(-3)
        var data = {"svg": src, "format":format}        
        $.fileDownload('/api/export/'+ filename, {
            data:data,
            httpMethod:'POST',
            successCallback: function (url) {
                msgbox.hide()               
            },
            failCallback: function (html, url) {
                msgbox.hide()
                Ext.Msg.alert('Error', html)                
            }
        });
            
    }
    ,
    showObject: function(ob){
        var self = this
        if('getRawdata' in ob) obj = ob.getRawdata()
        
        
        var tab =  Ext.getCmp("infopanel").getComponent(obj._id)
        if(!tab){           
            var title =  obj.name || obj.title || obj.label
            var title = precon.util.shortTitle(title)
            //process the node rendering
            if (ob.getClass && ob.getClass()=="node") {
                
                tab = Ext.getCmp("infopanel").add(
                    {
                         xtype:'nodeupdatepanel',
                         node: obj,
                         title: title,
                         autoScroll:true,
                         id:obj._id,
                         data:ob
                    }
                    /*
                    {
                                            title:title,
                                            layout:'fit',
                                            id:obj._id,
                                            closable:true,
                                            defaults: {
                                                anchor: '100%',
                                                bodyPadding:20
                                               },
                                            items:[{xtype:'nodeupdatepanel'}],
                                            fbar: [
                                                  {
                                                      text: 'Update Node',
                                                      handler: function () {
                                                            alert("peng peng");
                                                          var tabs = this.up('tabpanel');
                                                      }
                                                  }
                                              ]
                                        }*/
                    
                );
            }
            else if (ob.getClass && ob.getClass()=="connection") {
                   app.getController('LinkController').show(ob);
                    
            } else
            {
                tab = Ext.getCmp("infopanel").add({
                    title:title,
                    items: [self.renderObject(obj)],
                    id:obj._id,
                    autoScroll:true,
                    closable:true
                })
            }
        }
        Ext.getCmp("infopanel").setActiveTab(tab)
    },
    /*
     * Toggle the show/hide of legend window. If legend window is not created, it will create it first
     * 
     */
    toggleLegend:function(item,pressed) {
        if (!window.legendWindow)
            legendWindow= this.getView('GraphLegendWindow').create({ x:2,
                                                                     y:Ext.getCmp("legendToggleBtn").getEl().getXY()[1]-260,}       )
        if (pressed) {
            legendWindow.show();
            item.setText("Hide Legend");
        }
        else {
            legendWindow.hide();
            item.setText("Show Legend");
        } 
    }  // end of toggleLegend
});
