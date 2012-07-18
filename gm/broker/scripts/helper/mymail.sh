#!/bin/bash

# Simple script that allows us to connect to an open SMTP
# server and send mail. 

if [[ $# -ne 4 ]]; then
	echo "usage: `basename $0` to from subject message"
	exit 0
fi

to=$1
from=$2
subj=$3
msg=$4

nc server1.baderlab.med.utoronto.ca 25 << EOF 2>&1 > /dev/null
ehlo localhost
mail from: $from
rcpt to: $to
data
Subject: $subj
From: $from
To: $to

$msg
.
quit
EOF

exit
