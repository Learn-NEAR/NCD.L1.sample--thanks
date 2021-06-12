import { PersistentSet, Context } from "near-sdk-as"

export function register(): void {
  contracts.add(Context.predecessor)
}

export function is_registered(contract: string): bool {
  return contracts.has(contract)
}

export function list_all(): Array<string> {
  return contracts.values()
}

const contracts = new PersistentSet<string>("c")
