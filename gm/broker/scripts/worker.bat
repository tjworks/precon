@echo off
cls
set broker=target/genemania-broker-2.4.0-jar-with-dependencies.jar
java -Xms512m -Xmx1g -classpath %broker% org.genemania.broker.Worker
