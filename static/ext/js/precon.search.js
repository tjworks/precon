 $(document).ready( function() {
	$("#searchbtn").click(function(){
		var val = $("#searchtxt").attr("value")
		if(!val) return
		if(/\d{7,}/.test(val)){
			// assuming pubmed id
			precon.getPublication(val, function(res){
				
			})
		}
	})
	 
 });