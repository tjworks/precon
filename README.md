
============================
precon project dev env setup
============================


Python and modules
============================
- Install python 2.7, select correct file based on your OS: http://www.python.org/getit/
- Install setup_tools for python: http://pypi.python.org/pypi/setuptools
- Once setup_tools installed, run following::

	    easy_install django pymongo	requests easy_thumbnails django-guardian cssselect tinycss
	    
- Following step is NOT required for now
	#easy_install pil 		
	#If "easy_install pil" does not work, you may also directly download at: http://effbot.org/downloads/PIL-1.1.7.win32-py2.7.exe


sudo yum install batik-rasterizer


Git and Checkout
============================
- Install Git client: http://git-scm.com/downloads
- Setup SSH keys accordingly: https://github.com/settings/ssh
- Open a shell window and run::


	  	git clone git@github.com:precon/precon.git
	  	cd precon
	  	run.bat # this starts Django instance on port 80


Optional: Setup Mongo on Windows 
=====================================




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
- Download db dump file: http://one-chart.com/assets/oc.tar.gz
- Extract to c:\
- Make sure you have a directory c:\oc
- Execute following dommands::
	
		
			c:\mongodb\bin\mongorestore c:\oc


Install Node.js 
---------------------------------
Node.js is used for serving REST data 

For Windows

- Download and install Node.js: http://nodejs.org/dist/v0.8.7/node-v0.8.7-x86.msi
 
For Linux


		sudo yum localinstall --nogpgcheck http://nodejs.tchol.org/repocfg/amzn1/nodejs-stable-release.noarch.rpm   
		sudo yum install nodejs-compat-symlinks npm
		cd ~
		cd precon/nodejs/bin
		mongodb-rest & 


Startup Mongo and Node.js for DB server
---------------------------------------
- Configure scripts to use local database

  - Open precon/static/ext/js/precon.client.js
  - find this line::
  
  		    api_base: 'http://one-chart.com:3000/oc',
  		  		
  - change to:
  
  		    api_base: 'http://localhost:3000/oc',
  		
- Start mongod:


		C:\mongodb\bin\mongod.exe

	
- Start REST service:


		  cd precon\nodejs\bin
  		node mongodb-rest
  
  
- Start Django Web server


		cd precon
		run.bat
	


