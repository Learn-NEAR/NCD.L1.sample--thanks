#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$DEPENDENT" ] && echo "Missing \$DEPENDENT environment variable" && exit 1

echo
echo 'About to call transfer() on the contract'
echo near call \$CONTRACT transfer --account_id \$DEPENDENT
echo
echo \$CONTRACT is $CONTRACT
echo \recipient is $1
echo \amount is $2
echo
near call $CONTRACT transfer '{"recipient":"'$1'","amount":"'$2'"}' --account_id $DEPENDENT --gas 40000000000000
