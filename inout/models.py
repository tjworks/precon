from django.db import models

# Create your models here.

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

    def dump(self):
        output = '['
        for k in self: output += "%s:%s, " %(k, self[k])
        return output+"]"
    def lookup(self, obj, key, defaultValue):
        """
        helper method for looking up a key in a nested dictionary. will create one if not exist

        @obj Must be a dictionary
        @key  can use . notion to indicate the nested elemenst, i.e., games.earnings.gf_cons_earned_life
        @defultValue default value if one not exists
        """
        keys = key.split(".")
        for i, key in enumerate(keys):
            if key in obj:
                obj= obj[key]
            else:
                if(i + 1 < len(keys)):
                    # more to go
                    obj[key] = {}
                else:
                    # last one
                    obj[key] = defaultValue
                obj = obj[key]

        return obj if obj else defaultValue

