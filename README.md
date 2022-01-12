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


## Usage

### Development

To deploy the contract for development, follow these steps:

1. clone this repo locally: git clone --branch near-sdk-rs this-repository-url.git
2. install [rust](https://www.rust-lang.org/)
3. allow rust to compile webassembly with `rustup target add wasm32-unknown-unknown --toolchain nightly`
4. set your account name in ./scripts/.env
5. run `./scripts/1.testnet-deploy.sh` to deploy the contract (this deploys to the testnet, needs to be logged in)
6. check the scripts to see the cli used (The only lines that matter are the ones that start with 'near')
7. check ./src for the rust implementation of the contracts (lib.rs is where the contract is implemented)
8. Cargo.toml is where we declare the dependencies that we need

**Your contract is now ready to use.**

To use the contract you can do any of the following:

_Public scripts_

```sh
2.say-thanks.sh         # post a message saying thank you, optionally attaching NEAR tokens
2.say-anon-thanks.sh    # post an anonymous message (otherwise same as above)
```

_Owner scripts_

```sh
o-report.sh             # generate a summary report of the contract state
o-transfer.sh           # transfer received funds to the owner account
```

### Production

It is recommended that you deploy the contract to a subaccount under your MainNet account to make it easier to identify you as the owner

1. clone this repo locally
2. run `./scripts/x-deploy.sh` to rebuild, deploy and initialize the contract to a target account

   requires the following environment variables
   - `NEAR_ENV`: Either `testnet` or `mainnet`
   - `OWNER`: The owner of the contract and the parent account.  The contract will be deployed to `thanks.$OWNER`

3. run `./scripts/x-remove.sh` to delete the account

   requires the following environment variables
   - `NEAR_ENV`: Either `testnet` or `mainnet`
   - `OWNER`: The owner of the contract and the parent account.  The contract will be deployed to `thanks.$OWNER`
