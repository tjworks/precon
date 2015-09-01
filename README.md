
============================
precon/precogify project dev env setup
============================


1. install Python and modules
============================
- Install python 2.7, select correct file based on your OS: http://www.python.org/getit/
- Install setup_tools for python: http://pypi.python.org/pypi/setuptools
- Once setup_tools installed, run following::

	    easy_install django pymongo	requests easy_thumbnails django-guardian cssselect tinycss
	    
- Following step is NOT required for now
	#easy_install pil 		
	#If "easy_install pil" does not work, you may also directly download at: http://effbot.org/downloads/PIL-1.1.7.win32-py2.7.exe


sudo yum install batik-rasterizer

2. install mongodb
===================
The original system used version 2.0.7, can be downloaded from https://www.mongodb.org/dl/linux/x86_64
If installed higher version of mongodb, be careful of data compatible.


Install Mongo for Windows 64 bits
---------------------------------

Source: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/

- Download installer for windows 64 bits: http://www.mongodb.org/dr/downloads.mongodb.org/win32/mongodb-win32-x86_64-2.0.7.zip/download
- Extract to c:\
- Under command shell:: 
  
  
		  cd \
			move C:\mongodb-win32-* C:\mongodb
			md data
			md data\db
		  C:\mongodb\bin\mongod.exe
	
		  
- You might want to add "c:\mongodb\bin" to your PATH
- Download db dump file: http://localhost/assets/oc.tar.gz
- Extract to c:\
- Make sure you have a directory c:\oc
- Execute following dommands::
	
		
			c:\mongodb\bin\mongorestore c:\oc

3. Git and Checkout
============================
- Install Git client: http://git-scm.com/downloads
- Setup SSH keys accordingly: https://github.com/settings/ssh
- Open a shell window and run::


                git clone git@github.com:precon/precon.git
                cd precon
                run.bat # this starts Django instance on port 8200

4. Install Node.js 
===================
---------------------------------
Node.js is used for serving REST data 

For Windows

- Download and install Node.js: http://nodejs.org/dist/v0.8.7/node-v0.8.7-x86.msi
 
For Linux


		sudo yum localinstall --nogpgcheck http://nodejs.tchol.org/repocfg/amzn1/nodejs-stable-release.noarch.rpm   
		sudo yum install nodejs-compat-symlinks npm

5. setup configuration
=======================

- replace all 52.25.168.18 with your local public ip address
- major configurations are done in onechart/setting.py
  * ADMINS is administrator account, fill as needed
  * create "log" and "tmp" dir under project root dir
  * set TEMPFILE_DIR  to be the absolute dir of tmp
  * set DATABASES default as mysql, setup the corresnpoinding parameters for accessing mysql
  * add "/yr/path/to/precon-master/static" to STATICFILES_DIRS 
  * add 'django.contrib.sessions.middleware.SessionMiddleware' to MIDDLEWARE_CLASSES 
  * add 'django.contrib.sessions' to INSTALLED_APPS

6. initialize mysql
  sudo chown mysql:mysql -R /var/lib/mysql/*
  sudo chmod 755 -R /var/lib/mysql/*
  sudo service mysql restart
  python manage.py syncdb
  python manage.py check_permissions
  # configure auto start after reboot
  sudo chkconfig --level 345 mysqld on

6. recover data
===============
download the initial oc data.
mongorestore --dbpath /yr/path/data /yr/dump/path

7. run nanny to startup all servers including mongo, nodejs, web server
- update precon_nanny.sh with the right pathes 
- run precon_nanny.sh


8. Once everything works, put nanny in node restart init
add the following lines in /etc/rc.local
-----------------start-----------
#start precon services
exec 2>/tmp/rc.local.log # send stderr from rc.local to a log file
exec 1>&2                # send stdout to the same log file
set -x                   # tell sh to display commands before execution
#service mysqld start
#sleep 5
su ec2-user /home/ec2-user/precon_nanny.sh
-------------------end---------
change the path accordingly.

9. setup ip port forwarding:

http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2
sudo vim /etc/sysctl.conf   
set net.ipv4.ip_forward =1
sudo sysctl -p /etc/sysctl.conf
cat /proc/sys/net/ipv4/ip_forward   #make sure it is 1
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
#we need to open the Linux firewall to allow connections on port 80
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT
