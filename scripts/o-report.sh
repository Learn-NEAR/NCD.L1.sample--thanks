#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo "These are the environment variables being used:"
echo
echo "CONTRACT is [ $CONTRACT ]"
echo "OWNER is [ $OWNER ]"
echo
echo

echo "--------------------------------------------"
echo Report for $CONTRACT
echo "--------------------------------------------"
# what are the 10 most recent messages? -> Array<Message>
echo "near call \$CONTRACT list '{}' --accountId \$OWNER"
NEAR_ENV=$NETWORK near call $CONTRACT list '{}' --accountId $OWNER
echo

# what is the state of this contract? -> bool
echo "near call \$CONTRACT summarize '{}' --accountId \$OWNER"
NEAR_ENV=$NETWORK near call $CONTRACT summarize '{}' --accountId $OWNER
echo
echo
