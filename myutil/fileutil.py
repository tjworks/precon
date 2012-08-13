"""
Date utils
"""
from datetime import datetime
import os


DATE_SECONDS ='%Y-%m-%d %H:%M:%S'
DATE_MILLIS = '%Y%m%d %H:%M:%S.%f'
#9 >>> dt.microsecond
   

def writeFile(path, content, append=False):
    makeDir(os.path.dirname(path))
    try:
        fd = open(path, 'w' if not append else 'a')
        if isinstance(content, list):
            for line in content:
                fd.write(line.encode('UTF8', 'ignore'))
                if line[-1] != '\n': fd.write('\n')
        else:
            fd.write(content.encode('UTF8', 'ignore'))
        fd.close()
        return True
    except:
        return False
    
def makeDir(path):
    if os.path.exists(path) and os.path.isdir(path): return True
    try: os.makedirs(path)
    except: return False
    return True            

def contentsOfFile(path, strip=True):
    if os.path.exists(path):
        try:
            fd = open(path, 'rb')
            if strip: contents = fd.read().strip()
            else: contents = fd.read()
            fd.close()
            return contents
        except:
            pass
    return ''