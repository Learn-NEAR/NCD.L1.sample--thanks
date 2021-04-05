# Thanks

Say "thanks!" to other students of the NCD by calling _their_ instance of this contract.

You can optionally attach tokens to your message, or even leave an anonymous tip.

Of course keep in mind that your signing account will be visible on the blockchain via NEAR Explorer even if you send an anonymous message.

## Contract

```ts
// ------------------------------------
// contract initialization
// ------------------------------------

/**
 * initialize contract with owner ID and other config data
 *
 * (note: this method is called "constructor" in the singleton contract code)
 */
function init(owner: AccountId, allow_anonymous: bool = true): void

// ------------------------------------
// public methods
// ------------------------------------

/**
 * give thanks to the owner of the contract
 * and optionally attach tokens
 */
function say(message: string, anonymous: bool): bool

// ------------------------------------
// owner methods
// ------------------------------------

/**
 * show all messages and users
 */
function list(): Array<Message>

/**
 * generate a summary report
 */
function summarize(): Contract

/**
 * transfer received funds to owner account
 */
function transfer(): void
```


## Usage

### Development

To deploy the contract for development, follow these steps:

1. clone this repo locally
2. run `./scripts/1.dev-deploy.sh` to deploy the contract (this uses `near dev-deploy`)

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
