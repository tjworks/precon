(function(){

Ext.define('Precon.controller.LinkController', {
    extend: 'Precon.controller.BaseController',
    requires:['Precon.view.LinkUpdatePanel', 'Precon.view.ReferenceEditor'],
    init: function() {
     		 
     		this.control({
     				"#save-link-btn": {
     					click: function(btn){ 
     						       //console.log('clicked btn', arguments)     						 
			                 var formpanel  = btn.up('linkupdatepanel')
			                 
			                 formpanel.getForm().getFields().each(function(f){
			                	 var data = f.getModelData()
			                	 for(var i in data){
				                	 formpanel.bindObject.set(i, data[i])
				                 }
			                 })
     						       // update references
     						       var refstore = formpanel.down("refeditor").getStore();
     						       var pids = []
     						       refstore.each(function(rec){
     						         pids.push(rec.get("_id").substring(4))
     						       });
     						       formpanel.bindObject.set("refs", {pubmed: pids });
     						       
			                 formpanel.bindObject.save(function(data){
			                	 if(data && data.indexOf('conn') ==0){
			                	   //Ext.Msg.alert("INFO", "Successfully updated connection");
                           app.graphModel.trigger('change.connection', {connection:formpanel.bindObject} )
                           formpanel.up("window").hide();
                           formpanel.up("window").destroy();
			                	 }
			                	 else
			                		 Ext.Msg.alert("ERROR",data);
			                 })
     					}
     				},
     				'linkupdatepanel': {
     					afterrender: function(formpanel){     						
     					    var con = formpanel.bindObject
     					    if(!con) return
     					    formpanel.getForm().loadRecord({data: con.getRawdata()} )
     					    var label = '' ;
     					    _.each(con.getNodes(), function(node){
     					        label = label? label+", ":label;
     					        label += node.get("label")
     					    })
     					    formpanel.getForm().findField("linknodes").setValue(label);
     					    $("#add-ref-input-inputEl").val("");
     					    if(!precon.util.isMe( con.get('owner') )){
     					    	//Ext.getCmp("save-link-btn"). setDisabled(true)
     					    }
     					}
     				},
     				'refeditor':{
     				  click:function(){
     				    //console.log("click ", arguments)
     				  },
     				  itemclick:function(){
     				    //console.log("ref item click", arguments)
     				  }
     				  
     				}
     		});     	
    }, // end init
    // create and show the link update window
    show: function(con){
       //var getName=function(id) {precon.getObject(id,function(obj){obj.name})};
       // ref store
        var self = this;
        linkUpdatePanel = Ext.create('widget.linkupdatepanel',{data:con});
        tmpwin = Ext.create('Precon.view.Window', {
            items:[linkUpdatePanel],
            title:'Link Details',
            width:700
          });
        tmpwin.show();
        
        var conrefs = con.get('refs')
        conrefs = conrefs.pubmed? conrefs.pubmed : []
        conrefs = _.isArray(conrefs)? conrefs: [conrefs]
        var refstore = tmpwin.down("refeditor").getStore();
        refstore.removeAll();
        tmpstore = Ext.getCmp("refgrid").getStore();
        tmpstore.each(function(rec){
            var rid = rec.get('_id');
            rid = rid.indexOf('publ') == 0? rid.substring(4):rid
            if (_.indexOf(conrefs, rid) >=0){
              refstore.add(rec);
            }
        });
        
        form = tmpwin.down('linkupdatepanel').getForm()
    }      
	  ,showVoteWindow: function(con){
        var self = this;
        votewin = Ext.create('Precon.view.LinkVoteWindow',{data:con});
        votewin.show();
        
        self.updateVotes(votewin, con);
    }
    ,handleVote:function(btn){
        if(!window.user) return Ext.Msg.alert("ERROR", "Please login first")
        var win = Ext.getCmp("linkvotewin");
        console.log(btn)
        var self = this;
        var vote = {}
        vote.type = btn.data
        vote.comments = win.down("textarea").getValue();
        vote.user_id = user.user_id 
        vote.connection_id = win.data.get('_id')
        
        if(!vote.comments){
          Ext.Msg.alert("ERROR", "Please enter some notes");
          return
        }
        
       
        win.down("textarea").setValue("");
        precon.invoke('linkService.annotate', vote, function(data){
           if(data && data.error){
             Ext.Msg.alert("ERROR", data.error);
             return;
           }
           var votes = votewin.data.get('votes')  || []
            votes.push(vote);
            votewin.data.set('votes', votes);
            self.updateVotes(votewin)
           console.log("Added vote", data);
           
        });
        
        
        
    }
    ,updateVotes:function(votewin){
       votewin.remove(Ext.getCmp("votelist"));
       var votes = votewin.data.get('votes') || [];
       var reversed = [];
       for(var i=votes.length-1;i>=0; i--){
         reversed.push(votes[i]);
       }
       votewin.add( {
           xtype:'container',
           id:'votelist',
           data: reversed,
           tpl: new Ext.XTemplate(
            '<div class="precon-form">',
            '<tpl for=".">',
            '<div class="vote-summary vote-{type}">by <a href="#">{user_id}</a> <span class="date-time">{update_time}</span></div>',
            '<div class="vote-comments">{comments} </div>',
            '<hr/>',
            '</tpl>', 
           
            '</div>')
         });
       
         
    }      
});




})();


window.tests = window.tests ||{}
tests.addVote=function(){
     var d = new Date();
     var votereq = {
       connection_id: 'conn_intact_184907',
       user_id:'TJ',
       comments:'This is a comment at ' + d.getHours()+":" +d.getMinutes()+":"+ d.getSeconds(),
       type:'up',
       
     }
     
     precon.invoke('linkService.annotate', votereq, function(res){
       console.log("Vote result:", res)
     })
   } // end testAddVote 
 