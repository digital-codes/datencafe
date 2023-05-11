#!/bin/bash

PROCESS=reqserver.py
STARTCMD="/usr/bin/python3.10 /home/akugel/html/daten.cafe/ws/$PROCESS"

if [ -z "$(ps -ef | grep $PROCESS | grep -v grep)" ]; then
    # echo "$PROCESS is not running, starting..."
    nohup $STARTCMD  >/dev/null 2>&1 &
fi

