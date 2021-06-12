#!/usr/bin/env bash
set -e

[ -z "$REGISTRY" ] && echo "Missing \$REGISTRY environment variable" && exit 1

echo
echo 'About to call register() on the contract'
echo near call \$REGISTRY register '{}' --account_id \$REGISTRY
echo
echo \$REGISTRY is $REGISTRY
echo
near call $REGISTRY register '{}' --account_id $REGISTRY
