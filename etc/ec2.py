# Tips
#        Must be same region to share images
#        For windows, the API key can be stored in a file and configure the BOTO_CONFIG env setting 
#        Must connect to correct region! (Default is US-east)
#        

# Manual AWS account setup:

# Secruity group: default, allows 22, 80, 443 to 0.0.0.0
# Keypair :  name must be gameface, using gameface-west.pub

#[Credentials]
#aws_access_key_id=AKIAJDPLRPB44XYQC6YQ
#aws_secret_access_key=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


from boto.ec2.connection import EC2Connection
from boto.ec2 import connect_to_region
import boto, sys
from time import gmtime, strftime, sleep


staging = {
    'keyID':'AKIAI3QUICPCWFY36FCQ',
    'accessKey':'6O5QiNknYGP4Gty5Mm0H3ehGgJ1Cb+wrxCbh7H72',
    'accountID':'109784664566',
    'name':'john',
    'keypair':'gfwest',
    'security_groups':['default'],
    'regionName':'us-west-1',
    'zone':'us-west-1b'
}

econ=None
active_profile = None

def log(msg):
    tm = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    print "%s - %s" %(tm , msg)


def connect(profile=staging):
    global active_profile,econ    
    active_profile = profile    
    econ = connect_to_region(profile["regionName"],aws_access_key_id=profile["keyID"], aws_secret_access_key=profile["accessKey"])
    if(econ):
       log("Connected to %s " % profile['name'])

def instances(echo=True):
    __checkCon()
    ret = []
    instances = econ.get_all_instances()
    for r in instances:
        if echo:  print "id=%s,state=%s,dns=%s" %(r.instances[0].id, r.instances[0].state, r.instances[0].public_dns_name)
        #print dir(r.instances[0])
        ret.append(r.instances[0])
        #ret.append({'id': r.instances[0].id, 'state': r.instances[0].state, 'public_dns_name': r.instances[0].public_dns_name})
    return ret
    
def images(echo=True):
    __checkCon()
    images = econ.get_all_images(owners='self')
    for i in images:         
        if(echo): print "id=%s, name=%s, state=%s" %(i.id, i.name,i.state)
    return images

def ex_images(echo=True):
    __checkCon()
    images = econ.get_all_images(executable_by='self')
    for i in images:         
        if(echo): print "id=%s, name=%s, state=%s" %(i.id, i.name,i.state)
    return images
    
def start(instance_id):
    __checkCon()
    instance_id = __instance_id(instance_id)
    econ.start_instances([instance_id])
    print 'Done'
    
def stop(instance_id):
    __checkCon()
    instance_id = __instance_id(instance_id)
    econ.stop_instances([instance_id])
    print 'Done'
    
def create_image(instance_id, name='GamefaceImage'):
    """
    Create image from specified instance
    
    @name descriptive name of the image    
    """
    __checkCon()
    instance_id = __instance_id(instance_id)
    imgid = econ.create_image(instance_id, name)
    print 'New image id: %s' %imgid
    return imgid

def del_image(id):
    """Deregister image"""
    id = __image_id(id)
    print 'Done' if econ.deregister_image(id) else 'Failed'
    
    
def terminate(instance_id):
    __checkCon()
    instance_id = __instance_id(instance_id)
    econ.terminate_instances([instance_id])
    print 'Done'

def ips(echo=True):
    __checkCon()
    addrs = econ.get_all_addresses()
    for r in addrs:
        if echo: print "ip=%s, instance=%s " %(r.public_ip, r.instance_id)
    #print "Done"
    return addrs

def allocate():
    """Allocate a new address"""
    __checkCon()
    return econ.allocate_address()

def release(ip):
    """Release an elastic IP """
    __checkCon()
    ip = __ip_addr(ip) 
    print 'Done' if econ.release_address(ip) else 'Failed'
    
def share_img(img_id, acct_id):
    """Grant image launch permission to other AWS account"""
    __checkCon()
    img_id = __image_id(img_id)
    econ.modify_image_attribute(img_id, attribute='launchPermission', operation='add', user_ids=[acct_id])
    print 'Done'
    
def associate(instance_id, ip):
    """ associate ip to the instance """
    __checkCon()
    
    instance_id = __instance_id(instance_id)
    ip =  __ip_addr(ip) 
    print "Done" if econ.associate_address(instance_id, ip) else "Failed"
    
def set_data(instance_id, attr, value):
    __checkCon()
    instance_id = __instance_id(instance_id)
    print 'Done' if econ.modify_instance_attribute(instance_id, attr, value) else 'Failed'

def get_attr(instance_id, attr):
    __checkCon()
    instance_id = __instance_id(instance_id)
    try:
        return econ.get_instance_attribute(instance_id, attr)
    except:
        print 'Invalid attribute'
    
def launch(img_id, type='t1.micro', tag=None):
    """ launch an ec2 instance"""
    __checkCon()
    img_id = __image_id(img_id)
    r = econ.run_instances(img_id, user_data=None, instance_type=type, key_name=active_profile['keypair'], security_groups = active_profile['security_groups'], placement=active_profile['zone'])
    if tag and r: add_tag(r.instances[0].id, tag)
    return r.instances[0].id
    
def snapshots(echo=True):
    """ list my snapshots """
    __checkCon()
    snaps = econ.get_all_snapshots(owner='self')    
    for s in snaps:
        if echo: print "id=%s, vol=%s, size=%d, status=%s, tags=%s,  %s" %(s.id, s.volume_id, s.volume_size, s.status, s.tags, s.description)
    return snaps
    
def del_snapshot(sid):
    "delete snapshot"""
    __checkCon()
    sid = __snap_id(sid)
    print 'Done' if econ.delete_snapshot(sid) else 'Failed'
    
def create_snapshot(vol_id, description=None):
    """
    Create snapshot from specified volume
    
    """
    __checkCon()
    vol_id = __volume_id(vol_id)
    sid = econ.create_snapshot(vol_id, description)    
    return sid

def share_snapshot(sid, acct_id):
    """Share snapshot with someone so he can create a volume from it"""
    sid = __snap_id(sid)
    print 'Done' if econ.modify_snapshot_attribute(sid, attribute='createVolumePermission', operation='add', user_ids=[acct_id]) else 'Failed'
    
def volumes(echo=True):
    """ list volumes"""
    __checkCon()
    vols = econ.get_all_volumes()
    for v in vols:
        if echo: print "id=%s, size=%d, status=%s, snapshot_id=%s tags=%s" %(v.id, v.size, v.status, v.snapshot_id, v.tags)    
    return vols

def attach_volume(vid, instance_id, device='/dev/sdh'):
    vid = __volume_id(vid)
    instance_id = __instance_id(instance_id)
    econ.attach_volume(vid, instance_id, device)

def create_volume(size=8, snapshot=None, tag=None):
    """create new volume"""
    vol = econ.create_volume(size, active_profile['zone'], snapshot=snapshot)
    if vol and tag: vol.add_tag(tag)
    return vol.id
def add_tag(resource_id, tag, val=''):    
    tag = {tag: val}
    econ.create_tags(resource_id, tag)
def del_volume(vid):
    vid = __volume_id(vid)    
    econ.delete_volume(vid)
def detach_volume(vid, instance_id=None, device=None, force=False):
    vid = __volume_id(vid)
    econ.detach_volume(vid, instance_id)

def open_firewall(cidr, from_port, to_port=None):
    """
    cidr:  in the form of ip/mask, i.e., 192.168.1.2/24
    from_port: port to be opened
    to_port: 
    """
    if not to_port: to_port = from_port
    return econ.authorize_security_group(group_name=active_profile['security_groups'][0], ip_protocol='tcp', from_port=from_port, to_port=to_port, cidr_ip= cidr)

def authorize_ssh(ip):
    return econ.authorize_security_group(group_name=active_profile['security_groups'][0], ip_protocol='tcp', from_port='22', to_port='22', cidr_ip= "%s/32" %ip)

def __checkCon():
    if( not econ): raise BaseException("Not connected")




WAIT_TIME=5


def __instance_id(id):
    if(type(id) == int): id = instances(False)[id].id
    return id
def __image_id(id):
    if(type(id) == int): 
        imgs = images(False)
        if(len(imgs)>id): return imgs[id].id
        imgs = ex_images(False)
        if(len(imgs)>id): return imgs[id].id    
    return id
def __ip_addr(addr):
    if(type(addr) == int): addr = ips(False)[addr].public_ip
    return addr
    
def __snap_id(id):
    if(type(id) == int): id = snapshots(False)[id].id
    return id
    

def __volume_id(id):
    if(type(id) == int): id = volumes(False)[id].id
    return id

# wait for the condition defined by func() becomes true, or timeout
def waitFor(func, step=1, timeout=300):
    while timeout>0:
        if(func()): break
        sleep(step)        
        timeout -= step
        
#create a default connection    




""" 
# Mount volume on EC instance
1) create dir /data

2) Format(for new volume)
    mkfs -t ext4 /dev/sdh
    
3) Add this to /etc/fstab
  /dev/xvdh    /data       ext4    noatime         0   0

"""
