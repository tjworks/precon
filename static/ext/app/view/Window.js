Ext.define('Precon.view.Window', {
	extend:'Ext.window.Window',
	bodyPadding: 15,
  width: 800,
  height: 600,
  frame:false,
  border: false,
  modal       : true,
  bodyBorder:false,
  bodyStyle: {
    background:'transparent'
  }
});


Ext.define('Precon.view.BlankWindow', {
	extend:'Precon.view.Window',
	bodyPadding: 15,  
	  frame:false,
	  border: false,
	  modal       : true,
	  bodyBorder:false,
	  bodyStyle: {
	    background:'transparent'
	  },
	  contentTpl:"",
	  constructor: function(config){
			log.debug("config is! ", config)			
			var obj = config.object
			if(obj.getRawdata) obj = obj.getRawdata()			
			obj.processed_abstract = precon.util.processAbstract(obj)	
			
			var authors = ''
			if(obj.authors){
				obj.authors.forEach(function(author){
					if(authors) authors+=", ";
					authors += (author.first?author.first.substring(0,1):'') +" "+ author.last
				});			
			}
			obj.author_list = authors
			
			return this.callParent(arguments);
	}
});




Ext.define('Precon.view.LinkVoteWindow', {
	extend:'Precon.view.Window',		
	width:500,
	height:300,
	title: "Vote Link",
	tpl: new Ext.XTemplate(
			'<div class="precon-window vote-window">',
			'<div class="title">{label}</div>',
			'<div class="title">Vote link {label}</div>',
			'<div class="link-figure"></div>',
			'<div class="thumbs"><img src="/ext/resources/images/thumb-up.png"><img src="/ext/resources/images/thumb-down.png"></div>',
			'<div class="vote-annotation"><textarea></textarea></div>',					
			'</div>'),
	data: {
		label:"yeah"
	}
	
});


reload=function(){
	$.getScript('/ext/app/view/Window.js')
	w && w.hide()
	w = app.getView('Precon.view.LinkVoteWindow').create().show()	
}