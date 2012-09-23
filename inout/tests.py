"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from inout import pubmed
from myutil import fileutil


class InoutTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
    
    def test_export_lig(self):
        
       
        ids='19465464,18945920'.split(",")
        #ret = pubmed.exportReference(ids)
        sample_ris = fileutil.contentsOfFile("test/sample-medline.ris", False)
        #print "Sample %s" %sample_ris
        ret = pubmed.medline2ris(sample_ris)
        self.assertTrue(ret)
        fileutil.writeFile("tmp/output.ris", ret)
        print "##%s##" %ret
        self.assertIn('TY  - JOUR', ret)
        