#!/usr/bin/env bash

# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
# [ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo "These are the environment variables being used:"
echo
echo "CONTRACT is [ thanks.$OWNER ]"
echo "OWNER is [ $OWNER ]"
echo
echo

echo "--------------------------------------------"
echo Report for $CONTRACT
echo "--------------------------------------------"
# what are the 10 most recent messages? -> Array<Message>
echo "near call \$CONTRACT list '{}' --accountId \$OWNER"
near call thanks.$OWNER list '{}' --accountId $OWNER
echo

# what is the state of this contract? -> bool
echo "near call \$CONTRACT summarize '{}' --accountId \$OWNER"
near call thanks.$OWNER summarize '{}' --accountId $OWNER
echo
echo
