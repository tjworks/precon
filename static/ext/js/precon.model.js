		 		
		/**
		 * Precon Bio models
		 * Note, all the ids  are guaranteed unique in whole precon database, we call it precon id
		 */ 
		Network = {
			_id:'', // 
			name: '', // arbitrary network title
			author_id:'', // author 
			nodes:[],  // list of logical node  ids,
			entities:[], // physcial entity ids
			connections:[], // list of connection objects 		
		}
		
		Revision = {
			_id:'', // precon ID
			ver: 1, 
			tstamp: '20120918.120001.394', // timestamp
			// TBD
		}
		
		// Node usually wraps a physical entity and provide addition network specific information
		Node = {
			_id: '', // preocn id
			object_id:'', // the actual object's precon id
			group:'', 
			type:'',
			comment:'', // commend about the node
			refs:[], // list of references
			role:[], // list of roles this node participates in the network	
		}
		
		Connection = {
			_id:'',
			network_id:'', // the network this connection belongs to, can be NULL, index
			source:'',  // node id
			target:'', // node id
			source_obj_id: '', //source object id, index
			target_obj_id: '', //source object id, index
			interaction: 1, // interaction type,  1: physical association 2: 
			weight: 1,  // float, 0-1
			refs:[], // list of references	
			votes:[], // list of people id who voted this connection
		}
		
		People = {
			_id:'',
			first:'',
			last:'',
			name:''
			,user_id:'' // precon user id, if registered	
			,publications:[] // list of publication ids this person published/authored	
		}
		Circle = {
			_id:'',
			name:'',
			owner:'', // precon id, empty indicates system circles
			people:[], // list of people ids
			cstamp:'20120918.120000.001', // creation time stamp,
			ustamp: '' // update timestamp
		} 
		
		BioEntity= {
			_id:''
			, name:''
			, group:'' // gene | protein | specie |  
			, type:''
			
		}
		
		Alias = {
			_id:''  // Alias id
			,model:'' // subject data type, i.e., Node, Network, Connection, People, User group, Org, Article, Experiment etc
			,precon_id:'' // id of the subject 
			,name:'' // official name used in precon 
			,alias:'' // the alias		
			,source:'' // where the alias is defined, i.e., intact, gm, pubmed, uniprotkb	
			,source_id:''  // id in the source db, if applicable
			,type:''	// alias type,  name | id 	
		}
		
		Publication = {
				_id:'',
				name:'',
				pmd_id:'', // pubmed id
				abstract:'', // abstract of the doc
				local: 0, // 1: archived, 0: remote 
				url:'', // for the full text doc
				published: 1, // 0, unpublished, 1: published
				authors:[], // list of People id
		}
		
		Experiment = {
			_id:''
			, name:''
			, int_label:'' // shortLabel in IntAct db
			, int_id:'' // id in IntAct db
			, authors:[]
			, url:''  // the source of the experiment
			, year:2009  // the publish year
			, journal: '' 
		}
