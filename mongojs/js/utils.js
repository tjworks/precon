function(){};

log=function (msg, tag) { 
	format = function(digit){  return digit>9? digit: '0'+digit }      
	var d = new Date()
    time = d.getFullYear() + '-' + format(d.getMonth()+1) +'-'+ format(d.getDate()) + ' '+ format(d.getHours())+":"+ format(d.getMinutes())+":" + format(d.getSeconds())+"."+ padnumber(d.getMilliseconds(),3)	
	print( time+": "+ msg)
	tag = tag || ''
	var log={msg: msg, tm:time, tag:tag}
	//db.logs.save(log)

	/**
	 * 
	 * var obj = {}
	obj.msg = msg
	obj.time = time
	obj.tag = tag
	db.logs.save(obj)
	 */              
};

Stamper = function (){
	this.start = new Date()
	this.elapsed = function(){
		var now = new Date()
		return Math.round( (now.getTime() - this.start.getTime())/1000 ) 
	}
}


padnumber=function (num, digits) { 
	   digits = digits || 3
	   if (digits == 2)
		   return num>9? num: '0'+num 
	   if (digits == 3)
		   return num>99? num: (num>9?'0'+num:'00'+num)
	}

reload = function(){
	print("Reloading JS functions")
	db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});
}

movemr = function(){
	// move mr data to test db
	var collections = ['local.mrstats', 'local.mrplaytime']
	collections.forEach(function(col){
		print("Copying "+col );
		db.runCommand( { cloneCollection: col, from: '198.101.216.116', copyIndexes:true } );
	})
	print("Done!")	
}

mr = function(spec, overrides){
	reload()
	for(var p in overrides){
		spec[p] = overrides[p]
	}	
	var mrcontext = {count:1}
	spec.scope = {log:log, Stamper:Stamper, padnumber:padnumber,reload:reload, context:mrcontext}
	//spec.scope.mrcontext = mrcontext
	var st = new Stamper()
	print("Running mapreduce: "+ spec)
	db.runCommand(spec)
	print("############ Processed records: "+ spec.scope.context.count+" Time used: " +st.elapsed()+" seconds #########")
	print("Context: "+ mrcontext)
	
	/**
	db.runCommand(
			 { mapreduce : <collection>,
			   map : <mapfunction>,
			   reduce : <reducefunction>,
			   out : <see output options below>
			   [, query : <query filter object>]
			   [, sort : <sorts the input objects using this key. Useful for optimization, like sorting by the emit key for fewer reduces>]
			   [, limit : <number of objects to return from collection, not supported with sharding>]
			   [, keeptemp: <true|false>]
			   [, finalize : <finalizefunction>]
			   [, scope : <object where fields go into javascript global scope >]
			   [, jsMode : true]
			   [, verbose : true]
			 }
	*/
}
getCutoffTime = function(days){
	days = days || 1
	now = new Date().getTime()
	now = Math.round( now / 1000 )
    cutoff = now - (now % 24*60*60) - 24*60*60* days    
    return cutoff
}



add_label = function(){
	db.node.find({label:{$exists:false}}).forEach(function(obj){
		var en = db.entity.findOne({_id: obj.entity}, {symbol:1})
		var label = en.symbol
		db.node.update({_id: obj._id}, {$set:{label:label}})		
	})
}