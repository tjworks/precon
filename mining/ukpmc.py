from xml.dom.minidom import parse, parseString
import requests


def writeFile(path, content, append=False):
    os.makedirs(os.path.dirname(path))
    try:
        fd = open(path, 'w' if not append else 'a')
        if isinstance(content, list):
            for line in content:
                fd.write(line.encode('UTF8', 'ignore'))
                if line[-1] != '\n': fd.write('\n')
        else:
            fd.write(content.encode('UTF8', 'ignore'))
        fd.close()
        return True
    except:
        return False

def list_all_sets():
	setSpecs = []
	setNames = []
	resuls = {}
	base_url = 'http://ukpmc.ac.uk/oai.cgi?verb=ListSets'
	token = ''
	while True:	
		
		url = "%s%s" %(base_url, token)
		print "Handling: %s "%url
		r = requests.get(url)
		dom1 = parseString(r.text)
		#dom1 = parse('mining/listsets.xml') # parse an XML file by name
		sets = dom1.getElementsByTagName("set")
		for set in sets:
			spec = set.getElementsByTagName("setSpec")
			specName = set.getElementsByTagName("setName")
			try:						
				#setNames.append(specName)
				print "%s: %s" %(spec[0].firstChild.nodeValue, specName[0].firstChild.nodeValue.strip())
				setSpecs.append("%s: %s" %(spec[0].firstChild.nodeValue, specName[0].firstChild.nodeValue.strip()))
			except:
				continue
		
		resumeToken= dom1.getElementsByTagName("resumptionToken")
		if not resumeToken: break
		token = resumeToken[0].firstChild.nodeValue.strip()
		token =  "&resumptionToken="+token		
		
	
	fd = open("ukpmc-all-sets.txt", "w")
	for s in setSpecs:
		try:  
			fd.write("%s\n" %s)
		except: 
			pass
	fd.close()
	return setSpecs

def list_ids(setSpec):
	base_url = "http://ukpmc.ac.uk/oai.cgi?verb=ListIdentifiers&metadataPrefix=pmc_fm&set="
	url = "%s%s" %(base_url, setSpec) 
	r = requests.get(url)
	dom = parseString(r.text)
	headers = dom.getElementsByTagName("header")
	res = []
	for h in headers:
		idtag = h.getElementsByTagName("identifier")[0].firstChild.nodeValue
		print idtag
		res.append(idtag)
	return res
	
def get_articles(ids):
	base_url = "http://ukpmc.ac.uk/oai.cgi?verb=GetRecord&metadataPrefix=pmc_fm&identifier="
	for id in ids:
		url = "%s%s" %(base_url, id)
		r = requests.get(url)					

#writeFile("ukpmc-all-sets.txt", "\n".join(setSpecs))

"""	
<set>
<setSpec>aabc</setSpec>
<setName>
Advances and Applications in Bioinformatics and Chemistry : AABC
</setName>
"""
