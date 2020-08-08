@echo off

IF "%1"=="" GOTO no_args

cd C:\Users\keato\Documents\games
git add *
git commit -a -m "%*"
GOTO :end

:no_args
echo "versionSave Your commit message here"

:end