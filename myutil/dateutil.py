"""
Date utils
"""
from datetime import datetime


DATE_SECONDS ='%Y-%m-%d %H:%M:%S'
DATE_MILLIS = '%Y%m%d %H:%M:%S.%f'
#9 >>> dt.microsecond

def getTime(tm=None, format=DATE_SECONDS):
    tm = tm or datetime.utcnow()
    if type(tm) == float: tm= datetime.fromtimestamp(tm)
    return tm.strftime(  format )
    
    
        