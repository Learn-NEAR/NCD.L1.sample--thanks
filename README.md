# Allowance

The Allowance demo application allows a user, the owner, to setup a fund with payers and payees on NEAR.
The owner of the fund can provide money for the payers to spend, but the recipients and the amounts are restricted.

## ⚠️ Warning

Any content produced by NEAR, or developer resources that NEAR provides, are for educational and inspiration purposes only.  NEAR does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.

## About

There are 2 smart contracts:
  - Fund Registry - deploys fund contracts, tracks which funds an account has deployed.
  - Fund - main functionality

One account can deploy multiple fund contracts, and each fund can contain multiple payers and payees.
Each payer and payee has a balance that decreases with each transaction in which that account is involved.
A fund also has an unrestricted balance, which can be sent to any recipient.
Balances are decoupled from the contract available balance.  For a transfer to succeed, the amount must be
less than the contract account balance, the payer balance, and the payee balance (or the unrestricted balance if the recipient is not a payee).

This is the repo for the smart contracts.  There is a companion repo for the [web client][webclient].

## Features
- cross-contract account creation, contract deployment, and account deletion
- transfer money from contract to a recipient
- use PersistentMap and PersistentSet for storage

## Setup

1. clone this repo locally
2. run `yarn`
3. install near-api-js `npm install -g near-api-js`
4. export NEAR_ENV=testnet

## Development

1.  Build the contracts

```
yarn build:release
```

2.  Dev deploy

After `dev-deploy`, you'll see an account printed in the console that looks like `dev-1643167725542-27613424538062`.

```
near dev-deploy build/release/fund-registry.wasm
export REGISTRY_CONTRACT=dev-1643167725542-27613424538062
```

3.  Re-deploy after updating contract code

```
yarn build:release
near deploy --accountId $REGISTRY_CONTRACT --wasmFile build/release/fund-registry.wasm
```

## Usage

- The [web client][webclient] is the easiest way to interact with the contracts.
- The [Fund Registry doc][registry_doc] documents the registry contract API with `near-cli` examples.
- The [Fund doc][fund_doc] documents the fund contract API with `near-cli` examples.

## Production Deployment

To deploy for production, first create an account to which the contract can be deployed.

```
export NEAR_ENV=testnet
export CONTRACT=targetaccount.testnet
```

Build and deploy to the target account.

```
yarn build:release

near deploy \
  --accountId=$CONTRACT \
  --wasmFile=./build/release/fund-registry.wasm \
  --initFunction 'init' \
  --initArgs '{}'
```

## Cleanup

```
near delete $CONTRACT $BENEFICIARY
rm -rf neardev
```

[webclient]: https://github.com/rhythnic/NCD.L2.sample--allowance
[registry_doc]: ./src/fund-registry/README.md
[fund_doc]: ./src/fund/README.md