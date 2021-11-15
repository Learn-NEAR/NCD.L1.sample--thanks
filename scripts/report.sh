#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1

echo "These are the environment variables being used:"
echo
echo "CONTRACT is [ $CONTRACT ]"
echo "accountId is [ $1 ]"
echo
echo

# what is the state of this contract? -> bool
echo "near call \$CONTRACT summarize '{}' --accountId \$1"
near call $CONTRACT summarize '{}' --accountId $1
echo
echo
