#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo
echo 'About to call transfer() on the contract'
echo near call \$CONTRACT transfer --account_id \$OWNER
echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo
near call $CONTRACT transfer --account_id $OWNER
