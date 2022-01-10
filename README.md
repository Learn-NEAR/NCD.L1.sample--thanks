# Thanks

Say "thanks!" to other students of the NCD by calling _their_ instance of this contract.

You can optionally attach tokens to your message, or even leave an anonymous tip.

Of course keep in mind that your signing account will be visible on the blockchain via NEAR Explorer even if you send an anonymous message.

## ⚠️ Warning

Any content produced by NEAR, or developer resources that NEAR provides, are for educational and inspiration purposes only.  NEAR does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.

## Contract

```rs
// ------------------------------------
// contract initialization
// ------------------------------------

/// Initialize contract with owner ID and other config data
/// (note: this method is called "constructor" in the singleton contract code)
pub fn init(owner: AccountId, allow_anonymous: bool) -> Self

// ------------------------------------
// public methods
// ------------------------------------

/// Give thanks to the owner of the contract and 
/// optionally attach tokens.
pub fn say(message: String, anonymous: bool) -> bool

// ------------------------------------
// owner methods
// ------------------------------------

/// Show all messages and users.
pub fn list() -> Vec<Message> 


/// Generate a summary report.
pub fn summarize() -> Contract

/// Transfer received funds to owner account.
pub fn transfer() -> ()
```

## Usage(To do)
Scripts still need to be updated to a format that doesn't require yarn...

### Add wasm32-unknown-unknown to rust

This only needs to be done once for every rustup install:

rustup target add wasm32-unknown-unknown --toolchain nightly


### Env variables

export ACCOUNT="your-account-id.testnet"

export SUBACCOUNT="your-subaccount-name"

Here's an example: Let's say I have a master account called 'someone.testnet' and want to create a subaccount name 'rust-tests'. The end result will be 'rust-tests.someone.testnet'. In that case we use "someone.testnet" for ACCOUNT, "rust-tests" for SUBACCOUNT.


### Compile

cargo +nightly build --target wasm32-unknown-unknown --release

### Login to NEAR

near login

### Create account to deploy this contract

near create-account $SUBACCOUNT.$ACCOUNT --masterAccount $ACCOUNT --initialBalance 100

### Delete account 

Only when there's no need for the contract. transfer remaining near to $ACCOUNT.

near delete $SUBACCOUNT.$ACCOUNT $ACCOUNT

### Deploy

near deploy --accountId $SUBACCOUNT.$ACCOUNT --wasmFile ./target/wasm32-unknown-unknown/release/thanks.wasm --initFunction new --initArgs "{\"owner\": \"$SUBACCOUNT.$ACCOUNT\", \"allow_anonymous\":true }"

Allow_anonymous is set as true there, it can be false too.


### Call Functions examples

near call $SUBACCOUNT.$ACCOUNT list '{}' --account-id "$SUBACCOUNT.$ACCOUNT"

near call $SUBACCOUNT.$ACCOUNT summarize '{}' --account-id $SUBACCOUNT.$ACCOUNT

near call $SUBACCOUNT.$ACCOUNT say '{"message": "Hello", "anonymous": true}' --account-id $SUBACCOUNT.$ACCOUNT