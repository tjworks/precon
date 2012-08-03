// generate_index
function(){
                
	chop = function(seq){
	    return seq.split(/[\s-\.$"'\(\)_]/)
	}          
	insertKeywords=function(keywords, obj){
	    for (var k in keywords) {
	           kwd = keywords[k]
	           if(!kwd) continue;
	           kwd = kwd.toLowerCase()                               
	           updates = {}
	           updates['names.'+ obj._id]  =  obj.name                               
	           db.indices.findAndModify({
	                 query: {_id: kwd},                                     
	                 update: {$set: updates, $addToSet:{ids :obj._id}},
	                 new: true,
	                 upsert:true
	            });                               
	       }    
	}      
	db.publication.find().forEach( function(obj){                           
	       var keywords = [];
	       keywords.push(obj.pubmed_id);
	       keywords = keywords.concat( chop(obj.name) );
	       keywords.push(obj.name)
	       insertKeywords(keywords,obj);                    
	});                    
	db.entity.find().forEach( function(obj){                           
	       var keywords = []
	       keywords.push(obj.symbol)
	       keywords = keywords.concat( chop(obj.name) )
	       keywords.push(obj.name)
	     
	       insertKeywords(keywords,obj);                    
	});
	
	db.network.find().forEach( function(obj){                           
	       if(!obj.name) return;
	       var keywords = chop(obj.name);
	       keywords.push(obj.name)                                                                                 
	       insertKeywords(keywords,obj);                    
	});
	db.people.find().forEach( function(obj){                           
	       var keywords = [obj.first, obj.last] ;                                                      
	       obj.name=obj.first +" "+ obj.last
	       keywords.push(obj.name)
	       insertKeywords(keywords,obj);                    
	});
                                                    
}