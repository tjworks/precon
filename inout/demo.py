from copy import copy
from myutil import idtool, xml2json
from myutil.xml2dict import XML2Dict
from onechart import mongo
from onechart.models import Connection, Entity, Network, Node, BaseModel, \
	Publication, Association
from xml.dom.minidom import parse, parseString
import os
import pymongo
import time
import traceback


def load_pubmeds(pubmeds=None):
	"""
	Load pubmed abstract by using Togows
	
	Usage:
		
		python manage.py load		
		
	"""
	if not pubmeds:
		pubmeds = '19465464;18945920;17476361;8165821;11602624;11602624;19245656;11602624;19245656;11602624;19245656;11602624;19245656;11602624;19245656;16732470;20600832; 20577046;15358229;15358229;18006825;17062558;15849206;20407744;19918015;19564453;19653109;19375425;20299480;20442309;19679549;19752085;17638885;18212742;16125352;18387000;20053525;18358555'.split(";")	
		pubmeds.extend(  '12384179,21263130,21060860,20872241,20453838,19330030,17529967,17529973'.split(",") )
		pubmeds.extend( '22129971,22451849'.split(","))
		
	url = "http://togows.dbcls.jp/entry/pubmed/$ID?format=xml"

	"""
	pub={	'_id':'',
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
			pub._id = "%s%s" %(pub.PREFIX, pid)
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
			break	
			
	pubc = mongo.getCollection('publication')
	for pub in pubs:
		try:
			pubc.insert(pub)
			print "Inserted pub: %s" %pub
		except:
			print "ERROR %s"  %traceback.format_exc()

	log("Done")
	
	return pubs

	
		
def populate_associations():
	names = 'decreases,being uptaken ,activates,inhibits,stimulats,inhibits,activates,associated with reduced risk'.split(',')
	for name in names:
		a = Association({'name':name})
		a.save()
		
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





