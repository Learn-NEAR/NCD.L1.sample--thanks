#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$GUARDIAN" ] && echo "Missing \$GUARDIAN environment variable" && exit 1

echo "\$CONTRACT is $CONTRACT"
echo "\$GUARDIAN is $GUARDIAN"
echo "\$1 is [ $1 NEAR]"
echo "\$2 is [ $2 ] (optional)"

echo
echo 'About to call addFunds() on the contract'

if [ -n "$2" ]; then
    echo "near call \$CONTRACT addFunds '{\"recipient\":\"'\$2'\"}' --accountId \$GUARDIAN --amount \$1"
    near call $CONTRACT addFunds '{"recipient":"'$2'"}' --accountId $GUARDIAN --amount $1
else
    echo "near call \$CONTRACT addFunds '{\"recipient\":null}' --accountId \$GUARDIAN --amount \$1"
    near call $CONTRACT addFunds '{"recipient":null}' --accountId $GUARDIAN --amount $1
fi
echo
echo
