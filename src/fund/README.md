# Fund

The fund contract has most of the application functionality.  It allows the owner to restrict the transfer amounts
of a list of payers and payees.

## API

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