import { context, storage, PersistentMap } from "near-sdk-as"
import { AccountId, Timestamp } from "../../utils";

/**
 * == CONSTANTS ===============================================================
 */
export const FUND_REGISTRY_STORAGE_KEY = 'FNDRG';

/**
 * == MODELS ==================================================================
 */
@nearBindgen
export class FundRegistry {
  created_at: Timestamp = context.blockTimestamp;

  static create(): void {
    this.save(new FundRegistry())
  }

  static exists(): bool {
    return storage.contains(FUND_REGISTRY_STORAGE_KEY);
  }

  static get(): FundRegistry {
    return storage.getSome<FundRegistry>(FUND_REGISTRY_STORAGE_KEY)
  }

  static save(fundRegistry: FundRegistry): void {
    storage.set(FUND_REGISTRY_STORAGE_KEY, fundRegistry)
  }

  static get_fund_index(owner: AccountId): string[] {
    return fundsByOwner.get(owner, []) as string[];
  }

  static is_fund_owner(owner: AccountId, subaccount: AccountId): bool {
    return this.get_fund_index(owner).includes(subaccount);
  }

  static create_fund(owner: AccountId, subaccount: AccountId): void {
    const funds = this.get_fund_index(owner);
    if (!funds.includes(subaccount)) {
      funds.push(subaccount);
    }
    fundsByOwner.set(owner, funds);
  }

  static delete_fund(owner: AccountId, subaccount: AccountId): void {
    const fundIndex = this.get_fund_index(owner)
    const nextFundIndex: string[] = [];
    for (let i = 0; i < fundIndex.length; i++) {
      if (fundIndex[i] == subaccount) continue;
      nextFundIndex.push(fundIndex[i]);
    }
    fundsByOwner.set(owner, nextFundIndex);
  }
}


/**
 * == XCC ARGUMENT WRAPPERS ===================================================
 */
@nearBindgen
export class FundInitArgs {
  constructor(public owner: AccountId) {}
}

@nearBindgen
export class OnFundCreatedArgs {
  constructor(public owner: AccountId, public subaccount: AccountId) {}
}

@nearBindgen
export class FundDeleteArgs {
  constructor() {}
}

@nearBindgen
export class OnFundDeletedArgs {
  constructor(public owner: AccountId, public subaccount: AccountId) {}
}

/**
 * == DATA STRUCTURES =========================================================
 */
export const fundsByOwner = new PersistentMap<AccountId, string[]>('f');
