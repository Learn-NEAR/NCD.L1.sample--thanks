import { ContractPromiseBatch, context, base58, u128, env, logging, ContractPromise } from "near-sdk-as"
import { MIN_ACCOUNT_BALANCE, AccountId, XCC_GAS, assert_self } from "../../utils";
import { FundRegistry, FundInitArgs, OnFundCreatedArgs, FundDeleteArgs, OnFundDeletedArgs } from "./models";

/**
 * == CONSTANTS ===============================================================
 */
const FUND_CODE = includeBytes("../../../build/release/fund.wasm");

/**
 * == INITIALIZE CONTRACT ======================================================
 */
export function init(): void {
  assert(!FundRegistry.exists(), "Contract is already initialized.");

  assert(
    u128.ge(context.attachedDeposit, MIN_ACCOUNT_BALANCE),
    "Minimum account balance must be attached to initialize this contract (3 NEAR)"
  );

  FundRegistry.create();

  logging.log("FundRegistry was created")
}

/**
 * == VIEW FUNCTIONS ==========================================================
 */
export function get_registry(): FundRegistry {
  return FundRegistry.get();
}

export function get_fund_index(owner: AccountId): AccountId[] {
  return FundRegistry.get_fund_index(owner);
}

/**
 * == CHANGE FUNCTIONS ========================================================
 */
export function create_fund(subaccount: AccountId): void {
  assert(
    u128.ge(context.attachedDeposit, MIN_ACCOUNT_BALANCE),
    "Minimum account balance must be attached to initialize a fund (3 NEAR)"
  );

  const accountId = full_account_for(subaccount)

  assert(
    env.isValidAccountID(accountId),
    "Fund name must be valid NEAR account name"
  );

  logging.log("attempting to create fund")

  ContractPromiseBatch
    // deploy and initialize fund
    .create(accountId)
    .create_account()
    .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(FUND_CODE)))
    .add_full_access_key(base58.decode(context.senderPublicKey))
    .function_call(
      "init",
      new FundInitArgs(context.predecessor),
      context.attachedDeposit,
      XCC_GAS
    )
    // callback
    .then(context.contractName)
    .function_call(
      "on_fund_created",
      new OnFundCreatedArgs(context.predecessor, subaccount),
      u128.Zero,
      XCC_GAS
    )
}

export function on_fund_created(owner: AccountId, subaccount: AccountId): void {
  assert_self();
  logging.log('in on_fund_created');
  let results = ContractPromise.getResults();
  let fundCreated = results[0];

  // Verifying the remote contract call succeeded.
  // https://nomicon.io/RuntimeSpec/Components/BindingsSpec/PromisesAPI.html?highlight=promise#returns-3
  switch (fundCreated.status) {
    case 0:
      // promise result is not complete
      logging.log(`Fund creation for [${full_account_for(subaccount)}] is pending`)
      break;
    case 1:
      // promise result is complete and successful
      logging.log(`Fund creation for [${full_account_for(subaccount)}] succeeded`)
      logging.log('attempting to save fund in owner index');
      FundRegistry.create_fund(owner, subaccount);
      break;
    case 2:
      // promise result is complete and failed
      logging.log(`Fund creation for [${full_account_for(subaccount)}] failed`)
      break;

    default:
      logging.log("Unexpected value for promise result [" + fundCreated.status.toString() + "]");
      break;
  }
}

export function delete_fund(subaccount: AccountId): void {
  assert(
    FundRegistry.is_fund_owner(context.predecessor, subaccount),
    'Only the fund owner can delete the fund.'
  );

  const accountId = full_account_for(subaccount);

  logging.log("attempting to delete fund")

  ContractPromiseBatch
    // delete fund account
    .create(accountId)
    .function_call(
      "delete_fund",
      new FundDeleteArgs(),
      u128.Zero,
      XCC_GAS
    )
    // callback
    .then(context.contractName)
    .function_call(
      "on_fund_deleted",
      new OnFundDeletedArgs(context.predecessor, subaccount),
      u128.Zero,
      XCC_GAS
    )
}

export function on_fund_deleted(owner: AccountId, subaccount: AccountId): void {
  assert_self();
  let results = ContractPromise.getResults();
  let fundDeleted = results[0];

  // Verifying the remote contract call succeeded.
  // https://nomicon.io/RuntimeSpec/Components/BindingsSpec/PromisesAPI.html?highlight=promise#returns-3
  switch (fundDeleted.status) {
    case 0:
      // promise result is not complete
      logging.log(`Fund deletion for [${full_account_for(subaccount)}] is pending`)
      break;
    case 1:
      // promise result is complete and successful
      logging.log(`Fund deletion for [${full_account_for(subaccount)}] succeeded`)
      FundRegistry.delete_fund(owner, subaccount);
      break;
    case 2:
      // promise result is complete and failed
      logging.log(`Fund deletion for [${full_account_for(subaccount)}] failed`)
      break;

    default:
      logging.log("Unexpected value for promise result [" + fundDeleted.status.toString() + "]");
      break;
  }
}

/**
 * == HELPERS =================================================================
 */
function full_account_for(subaccount: string): string {
  return `${subaccount}.${context.contractName}`;
}