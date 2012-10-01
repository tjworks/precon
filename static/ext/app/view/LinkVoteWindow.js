
Ext.define('Precon.view.LinkVoteWindow', {
  extend:'Precon.view.Window',    
  alias:'linkvotewindow',
  width:500,
  title: "Link Annotations",
  id:'linkvotewin',
  autoScroll:true,
  initComponent:function(){
    // data is link
    if(!(this.data instanceof precon.Connection) ) throw "data property does not exist, it should be a valid precon.Connection object"
    
    var dat =  $.extend({}, this.data.getRawdata());
    dat.node1 = this.data.getNodes()[0].get('label')
    dat.node2 = this.data.getNodes()[1].get('label')
    var votes = this.data.get("votes") || [];
    
    dat.upcounts= 0 
    dat.downcounts = 0;
    _.each(votes, function(vote){
        if(vote && vote.type == 'up')
          dat.upcounts++
        else if(vote && vote.type == 'down')
          dat.downcounts++;
    });
    
    this.items= [
        ,{
         xtype:'container',
         data:dat,
         tpl: new Ext.XTemplate(
          '<div class="precon-form">',
          '<div class="title link-desc"><span class="bio-term">{node1}</span> {type} <span class="bio-term">{node2}</span></div>',
          '<div class="link-figure"></div>',
          '<div>This link has received {upcounts} positive votes and {downcounts} negative votes. </div>',
          '<div>To cast your vote, enter your comment and press one of the buttons. </div>',
          '</div>'),
       }
       ,{
        xtype:'textarea',
        height:100,
        width:450,
        grow:true,
       
        placeHolder:'Enter your comment and press button below'
        
        // '<div class="vote-annotation"><textarea style="height:100px;width:450px" placeholder="Enter notes here(optional)"></textarea></div>',
       }
       ,{
          xtype:'container',
          layout:'hbox'
         , items: [ {
                   xtype:'button',
                   text:'Vote Up',
                   icon:'/ext/resources/images/thumb-upx32.png',
                   scale:'large',
                   handler: function(){ app.getController('LinkController').handleVote(this); },
                   data:'up'
                 }
                 ,{xtype:'container', witdh:5,html:'&nbsp;'}
                 ,{
                 xtype:'button',
                 text:'Vote Down',
                 icon:'/ext/resources/images/thumb-downx32.png',
                 scale:'large',
                 handler: function(){ app.getController('LinkController').handleVote(this); },
                 data:'down'
               }
                ,{xtype:'container', witdh:5,html:'&nbsp;'}
                 ,{
                 xtype:'button',
                 text:'Comment Only',
                 icon:'/ext/resources/images/writex32.png',
                 scale:'large',
                 handler: function(){ app.getController('LinkController').handleVote(this); },
                 data:'comment'
               }
            ] // end items
      } // end container
       
     
         
      
      ]
    
    this.callParent();
  }// end initComponent
  
  
  
});