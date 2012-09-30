
Ext.define('Precon.view.LinkVoteWindow', {
  extend:'Precon.view.Window',    
  alias:'linkvotewindow',
  width:500,
  title: "Vote Link",
  id:'linkvotewin',
  initComponent:function(){
    // data is link
    if(!(this.data instanceof precon.Connection) ) throw "data property does not exist, it should be a valid precon.Connection object"
    
    var dat =  $.extend({}, this.data.getRawdata());
    dat.node1 = this.data.getNodes()[0].get('label')
    dat.node2 = this.data.getNodes()[1].get('label')
    dat.upcounts=1
    dat.downcounts = 1;
    //var svg = $.clone( $( "path#"+ this.data.get("_id") ));
    dat.votes = [
       {
         user_id:'TJ',
         type:'up',
         update_time:'2012-09-30 15:00:30',
         comments:'This finding also is evidential in my paper Gluclose and Metformine blah'
       },
       {
         user_id:'Joe',
         type:'down',
         update_time:'2012-09-21 12:00:30',
         comments:'I attest this link does not exist!'
       }
    ]
    this.items= [
        ,{
         xtype:'container',
         data:dat,
         tpl: new Ext.XTemplate(
          '<div class="precon-form">',
          '<div class="title link-desc"><span class="bio-term">{node1}</span> {type} <span class="bio-term">{node2}</span></div>',
          '<div class="link-figure"></div>',
          '<div>This link has received {upcounts} positive votes and {downcounts} negative votes.</div>',
          '<div>To cast your vote, enter your comment below(optional) and press one of the buttons. </div>',
          '</div>'),
       }
       ,{
        xtype:'textarea',
        height:100,
        width:450,
        grow:true,
        placeHolder:'Enter your comment here(optional) and press button below'
        
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
                   handler: function(){ app.getController('LinkController').handleVote(this); }
                 }
                 ,{xtype:'container', witdh:5,html:'&nbsp;'}
                 ,{
                 xtype:'button',
                 text:'Vote Down',
                 icon:'/ext/resources/images/thumb-downx32.png',
                 scale:'large',
                 handler: function(){ app.getController('LinkController').handleVote(this); }
               }
            ] // end items
      } // end container
       
       ,{
         xtype:'container',
         data:dat,
         tpl: new Ext.XTemplate(
          '<div class="precon-form">',
          '<tpl for="votes">',
          '<div class="vote-summary vote-{type}">by <a href="#">{user_id}</a> <span class="date-time">{update_time}</span></div>',
          '<div class="vote-comments">{comments} </div>',
          '<hr/>',
          '</tpl>', 
         
          '</div>'),
       }
         
      
      ]
    
    this.callParent();
  }// end initComponent
  
  
  
});