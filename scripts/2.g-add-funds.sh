#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$GUARDIAN" ] && echo "Missing \$GUARDIAN environment variable" && exit 1

echo
echo 'About to call addFunds() on the contract'
echo near call \$CONTRACT addFunds '{"recipient":"'"$2"'"}' --account_id \$GUARDIAN --amount \$1
echo
echo \$CONTRACT is $CONTRACT
echo \$GUARDIAN is $GUARDIAN
echo \$1 is [ $1 NEAR] '(the amount)'
echo \$2 is [ $2 ] '(optional recipient)'
echo
near call $CONTRACT addFunds '{"recipient":"'$2'"}' --account_id $GUARDIAN --amount $1
