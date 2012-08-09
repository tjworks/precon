function () {
    count=3
	db.connection.find().forEach( function(conn) {
		db.network.find({_id: conn.network}, {'refs':1}).forEach( function(network){
		     if(network.refs.pubmed){
			   conn.refs['pubmed'] = network.refs['pubmed']
			   db.connection.save(conn)
			  }
		});
		if(count-- ==0) return false             
    });
}