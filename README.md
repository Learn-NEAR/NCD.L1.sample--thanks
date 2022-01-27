# Allowance

The Allowance demo application allows a user, the owner, to setup a fund with payers and payees.
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

Using the frone-end is the easiest way to interact with the contracts.
See the contract APIs below to call the contract directly from the near-cli.

## Fund Registry API

### init(): void

Initialize contract

```
near call $REGISTRY_CONTRACT init '{}' --accountId $REGISTRY_CONTRACT --deposit 3
```

### get_registry(): FundRegistry

See the registry core state, like initialization timestamp.

```
near view $REGISTRY_CONTRACT get_fund
```

### create_fund(subaccount: AccountId): void

Deploy a Fund contract at a subaccount of the registry's account ID

```
near call $REGISTRY_CONTRACT create_fund '{"subaccount":"$SUBACCOUNT"} --accountId $OWNER --deposit 3
```

### delete_fund(subaccount: AccountId): void

Delete a fund account and assign fund owner as beneficiary

```
near call $REGISTRY_CONTRACT delete_fund '{"subaccount":"$SUBACCOUNT"} --accountId $OWNER
```

### get_fund_index(owner: AccountId): AccountId[]

See the funds that have been created/deployed by an account

```
near view $REGISTRY_CONTRACT get_fund_index '{"owner": "$OWNER"}
```

## Fund API

### init(): void

Fund contracts are initialized when you call `create_fund` on the registry, so no need to call directly

### get_fund(): Fund

See core fund state, like unrestricted_balance and owner

```
near view $FUND_CONTRACT get_fund '{}'
```

### create_payers(accountIds: AccountId[], balance: u128): void

Create payers all with the same initial balance

```
near call $FUND_CONTRACT create_payers '{"accountIds":["$PAYER"],"balance":"7000000000000000000000000"}' --accountId $OWNER
```

### create_payees(accountIds: AccountId[], balance: u128): void

Create payees all with the same initial balance

```
near call $FUND_CONTRACT create_payees '{"accountIds":["$PAYEE"],"balance":"7000000000000000000000000"}' --accountId $OWNER
```

### delete_payers(accountIds: AccountId[]): void

Delete payers

```
near call $FUND_CONTRACT delete_payers '{"accountIds":["$PAYER"]}' --accountId $OWNER
```

### delete_payees(accountIds: AccountId[]): void

Delete payees

```
near call $FUND_CONTRACT delete_payees '{"accountIds":["$PAYEE"]}' --accountId $OWNER
```

### get_payer_index(): AccountId[]

Get all payer account IDs

```
near view $FUND_CONTRACT get_payer_index '{}'
```

### get_payee_index(): AccountId[]

Get all payee account IDs

```
near view $FUND_CONTRACT get_payee_index '{}'
```

### get_payer(): Payer

Get core state for payer, including balance

```
near view $FUND_CONTRACT get_payer '{"accountId":"$PAYER"}'
```

### get_payee(): Payee

Get core state for payee, including balance

```
near view $FUND_CONTRACT get_payee '{"accountId":"$PAYEE"}'
```

### set_payer_balance(accountId: AccountId, balance: u128): void

Set a payer's balance

```
near call $FUND_CONTRACT set_payer_balance '{"accountId":"$PAYER","balance":"7000000000000000000000000"}' --accountId $OWNER
```

### set_payee_balance(accountId: AccountId, balance: u128): void

Set a payee's balance

```
near call $FUND_CONTRACT set_payee_balance '{"accountId":"$PAYEE","balance":"7000000000000000000000000"}' --accountId $OWNER
```

### transfer(recipient: AccountId, amount: u128): void

Transfer money from the fund

```
near call $FUND_CONTRACT transfer '{"recipient":"$PAYEE","amount":"7000000000000000000000000"}' --accountId $PAYER
```

### deposit_money(): void

Deposit money in the fund

```
near call $FUND_CONTRACT deposit_money '{}' --accountId $OWNER --deposit 20
```

### delete_fund(): void

Called when you call `delete_fund` on the registry.

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