$(function() {
	if( $("#announcements").size() == 0 ){
		return;
	}

	$("#loading_announcements").show();
	
	var MAX_ENTRIES = 3;
	$.jGFeed('http://groups.google.com/group/genemania-announce/feed/rss_v2_0_msgs.xml',
		function(feeds){
			if(!feeds){ return false; }
			var length = Math.min(MAX_ENTRIES, feeds.entries.length);
			for(var i=0; i<length; i++){
				var entry = feeds.entries[i];
				var date = entry.publishedDate.substring(0, entry.publishedDate.lastIndexOf(" "));
				date = date.substring(0, date.lastIndexOf(" "));
				date = date.substring(date.indexOf(", ") + 2);
				$("#announcements").append('<h2>' + date + '</h2>');
				$("#announcements").append('<h3>' + entry.title + '</h3>');
				$("#announcements").append('<div class="entry">' + entry.content + ' </div>');
				$("#announcements").append('<p>(<a href="'+entry.link+'" target="_blank">more...</a>)<p>');
			}
			// Replace the '[link]' text by the actual URL:
			$("#announcements .entry a").each(function() {
				var txt = $(this).attr('href').replace('http://', '');
				$(this).html(txt);
			});
			
			$("#announcements").show();
			$("#loading_announcements").hide();
		},
	10);				
});
