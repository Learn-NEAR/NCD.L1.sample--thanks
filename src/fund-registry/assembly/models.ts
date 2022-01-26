import { context, storage, PersistentMap } from "near-sdk-as"
import { AccountId, Timestamp } from "../../utils";

export const FUND_REGISTRY_STORAGE_KEY = 'FNDRG';

@nearBindgen
export class FundRegistry {
  created_at: Timestamp = context.blockTimestamp;
  
  constructor(
    public owner: AccountId
  ) { }

  static create(owner: AccountId): void {
    this.save(new FundRegistry(owner))
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
    const funds = this.get_fund_index(owner)
      .filter(name => name === subaccount);
    fundsByOwner.set(owner, funds);
  }
}

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

const fundsByOwner = new PersistentMap<AccountId, string[]>('f');
