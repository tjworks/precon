
from django.conf import settings
from myutil.objdict import ObjDict
from onechart import settings
from pymongo import Connection
import logging
import os
import sys
import time
import traceback

"""
Dev tools
"""
bm=um=gfm=None
def switch(newname):
    settings.MONGODB_NAME = newname
    initdb()

def initdb():
    pass

    
def index():
    col=getCollection('edge')
    
    print "creating indexes"    
    col.ensure_index('begin')
    col.ensure_index('end')
    #col.ensure_index('author',sparse=True)
    
    #dbcon[settings.MONGODB_NAME].fs.chunks.ensure_index('files_id')
    



def dbinfo():
    print "DB: %s@%s" %(settings.MONGODB_NAME, settings.MONGODB_HOST)
 

if __name__ == '__main__':    
    initdb()
    dbinfo()
    

logger = logging.getLogger(__name__)
__connection = None
__dbase = None

def getConnection():        
        global __connection
        if(not __connection):
            __connection = Connection(settings.MONGODB_HOST, 27017)
        if(not __connection): raise Exception("Cannot get connection")
        return __connection
    
      
    
def getCollection(colName):        
        col =   db()[colName]
        if(not col): raise Exception("Cannot access collection %s" % colName)
        return col
    
def db():        
        __dbase =  getConnection()[settings.MONGODB_NAME]
        if(not  __dbase   ): raise Exception("Cannot access database")
        return __dbase

class ValidationError(Exception):
    pass




def createIndexes():
    pass
    """
    db.network.ensureIndex({ "name" : 1 },{ "name" : "name", "background" : true });
    
    db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});
    """
    
    

def insertJS():
    codes = ObjDict()
    codes.generate_index = """
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
                           obj.name=obj.pubmed_id+", "+ obj.name                           
                           insertKeywords(keywords,obj);                    
                    });                    
                    db.entity.find().forEach( function(obj){                           
                           var keywords = []
                           keywords.push(obj.symbol)
                           keywords = keywords.concat( chop(obj.name) )
                           keywords.push(obj.name)
                           if(obj.name)
                               obj.name=obj.symbol +", "+ obj.name
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

    """    
    mydb= db()
    for funcname, funcbody in codes.items():
        mydb.system.js.save({'_id':funcname, 'value':funcbody})
    print "Done"
    
    
    
    
    
    
    
    
    
    