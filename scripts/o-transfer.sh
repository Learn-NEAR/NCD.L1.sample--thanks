#!/usr/bin/env bash

# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
# [ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo
echo 'About to call transfer() on the contract'
echo near call \$CONTRACT transfer --account_id \$OWNER
echo
echo \$CONTRACT is thanks.$OWNER
echo \$OWNER is $OWNER
echo
near call thanks.$OWNER transfer --account_id $OWNER
