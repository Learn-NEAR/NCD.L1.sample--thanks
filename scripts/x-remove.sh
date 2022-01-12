#!/usr/bin/env bash

# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

# exit on first error after this point
set -e

echo "deleting thanks.$OWNER and setting $OWNER as beneficiary"
echo
near delete thanks.$OWNER $OWNER
