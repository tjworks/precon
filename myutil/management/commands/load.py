
from django.core.management.base import NoArgsCommand, BaseCommand
from inout import demo
from optparse import make_option
import os
import sys
import traceback

modules = "etc.aws.ec2,etc.aws.backup, etc.scripts.dbtool, gameface,gameface.service,gameface.models.User,gameface.models.Face,gameface.management.commands.gfshell,gameface.management.commands.misc"

    
class Command(BaseCommand):
    option_list = NoArgsCommand.option_list + (
        make_option('-f', '--file', dest='inputfile', help="full path to the input file" ),       
    )
    help = """
        Performs various data importing tasks.
        
        python manage.py load csv -f demodata.csv
        """

    requires_model_validation = True

    def handle(self, *args, **options):
        #from inout import mif 
        #mif.importmif()
        #self.registery()
        
        if args[0] == 'csv':            
            load_csv( options.get('inputfile', None))            
    
def load_csv(filename=None):
    print "Import csv file: %s" %filename
    #Node A    Node A Category    Node A Primary Ref    Node B    Node B Catergory    Node B Database ID    Edge/Relationship    Reference    Network
    #Metformin (1,1-dimethylbiguanide)    Chemical    CHEBI:6801    blood glucose concentration    Metabolite        decreases    Pubmed: 19465464;18945920    metfromin diabete network
    filename = filename or 'c:/work/caida/Dropbox/precon/NetworkFormat/demodata.csv'
    from inout import csvloader
    loader = csvloader.CSVLoader(file = filename)
    networks,errors = loader.load()
    if errors:
        print errors
    else:
        for name, network in networks.items():
            network.save()