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
near dev-deploy ./build/release/allowance.wasm

echo --------------------------------------------
echo run the following commands
echo
echo 'export NEAR_ENV=<testnet | mainnet>'
echo 'export CONTRACT=<dev-123-456>'
echo 'export GUARDIAN=<the guardian account>'
echo 'export DEPENDENT=<the minor account>'
echo "near call \$CONTRACT init '{\"guardian\":\"'\$GUARDIAN'\",\"dependent\":\"'\$DEPENDENT'\"}' --accountId \$CONTRACT"
echo
echo

exit 0
