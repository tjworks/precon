"""
Database unique ID tool
"""
from myutil.dateutil import getTime
import random
import math
import time
def generate(prefix=None, digits = 24):
    """
    Generates a random ID number, prefixed with up to first 4 letters of the "prefix"
    
    For example: nod20394823
    """
    random.seed()
    num = int(random.random() * math.pow(10, 6))
    
    #TBD: check db to see if it already exists
    return "%s%s%s" %(prefix[0:4], time.strftime("%y%m%d%H%M%S"), num) 
    