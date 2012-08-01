from django.contrib.auth.models import User
from django.db import models
from myutil import idtool
from myutil.dateutil import getTime
from onechart import mongo
from userena.models import UserenaLanguageBaseProfile
import logging
import re
logger = logging.getLogger(__name__)


CLEANUP_PATTERN = re.compile(r'[()\s]')
class BaseModel(dict):
    def __init__(self, data=None):
        if(data):self.update(data)
        #self.id = self._id if self._id else None
        if not self._id: self._id= idtool.generate(self._col)
        
            
    def __getattr__(self, attr):
        if(attr == 'id'): attr = '_id'
        return self[attr] if attr in self else None

    def __setattr__(self, attr, value):
        # any keys starts with _ is considered transient, non-persistable
        if(attr[0] == "_" and attr != '_id'):
            #print "Setting attr: %s=%s" %(attr,value)
            self.__dict__[attr] = value
            return
        #print "Setting key: %s=%s" %(attr,value)
        if(attr == 'id'): attr = '_id'
        self[attr] = value

    def save(self):
        col = mongo.getCollection(self._col)
        logger.debug("Persisting %s: %s" %(self._col, self))
                
        self._id = self.cleanup_id(self._id)
        self.create_tm = self.create_tm or getTime()
        self.update_tm =  getTime()
        col.save(self, safe=True)
        logger.debug("Done")
        
        if self._save: self._save()
            
    def cleanup_id(self, id):
        return CLEANUP_PATTERN.sub('', id).lower()
          
    def PK(self):
        """
        Helper method to return a Mongo query based on primary key
        """
        return {'_id': self._id}

class BioModel(BaseModel):    
    def __init__(self, data=None):
        BaseModel.__init__(self, data)
        

class Network(BioModel):
    """
    Primary id: ntwk_DB_DBID  e.g.e, ntwk_intact_1039473
    """
    _col = 'network'
    def __init__(self, data=None):
        BioModel.__init__(self, data)
            
        self.name = self.name or ''
        self.refs = self.refs or {}
        self.visibility = self.visibility or 'private'
        self.owner = self.owner or ''
    
        # Non persistent field
        self._connections = self._connections or []
    
    def _save(self):
        logger.debug("Performing network specific saving")
        for con in self._connections:
            con.save()
            
class Node(BioModel):
    _col="node"
    def __init__(self, data=None, entity=None):
        BioModel.__init__(self, data)
        if(entity):
            self.entity = entity._id            
            self.label = self.label or entity.label or entity.name
            self.group = self.group or entity.group
            
            self._entity = entity 
        self.role = self.role or ''
    
    def _save(self):
        logger.debug("Performing Node specific saving")
        if self._entity: self._entity.save()
        
class Entity(BioModel):
    """
    Primary id: 
        enti_up_xxxxx   (for genes, uisng unioric number)
        
    """
    _col='entity'
    def __init__(self, data=None):
        BioModel.__init__(self, data)
        
        self.group = self.group or ''  # protein, gene etc
        self.cats = self.cats or {}  #  dictionary of categories organism: human 
        self.label=self.label or '' # short label
        self.name= self.name or '' # full name
        self.alias = self.alias or []  # list of aliases
        self.dbref = self.dbref or {}  # DB reference, such as UniProcKB or CHEBI etc
        self.refs = self.refs or {}
        
        # Non persisten fields        
        
        
class Connection(BioModel):
    """
    Primary id: 
        conn_   (for genes, uisng unioric number)
        
    """
    _col="connection"
    def __init__(self, data=None):
        BioModel.__init__(self, data)
            
        
        """
        Arbitrary References
            pubmed: pubmed id, i.e., 15102471            
            intact: intact id, i.e., EBI-2433438
        """
        self.refs = self.refs or  {}
        """
        Wrapper over physical entities
        """
        self.nodes = self.nodes or []
        self.type  = self.type or ''
                
        """
        entity objects
        """
        self._entities = self._entities or []        
        self._nodes = self._nodes or []        

    def validate(self):
        if(len( self.nodes) != len(self.entities)):
            raise Exception("Number of nodes and entities in a connection should agree")
        if not self.network:
            raise Exception("Missing required field: network")
    def _save(self):
        logger.debug("Performing Connection specific saving")
        for node in self._nodes:
            node.save()
      
class Publication(BioModel):
    """
    Primary id: 
        publ_           
    """    
    _col="publication"    
    def __init__(self, data=None):
        BioModel.__init__(self, data)
        
        """
        Arbitrary References
            pubmed: pubmed id, i.e., 15102471            
            intact: intact id, i.e., EBI-2433438
        """
        self.refs = self.refs or  {}
        self.pubmed_id = self.pubmed_id or ''
        self.authors = self.authors or []

class Association(BaseModel):
    _col = 'association'
    _index=['name']
    def __init__(self, data=None):
        BaseModel.__init__(self, data)
        
        self.name= self.name or ''
        self.group = self.group or ''
        if self.name: self._id = 'asso_%s' %self.name

class Experiment(BioModel):
    pass


class PreconProfile(UserenaLanguageBaseProfile ):
    user = models.OneToOneField(User,
                                unique=True,
                                verbose_name= 'user',
                                related_name='my_profile')
    favourite_snack = models.CharField( 'favourite snack' ,
                                       max_length=5)
prefix_mapping =  {'netw':'network' , 'ntwk':'network', 'enti':'entity', 'node':'node', 'conn': 'connection', 'publ':'publication'}