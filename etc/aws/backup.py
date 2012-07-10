#this script is intended to be called from command line, i.e., python backup.py

from ec2 import *
from time import gmtime, strftime

# today's date
DATA_SNAPSHOT_NAME_PATTERN = "Day-%d"

def daily_snapshot():
	""" 
	Perform a daily data snapshot 
	Only volumes with tag 'snapshot' as 'daily' will be snapshoted
		
	"""
	log("starting backup process")
	#connect to production system
	connect(prod)	
	snapname = strftime(DATA_SNAPSHOT_NAME_PATTERN, gmtime())
	
	log("Existing snapshots")
	snaps = snapshots()
	for s in snaps:
		if(s.description and s.description.find(snapname)>=0):
			log("Backup snapshot %s already exists, quiting." % snapname)
			return;
	
	log("Look for the data volume")
	for v in volumes(False):
		if not v.tags: continue
		if v.tags['snap'] == 'daily' and v.status == 'in-use':
			snapname = v.tags['label'] if 'label' in v.tags else ''
			snapname ="%s-%s" % (snapname, strftime(DATA_SNAPSHOT_NAME_PATTERN) )
			
			for s in snaps:
				if(s.description and s.description.find(snapname)>=0): 
					log("Found existing snapshot, deleting %s" %snapname)
					del_snapshot(s.id)
			snaps = snapshots()
			
		log("Creating snapshot: %s from volume %s " %(snapname, v.id))
		sid = create_snapshot(v.id, snapname)	
		log("Waiting for snapshot to complete")
		timeout = 600
		while timeout>0:
			if isSnapshotReady(sid): break
			sleep(5)		
			timeout -= 5
		
		if not isSnapshotReady(sid): raise Exception("Snapshot was not ready after 10 minutes, human intervention is called!")		 
		
def isSnapshotReady(sid):		
		if type(sid) != int: sid = sid.id
		snaps = snapshots(False)
		for s in snaps:
			if s.id == sid and s.status == 'completed':  return True
		return False
		

def hello():
	print 'Hello World'
	connect(staging)
	ins = instances()
	with open('hello.world', 'a') as f:
		f.write("====%s====\n%s" %(strftime('%m%d-%H%M'), ins))

if __name__ == 'main':
	daily_snapshot()