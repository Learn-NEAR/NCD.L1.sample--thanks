#!/usr/bin/env bash

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$DEPENDENT" ] && echo "Missing \$DEPENDENT environment variable" && exit 1
[ -z "$GUARDIAN" ] && echo "Missing \$GUARDIAN environment variable" && exit 1


# exit on first error after this point
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
yarn build:release

echo --------------------------------------------
echo
echo "creating a subaccount under $DEPENDENT"
echo
near create-account allowance.$DEPENDENT --masterAccount=$DEPENDENT --initialBalance "1"

echo --------------------------------------------
echo
echo "deploying and initializing the contract in a single transaction"
echo
near deploy \
  --accountId=allowance.$DEPENDENT \
  --wasmFile=./build/release/allowance.wasm \
  --initFunction 'init' \
  --initArgs '{"guardian":"'$GUARDIAN'","dependent":"'$DEPENDENT'"}'

exit 0
