#!/usr/bin/env bash

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$GUARDIAN" ] && echo "Missing \$GUARDIAN environment variable"
[ -z "$DEPENDENT" ] && echo "Missing \$DEPENDENT environment variable"

echo "deleting $CONTRACT and setting $GUARDIAN as beneficiary"
echo
near delete $CONTRACT $GUARDIAN

echo --------------------------------------------
echo
echo "cleaning up the /neardev folder"
echo
rm -rf ./neardev