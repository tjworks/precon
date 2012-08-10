from django.db import models
from myutil.objdict import ObjDict
from onechart import mongo
from onechart.models import Connection, Network, Node, Entity
import time

# Create your models here.

def importGene(filename):
    filename = filename or r'C:\work\caida\Dropbox\precon\engineering\Contents\GBM_BN-symbols.txt'
    cnt = 0
    set = {}
    col = mongo.db()['entity']
    with open(filename) as f:
        content = f.read()        
        for line in content.split('\n'):
            line = line.strip()
            sym = line.lower()
            if(sym in set): continue
            set[sym] = 1
            
            doc=ObjDict()
            doc._id = 'enti_sym_%s' %sym 
            doc.symbol = sym
            doc.group='protein'
            doc.name = line
            doc.label = line
            
            if(col.find({'symbol':sym}).count()>0): continue
                
            col.save( doc,safe=True)
            cnt += 1
            print "Added # %d:  %s" %(cnt, sym)
    print "Inserted %d gene" %cnt        
            
def importEdges(filename=None):
    """
    import edges, one pair per line 
    Edge property: - no direction, -> left to right, <- right to left
    """
    filename = filename or  r'C:\work\caida\Dropbox\precon\engineering\Contents\GBM_BN-Massaged.csv'    
    
    # add a network
    n = Network.findOne({'name': "GBM Predicted Tumor Network"}) or Network()
    n.name = "GBM Predicted Tumor Network"
    n.group = "predicted"
    n.owner = 'precon'
    n.save()
     
    
    col = mongo.db()['entity']
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
            count+=1
            if(count<8378): continue
            
            tmp =[]
            tmp.append( items[0].lower().strip())
            tmp.append( items[1].lower().strip())
            entities = ['','']
            print "!!! %d " %( col.find({'symbol': {'$in': tmp  } }).count() )
            for r in  col.find({'symbol': {'$in': tmp  } }):
                if(r['symbol'] == tmp[0]):
                    entities[0] = Entity(r)
                if(r['symbol'] == tmp[1]):
                    entities[1] = Entity(r)
            
            if(len(entities)!=2 ):
                raise "Invalid nodes %s, continue" % entities
            
            
            node1 = Node.findOne({'network': n._id, 'entity': entities[0]._id}) 
            if not node1:
                node1 = Node({'network':n._id}, entities[0])
                node1.save()
            node2 = Node.findOne({'network': n._id, 'entity': entities[1]._id}) 
            if not node2:
                node2 = Node({'network':n._id}, entities[1])
                node2.save()
            
         
            
            con = Connection()
            con._id  = "conn_%s_%s" %(tmp[0], tmp[1])
            con.nodes = [node1._id, node2._id]
            con.entities = [ entities[0]._id, entities[1]._id ] 
            con.type = 'predicted'
            con.network = n._id
            con.label = ""
            con.save()
                        
            
            print "Saving connection %d %s" % (count, con._id) 
            
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