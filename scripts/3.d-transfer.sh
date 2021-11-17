#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$DEPENDENT" ] && echo "Missing \$DEPENDENT environment variable" && exit 1

echo "\$CONTRACT is $CONTRACT"
echo "\$DEPENDENT is $DEPENDENT"
echo "\$1 is [ $1 ]"
echo "\$2 is [ $2 ]"

echo
echo 'About to call transfer() on the contract'
echo "near call \$CONTRACT transfer '{\"recipient\":\"'$1'\",\"amount\":\"'$2'\"}' --accountId \$DEPENDENT --gas 40000000000000"
near call $CONTRACT transfer '{"recipient":"'$1'","amount":"'$2'"}' --accountId $DEPENDENT --gas 40000000000000
echo
echo