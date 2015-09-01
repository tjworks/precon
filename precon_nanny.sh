#!/bin/bash
# The script to monitor online servers.
# Consider later: use forever+upstart
#

log_backup_suffix=".old"
mongod_log="/home/ec2-user/mongolog.log"
mongod_key="mongod --logpath $mongod_log --dbpath /home/ec2-user/precon/data/ --unixSocketPrefix /home/ec2-user/precon/tmp/ --fork"
start_mongod_cmd="/home/ec2-user/mongodb-linux-x86_64-2.0.7/bin/mongod --logpath /home/ec2-user/mongolog.log --dbpath /home/ec2-user/precon/data/ --unixSocketPrefix /home/ec2-user/precon/tmp/ --fork"

nodejs_key="mongodb-rest"
start_nodejs_cmd="/home/ec2-user/precon/nodejs/bin/mongodb-rest"
nodejs_log="/home/ec2-user/rest.log"

server_key="run.bat" 
server_cmd_dir="/home/ec2-user/precon"
start_server_cmd="./run.bat"
server_log="/home/ec2-user/server.log"

sid=0

echo -e `date` " : Starting nanny in 5 seconds ..."
sleep 5

while true
do 
	sid=$(ps aux | grep "$mongod_key" | awk -F' ' '{if(match($0,"grep")<1) printf("%s\n",$2)}');
	if [ -z "$sid" ]
        then
                RUN_TIME=`date '+%Y-%m-%d %H:%M'`
                echo "$mongod_key does not exist. Now restart it.[$RUN_TIME]"
		cp $mongod_log $mongod_log$log_backup_suffix
        	$start_mongod_cmd
        	sleep 2
#	else
#		echo "$mongod_key does exist: $sid. Do nothing."
        fi

	sid=$(ps aux | grep "$nodejs_key" | awk -F' ' '{if(match($0,"grep")<1) printf("%s\n",$2)}');
        if [ -z "$sid" ]
        then
                RUN_TIME=`date '+%Y-%m-%d %H:%M'`
                echo "$nodejs_key does not exist. Now restart it.[$RUN_TIME]"
		cp $nodejs_log $nodejs_log$log_backup_suffix
                nohup $start_nodejs_cmd >> $nodejs_log 2>&1 &
                sleep 2
#	else
#		echo "$nodejs_key does exist: $sid. Do nothing."
        fi
	
	sid=$(ps aux | grep "$server_key" | awk -F' ' '{if(match($0,"grep")<1) printf("%s\n",$2)}');
        if [ -z "$sid" ]
        then
                RUN_TIME=`date '+%Y-%m-%d %H:%M'`
                echo "$server_key does not exist. Now restart it.[$RUN_TIME]"
		cp $server_log $server_log$log_backup_suffix
                cd $server_cmd_dir
		nohup $start_server_cmd >> $server_log 2>&1 &
                sleep 2
#	else
#		echo "$server_key does exist: $sid. Do nothing"
        fi

	sleep 5
done
exit
