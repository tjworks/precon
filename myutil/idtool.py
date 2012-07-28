"""
Database unique ID tool
"""
import random, math
def generate(prefix=None, digits = 24):
    """
    Generates a random ID number, prefixed with up to first 4 letters of the "prefix"
    
    For example: nod20394823
    """
    
    random.seed()
    num = int(random.random() * math.pow(10, digits))
    prefix = prefix or ""
    
    #TBD: check db to see if it already exists
    return ("%s%8d" %(prefix[0:4], num)).replace(' ', '0')
    