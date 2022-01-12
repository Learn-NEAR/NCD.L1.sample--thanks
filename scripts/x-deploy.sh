#!/usr/bin/env bash

# If an error occurs, check environment variables (.env file), and remove the account (by calling `sh ./scripts/x-remove.sh `) before calling this script again.

# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1


# exit on first error after this point
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
# yarn build:release
cargo +nightly build --target wasm32-unknown-unknown --release

echo --------------------------------------------
echo
echo "creating a subaccount under $OWNER"
echo
near create-account thanks.$OWNER --masterAccount=$OWNER --initialBalance "90"

echo --------------------------------------------
echo
echo "deploying and initializing the contract in a single transaction"
echo
# very easy to misstype this
near deploy --accountId=thanks.$OWNER --wasmFile=./target/wasm32-unknown-unknown/release/thanks.wasm --initFunction 'init' --initArgs "{\"owner\":\"$OWNER\", \"allow_anonymous\": true}"

exit 0
