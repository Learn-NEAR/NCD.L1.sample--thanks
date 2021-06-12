#!/usr/bin/env bash
set -e

[ -z "$REGISTRY" ] && echo "Missing \$REGISTRY environment variable" && exit 1

echo
echo 'About to call list_all() on the contract'
echo near call \$REGISTRY list_all '{}' --account_id \$REGISTRY
echo
echo \$REGISTRY is $REGISTRY
echo
near call $REGISTRY list_all '{}' --account_id $REGISTRY
