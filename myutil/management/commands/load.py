from django.core.management.base import NoArgsCommand, BaseCommand
from myutil import idtool
from myutil.objdict import ObjDict
from myutil.xml2dict import XML2Dict
from onechart import mongo
from onechart.models import Association, Publication, People
from onechart.mongo import db
from optparse import make_option
import os
import sys
import time
import traceback

modules = "etc.aws.ec2,etc.aws.backup, etc.scripts.dbtool, gameface,gameface.service,gameface.models.User,gameface.models.Face,gameface.management.commands.gfshell,gameface.management.commands.misc"

    
class Command(BaseCommand):
    option_list = NoArgsCommand.option_list + (
        make_option('-f', '--file', dest='inputfile', help="full path to the input file" ),       
        make_option('--id', dest='ids', help="comma separated pubmed ids" ),
    )
    help = """
        Performs various data importing tasks.
        
        python manage.py load csv -f demodata.csv
        python manage.py load pubmed   # load demo pubmed articles
        python manage.py load demodata     # load demo data
        python manage.py load init        # other initial data
        """

    requires_model_validation = True

    def handle(self, *args, **options):
        #from inout import mif 
        #mif.importmif()
        #self.registery()        
        if args[0] == 'csv':            
            load_csv( options.get('inputfile', None))            
        if args[0] == 'pubmed':
            load_pubmeds( options.get('ids', None))
        func = getattr(sys.modules[__name__], args[0])
        if func:
            func()
        else:
            print "Invalid subcommand %s" %args[0]
      


def mongo_scripts():
    mydb= db()
    for f in filesInDir("etc/mongo"):
        if f.find(".js")<0: continue
        funcname = f.replace(".js", "")
        handle = open("etc/mongo/%s" %f,'r')
        funcbody = handle.read()
        handle.close()
        print "Load function: %s" %funcname
        mydb.system.js.save({'_id':funcname, 'value':funcbody}, safe=True)            
    print "Done"
    # db.system.js.find().forEach(function(u){eval(u._id + " = " + u.value);});
    
    
def demodata():
    # precon user
    precon = People({'first':'precon', 'last':'onechart'})
    precon._id = "peop_precon"
    precon.save()    
    
def initdata():    
    populate_associations()
    
    
    
def populate_associations():
    names = 'decreases,being uptaken ,activates,inhibits,stimulats,inhibits,activates,associated with reduced risk'.split(',')
    for name in names:
        a = Association({'name':name})
        a.save()
        
        
        
        
def load_csv(filename=None):
    print "Import csv file: %s" %filename
    #Node A    Node A Category    Node A Primary Ref    Node B    Node B Catergory    Node B Database ID    Edge/Relationship    Reference    Network
    #Metformin (1,1-dimethylbiguanide)    Chemical    CHEBI:6801    blood glucose concentration    Metabolite        decreases    Pubmed: 19465464;18945920    metfromin diabete network
    filename = filename or 'c:/work/caida/Dropbox/precon/NetworkFormat/demodata.csv'
    from inout import csvloader
    loader = csvloader.CSVLoader(file = filename)
    networks,errors = loader.load()
    if errors:
        print errors
    else:
        for name, network in networks.items():
            network.save()
            
            

def load_pubmeds(ids=None):
    if not ids:
        pubmeds = '19465464;18945920;17476361;8165821;11602624;11602624;19245656;11602624;19245656;11602624;19245656;11602624;19245656;11602624;19245656;16732470;20600832; 20577046;15358229;15358229;18006825;17062558;15849206;20407744;19918015;19564453;19653109;19375425;20299480;20442309;19679549;19752085;17638885;18212742;16125352;18387000;20053525;18358555'.split(";")    
        pubmeds.extend(  '12384179,21263130,21060860,20872241,20453838,19330030,17529967,17529973'.split(",") )
        pubmeds.extend( '22129971,22451849'.split(","))
    else:
        pubmeds = ids.split(",")
        
    url = "http://togows.dbcls.jp/entry/pubmed/$ID?format=xml"

    """
    pub={    '_id':'',
            'name':'',
            'refs':{ 'pubmed': '' },
            'abstract':'', 
            'local': 0,  
            'url':'',  
            'published': 1, 
            'authors':[]
            }
    """
    pc = mongo.getCollection('people')
    try:
        pc.create_index([("last", 1), ("middle",1), ("first",1)], unique=True)
    except:
        pass
    
    pubs = []
    peoples = []
    for pid in pubmeds:
        try:
            uri = url.replace('$ID', pid)
            print "Loading %s" %uri
            doc = XML2Dict().fromurl(uri)
            #print doc
            article = doc['PubmedArticleSet']['PubmedArticle']['MedlineCitation']['Article']
            article = doc.PubmedArticleSet.PubmedArticle.MedlineCitation.Article
            
            pub = Publication()
            pub._id = "publ_pubmed%s" % (pid)
            pub.refs= {'pubmed': pid}
            pub.name= article['ArticleTitle']['value'] if article.ArticleTitle else ''
            pub.abstract = ''
            if article.Abstract and article.Abstract.AbstractText:
                texts = [ article.Abstract.AbstractText ] if not isinstance(article.Abstract.AbstractText, list) else article.Abstract.AbstractText
                pub.abstract= "\n\n".join([ text['value'] for text in texts ]) 
                                
            pub.language=article['Language']['value'] if article.Language else ''
            pubs.append(pub) 
            
            pub.authors=[]
            authors = article['AuthorList']['Author']
            for author in authors:
                people = {'first': author.ForeName.value if author.ForeName and author.ForeName.value else '',
                          'last': author.LastName.value if author.LastName and author.LastName.value else '',
                          'middle': author.Initials.value if author.Initials and author.Initials.value else '' }
                if not people['last']: continue             
                people['namekey'] = "%s.%s.%s" %(people['first'].lower(), people['middle'].lower(), people['last'].lower())                
                
                people['_id'] = idtool.generate('peop')
                try:
                    pc.insert(people, safe=True)
                    print "Inserted %s" %people
                except:
                    del people['_id']
                    people = pc.find_one(people)
                if people:
                    pc.update({'_id':people['_id']}, {'$addToSet': {'publications':pub._id}}, safe=True)
                    pub.authors.append(people)                            
            #print authors            
        except:
            print "ERROR: %s" %traceback.format_exc()    
                
            
    pubc = mongo.getCollection('publication')
    for pub in pubs:
        try:
            pubc.insert(pub)
            print "Inserted pub: %s" %pub
        except:
            print "ERROR %s"  %traceback.format_exc()

    log("Done")
    
    return pubs

    
        
        
def error(msg):
    log( "ERROR: %s" %msg)            


def filesInDir(path, fullpath=False, includeHiddenFiles=False):
    try: files = os.listdir(path)
    except: return []
    if not includeHiddenFiles: files = [name for name in files if (name and name[0] != '.')]
    if not fullpath: return files
    else: return ['%s/%s' % (path, name) for name in files]

def log(msg):    
    msg = time.strftime("%H:%M:%S ") + msg +"\n"
    print msg
    with open("import.log", "a") as f:
        f.write(msg) 

            