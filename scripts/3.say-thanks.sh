#!/usr/bin/env bash

# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
# [ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$SPEAKER" ] && echo "Missing \$SPEAKER environment variable" && exit 1

echo
echo 'About to call say() on the contract'
echo near call thanks.\$OWNER say '{"message":"$1"}' --account_id \$SPEAKER --amount \$1
echo
echo thanks.\$OWNER is $CONTRACT
echo \$SPEAKER is $SPEAKER
echo \$1 is [ $1 ] '(the message)'
echo \$2 is [ $2 NEAR ] '(optionally attached amount)'
echo
near call thanks.$OWNER say "{\"message\":\"$1\", \"anonymous\": false}" --account_id $SPEAKER --amount $2
