import { Context, ContractPromiseBatch, logging, u128 } from "near-sdk-core"
import { AccountId, ONE_NEAR, XCC_GAS, assert_self, assert_single_promise_success } from "../../utils"
import { Message, ContributionTracker, Vector } from "./models"

// max 5 NEAR accepted to this contract before it forces a transfer to the owner
const CONTRIBUTION_SAFETY_LIMIT: u128 = u128.mul(ONE_NEAR, u128.from(5));

@nearBindgen
export class Contract {
  private owner: AccountId
  private allow_anonymous: bool
  // private messages: Vector<Message> = new Vector<Message>("m")
  private contributions: ContributionTracker = new ContributionTracker()

  constructor(owner: AccountId, allow_anonymous: bool = true) {
    this.owner = owner
    this.allow_anonymous = allow_anonymous
  }

  @mutateState()
  say(message: string, anonymous: bool = false): bool {
    // guard against too much money being deposited to this account in beta
    const deposit = Context.attachedDeposit
    this.assert_financial_safety_limits(deposit)

    // guard against invalid message size
    assert(message.length > 0, "Message length cannot be 0")
    assert(message.length < Message.max_length(), "Message length is too long, must be less than " + Message.max_length().toString() + " characters.")

    if (!this.allow_anonymous) {
      assert(!anonymous, "Anonymous messages are not allowed by this contract")
    }

    if (deposit > u128.Zero) {
      this.contributions.update(deposit)
    }

    messages.pushBack(new Message(message, anonymous, deposit))
    return true
  }

  // ----------------------------------------------------------------------------
  // OWNER methods
  // ----------------------------------------------------------------------------

  list(): Array<Message> {
    this.assert_owner()
    return messages.get_last(10)
  }

  summarize(): Contract {
    this.assert_owner()
    return this
  }

  transfer(): void {
    this.assert_owner()

    assert(this.contributions.received > u128.Zero, "No received (pending) funds to be transferred")

    const to_self = Context.contractName
    const to_owner = ContractPromiseBatch.create(this.owner)

    // transfer earnings to owner then confirm transfer complete
    const promise = to_owner.transfer(this.contributions.received)
    promise.then(to_self).function_call("on_transfer_complete", '{}', u128.Zero, XCC_GAS)
  }

  @mutateState()
  on_transfer_complete(): void {
    assert_self()
    assert_single_promise_success()

    logging.log("transfer complete")
    // reset contribution tracker
    this.contributions.record_transfer()
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------

  private assert_owner(): void {
    const caller = Context.predecessor
    assert(this.owner == caller, "Only the owner of this contract may call this method")
  }

  private assert_financial_safety_limits(deposit: u128): void {
    const new_total = u128.add(deposit, this.contributions.received)
    assert(u128.le(deposit, CONTRIBUTION_SAFETY_LIMIT), "You are trying to attach too many NEAR Tokens to this call.  There is a safe limit while in beta of 5 NEAR")
    assert(u128.le(new_total, CONTRIBUTION_SAFETY_LIMIT), "Maximum contributions reached.  Please call transfer() to continue receiving funds.")
  }

}


const messages: Vector<Message> = new Vector<Message>("m")
