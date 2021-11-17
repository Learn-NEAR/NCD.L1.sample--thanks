import { Context, ContractPromiseBatch, logging, u128, PersistentMap } from "near-sdk-core"
import { AccountId, Amount, XCC_GAS, assert_self, assert_single_promise_success } from "../../utils"

@nearBindgen
export class Contract {
  private guardian: AccountId
  private dependent: AccountId
  private unrestrictedAllowance: u128 = u128.Zero

  constructor(guardian: AccountId, dependent: AccountId) {
    this.guardian = guardian
    this.dependent = dependent
  }

  // ----------------------------------------------------------------------------
  // Guardian methods
  // ----------------------------------------------------------------------------
  @mutateState()
  addFunds(recipient: AccountId | null): bool {
    this.assert_guardian()

    const deposit = Context.attachedDeposit

    if (recipient) {
      const prevBalance = allowanceByRecipient.contains(recipient)
        ? allowanceByRecipient.get(recipient, u128.Zero) as u128
        : u128.Zero
      allowanceByRecipient.set(recipient, u128.add(prevBalance, deposit))
    } else {
      this.unrestrictedAllowance = u128.add(this.unrestrictedAllowance, deposit)
    }

    return true
  }

  // ----------------------------------------------------------------------------
  // Dependent methods
  // ----------------------------------------------------------------------------
  @mutateState()
  transfer(recipient: AccountId, amount: Amount): void {
    this.assert_dependent()
    const useUnrestrictedAllowance = !allowanceByRecipient.contains(recipient)

    const availableFunds = useUnrestrictedAllowance
      ? this.unrestrictedAllowance
      : allowanceByRecipient.get(recipient, u128.Zero) as u128
    
    assert(availableFunds >= amount, "Insufficient funds available for this recipient")

    // Persist remaining funds amount
    // If 0 funds remain, remove recipient from mapping
    const remainingFunds = u128.sub(availableFunds, amount)
    if (useUnrestrictedAllowance) {
      this.unrestrictedAllowance = remainingFunds
    } else if (remainingFunds > u128.Zero) {
      allowanceByRecipient.set(recipient, remainingFunds)
    } else {
      allowanceByRecipient.delete(recipient)
    }

    const self = Context.contractName
    const to_recipient = ContractPromiseBatch.create(recipient)

    // transfer funds to recipient then confirm transfer complete
    to_recipient.transfer(amount)
    to_recipient.then(self).function_call("on_transfer_complete", '{}', u128.Zero, XCC_GAS)
  }

  // ----------------------------------------------------------------------------
  // Dependent and Guardian methods
  // ----------------------------------------------------------------------------
  reportFunds(recipient: AccountId | null): u128 {
    this.assert_dependent_or_guardian()
    return recipient
      ? allowanceByRecipient.get(recipient, u128.Zero) as u128
      : this.unrestrictedAllowance
    // if (!recipient) {
    //   return this.unrestrictedAllowance;
    // } else if (!allowanceByRecipient.contains(recipient)) {
    //   return u128.Zero
    // } else {
    //   return allowanceByRecipient.get(recipient, u128.Zero) as u128
    // }
  }

  summarize(): Contract {
    this.assert_dependent_or_guardian()
    return this
  }

  on_transfer_complete(): void {
    assert_self()
    assert_single_promise_success()
    logging.log("transfer complete")
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------
  private assert_guardian(): void {
    const caller = Context.predecessor
    assert(this.guardian == caller, "Only the guardian of this contract may call this method")
  }

  private assert_dependent(): void {
    const caller = Context.predecessor
    assert(this.dependent == caller, "Only the dependent of this contract may call this method")
  }

  private assert_dependent_or_guardian(): void {
    const caller = Context.predecessor
    const canAccess = this.dependent == caller || this.guardian == caller
    assert(canAccess, "Only the dependent or the guardian of this contract may call this method")
  }
}

// --------------------------------------------------------------------------
// Persistent storage data structures
// --------------------------------------------------------------------------
const allowanceByRecipient = new PersistentMap<AccountId, u128>("a");