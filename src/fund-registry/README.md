# Fund Registry
The fund registry is responsible for deploying and indexing fund contracts.

## API

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