
from bson.code import Code
from django.core.management.base import NoArgsCommand, BaseCommand
from gameface import gf_statistics
from gameface.gf_constants import SECONDS_OF_DAY
from gameface.service import StatsManager
from gameface.util.objdict import ObjDict
from mongojs import mongo
from optparse import make_option
import logging
import os
import sys
import time
import traceback

logger = logging.getLogger(__name__)

def mrall(days=None):
    """
    Run all the mapreduce jobs
    @param days Number of days, default to from yesterday
    """
    #copyEvents(days)    
    playtime(days)
    
    # metrics over time
    dailyStats(days)
    
    alltimeStats()
    
def alltimeStats():
    # TBD: do this for each game
    games = ['zombieface']
    for game_id in games:
        stats = gf_statistics.calcUserStats(game_id)
        for name, value in stats.items():
            data= { 'name': name, 'value':value, 'game_id': game_id, 'type':'metric'}   
            StatsManager.save(data)
            print "Saving stat %"
def playtime(days=None):
    logger.debug("Playtime starting")
    mr('playtime', days)  # see playtime.js for details
    db()['mrplaytime'].ensure_index("value.time_total")
    db()['mrplaytime'].ensure_index("value.session_total")
    db()['mrplaytime'].ensure_index("value.event_total")
    
    # calculate average
    total_time = 0
    cursor = db()['mrplaytime'].find().sort('value.time_total', -1)
    cnt = cursor.count()
    top10 = 0
    top10Total = 0
    for r in cursor:        
        total_time = total_time + r['value']['time_total']
        top10 = top10+1
        #if(top10 <=10):              top10Total = total_time
        
    for r in  db()['mrplaytime'].find().sort('value.time_total', -1).limit(10):
        top10Total  = top10Total + r['value']['time_total']
        print "Time %s" % r['value']['time_total']
    print "Top 10 Total:%d " %top10Total
    print "Total:%d " %total_time
    
    import math
    #TBD: fix me
    data= { 'name': "All User: Average Time Played", 'value': math.ceil(  total_time / cnt ), 'game_id': 'zombieface', 'type':'metric'}            
    StatsManager.save(data)
    data= { 'name': "Top 10: Average Time Played", 'value': math.ceil(  top10Total / 10 ), 'game_id': 'zombieface', 'type':'metric'}            
    StatsManager.save(data)
    
    
    
#gamemanager_facebookLoginFail,  gamemanager_facebookLoginSuccess        
def dailyStats(days=None):
    logger.debug("dailyStats starting")
    from bson.code import Code    
    cutoff = getCutoffTime(days)
    mongo.upload('dailystats.js')
    
    mr('dailystats_event', days)     
    mr('dailystats_user', days, 'create_tm')    
    
    reduce = Code("""
                function (key, values) {
                     var ret = { newuser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0 , pushenabled:0, pushrejected:0,fb_unique_attempts:0}
                     
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
    col = db()['Event']
    #col.map_reduce(map, reduce, out ={'merge':"mrstats"}, query={'server':'gameface.me', 'tm':{'$gt': cutoff}}, finalize=final, scope=Code("{context:{}}"))  # 'tm':{'$gt':1343403361}, 
    
    # step 2, map reduce the sign ups
    map = Code("""
                
                """
                )        
    col = db()['User']
    #col.map_reduce(map, reduce, out ={'reduce':"mrstats"},query={'create_tm':{'$gt': cutoff} })
    
    # step 3, map reduce the push enabled users
    map = Code("""
                function () {                        
                    format = function(digit){  return digit>9? digit: '0'+digit }  
                    var emits = {newuser:0,signup:0, fb_signup:0, fb_attempt_users: {}, fb_attempts:0 , fb_failures:0 , pushenabled:0, pushrejected:0 ,fb_unique_attempts:0}
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
    #col.map_reduce(map, reduce, out ={'reduce':"mrstats"},query={'tm':{'$gt': cutoff}})
     
    
    # created customface
    
def mr(name, days=None, tmfield='tm'):
    cutoff = getCutoffTime(days)
    mongo.upload("%s.js" %name)
    print "Running mapreduce %s for %d days" %(name, days)
    print mongo.runjs('mr(%s, {query:{%s:{$gt: %d}}})' %(name, tmfield, cutoff))

      
def getCutoffTime(days=None):     
    days = days or 1
    now = time.time()    
    cutoff = now - (now % SECONDS_OF_DAY) - SECONDS_OF_DAY * days    
    return cutoff

        
def db(env=None):    
    """
      if(env == 'prod'):
        from pymongo import Connection    
        connection = Connection('mongod.gameface.me', 27017)
        return connection['gfprod']
    """      
    return mongo.db()
        
    
def getAverage(*args):    
    
    """
    avg total amount of time spent in the game
    avg xp total
    avg gameface platform level
    avg outfits bought *where applicable
    avg custom characters made *where applicable
    avg number of facebook friends gamefaces in their account
    """
    
    mydb = db()
    mydb.GameInstall.count()
    
    
    from gameface.util.objdict import ObjDict
    stats = ObjDict()
    # total time
    
    
     
    totals = ObjDict()
    col = db()['GameInstall']
    totals.TotalEvents = col.count()
    
    totals.TotalFlurryEvent = col.find({'type':{'$ne':'api'}}).count()
     
    totals.AppStart = col.find( {'type': 'AppStart' }).count()
    
    result = db().command( { 'distinct': 'Event', 'key': 'guid', 'query':{'type':'AppStart'} })
    totals.AppStartUnique = len( result['values'] )
    
    result = db().command( { 'distinct': 'Event', 'key': 'type', 'query':{'server':'gameface.me'}} )
    totals.EventTypes= len(result['values'])
    
    result = db().command( { 'distinct': 'Event', 'key': 'ip', 'query':{'server':'gameface.me'}} )
    totals.UniqueIPs= len(result['values'])
    
    
    #print result
    #db().eval(process_events, *args)
    
    return totals
    #return result


def copyEvents(days):
    logger.debug("Copy events for %d days" %days)
    cutoff=getCutoffTime(days)
    from pymongo import Connection
    proddb =     Connection('mongod.gameface.me', 27017)
    mrdb = Connection('198.101.216.116', 27017)
    cursor = proddb.gfprod.Event.find({'tm':{'$gt': cutoff}}, sort=[('tm', 1)]).skip(133000)
    print("Found %d evnets" %cursor.count())
    cnt = 0
    import gc
    for e in cursor: 
        mrdb.local.Event.insert(e)
        cnt+=1
        if(cnt % 1000 == 0): 
            print("%dk" %cnt) 
            gc.collect()
            time.sleep(1)
    print("Done!")
"""

Total events:    500K
Time span: May 22 - Now, 70 days



  
Mongo server side code

db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});



"""
            
def prep(days=None):
    """
    Prep the Event db for analysis
    """
    
    #step 1 create indexes
    db()['Event'].ensure_index('uid')
    db()['Event'].ensure_index('gid')
    
            
            

    
    
                