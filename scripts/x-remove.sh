#!/usr/bin/env bash

[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1
[ -z "$NETWORK" ] && echo "Missing \$NETWORK environment variable" && exit 1

# exit on first error after this point
set -e

echo "deleting thanks.$OWNER and setting $OWNER as beneficiary"
echo
NEAR_ENV=$NETWORK near delete thanks.$OWNER $OWNER
