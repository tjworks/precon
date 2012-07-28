"""
Thunder Chen<nkchenz@gmail.com> 2007.9.1
"""
from myutil.objdict import ObjDict
from xml.etree.ElementTree import XMLParser, TreeBuilder
import re
import requests
import xml.etree.ElementTree as ET
#from object_dict import object_dict

class XML2Dict(object):

    def __init__(self):
        pass

    def _parse_node(self, node):
        node_tree = ObjDict()
        # Save attrs and text, hope there will not be a child with same name
        if node.text:
            node_tree.value = node.text
        for (k,v) in node.attrib.items():
            k,v = self._namespace_split(k, ObjDict({'value':v}))
            node_tree[k] = v
        #Save childrens
        for child in node.getchildren():
            tag, tree = self._namespace_split(child.tag, self._parse_node(child))
            if  tag not in node_tree: # the first time, so store it in dict
                node_tree[tag] = tree
                continue
            old = node_tree[tag]
            if not isinstance(old, list):
                node_tree.pop(tag)
                node_tree[tag] = [old] # multi times, so change old dict to a list       
            node_tree[tag].append(tree) # add the new one      

        return  node_tree


    def _namespace_split(self, tag, value):
        """
           Split the tag  '{http://cs.sfsu.edu/csc867/myscheduler}patients'
             ns = http://cs.sfsu.edu/csc867/myscheduler
             name = patients
        """
        result = re.compile("\{(.*)\}(.*)").search(tag)
        if result:
            value.namespace, tag = result.groups()    
        return (tag, value)

    def parse(self, file):
        """parse a xml file to a dict"""
        f = open(file, 'r')
        return self.fromstring(f.read()) 

    def fromstring(self, s):
        """parse a string"""                
        t = ET.fromstring(s)
        root_tag, root_tree = self._namespace_split(t.tag, self._parse_node(t))
        return ObjDict({root_tag: root_tree})

    def fromurl(self, url):
        """parse a url"""
     
        """Returns the string fetched from the given URL.
        
        Uses the urlfetch interface to get the contents of a given URL.  The
        memcache version will be returned if recent.
        
        Args:
          url: The url to fetch.
        
        Raises:
          LookupError: The URL was not able to be fetched.
        """
        #content = memcache.get(url)
        #if content: return content
        r = requests.get(url)
         
        if r.status_code == 200:
            from django.utils.encoding import smart_str, smart_unicode
            #a = u'\xa1'
            content = smart_str(r.text)
            #content = unicode(r.text, "utf-8")
            #content = unicode(content.decode("utf-8"))
            #memcache.add(url, content, 60 * 60)
            return self.fromstring(content)
        return None

if __name__ == '__main__':
    s = """<?xml version="1.0" encoding="utf-8" ?>
    <result>
        <count n="1">10</count>
        <data><id>491691</id><name>test</name></data>
        <data><id>491692</id><name>test2</name></data>
        <data><id>503938</id><name>hello, world</name></data>
    </result>"""

    xml = XML2Dict()
    r = xml.fromstring(s)
    from pprint import pprint
    pprint(r)
    print r.result.count.value
    print r.result.count.n

    for data in r.result.data:
        print data.id, data.name 

    # Test file parsing
    pprint(xml.parse('a'))
