/******* Demonstration of precon.client *****************/
    
$(document).ready( function() {
    var path = document.location.pathname
    var precon_id = path.replace("/graph/", "")
    if(precon_id){
    	precon.getObject(precon_id, function(obj){
    		// display the object meta info(dev purpose)
    		$("#section_east_1").html("Object: <pre>"+ precon.util.formatObject(obj)+"</pre>")
    		$("#graph-title").text(obj.name)
    	})
    	if(precon_id.indexOf('netw') == 0 || precon_id.indexOf('ntwk') == 0){
    		// display the network connection raw data(dev purpose)
        	precon.getNetworkConnections(precon_id, function(obj){
                $("#section_east_2").html("Network Connections: <pre>"+ precon.util.formatObject(obj)+"</pre>")
                $("#graph_pane").html("Network Connections: <pre>"+ precon.util.formatObject(obj)+"</pre>")
            })
    	}
    }
    
    
    // list my networks
    precon.searchNetworks({owner:'precon'}, function(networks){
    	console.log("Got precon's networks", networks)
    	
		    lists = "<UL>"
            for(var n in networks){
                network = networks[n]
                lists += '<li><input type=checkbox><a href="/graph/' + network._id  +'">'+  precon.util.truncate(network.name, 20)+'</a></li>'
            }
            lists+="</UL>"
            $("#mynetworks").html(lists)	
    })
    
    
});


/******* End of Demonstration code  *****************/



$(document).ready( function() {
	
	 $( "#searchtxt" ).autocomplete({
	      source: validateKeyword(),
	      minLength:2
	    });
	$("#searchbtn").click(doSearch)
	 
 });

pubmedids ='19465464,18945920,17476361,8165821,11602624,11602624,19245656,11602624,11602624,11602624,19245656,16732470,20600832, 20577046,15358229,15358229,18006825,17062558,15849206,20407744,19918015,19564453,19653109,19375425,20299480,20442309,19679549,19752085,17638885,18212742,16125352,18387000,20053525,18358555,12384179,21263130,21060860,20872241,20453838,19330030,17529967,17529973,22129971,22451849'.split(',')    
nodes = "blood glucose concentration,Organic cation transporter 1 (OCT1),AMPK,glucose synthesis,lipid synthesis,protein synthesis,fatty acid oxidation,glucose uptake,respiratory-chain complex 1,fructose-1,6-bisphosphatase,fatty acid synthase,acetyl CoA carboxylase(ACC),mTORC1,TSC2,cancer risk,prostate cancer risk,pancreatic cancer risk,breast cancer,cancer (cell lines),cancer (animal models),type 2 diabete,angiogenesis,Metformin (1,1-dimethylbiguanide),AMPK".split(",")

function validateKeyword(){
	return pubmedids.concat(nodes)
}
function doSearch(){
		var val = $("#searchtxt").attr("value")
		if(!val) return
		
		query = parseSearchToken(val)
		if(!query) return
		precon.searchNetworks(query, function(networks){
			console.log(" search results", networks)
			lists = "<UL>"
	         for(var n in networks){
	             network = networks[n]
	             lists += '<li><input type=checkbox><a href="/graph/' + network._id  +'">'+  precon.util.truncate(network.name, 20)+'</a></li>'
	         }
	         lists+="</UL>"
	         $("#foundnetworks").html(lists)	
		});	
}
function parseSearchToken(token){	
	
	if(/^\d{7,}$/.test(token)) return {pubmed: token}
	
	
} 