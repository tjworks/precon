from copy import copy
from models import BaseModel
from onechart import mongo
from onechart.models import Interactor, Interaction
from xml.dom.minidom import parse, parseString
import os
import time



def importmif():
	resuls = {}
	content = ''
	
	basedir = r"c:\Users\tangev\Google Drive\onechart\data\IntAct"
	 
	interactions = []
	interactors = []
	cats = os.listdir(basedir)
	for c in cats:
		files = os.listdir("%s\\%s" %(basedir,c) )
		for file in files:
			file = "%s\\%s\\%s" %(basedir, c, file)
			log( "Processing %s" %file)
			a,b = parseFile(file)
			interactors.extend(a)
			interactions.extend(b)
	
	log( "###########################")
	log( "Total interactors: %d" % len(interactors))
	log( "Total interactions: %d" % len(interactions))
		
	ec = mongo.getCollection('edge')		
	for i in interactions:
		doc  = {}
		doc['source'] = i.src.upper()
		doc['target'] =  i.target.upper()
		doc['_id'] = i._id
		doc['form'] = i.form
		doc['origin'] = 'IntAct'  
		ec.insert(doc)	
		log("Inserted %s" %i._id)
	log("Done")
			
def parseFile(filename):
	with open(filename) as f:
		content = f.read()		
	dom = parseString(content)
	interactors = parseInteractors(dom)
	interactions = parseInteractions(dom, interactors)
	return interactors,interactions
	"""
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
	return setSpec
	"""	
def parseInteractions(dom,interactors):
	"""
	 <interaction id="678614" imexId="IM-12113-2">
                <names>
                    <shortLabel>pf1130-pf1128-2</shortLabel>
                    <fullName>Affinity purification by hydroxy apatite chromatography</fullName>
                </names>
                <xref>
                    <primaryRef refTypeAc="MI:0356" refType="identity" id="EBI-2507294" dbAc="MI:0469" db="intact"/>
                    <secondaryRef refType="imex source" id="MI:0469" dbAc="MI:0488" db="psi-mi"/>
                    <secondaryRef refTypeAc="MI:0662" refType="imex-primary" id="IM-12113-2" dbAc="MI:0670" db="imex"/>
                </xref>
                <experimentList>
                    <experimentRef>678502</experimentRef>
                </experimentList>
                <participantList>
                    <participant id="678615">
                        <names>
                            <shortLabel>n/a</shortLabel>
                        </names>
                        <xref>
                            <primaryRef refTypeAc="MI:0356" refType="identity" id="EBI-2507299" dbAc="MI:0469" db="intact"/>
                        </xref>
                        <interactorRef>678518</interactorRef>
                        <biologicalRole>
                            <names>
                                <shortLabel>unspecified role</shortLabel>
                                <fullName>unspecified role</fullName>
                            </names>
                            <xref>
                                <primaryRef refTypeAc="MI:0356" refType="identity" id="MI:0499" dbAc="MI:0488" db="psi-mi"/>
                                <secondaryRef refTypeAc="MI:0356" refType="identity" id="EBI-77781" dbAc="MI:0469" db="intact"/>
                                <secondaryRef refTypeAc="MI:0358" refType="primary-reference" id="14755292" dbAc="MI:0446" db="pubmed"/>
                            </xref>
                        </biologicalRole>
                        <experimentalRoleList>
                            <experimentalRole>
                                <names>
                                    <shortLabel>neutral component</shortLabel>
                                    <fullName>neutral component</fullName>
                                </names>
                                <xref>
                                    <primaryRef refTypeAc="MI:0356" refType="identity" id="MI:0497" dbAc="MI:0488" db="psi-mi"/>
                                    <secondaryRef refTypeAc="MI:0356" refType="identity" id="EBI-55" dbAc="MI:0469" db="intact"/>
                                    <secondaryRef refTypeAc="MI:0358" refType="primary-reference" id="14755292" dbAc="MI:0446" db="pubmed"/>
                                </xref>
                            </experimentalRole>
                        </experimentalRoleList>
                    </participant>
	"""
	ems = dom.getElementsByTagName("interaction")	
	interactions = []	
	for em in ems:
		#interactions.append(interaction)		
		psi_id = em.getAttribute('id')
		cat =getText( em.getElementsByTagName("interactionType")[0], 'shortLabel')
		int_label = getText(em,'shortLabel')
		participants =  em.getElementsByTagName("participant")
		pats = []
		for p in  participants:
			try:
				ref = getText(p, 'interactorRef')
				i = findInteractorByPsiId(interactors,ref)
				if i: pats.append(i)
			except:
				log( "Invalid participant: %s" %p.getAttribute('id'))
		tmp_pats = copy(pats)
		for indx in range(len( pats)):
			p1 = pats[indx]
			topop=-1
			for indx2 in range(len(tmp_pats)):
				p2= tmp_pats[indx2]
				if p2._id == p1._id: 
					topop = indx2
					continue
				interaction = Interaction()
				interactions.append(interaction)
				interaction.form = cat
				interaction.src = p1._id
				interaction.target = p2._id
				interaction._id = "%s.%s.%s" %(int_label, p1._id, p2._id)
				
			tmp_pats.pop(topop)
				
	return interactions
		
def findInteractorByPsiId(interactors, psi_id):
	for i in interactors:
		if i.psi_id == psi_id: return i
	return None

def parseInteractors(dom):
	ems = dom.getElementsByTagName("interactor")
	
	interactors = []
	
	for em in ems:
		interactor = Interactor()
		tmp = em.getElementsByTagName("shortLabel")
		slabel = tmp[0].firstChild.nodeValue.strip()
		slabel = slabel.split('_')[0]
		interactor._id = slabel		
		
		interactor.name =  getText(em, 'fullName')
		interactor.psi_id = em.getAttribute('id')
		interactor.cat = getText( em.getElementsByTagName("interactorType")[0], 'shortLabel')
		interactors.append(interactor)

	return interactors

def getText(p, em_name):
	tmp = p.getElementsByTagName(em_name)
	return tmp[0].firstChild.nodeValue.strip()
		
	
			
def error(msg):
	log( "ERROR: %s" %msg)			
	
	
	"""
	 self._id = self._id or '' 
        self.cat = self.cat or ''  # protein, gene etc
        self.org = self.org or ''  # organism: human 
        self.label=self.label or '' # short label
        self.name= self.name or '' # full name
        self.alias = self.alias or []  # list of aliases
        self.uniproc_id = self.uniproc_id or ''  # uniproc id
        self.psi_id = self.psi_id or ''
	 <interactor id="678547">
	    <names>
	        <shortLabel>if5a_pyrfu</shortLabel>
	        <fullName>Translation initiation factor 5A</fullName>
	        <alias type="gene name" typeAc="MI:0301">eif5a</alias>
	        <alias type="gene name synonym" typeAc="MI:0302">eIF-5A</alias>
	        <alias type="gene name synonym" typeAc="MI:0302">Hypusine-containing protein</alias>
	        <alias type="locus name" typeAc="MI:0305">PF1264</alias>
	    </names>
	    <xref>
	        <primaryRef refTypeAc="MI:0356" refType="identity" version="SP_45" id="Q8U1E4" dbAc="MI:0486" db="uniprotkb"/>
	      
	    </xref>
	    <interactorType>
	        <names>
	            <shortLabel>protein</shortLabel>
	            <fullName>protein</fullName>
	        </names>
	        <xref>
	            <primaryRef refTypeAc="MI:0356" refType="identity" id="MI:0326" dbAc="MI:0488" db="psi-mi"/>
	            <secondaryRef refTypeAc="MI:0356" refType="identity" id="EBI-619654" dbAc="MI:0469" db="intact"/>
	            <secondaryRef refTypeAc="MI:0358" refType="primary-reference" id="14755292" dbAc="MI:0446" db="pubmed"/>
	            <secondaryRef refTypeAc="MI:0361" refType="see-also" id="SO:0000358" dbAc="MI:0486" db="uniprotkb"/>
	        </xref>
	    </interactorType>
	    <organism ncbiTaxId="186497">
	        <names>
	            <shortLabel>pyrfu</shortLabel>
	            <fullName>Pyrococcus furiosus</fullName>
	        </names>
	    </organism>
	</interactor>
	<interactor id="678544">
	"""
#writeFile("ukpmc-all-sets.txt", "\n".join(setSpecs))

"""	
<set>
<setSpec>aabc</setSpec>
<setName>
Advances and Applications in Bioinformatics and Chemistry : AABC
</setName>
"""


def filesInDir(path, fullpath=False, includeHiddenFiles=False):
	try: files = os.listdir(path)
	except: return []
	if not includeHiddenFiles: files = [name for name in files if (name and name[0] != '.')]
	if not fullpath: return files
	else: return ['%s/%s' % (path, name) for name in files]

def log(msg):	
	msg = time.strftime("%H:%M:%S ") + msg +"\n"
	with open("import.log", "a") as f:
		f.write(msg) 
