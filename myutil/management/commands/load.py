
from django.core.management.base import NoArgsCommand
from optparse import make_option
import os
import sys
import traceback

modules = "etc.aws.ec2,etc.aws.backup, etc.scripts.dbtool, gameface,gameface.service,gameface.models.User,gameface.models.Face,gameface.management.commands.gfshell,gameface.management.commands.misc"

    
class Command(NoArgsCommand):
    option_list = NoArgsCommand.option_list + (
        make_option('--plain', action='store_true', dest='plain',
            help='Tells Django to use plain Python, not IPython.'),
        make_option('--no-pythonrc', action='store_true', dest='no_pythonrc',
            help='Tells Django to use plain Python, not IPython.'),
    )
    help = "Like the 'shell' command but autoloads the models of all installed Django apps."

    requires_model_validation = True

    def handle(self, *args, **options):
        #from inout import mif 
        #mif.importmif()
        #self.registery()
        
        from inout import demo
        demo.load()        
        
    def registery(self):        
        import urllib2
        
        urlStr = 'http://www.ebi.ac.uk/Tools/webservices/psicquic/registry/registry?action=ACTIVE&format=txt'
        try:
            fileHandle = urllib2.urlopen(urlStr)
            content = fileHandle.read()
            fileHandle.close()
        except IOError:
            print 'Cannot open URL' % urlStr
            content = ''
        
        lines = content.splitlines()
        
        for line in lines:
            fields = line.split('=')
            print fields[0] + ' ---> ' + fields[1]
            
    def registery_detail(self):
        
        import urllib2
        import sys
        from xml.dom.ext.reader import Sax2
        from xml.dom.ext import PrettyPrint
        from xml.dom.NodeFilter import NodeFilter
        from xml import xpath
        
        urlStr = 'http://www.ebi.ac.uk/Tools/webservices/psicquic/registry/registry?action=STATUS&format=xml'
        
        # read the file
        try:
            fileHandle = urllib2.urlopen(urlStr)
            content = fileHandle.read()
            fileHandle.close()
        except IOError:
            print 'Cannot open URL' % urlStr
            content = ''
        
        # Create the XML reader
        reader = Sax2.Reader()
        
        doc = reader.fromString(content)
        
        #PrettyPrint(doc)
        
        totalCount = 0
        serviceCount = 0;
        activeCount = 0;
        
        # getting the service nodes
        serviceNodes = xpath.Evaluate('service', doc.documentElement)
        
        for serviceNode in serviceNodes:
            # Getting some of the elements for each node
            name = serviceNode.getElementsByTagName('name')[0].firstChild.nodeValue
            active = serviceNode.getElementsByTagName('active')[0].firstChild.nodeValue
            interactionCount = serviceNode.getElementsByTagName('count')[0].firstChild.nodeValue
            restUrl = serviceNode.getElementsByTagName('restUrl')[0].firstChild.nodeValue
            restExample = serviceNode.getElementsByTagName('restExample')[0].firstChild.nodeValue
        
            print 'Service: '+ name +' =========================================================================='
            print '\tActive: ' + active
            print '\tEvidences: ' + interactionCount
            print '\tREST URL: ' + restUrl
            print '\tREST Example: ' + restExample
        
            totalCount = totalCount + int(interactionCount)
            serviceCount = serviceCount + 1
        
            if bool(active):
               activeCount = activeCount + 1
        
        # Print totals
        print '\nTotal evidences: ' + str(totalCount)
        print 'Total services: ' + str(serviceCount)
        print '\tActive: ' + str(serviceCount)