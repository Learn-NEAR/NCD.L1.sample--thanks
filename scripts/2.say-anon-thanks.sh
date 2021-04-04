#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$SPEAKER" ] && echo "Missing \$SPEAKER environment variable" && exit 1

echo
echo 'About to call say() on the contract'
echo near call \$CONTRACT say '{"message":"$1", "anonymous": true}' --account_id \$SPEAKER --amount \$1
echo
echo \$CONTRACT is $CONTRACT
echo \$SPEAKER is $SPEAKER
echo \$1 is [ $1 ] '(the message)'
echo \$2 is [ $2 NEAR ] '(optionally attached amount)'
echo
NEAR_ENV=$NETWORK near call $CONTRACT say '{"message":"'$1'", "anonymous": true}' --account_id $SPEAKER --amount $2
