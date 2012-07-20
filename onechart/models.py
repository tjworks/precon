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


class Interactor(BaseModel):
    
    def __init__(self, data=None):
        if(data):self.update(data)
        
        self._id = self._id or '' 
        self.cat = self.cat or ''  # protein, gene etc
        self.org = self.org or ''  # organism: human 
        self.label=self.label or '' # short label
        self.name= self.name or '' # full name
        self.alias = self.alias or []  # list of aliases
        self.uniproc_id = self.uniproc_id or ''  # uniproc id
        self.psi_id = self.psi_id or ''
        
        
class Interaction(BaseModel):
    PHYSICAL_ASSOCIATION = 1
    def __init__(self, data=None):
        if(data): self.update(data)
        
        self._id = self._id or ''
        self.src = self.src or ''
        self.target=self.target or ''
        self.cat=self.cat or ''

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