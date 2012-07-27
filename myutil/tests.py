"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from onechart.models import BaseModel
import unittest
import xml.dom
import xml2json

class UtilTest(TestCase):

    def test_xml2json(self):
        url = "http://togows.dbcls.jp/entry/pubmed/16381885?format=xml"
        d = xml2json.Url2Dict(url)        
        m = BaseModel(d)
        print d['PubmedArticleSet']['PubmedArticle']['MedlineCitation']['PMID']
        self.assertTrue(d['PubmedArticleSet']['PubmedArticle']['MedlineCitation']['PMID'], "Hmm")
        return d
