# Thanks

Say "thanks!" to other students of the NCD by calling _their_ instance of this contract.

You can optionally attach tokens to your message, or even leave an anonymous tip.

Of course keep in mind that your signing account will be visible on the blockchain via NEAR Explorer even if you send an anonymous message.

## ⚠️ Warning

Any content produced by NEAR, or developer resources that NEAR provides, are for educational and inspiration purposes only. NEAR does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.

## Contract

```typescript
// ------------------------------------
// contract initialization
// ------------------------------------

/**
 * initialize contract with owner ID and other config data
 *
 * (note: this method is called "constructor" in the singleton contract code)
 */
function init(owner: AccountId, allow_anonymous: bool = true): void;

// ------------------------------------
// public methods
// ------------------------------------

/**
 * give thanks to the owner of the contract
 * and optionally attach tokens
 */
function say(message: string, anonymous: bool): bool;

// ------------------------------------
// owner methods
// ------------------------------------

/**
 * show all messages and users
 */
function list(): Array<Message>;

/**
 * generate a summary report
 */
function summarize(): Contract;

/**
 * transfer received funds to owner account
 */
function transfer(): void;
```

## Usage

### Development

To deploy the contract for development, follow these steps:

1. clone this repo locally
2. run `npm i` to install dependencies
3. run `npm run deploy` to deploy the contract (this uses `near dev-deploy`)

**Your contract is now ready to use.**

To see how to use the contract you can check out the integration tests for example calls.
