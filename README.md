
============================
precon project dev env setup
============================


Python and modules
-------------------
- Install python 2.7
- Install setup_tools for python: http://pypi.python.org/pypi/setuptools
- Install modules::

	easy_install django pymongo	requests

Git and Checkout
----------------
- Install Git client: http://git-scm.com/downloads
- Setup SSH keys accordingly: https://github.com/settings/ssh
- Open a shell window and run:  git clone git@github.com:precon/precon.git
- cd precon
- run.bat # this starts Django instance on port 80


Install Node.js (optional)
--------------------------
::

	sudo yum localinstall --nogpgcheck http://nodejs.tchol.org/repocfg/amzn1/nodejs-stable-release.noarch.rpm   
	sudo yum install nodejs-compat-symlinks npm
	cd ~
	npm install mongodb-rest
	cd ~/node_modules/mongodb-rest/bin
	mongodb-rest & 

Project configurations
----------------------
precon/onechart/settings.py
