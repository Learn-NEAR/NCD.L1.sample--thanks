#!/usr/bin/env bash
set -e

# set the accountId based on the environment variables
if [ -z "$GUARDIAN" ]; then
    accountId="$DEPENDENT"
else
    accountId="$GUARDIAN"
fi

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$accountId" ] && echo "Missing either \$GUARDIAN or \$DEPENDENT environment variable" && exit 1

echo "These are the variables being used:"
echo
echo "\$CONTRACT is [ $CONTRACT ]"
echo "\$accountId is [ $accountId ]; set to either \$GUARDIAN or \$DEPENDENT"
echo "\$1 is [ $1 ] (optional)"
echo

# what is the amount of available funds for a recipient -> u128
if [ -n "$1" ]; then
    echo "near call \$CONTRACT reportFunds '{\"recipient\":\"\'\$1'\"}' --accountId \$accountId"
    near call $CONTRACT reportFunds '{"recipient":"'$1'"}' --accountId $accountId
fi
echo
echo

# what is the state of this contract? -> bool
echo "near call \$CONTRACT summarize '{}' --accountId \$accountId"
near call $CONTRACT summarize '{}' --accountId $accountId
echo
echo
