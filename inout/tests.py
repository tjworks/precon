"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from inout import pubmed


class InoutTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
    
    def test_export_lig(self):
        ids='19465464,18945920'.split(",")
        ret = pubmed.exportReference(ids)
        self.assertTrue(ret)
        print "##%s##" %ret
        self.assertIn('TY  - JOUR', ret)
       

sample_ris= """
PMID- 19465464
OWN - NLM
STAT- MEDLINE
DA  - 20090525
DCOM- 20090707
LR  - 20120306
IS  - 1756-1833 (Electronic)
IS  - 0959-535X (Linking)
VI  - 338
DP  - 2009
TI  - Newer agents for blood glucose control in type 2 diabetes: summary of NICE
      guidance.
PG  - b1668
LID - 10.1136/bmj.b1668 [doi]
LID - bmj.b1668 [pii]
AD  - Cambridge University Hospitals NHS Foundation Trust, Cambridge CB2 0QQ.
      aia31@medschl.cam.ac.uk
FAU - Adler, Amanda I
AU  - Adler AI
FAU - Shaw, Elizabeth J
AU  - Shaw EJ
FAU - Stokes, Tim
AU  - Stokes T
FAU - Ruiz, Francis
AU  - Ruiz F
CN  - Guideline Development Group
LA  - eng
PT  - Journal Article
DEP - 20090522
PL  - England
TA  - BMJ
JT  - BMJ (Clinical research ed.)
JID - 8900488
RN  - 0 (Blood Glucose)
RN  - 0 (Dipeptidyl-Peptidase IV Inhibitors)
RN  - 0 (Hypoglycemic Agents)
RN  - 0 (Insulin)
RN  - 0 (Peptides)
RN  - 0 (Thiazolidinediones)
RN  - 0 (Venoms)
RN  - 141732-76-5 (exenatide)
SB  - AIM
SB  - IM
MH  - *Blood Glucose
MH  - Decision Making
MH  - Diabetes Mellitus, Type 2/*drug therapy
MH  - Dipeptidyl-Peptidase IV Inhibitors/therapeutic use
MH  - Humans
MH  - Hypoglycemic Agents/*therapeutic use
MH  - Insulin/therapeutic use
MH  - Peptides/therapeutic use
MH  - *Practice Guidelines as Topic
MH  - Thiazolidinediones/therapeutic use
MH  - Venoms/therapeutic use
IR  - Adler A
FIR - Adler, Amanda
IR  - Allerdyce C
FIR - Allerdyce, Claudette
IR  - Doherty T
FIR - Doherty, Tony
IR  - Farmer A
FIR - Farmer, Andrew
IR  - Goenka N
FIR - Goenka, Niru
IR  - Hadley-Brown M
FIR - Hadley-Brown, Martin
IR  - Home P
FIR - Home, Philip
IR  - Ivory P
FIR - Ivory, Philip
IR  - Johns Y
FIR - Johns, Yvonne
IR  - Lewin I
FIR - Lewin, Ian
IR  - McGuire A
FIR - McGuire, Alistair
IR  - Wood J
FIR - Wood, Julie
IR  - Ayiku L
FIR - Ayiku, Lynda
IR  - Banks E
FIR - Banks, Emma
IR  - Elliott N
FIR - Elliott, Nicole
IR  - Heath M
FIR - Heath, Michael
IR  - Ruiz F
FIR - Ruiz, Francis
IR  - Shaw E
FIR - Shaw, Elizabeth
IR  - Stokes T
FIR - Stokes, Tim
EDAT- 2009/05/26 09:00
MHDA- 2009/07/08 09:00
CRDT- 2009/05/26 09:00
PST - epublish
SO  - BMJ. 2009 May 22;338:b1668. doi: 10.1136/bmj.b1668.

PMID- 18945920
OWN - NLM
STAT- In-Process
DA  - 20081230
IS  - 1935-5548 (Electronic)
IS  - 0149-5992 (Linking)
VI  - 32
IP  - 1
DP  - 2009 Jan
TI  - Medical management of hyperglycemia in type 2 diabetes: a consensus algorithm for
      the initiation and adjustment of therapy: a consensus statement of the American
      Diabetes Association and the European Association for the Study of Diabetes.
PG  - 193-203
AB  - The consensus algorithm for the medical management of type 2 diabetes was
      published in August 2006 with the expectation that it would be updated, based on 
      the availability of new interventions and new evidence to establish their
      clinical role. The authors continue to endorse the principles used to develop the
      algorithm and its major features. We are sensitive to the risks of changing the
      algorithm cavalierly or too frequently, without compelling new information. An
      update to the consensus algorithm published in January 2008 specifically
      addressed safety issues surrounding the thiazolidinediones. In this revision, we 
      focus on the new classes of medications that now have more clinical data and
      experience.
AD  - Diabetes Center, Massachusetts General Hospital, Boston, Massachusetts, USA.
      dnathan@partners.org
FAU - Nathan, David M
AU  - Nathan DM
FAU - Buse, John B
AU  - Buse JB
FAU - Davidson, Mayer B
AU  - Davidson MB
FAU - Ferrannini, Ele
AU  - Ferrannini E
FAU - Holman, Rury R
AU  - Holman RR
FAU - Sherwin, Robert
AU  - Sherwin R
FAU - Zinman, Bernard
AU  - Zinman B
CN  - American Diabetes Association
CN  - European Association for Study of Diabetes
LA  - eng
PT  - Journal Article
DEP - 20081022
PL  - United States
TA  - Diabetes Care
JT  - Diabetes care
JID - 7805975
SB  - IM
CIN - Diabetes Care. 2009 May;32(5):e58; author rely e59. PMID: 19407068
CIN - Diabetes Care. 2009 Mar;32(3):e34; author reply e37-8. PMID: 19246585
CIN - Diabetes Care. 2009 Mar;32(3):e35-6; author reply e37-8. PMID: 19246586
PMC - PMC2606813
OID - NLM: PMC2606813
EDAT- 2008/10/24 09:00
MHDA- 2008/10/24 09:00
CRDT- 2008/10/24 09:00
PHST- 2008/10/22 [aheadofprint]
PHST- 2008/12/17 [aheadofprint]
AID - dc08-9025 [pii]
AID - 10.2337/dc08-9025 [doi]
PST - ppublish
SO  - Diabetes Care. 2009 Jan;32(1):193-203. Epub 2008 Oct 22.
"""