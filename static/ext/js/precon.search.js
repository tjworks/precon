/******* Demonstration of precon.client *****************/
/**    
$(document).ready( function() {
    var path = document.location.pathname
    var precon_id = path.replace("/graph/", "")
    if(precon_id && precon_id.length>4){
    	precon.getObject(precon_id, function(obj){
    		// display the object meta info(dev purpose)
    		$("#section_east_1").html("Object: <pre>"+ precon.util.formatObject(obj)+"</pre>")
    		$("#graph-title").text(obj.name)
    	})
    	if(precon_id.indexOf('netw') == 0 || precon_id.indexOf('ntwk') == 0){
    		// display the network connection raw data(dev purpose)
        	precon.searchNetworks({network:precon_id}, function(obj){
                $("#section_east_2").html("Network Data: <pre>"+ precon.util.formatObject(obj)+"</pre>")
                $("#graph_pane").html("Network Data: <pre>"+ precon.util.formatObject(obj)+"</pre>")
            })
    	}
    	
    	
    }
    
    
    // list my networks
   
    precon.searchNetworks({owner:'precon'}, function(networks){
    	log.debug("Got precon's networks", networks)
    	
		    lists = "<UL>"
            for(var n in networks){
                network = networks[n]
                lists += '<li><input type=checkbox><a href="/graph/' + network._id  +'">'+  precon.util.truncate(network.name, 20)+'</a></li>'
            }
            lists+="</UL>"
            $("#mynetworks").html(lists)
            
            
    })
   
    
});

*/
/******* End of Demonstration code  *****************/
$(document).ready( function() {
	 log.info("jquery - DOMContentReady")
	 $( "#searchtxt" ).autocomplete({
	      source: validateKeyword,
	      minLength:2,
	      select: function(event, ui) {
	    	  log.debug("selected ", ui)
	    	  document.location='/graph/'+ ui.item._id	    	  
	      }	    	
	    });
	$("#searchbtn").click(doSearch)
	 
 });

function validateKeyword(req, callback){
	term = req.term
	log.debug("validating term")
	precon.quickSearch(term, function(results){
		log.debug("kw search results by "+term, results)
		callback(results)
	})		  
}
/**
 * Search for entity only
 * @param req
 * @param callback
 */
function validateEntity(req, callback){
	term = req.term
	log.debug("validating term")
	precon.quickSearch(term, function(results){
		log.debug("kw search results by "+term, results)
		callback(results)
	}, 'entity')		  
}

function doSearch(){
		var val = $("#searchtxt").attr("value")
		if(!val) return
		
		query = parseSearchToken(val)
		if(!query) return
		precon.searchNetworks(query, function(networks){
			log.debug(" search results", networks)
			lists = "<UL>"
	         for(var n in networks){
	             network = networks[n]
	             lists += '<li><input type=checkbox><a href="/graph/' + network.get('id')  +'">'+  precon.util.truncate(network.get('name'), 20)+'</a></li>'
	         }
	         lists+="</UL>"
	         $("#foundnetworks").html(lists)	
		});	
}
function parseSearchToken(token){		
	if(/^\d{7,}$/.test(token)) return {pubmed: token}
} 

function showObj(obj_id){
	precon.getObject(obj_id, function(obj){		
		$("#section_east_1").html("Object: <pre>"+ precon.util.formatObject(obj)+"</pre>")
	})	
}


function Timer(name){
	this.name = name || ''
	//if(this.name) console.debug("STARTING ["+ this.name+"]")
	this.start = new Date()
	this.elapsed = function(msg){		
		var e = (new Date().getTime() - this.start.getTime() ) /1000
		this.start = new Date()
		log.debug("ELAPSED  ["+ this.name+"]: "+ e +"s "+(msg||'') )
		return e
	}
	return this
}