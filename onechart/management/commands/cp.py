#!/usr/bin/env python
import os
import sys
from django.core.management.base import BaseCommand
import subprocess

skips = ['manage.py']

class Command(BaseCommand):
   
    help = "Transfer local changed files to remote server."

    def handle(self, *args, **options):
        #output =os.system("svn status")    
        output = subprocess.check_output("svn status")
          
        for line in output.split('\n'):
            tup = line.split()
            if not (tup and len(tup)>1): continue
            code = tup[0]
            filename = tup[1]
            if not (code and filename): continue
            if ".py" not in filename: continue
            if os.path.basename(filename) in skips: continue        
            
            if args and len(args)>0:
                if args[0] not in filename: continue
            
            if code == 'M' or code =='A':                
                cmd = "pscp -i c:\\tools\\gfwest.ppk %s ec2-user@test.gameface.me:tj/%s" %(filename , filename.replace('\\', '/') )
                print cmd
                res = subprocess.check_output(cmd)
                print res
