function () {
    // entities
	db.entity.find().forEach(function(en){		
		keywords = en.name.toLowerCase().split(/[ ,;'"]/)
		keywords.push(en.symbol)
		if(en.refs && en.refs.uniprotkb)
		   keywords.push(en.refs.uniprotkb.toLowerCase())
		var rec = {}
		rec.keywords= keywords
		rec._id = en._id
		rec.col='entity'
		db.alias.save(rec)
	});

	 
}