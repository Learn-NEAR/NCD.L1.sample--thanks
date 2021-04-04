#!/usr/bin/env bash

[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1
[ -z "$NETWORK" ] && echo "Missing \$NETWORK environment variable" && exit 1

# exit on first error after this point
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
yarn build:release

echo --------------------------------------------
echo
echo "creating a subaccount under $OWNER"
echo
NEAR_ENV=$NETWORK near create-account thanks.$OWNER --masterAccount=$OWNER

echo --------------------------------------------
echo
echo "deploying and initializing the contract in a single transaction"
echo
NEAR_ENV=$NETWORK near deploy --accountId=thanks.$OWNER --wasmFile=./build/release/thanks.wasm --initFunction 'init' --initArgs '{"owner":"'$OWNER'"}'

exit 0
