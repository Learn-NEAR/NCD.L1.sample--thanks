#!/usr/bin/env bash

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$DEPENDENT" ] && echo "Missing \$DEPENDENT environment variable" && exit 1
[ -z "$GUARDIAN" ] && echo "Missing \$GUARDIAN environment variable" && exit 1

# exit on first error after this point
set -e

echo "deleting allowance.$DEPENDENT and setting $GUARDIAN as beneficiary"
echo
near delete allowance.$DEPENDENT $GUARDIAN
