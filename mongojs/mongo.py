#!/usr/bin/env python
from django.core.management.base import BaseCommand
from onechart import settings
from inout.mif import filesInDir
from pymongo import Connection
import os
import subprocess
import sys


        
def db(dbhost=None, dbname=None):
    dbhost = dbhost or settings.MONGODB_HOST 
    dbname = dbname or settings.MONGODB_NAME
    return Connection(dbhost, 27017)[dbname]

def runjsfile(jsfile):
    upload(jsfile)
    jsfile = jsfile.replace("\\", '/')
    if(jsfile.find("/")<0):
        jsfile = "mongojs/js/%s" %(jsfile)
    if(not os.path.exists(jsfile)):
        print ("File %s does not exist" %jsfile)
        return
    print "Running %s" %jsfile
    funcname  = os.path.basename(jsfile)
    funcname = funcname.replace(".js", "")+ "()"
    mydb = db()
    response = mydb.command({'$eval': 'db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);}); %s' %funcname, 'nolock': True})
    print("%s" %response)

def runjs(code):
    """
    Execute JS code on mongo
    """
    mydb = db()
    response = mydb.command({'$eval': 'db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);}); %s' %code, 'nolock': True})
    print("%s" %response)
        
def upload(filename = None):
    mydb= db()
    for f in filesInDir("mongojs/js"):
        if f.find(".js")<0: continue        
        if(not filename or f == filename):
            funcname = f.replace(".js", "")
            handle = open("mongojs/js/%s" %f,'r')
            funcbody = handle.read()
            handle.close()
            print "Load function: %s" %funcname
            mydb.system.js.save({'_id':funcname, 'value':funcbody}, safe=True)            
    print "Done"
    # db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});
    
