from django.contrib.auth.models import User
from django.db import models
from userena.models import UserenaLanguageBaseProfile

class BaseModel(dict):
    def __init__(self, data=None):
        if(data):
            self.update(data)
            #self.id = self._id if self._id else None
        
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

    def PK(self):
        """
        Helper method to return a Mongo query based on primary key
        """
        return {'_id': self._id}

class Network(BaseModel):
    """
    Primary id: ntwk_DB_DBID  e.g.e, ntwk_intact_1039473
    """
    def __init__(self, data=None):
        BaseModel.__init__(self, data)
        if(data):self.update(data)
        self._col = 'network'
        
        self.name = self.name or ''
        self.refs = self.refs or {}
    
class Node(BaseModel):
    def __init__(self, data=None):
        BaseModel.__init__(self, data)
        if(data):self.update(data)
        self.entity = self.entity or ''
        self.role = self.role or ''
        
        """
        refs
            entity:  id pointing to physical entity in entity collection
            intact:  id in IntAct db 
        """
        self.refs = self.refs or {}
        self.type = self.type or ''
        
class Entity(BaseModel):
    """
    Primary id: 
        enti_up_xxxxx   (for genes, uisng unioric number)
        
    """
    def __init__(self, data=None):
        BaseModel.__init__(self, data)
        if(data):self.update(data)
        
        self._id = self._id or '' 
        self.group = self.group or ''  # protein, gene etc
        self.org = self.org or ''  # organism: human 
        self.label=self.label or '' # short label
        self.name= self.name or '' # full name
        self.alias = self.alias or []  # list of aliases
        self._col = 'entity'
        
class Connection(BaseModel):
    """
    Primary id: 
        conn_   (for genes, uisng unioric number)
        
    """
    PHYSICAL_ASSOCIATION = 1
    
    def __init__(self, data=None):
        if(data): self.update(data)
        
        self._id = self._id or ''        
        self.nodes = self.nodes or []
        """
        entity ids, this is a denormalization of the nodes.entity
        """
        self.entities = self.entities or []
        self._col = 'connection'

class Experiment(BaseModel):
    pass
class Participant(BaseModel):        
    pass    



class PreconProfile(UserenaLanguageBaseProfile ):
    user = models.OneToOneField(User,
                                unique=True,
                                verbose_name= 'user',
                                related_name='my_profile')
    favourite_snack = models.CharField( 'favourite snack' ,
                                       max_length=5)
    
"""
from mongoengine import *
import datetime
# Create your models here.

class User(Document):
    email=StringField(required=True, primary_key=True)
    password=StringField(required=True)
    meta = { 'indexes': ['email'] }

class Edge(Document):
    begin = StringField(required=True)
    end = StringField(required=True)
    interaction = StringField(required=False)
    level=IntField(default=0)
    author=ReferenceField(User)
    tags=ListField(field=StringField())
    #meta = { 'indexes': ['begin', 'end', {'fields':'author', 'sparse':True} ] }
class Network(Document):
    name = StringField(required=True)
    category = StringField()
    version = IntField(default=1)
    tmstamp = DateTimeField(default=datetime.datetime.now)
    owner=ReferenceField(User)
    edges=ListField(field=ReferenceField(Edge))
    meta = { 'indexes': ['name', 'owner'] }
    
    
"""    