import { context, storage, PersistentSet, u128, PersistentMap } from "near-sdk-as"
import { AccountId, Timestamp } from "../../utils";

/**
 * == CONSTANTS ===============================================================
 */
export const FUND_STORAGE_KEY = 'FND';

/**
 * == MODELS ==================================================================
 */
@nearBindgen
export class Payer {
  constructor(public balance: u128) {}

  static create(account_ids: AccountId[], balance: u128): void {
    for(let i = 0; i < account_ids.length; i++) {
      let account_id = account_ids[i];
      assert(!payer_index.has(account_id), 'Payer already exists');
      payer_index.add(account_id);
      this.save(account_id, new Payer(balance));
    }
  }

  static delete(account_ids: AccountId[]): void {
    for (let i = 0; i < account_ids.length; i++) {
      payer_records.delete(account_ids[i]);
      payer_index.delete(account_ids[i]);
    }
  }

  static exists(account_id: AccountId): bool {
    return payer_index.has(account_id);
  }

  static get(account_id: AccountId): Payer {
    return payer_records.getSome(account_id);
  }

  static save(account_id: AccountId, payer: Payer): void {
    payer_records.set(account_id, payer);
  }

  static get_index(): AccountId[] {
    return payer_index.values();
  }

  static set_balance(account_id: AccountId, balance: u128): void {
    const payer = this.get(account_id);
    payer.balance = balance;
    this.save(account_id, payer);
  }

  static deduct_balance(account_id: AccountId, amount: u128): void {
    const payer = this.get(account_id);
    assert_sufficient_funds(payer.balance, amount);
    payer.balance = u128.sub(payer.balance, amount);
    this.save(account_id, payer);
  }
}

@nearBindgen
export class Payee {
  constructor(public balance: u128) {}

  static create(account_ids: AccountId[], balance: u128): void {
    for(let i = 0; i < account_ids.length; i++) {
      let account_id = account_ids[i];
      assert(!payee_index.has(account_id), 'Payee already exists');
      payee_index.add(account_id);
      this.save(account_id, new Payee(balance));
    }
  }

  static delete(account_ids: AccountId[]): void {
    for (let i = 0; i < account_ids.length; i++) {
      payee_records.delete(account_ids[i]);
      payee_index.delete(account_ids[i]);
    }
  }

  static exists(account_id: AccountId): bool {
    return payee_index.has(account_id);
  }

  static get_index(): AccountId[] {
    return payee_index.values();
  }

  static get(account_id: AccountId): Payee {
    return payee_records.getSome(account_id);
  }

  static save(account_id: AccountId, payer: Payee): void {
    payee_records.set(account_id, payer);
  }

  static set_balance(account_id: AccountId, balance: u128): void {
    const payee = this.get(account_id);
    payee.balance = balance;
    this.save(account_id, payee);
  }

  static deduct_balance(account_id: AccountId, amount: u128): void {
    const payee = this.get(account_id);
    assert_sufficient_funds(payee.balance, amount);
    payee.balance = u128.sub(payee.balance, amount);
    this.save(account_id, payee);
  }
}

@nearBindgen
export class Fund {
  created_at: Timestamp = context.blockTimestamp;
  unrestricted_balance: u128 = u128.Zero;
  
  constructor(
    public owner: AccountId
  ) { }

  static create(owner: AccountId): void {
    this.save(new Fund(owner))
  }

  static exists(): bool {
    return storage.contains(FUND_STORAGE_KEY);
  }

  static is_owner(accountId: AccountId): bool {
    return this.get().owner == accountId;
  }

  static get(): Fund {
    return storage.getSome<Fund>(FUND_STORAGE_KEY)
  }

  static save(fund: Fund): void {
    storage.set(FUND_STORAGE_KEY, fund)
  }

  static set_unrestricted_balance(balance: u128): void {
    const fund = this.get();
    fund.unrestricted_balance = balance;
    this.save(fund);
  }

  static deduct_unrestricted_balance(amount: u128): void {
    const fund = this.get();
    assert_sufficient_funds(fund.unrestricted_balance, amount);
    fund.unrestricted_balance = u128.sub(fund.unrestricted_balance, amount);
    this.save(fund);
  }

  static adjust_transfer_balances(sender: AccountId, recipient: AccountId, amount: u128): void {
    Payer.deduct_balance(sender, amount);
    if (Payee.exists(recipient)) {
      Payee.deduct_balance(recipient, amount);
    } else {
      this.deduct_unrestricted_balance(amount);
    }
  }
}

/**
 * == DATA STRUCTURES =========================================================
 */
export const payer_index = new PersistentSet<AccountId>('pri');
export const payer_records = new PersistentMap<AccountId, Payer>('pr');
export const payee_index = new PersistentSet<AccountId>('pei');
export const payee_records = new PersistentMap<AccountId, Payee>('pe');

/**
 * == HELPERS =================================================================
 */
function assert_sufficient_funds(balance: u128, deduction_amount: u128): void {
  assert(u128.ge(balance, deduction_amount), 'Insufficient balance');
}
