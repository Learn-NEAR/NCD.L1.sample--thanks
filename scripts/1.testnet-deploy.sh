#!/usr/bin/env bash


if rustup -V; 
    then echo "Rustup is installed"; 
    else echo "Rustup not detected" | exit 1;
fi

if [ ! < grep 'wasm32-unknown-unknown' < rustup target list ]; 
    then rustup target add wasm32-unknown-unknown --toolchain nightly; 
    else echo "Wasm is already installed"; 
fi



# load environment variables
if [ -f './scripts/.env' ];
    then export $(grep -v '^#' ./scripts/.env | xargs);
    else echo 'Failed to find ./scripts/.env file';
fi

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo "deleting $CONTRACT and setting $OWNER as beneficiary"
echo
near delete $CONTRACT $OWNER

echo "creating $CONTRACT and setting $OWNER as master, sending 100 (fake) Near to it"
echo

near create-account $CONTRACT --masterAccount $OWNER --initialBalance 100

echo --------------------------------------------
echo
echo "cleaning up the /neardev folder"
echo
# rm -rf ./neardev

# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
cargo +nightly build --target wasm32-unknown-unknown --release

echo --------------------------------------------
echo
echo "redeploying the contract"
echo
near deploy --accountId $CONTRACT --wasmFile ./target/wasm32-unknown-unknown/release/thanks.wasm --initFunction init --initArgs "{\"owner\": \"$CONTRACT\", \"allow_anonymous\":true }"

# echo --------------------------------------------
# echo run the following commands
# echo
# echo 'export CONTRACT=<dev-123-456>'
# echo 'export OWNER=<your own account>'
# echo "near call \$CONTRACT init '{\"owner\":\"'\$OWNER'\"}' --accountId \$CONTRACT"
# echo
# echo

echo --------------------------------------------
echo Contract deployed and initialized.
echo
echo

exit 0
