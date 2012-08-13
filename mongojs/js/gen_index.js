
function(cutoff){
	cutoff = cutoff || '2012-08-01 00:00:00'
	var query = {create_tm:{$gt:cutoff}}
    chop = function(seq){
        if(!seq) return seq
		return seq.split(/[\s-\.$"'\(\)_]/)
    }          
    insertKeywords=function(keywords, obj){
        for (var k in keywords) {
               kwd = keywords[k]
               if(!kwd) continue;
               kwd = kwd.toLowerCase()                               
               updates = {}
               updates['names.'+ obj._id]  =  obj.name                               
               db.indices.update(
                     {_id: kwd},                                     
                     {$set: updates, $addToSet:{ids :obj._id}},                     
                     true
                );                               
           }    
    }      
    count = 0
    
    db.publication.find(query).forEach( function(obj){                           
           var keywords = [];
           keywords.push(obj.pubmed_id);
           keywords = keywords.concat( chop(obj.name) );
           keywords.push(obj.name)
           obj.name=(obj.pubmed_id?obj.pubmed_id+", ": "")+ obj.name                           
           insertKeywords(keywords,obj);
           count++;
    });    
    log("Processed "+ count+ " publications")
    
    count=0
    db.entity.find(query).forEach( function(obj){                           
           var keywords = []
           keywords.push(obj.symbol)
           keywords = keywords.concat( chop(obj.name) )
           keywords.push(obj.name)
           if(obj.name)
               obj.name=(obj.symbol?obj.name+", ":'') + obj.name
           insertKeywords(keywords,obj);
           count++
    });
    log("Processing "+count+" entities")
    count=0
    db.network.find(query).forEach( function(obj){                           
           if(!obj.name) return;
           var keywords = chop(obj.name);
           keywords.push(obj.name)                                                                                 
           insertKeywords(keywords,obj);
           count++;
    });
    log("Processed network "+ count)
    count = 0
    db.people.find(query).forEach( function(obj){                           
           var keywords = [obj.first, obj.last] ;                                                      
           obj.name=obj.first +" "+ obj.last
           keywords.push(obj.name)
           insertKeywords(keywords,obj);
           count++;
    });
    log("Processed people "+ count)
}


// generate_index
gen_index_people = function(){
                
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
	
	db.people.find().forEach( function(obj){                           
	       var keywords = [obj.first, obj.last] ;                                                      
	       obj.name=obj.first +" "+ obj.last
	       keywords.push(obj.name)
	       insertKeywords(keywords,obj);                    
	});
                                                    
}
    