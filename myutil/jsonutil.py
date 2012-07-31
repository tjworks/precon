"""
Database unique ID tool
"""
from myutil.objdict import ObjDict
import json
import math
import random

class JsonResponse(ObjDict):
    def __init__(self, data=None):
        super( JsonResponse, self ).__init__()
        self.data = data
        self.errors = []
        self.statusCode  = 200
    
    def addError(self, msg):
        self.errors.append(msg)
    
    def status(self, statusCode):
        if statusCode: self.statusCode = statusCode
        return self.statusCode
    
    def __repr__(self):
        
        data = json.dumps(self)
        error = '\n'.join( self.errors)
        code = self.statusCode