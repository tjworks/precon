/** User service module */
var events = require('events');

var SKILL_OWN =  module.exports.SKILL_OWN = 1;
var SKILL_WANTED =  module.exports.SKILL_WANTED = 2;
var CallReady = module.exports.CallReady = 'CallReady';
var Calling = module.exports.Calling = 'Calling';
var Ringing = module.exports.Ringing = 'Ringing';

var USERS = {};
module.exports.get = function(uid){ 
		if(!uid) return null;
		USERS[uid] || (USERS[uid] = new User(uid) )
		return USERS[uid]	  
};
/**@todo: idleList should be actively maintained rather than calculated*/  
module.exports.listIdle = function(){	
	var ret=[];
	// idle: chatStatus is CallReady 
	for(var i  in USERS){
		var u = USERS[i];
		u.getChatStatus() ==  CallReady && ret.push(u.getId())
	}
	console.log("List idle:  "+ ret.length);
	return ret;
};
module.exports.listStatuses = function(){	
	var ret=[];
	// idle: chatStatus is CallReady 
	for(var i  in USERS){
		var u = USERS[i]; 
		var t = {name: u.getName(), status:u.getChatStatus(), conId: u.getChatId()};		 
		ret.push( t );
	}
	//console.log("List idle:  "+ ret.length);
	return ret;
};

module.exports.listUsers = function(){	
	var ret=[];
	// idle: chatStatus is CallReady 
	for(var i  in USERS){
		var u = USERS[i]; 		 		 
		ret.push( u.getModel());
	}
	return ret;
};

var User = function(uid){
		var id = uid;		
		var skillsWanted = [];
		var skillsHave = [];
		var chatStatus = '';
		var chatId = '';
		var name = '';
		
		var esto = this;
		this.addSkill = function(skill, type){  
				if(!skill) return;
				
				var skills = SKILL_WANTED==type ? skillsWanted: skillsHave;
				
				if( skills.indexOf(skill) <0 )
					skills.push(skill);
		};
		this.removeSkill = function(skill, type){
				if(!skill) return;
				var skills = SKILL_WANTED==type ? skillsWanted: skillsHave;
				
				var indx =  skills.indexOf(skill);
				if(indx >=0)
						skills.splice(indx, 1);
		}
		this.getSkills = function(){			
			return { 
					have: skillsHave.slice(0, skillsHave.length), 
					wanted: skillsWanted.slice(0, skillsWanted.length)
				}				 
		};
		this.getId = function(){
			return id;
		};
		this.updateStatus= function(obj){			
			var newStatus = obj;
			var oldStatus = chatStatus;
			if(typeof obj == 'object'){
				newStatus = obj.status;
				if(obj.nearID)
					chatId = obj.nearID;	
			}
			if(newStatus == chatStatus) return;
			console.log("User status change: "+ oldStatus +" -> "+newStatus);			
			chatStatus = newStatus;
			esto.emit('statusUpdated', {chatStatus:chatStatus, id:id, oldStatus: oldStatus});
		};
		this.getChatStatus  = function(){
			return chatStatus;
		};
		// this one does not emit event, used internally
		this.setChatStatus = function(newStatus){
			chatStatus = newStatus;
		};
		this.getChatId  = function(){
			return chatId;
		};
		this.setName = function(nm){
			name = nm;
		};
		this.getName = function(nm){
			return name || id;
		};
		this.toString = function(){
			return "User [id: "+ id+", name:" +name+", status: " + chatStatus+", chatId: "+ chatId+", skillsWanted: ("+ skillsWanted+") skillsHave: ("+ skillsHave+")]"
		};
		
		this.getModel = function(){
			return {
				id:id,
				name:name,
				status:chatStatus,
				chatId:chatId,
				skillsWanted:skillsWanted,
				skillsHave:skillsHave				
			}			
		};
		this.setModel = function(model){			
			if('name' in model)
				esto.setName(model.name);
			if('skillsWanted' in model)
				skillsWanted = model.skillsWanted || [];

			if('skillsHave' in model)
				skillsHave = model.skillsHave || [];
			
			if('chatStatus' in model)
				esto.updateStatus(model.chatStatus);
			
		}
		
}
User.prototype = new events.EventEmitter;
