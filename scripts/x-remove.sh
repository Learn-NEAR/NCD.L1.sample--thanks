#!/usr/bin/env bash

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

# exit on first error after this point
set -e

echo "deleting thanks.$OWNER and setting $OWNER as beneficiary"
echo
near delete thanks.$OWNER $OWNER
