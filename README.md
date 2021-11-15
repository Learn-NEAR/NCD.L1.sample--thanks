# Allowance

Allow a guardian to add funds that can be transferred by the dependent.  The guardian can optionally specify the intended recipient when
adding funds.  If no recipient is specified, it increases the "unrestricted balance", money that the dependent can send
to any address.

## ⚠️ Warning

Any content produced by NEAR, or developer resources that NEAR provides, are for educational and inspiration purposes only.  NEAR does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.

## Setup
1. clone this repo locally
2. run `yarn`

## Development Deployment

1. run `./scripts/1.dev-deploy.sh` to deploy the contract (this uses `near dev-deploy`).  Follow the command's output for setting environment variables and calling the `init` (constructor) method
2. run `./scripts/4.dev-cleanup.sh` to delete the dev contract.

## Usage
Ensure `NEAR_ENV`, `DEPENDENT`, and `GUARDIAN` environment variables are set.

### Add funds (logged in as the guardian)
- **method:** `addFunds(recipient: AccountId): bool`
- **script:** `./scripts/2.g-add-funds.sh AMOUNT [RECIPIENT]`
- **example:** `./scripts/2.g-add-funds.sh 2`
- **example:** `./scripts/2.g-add-funds.sh 5 account.testnet`

### Transfer funds (logged in as the dependent)
- **method:** `transfer(recipient: AccountId, amount: Amount): void`
- **script:** `./scripts/3.d-transfer.sh RECIPIENT AMOUNT`
- **example:** `./scripts/3.d-transfer.sh account.testnet 5000000000000000000000000`

### View contract storage (logged in as the guardian or dependent)
Because this can be called by guardian or dependent, you must specify the caller.  Funds added with a targetted recipient
are not available for view.  This may be a future enhancement.
- **method:** `summerize(): Contract`
- **script:** `./scripts/report.sh ACCOUNT`
- **example:** `./scripts/report.sh guardian.testnet`

## Production Deployment

1. run `./scripts/x-deploy.sh` to rebuild, deploy and initialize the contract to a target account

   requires the following environment variables
   - `NEAR_ENV`: Either `testnet` or `mainnet`
   - `DEPENDENT`: The owner of the contract and the parent account.  The contract will be deployed to `allowance.$DEPENDENT`.
   - `GUARDIAN`: The guardian is the only account allowed to add funds.

2. run `./scripts/x-remove.sh` to delete the account

   requires the following environment variables
   - `NEAR_ENV`: Either `testnet` or `mainnet`
   - `DEPENDENT`: The contract will be deleted from `allowance.$DEPENDENT`
   - `GUARDIAN`: The guardian will be the beneficiary of the deleted account.
