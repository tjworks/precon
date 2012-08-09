# Create your views here.
from gameface import settings
from gameface.gf_util import filesInDir
import time


def user_stats(cutoff=None):
    from bson.code import Code
      
    cutoff = cutoff or (time.time() - 24*60*60 ) # today 
    
    # user play_time
    # Use Event logs, for each user, find all the events for each game session. The difference between the first event's timestamp and last event's 
    # timestamp is the rough time user spent in the game. A gap of 10(?) minutes is considered to be a different game session
    
def db():
    
    from pymongo import Connection
    
    connection = Connection('198.101.216.116', 27017)
    return connection['local']
    
    
    
def mapreduce(days=None):
    from bson.code import Code
    
    if(days is None): days = 3
    else: days = days+1    
    cutoff = time.time() - 24*60*60 * days # past 3 days
    
    # step 1, map reduce the all users, fb attempts and failures
    map = Code("""
                function () {        
                    format = function(digit){  return digit>9? digit: '0'+digit }                    
                    var emits = {alluser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0 , pushenabled:0, pushrejected:0 ,fb_unique_attempts:0}
                    if(this.type == 'AppStart') emits.alluser = 1
                    if(this.type == 'title_FBLoginSelected'){
                         emits.fb_attempts=1
                         if(this.ip)  emits.fb_attempt_users[this.ip.replace(/\./g,'_')] = 1
                    }
                    if(this.type == 'gamemanager_facebookLoginFail') emits.fb_failures=1
                    var d = new Date(this.tm * 1000)
                    key = d.getFullYear() + '-' + format(d.getMonth()+1) +'-'+ format(d.getDate());
                    emit(key, emits)                
                }
                """
                )
    
    reduce = Code("""
                function (key, values) {
                     var ret = { alluser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0 , pushenabled:0, pushrejected:0,fb_unique_attempts:0}
                     
                     for(var i in values){
                         var hash = values[i]
                         for(var key in hash){
                             if(!ret[key])
                                 ret[key] = hash[key]
                             else if(typeof(ret[key]) == 'number')
                                 ret[key] = ret[key]+ hash[key]
                             else if(hash[key]) {
                                 for(var k in hash[key]){ 
                                     if(ret[key]) ret[key][k] = 1
                                 }
                             }                                 
                         }
                     }
                     return ret; 
                }
            """
              )
    
    final = Code("""
            function(key, value){
                if(value.fb_attempt_users){
                    var cnt = 0
                    for(var i in value.fb_attempt_users) cnt++
                    value.fb_unique_attempts = cnt 
                    value.fb_attempt_users = cnt
                }
                return value
            }
            """
            )
    col = db()['Event']
    col.map_reduce(map, reduce, out ={'merge':"mrstats"}, query={'server':'gameface.me', 'tm':{'$gt': cutoff}}, finalize=final)  # 'tm':{'$gt':1343403361}, 
    
    # step 2, map reduce the sign ups
    map = Code("""
                function () {                        
                    format = function(digit){  return digit>9? digit: '0'+digit }  
                    var emits = {alluser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0, pushenabled:0, pushrejected:0 ,fb_unique_attempts:0 }
                    if(!this.create_tm ) return
                    var d = new Date(this.create_tm * 1000)
                    key = d.getFullYear() + '-' + format(d.getMonth()+1) +'-'+ format(d.getDate());
                    
                    emits.signup = 1
                    if(this.fbID) emits.fb_signup=1                    
                    emit(key, emits)                
                }
                """
                )        
    col = db()['User']
    col.map_reduce(map, reduce, out ={'reduce':"mrstats"},query={'create_tm':{'$gt': cutoff} })
    
    # step 3, map reduce the push enabled users
    map = Code("""
                function () {                        
                    format = function(digit){  return digit>9? digit: '0'+digit }  
                    var emits = {alluser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0 , pushenabled:0, pushrejected:0 ,fb_unique_attempts:0}
                    if(!this.tm ) return
                    var d = new Date(this.tm * 1000)
                    key = d.getFullYear() + '-' + format(d.getMonth()+1) +'-'+ format(d.getDate());
                    
                    if(this.token) emits.pushenabled = 1
                    else emits.pushrejected = 1
                                        
                    emit(key, emits)                
                }
                """
                )        
    col = db()['GameInstall']
    col.map_reduce(map, reduce, out ={'reduce':"mrstats"},query={'tm':{'$gt': cutoff}})
    
    
    

def load_scripts():
    mydb= db()
    basedir = settings.PROJECT_PATH
    for f in filesInDir("%s/mapreduce/js" %basedir):
        if f.find(".js")<0: continue
        funcname = f.replace(".js", "")
        handle = open("%s/mapreduce/js/%s" %(basedir,f),'r')
        funcbody = handle.read()
        handle.close()
        print "Load function: %s" %funcname
        mydb.system.js.save({'_id':funcname, 'value':funcbody}, safe=True)            
    print "Done"
    # db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});
    