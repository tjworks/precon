#!/bin/sh 
function log_trace() {
    echo "[TRACE] "`date +"[%Y-%m-%d %H:%M:%S] >> "`$*
}

function log_error() {
    echo "[ERROR] "`date +"[%Y-%m-%d %H:%M:%S] >> "`$*
}


NOW_TO_YEAR=`date +%Y`
NOW_TO_DAY=`date +%Y%m%d`
NOW_TO_SECOND=`date +%Y%m%d_%H%M%S`

function cp_and_clear_daily() {
    # cp
    log_file_name=`basename $1`
    cmd_str="cp $1 ${log_file_name}_"$NOW_TO_DAY
    log_trace $cmd_str
    $cmd_str

    if [ $? -ne 0 ]; then
        log_error "Failed to '$cmd_str'"
    fi

    # clear
    cmd_str="> $1"
    log_trace $cmd_str
    #$cmd_str     -- NOT work this way !
    > $1

    if [ $? -ne 0 ]; then
        log_error "Failed to '$cmd_str'"
    fi
}

function delete_old_log_files() {
    log_dir=$1
    prefix=$2
    days=$3

    cmd_str="cd $log_dir"
    log_trace $cmd_str
    if [ $? -ne 0 ]; then
        log_error "Failed to '$cmd_str'"
    else
        find . -type f -mtime +$days -name "$prefix*.log*" | xargs -i rm {}               #saving $days days logs
    fi
}

##########
## main ##
##########
#rename log and cleanup older logs
log_dir=/home/ec2-user
server_log_prefix="server"
server_log="$server_log_prefix.log"
nodejs_log_prefix="rest"
nodejs_log="$nodejs_log_prefix.log"
nanny_log_prefix="nanny"
nanny_log="$nanny_log_prefix.log"

cp_and_clear_daily $log_dir/$server_log
cp_and_clear_daily $log_dir/$nodejs_log
cp_and_clear_daily $log_dir/$nanny_log

delete_old_log_files $log_dir $server_log_prefix 7
delete_old_log_files $log_dir $nodejs_log_prefix 7
delete_old_log_files $log_dir $nanny_log_prefix 7

