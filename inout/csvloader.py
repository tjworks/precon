from onechart import mongo
from onechart.models import Entity, Node, Connection, Network
import csv


SUPPORTED_COLUMNS = 'NodeA,NodeA_Category,NodeA_DBID,NodeB,NodeB_Category,NodeB_DBID,Edge,Edge_Ref,Network'.split(',')


__Column_Indexes = {} 

class CSVLoader(object):
	def __init__(self, text=None,file=None):
		
		if text:
			self.rows = csv.reader(text, delimiter=',', quotechar='"')
		else:
			self.rows = csv.reader( open(file, 'rb'), delimiter=',', quotechar='"')
		self.errors = []
		
	def _error(self, msg, rowIndex=None, colIndex=None):
		rowIndex = self.rows.line_num if rowIndex is None else rowIndex
		
		self.errors.append({ 'error':msg, 'row':rowIndex})
		
	def load(self):
		
		self.columnIndexes = {}
		headers = self.rows.next()
		for i in range (len(headers)):
			col = headers[i]
			if col not in SUPPORTED_COLUMNS:
				raise Exception("Invalid column: %s. Accepted columns are: %s" %(col, SUPPORTED_COLUMNS))
			self.columnIndexes[col] = i
			
		#networks, connections, entities, nodes
		entities = {}
		nodes = {}
		networks = {}
		
		for row in self.rows:
			entityA = None
			dbid = 	self.getCol('NodeA_DBID',row )
			if dbid:
				dbid = dbid.lower()
				_id = 'enti_%s' %dbid			
				if _id not in entities: 				
					entityA = Entity()
					entityA._id = _id
					entityA.dbref = {}
					pair = dbid.split(':')							
					if(len(pair)!=2): 
						self._error("Invalid NodeA_DBID: %s" %dbid)
						continue	
					entityA.dbref[pair[0]] = pair[1]			
					entityA.group = self.getCol('NodeA_Category',row)
					#entity.label = 'Metformin'
					entityA.name = self.getCol('NodeA',row)								
					entities[_id] = entityA
				else:
					entityA=entities[_id] 			
			#Node B
			entityB = None
			dbid = 	self.getCol('NodeB_DBID',row,  False)
			if dbid:
				dbid = dbid.lower()
				_id = 'enti_%s' %dbid			
				if _id not in entities: 				
					entityB = Entity()
					entityB._id = _id
					entityB.dbref = {}
					pair = dbid.split(':')
					if(len(pair)!=2): 
						self._error("Invalid NodeB_DBID: %s" %dbid)		
						continue						
					entityB.dbref[pair[0].strip()] = pair[1].strip()			
					entityB.group = self.getCol('NodeB_Category',row)
					#entity.label = 'Metformin'
					entityB.name = self.getCol('NodeB' ,row )
					entities[_id] = entityB
				else:
					entityB = entities[_id] 
				
			edgeType = self.getCol('Edge',row,  False)
			if not edgeType: continue
			con = Connection()
			con.type = edgeType
						
			nodeA = nodes[entityA._id] if entityA._id in nodes else self.newNode(entityA)  
			nodeB = nodes[entityB._id] if entityB._id in nodes else self.newNode(entityB)
			nodes[entityA._id] = nodeA
			nodes[entityB._id] = nodeB	
			con.entities=[entityA._id, entityB._id] # this is for search
			con.nodes = [nodeA._id, nodeB._id]		
			con._nodes = [nodeA, nodeB]
			
			
			con.refs = {}
			
			edgeRefs = self.getCol('Edge_Ref',row, False)
			if edgeRefs:
				# comma separated
				pairs = edgeRefs.split(",")
				if len(pairs) == 1: pairs = edgeRefs.split("\n")
				for p in pairs:
					pair = p.split(':')
					refs = pair[1].split(';')
					if len(refs) == 1: refs = pair[1]
					con.refs[pair[0].lower().strip()] = refs
			
			
			networkName = self.getCol('Network',row) or 'DEFAULT'
			network = networks[networkName] if networkName in networks else Network()
			network.name = networkName
			network.owner='peop_precon'
			networks[networkName]  = network
			
			network._connections = network._connections or []
			network._connections.append(con)
			
			con.network = network._id
			con.owner='precon'
		#TBD, error
		return networks, self.errors
	def newNode(self, entity):
		node = Node(entity=entity)
		return node

	def getCol(self, col, row,  required=True):
		
		if not col in self.columnIndexes: 
			self._error('Missing column NodeA', self.rows.line_num )
			return None	
		return row[ self.columnIndexes[col] ]
	 
	
	
"""
NodeA	NodeA_Category	NodeA_DBID	NodeB	NodeB_Category	NodeB_DBID	Edge	Edge_Ref	Network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	blood glucose concentration	Metabolite	Unknown	decreases	Pubmed: 19465464;18945920	metfromin diabete network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	Organic cation transporter 1 (OCT1)	Gene/Protein	UniProtKB:O15245	being uptaken 	Pubmed: 17476361;8165821	metfromin diabete network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	AMPK	Gene/Protein	UniProtKB:Q9Y478	activates	Pubmed:11602624	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	glucose synthesis	GO	GO:0006094	inhibits	Pubmed:11602624;19245656	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	lipid synthesis	GO	GO:0008610	inhibits	Pubmed:11602624;19245656	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	protein synthesis	GO	GO:0006412 	inhibits	Pubmed:11602624;19245656	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	fatty acid oxidation	GO	GO:0019395 	stimulats	Pubmed:11602624;19245656	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	glucose uptake	GO	GO:0046323	stimulats	Pubmed:11602624;19245656	metfromin diabete network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	respiratory-chain complex 1	GO	GO:0005747	inhibits	Pubmed:16732470;20600832	metfromin diabete network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	fructose-1,6-bisphosphatase	Gene/Protein	UniProtKB:P09467	inhibits	Pubmed: 20577046	metfromin diabete network
AMPK	Gene/Protein	UniProtKB:Q9Y478	fatty acid synthase	Gene/Protein	UniProtKB:P49327	decreases	Pubmed:15358229	cancer metabolism network
AMPK	Gene/Protein	UniProtKB:Q9Y478	acetyl CoA carboxylase(ACC)	Gene/Protein	UniProtKB:Q13085 	decreases	Pubmed:15358229	cancer metabolism network
AMPK	Gene/Protein	UniProtKB:Q9Y478	mTORC1	Gene/Protein	UniProtKB:P42345 	inhibits	Pubmed:18006825;	cancer metabolism network
AMPK	Gene/Protein	UniProtKB:Q9Y478	TSC2	Gene/Protein	UniProtKB:P49815 	phosphorylates/activates	Pubmed:17062558	cancer metabolism network
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	cancer risk	Disease	ICD-10:C80.9	associated with reduced risk	Pubmed:15849206;20407744;19918015;19564453	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	prostate cancer risk	Disease	ICD-10:C61	associated with reduced risk	Pubmed:19653109	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	pancreatic cancer risk	Disease	ICD-10:C25.9	associated with reduced risk	Pubmed:19375425	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	breast cancer	Disease	ICD-10:C50	associated with reduced risk	Pubmed:20299480	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	cancer (cell lines)	Model	Unknown	inhibits	Pubmed:20442309	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	cancer (animal models)	Model	Unknown	inhibits	Pubmed:19679549;19752085;17638885;18212742;16125352;18387000	
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	type 2 diabete	Disease	ICD-10:E11	inhibits		
Metformin (1,1-dimethylbiguanide)	Chemical	CHEBI:6801	angiogenesis	GO	GO:0001525 	inhibits	Pubmed:20053525;18358555	

"""		