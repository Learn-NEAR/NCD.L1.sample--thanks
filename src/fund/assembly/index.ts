import { ContractPromiseBatch, context, u128, logging } from "near-sdk-as"
import { MIN_ACCOUNT_BALANCE, AccountId, XCC_GAS, assert_self, assert_single_promise_success } from "../../utils";
import { Fund, Payer, Payee } from "./models";

/**
 * == INITIALIZE CONTRACT ======================================================
 */
export function init(): void {
  assert(!Fund.exists(), "Contract is already initialized.");

  assert(
    u128.ge(context.attachedDeposit, MIN_ACCOUNT_BALANCE),
    "Minimum account balance must be attached to initialize this contract (3 NEAR)"
  );

  Fund.create(context.sender);

  logging.log("Fund was created")
}

/**
 * == VIEW FUNCTIONS ==========================================================
 */
export function get_fund(): Fund {
  return Fund.get();
}

export function get_payer_index(): AccountId[] {
  return Payer.get_index();
}

export function get_payee_index(): AccountId[] {
  return Payee.get_index();
}

export function get_payer(accountId: AccountId): Payer {
  return Payer.get(accountId);
}

export function get_payee(accountId: AccountId): Payee {
  return Payee.get(accountId);
}

/**
 * == CHANGE FUNCTIONS ========================================================
 */
export function create_payers(accountIds: AccountId[], balance: u128): void {
  assert_is_owner(context.predecessor);
  Payer.create(accountIds, balance);
}

export function create_payees(accountIds: AccountId[], balance: u128): void {
  assert_is_owner(context.predecessor);
  Payee.create(accountIds, balance);
}

export function delete_payers(accountIds: AccountId[]): void {
  assert_is_owner(context.predecessor);
  Payer.delete(accountIds);
}

export function delete_payees(accountIds: AccountId[]): void {
  assert_is_owner(context.predecessor);
  Payee.delete(accountIds);
}

export function set_unrestricted_balance(balance: u128): void {
  assert_is_owner(context.predecessor);
  Fund.set_unrestricted_balance(balance);
}

export function set_payer_balance(accountId: AccountId, balance: u128): void {
  assert_is_owner(context.predecessor);
  Payer.set_balance(accountId, balance);
}

export function set_payee_balance(accountId: AccountId, balance: u128): void {
  assert_is_owner(context.predecessor);
  Payee.set_balance(accountId, balance);
}

export function transfer(recipient: AccountId, amount: u128): void {
  assert_is_payer(context.predecessor);

  Fund.adjust_transfer_balances(context.predecessor, recipient, amount);

  ContractPromiseBatch
    // transfer money
    .create(recipient)
    .transfer(amount)
    // callback
    .then(context.contractName)
    .function_call("on_transfer_complete", '{}', u128.Zero, XCC_GAS)
}

export function on_transfer_complete(): void {
  assert_self()
  assert_single_promise_success()
  logging.log("transfer complete")
}

export function deposit_money(): void {
  logging.log(`deposited money`);
}

export function delete_fund(): void {
  const fund = Fund.get();

  assert_is_owner(context.sender);

  ContractPromiseBatch
    .create(context.contractName)
    .delete_account(fund.owner);
}

/**
 * == HELPERS =================================================================
 */
function assert_is_owner(account_id: AccountId): void {
  assert(Fund.is_owner(account_id), 'Unauthorized');
}

function assert_is_payer(account_id: AccountId): void {
  assert(Payer.exists(account_id), 'Unauthorized.');
}