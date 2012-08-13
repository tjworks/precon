"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from myutil.fileutil import contentsOfFile
from onechart import settings
from onechart.models import BaseModel, Network
import json
import os
import unittest
import xml.dom

class PersistTest(TestCase):

    def test_savenetwork(self):
        settings.MONGODB_NAME = 'octest'        
        
        raw = "{'_nodes': [{'_id': 'node13448668499547680-new', 'label': 'TTT', 'entity': ''}], 'name': 'abcde', 'connections': ['conn_mll_tsc2', 'conn13448668609469805-new'], 'owner': 'abc4_onechart.com', 'nodes': ['node13448668499547680-new'], '_id': 'netw13448668795386140-new', '_connections': [{'entities': ['enti_up_P49815', ''], 'nodes': ['node120810102011296361', 'node13448668499547680-new'], '_id': 'conn13448668609469805-new', 'type': 'inhibits', 'id': 'conn13448668609468747-new'}]}"
        raw = """
                {"owner":"abc4_onechart.com","name":"abcde","_connections":[{"nodes":["node120810102011296361","node13448668499547680-new"],
                "type":"inhibits","id":"conn13448668609468747-new","_id":"conn13448668609469805-new","entities":["enti_up_P49815",""]}],
                "connections":["conn_mll_tsc2","conn13448668609469805-new"],"nodes":["node13448668499547680-new"],"_nodes":[{"entity":"","label":"TTT","_id":"node13448668499547680-new"}],
                "_id":"netw13448668795386140-new"}
                """
        data = json.loads(raw)        
        m = Network(data)
        m.name = "TestNetwork-1"
        m.save()
        
