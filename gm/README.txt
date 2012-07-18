
GeneMANIA Source Snapshot
=========================


Components
----------

The software is distributed as the following
set of modules:

 - common: shared classes
 - engine: algorithm code
 - broker: stand-alone program for out-of-web-container algorithm execution
 - website: front-end web-application


Build Requirements
------------------

The GeneMANIA software is configured and built using the Maven2 build tool. The
minimum local requirements for building from source are:

 - Java 6 JDK
 - Maven2: http://maven.apache.org/ 

Library dependencies will be automatically retrieved by the build tool.


Build Configuration
-------------------

The maven 'profile' mechanism is used to configure build and deployment
parameters. A default profile called 'local' is included in the broker and
website modules and is intended for local (developer) deployment and testing.
This profile may be copied and customized for other, e.g. production,
installations. 

The local profile assumes the following folders exist in the developers
home directory:

  ${HOME}/genemania: top-level folder for runtime files
  ${HOME}/genemania/apache-tomcat: installation of tomcat
  ${HOME}/genemania/genemania-data: organism data folder
  ${HOME}/genemania/genemania-data/index: metadata sub-folder
  ${HOME}/genemania/genemania-data/cache: network data sub-folder

Refer to the profiles section of the broker and website pom.xml files for these
and other parameters.


Build Steps
-----------

The modules should be built in the following order (cmd line example):

  cd common; mvn install
  cd ../engine; mvn install
  cd ../broker; mvn install assembly:assembly
  cd ../website; mvn package   

This creates a configured, deployable war file website/target/genemania.war


Runtime requirements
--------------------

The web application consists of two parts, the front-end application running in
a servlet container, and a backend consisting of one or more worker processes
that execute the computations. Communication between the two is mediated by the
ActiveMQ middleware application. That is, the following are required to deploy a
running application in addition to the build artifacts:

 - Tomcat 6: http://tomcat.apache.org/
 - ActiveMQ: http://activemq.apache.org/
 - Dataset (contact the GeneMANIA team)
 - Java 6 JRE


Deployment
----------

To start an instance of the application:

 - copy the genemania-data to the configured location
 - deploy the web application archive 'genemania.war' to the tomcat webapps folder.
 - start one or more worker processes (see below)
 - start an ActiveMQ instance with default configuration
 - start tomcat

For a default tomcat config, the web application should be viewable at:

  http://localhost:8080/genemania


Workers
-------

The worker component can be found in the broker/target/ directory as
genemania-broker-VERSION-jar-with-dependencies.jar. To start the worker use

  java -Xms512m -Xmx1g -classpath genemania-broker-VERSION-jar-with-dependencies.jar org.genemania.broker.Worker

allocating more memory can improve performance, for example on a 64 bit java vm:

  java -Xms512m -Xmx3g -d64 -classpath genemania-broker-VERSION-jar-with-dependencies.jar org.genemania.broker.Worker



TJ's Notes:
	- install Tomcat 6(admin/prec0n), activemq, apache maven
	- added build.xml
	- modify website/pom.xml for tomcat user name/password
	- copy/link data dir: $HOME/genemania/genemania-data
	- rename dir to cache & index
	- build (refer to above instruction)
	- start activemq (bin/activemq)
	- start worker: java -Xms512m -Xmx1g -classpath genemania-broker-2.8.0-jar-with-dependencies.jar org.genemania.broker.Worker
	- copy war file to tomcat/webapps
	- start tomcat
