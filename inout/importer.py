from django.db import models
from onechart import mongo
from onechart.models import Edge
import time

# Create your models here.

def importEdges(filename):
    """
    import edges, one pair per line 
    Edge property: - no direction, -> left to right, <- right to left
    """
    count = 0
    now = time.time()
    ec = mongo.getCollection('edge')
    with open(filename) as f:
        content = f.read()        
        for line in content.split('\n'):
            doc  = {}
            line = line.strip()
            pos = line.find("///")            
            if pos>0: 
                line = line[0:pos].strip()
                doc['comment'] = line[pos:]
                 
            items = line.split("->")
            if (len(items) == 1): items = line.split("<-")
            if (len(items) == 1): items = line.split(" - ")
            if (len(items) == 1): 
                error("Ignore invalid line: [%s]" %line)
                continue            
            doc['source'] = items[0].strip().upper()
            doc['target'] =  items[1].strip().upper()
            ec.insert(doc)            
            count+=1
    finish = time.time()
    print "Imported %d edges, time elpased %d seconds" %(count, finish - now)
def error(msg):
    writeFile("import.log", "ERROR: %s\n" %msg, True)
    
def writeFile(path, content, append=False):
    try:
        fd = open(path, 'w' if not append else 'a')
        fd.write(content)
        fd.close()
        return True
    except:
        return False    