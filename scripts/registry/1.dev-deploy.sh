#!/usr/bin/env bash

[ -z "$REGISTRY" ] && echo "Missing \$REGISTRY environment variable"
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"

echo "deleting $REGISTRY and setting $OWNER as beneficiary"
echo
near delete $REGISTRY $OWNER

echo --------------------------------------------
echo
echo "cleaning up the /neardev folder"
echo
rm -rf ./neardev
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
yarn build:release

echo --------------------------------------------
echo
echo "redeploying the contract"
echo
near dev-deploy ./build/release/registry.wasm
mv ./neardev ./neardev-registry

exit 0
