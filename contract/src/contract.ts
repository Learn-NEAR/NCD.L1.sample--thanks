import {
  NearBindgen,
  NearContract,
  near,
  call,
  assert,
  Vector,
} from "near-sdk-js";
import {
  ContributionTracker,
  Message,
  recordTransfer,
  updateContribution,
} from "./models";
import { assert_self, assert_single_promise_success } from "./utils";

const ONE_NEAR: bigint = BigInt(10e24);
const TGAS: bigint = BigInt(10e14);
const XCC_GAS: bigint = BigInt(5) * TGAS;
// max 5 NEAR accepted to this contract before it forces a transfer to the owner
const CONTRIBUTION_SAFETY_LIMIT: bigint = ONE_NEAR * BigInt(5);

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

// The @NearBindgen decorator allows this code to compile to Base64.
@NearBindgen
export class Contract extends NearContract {
  private owner: string;
  private allow_anonymous: boolean;
  private contributions: ContributionTracker = new ContributionTracker();
  private messages: Vector;

  constructor({
    owner,
    allow_anonymous = true,
  }: {
    owner: string;
    allow_anonymous?: boolean;
  }) {
    super();
    this.owner = owner;
    this.allow_anonymous = allow_anonymous;
    this.messages = new Vector("messages");
  }

  default() {
    return new Contract({ owner: near.signerAccountId() });
  }

  @call
  say({
    message,
    anonymous = false,
  }: {
    message: string;
    anonymous: boolean;
  }): boolean {
    // guard against too much money being deposited to this account in beta
    const deposit = BigInt(Number(near.attachedDeposit()));
    this.assert_financial_safety_limits(deposit);

    // guard against invalid message size
    assert(message.length > 0, "Message length cannot be 0");
    assert(
      message.length < Message.max_length(),
      "Message length is too long, must be less than " +
        Message.max_length().toString() +
        " characters."
    );

    if (!this.allow_anonymous) {
      assert(!anonymous, "Anonymous messages are not allowed by this contract");
    }

    if (deposit > BigInt(0)) {
      updateContribution(this.contributions, deposit);
    }

    this.messages.push(new Message(message, anonymous, deposit));
    return true;
  }

  // ----------------------------------------------------------------------------
  // OWNER methods
  // ----------------------------------------------------------------------------

  @call
  list(): Array<Message> {
    this.assert_owner();

    const messages = [];
    const length = this.messages.len();

    for (let i = Math.max(length - 10, 0); i < length; i++) {
      messages.push(this.messages.get(i));
    }

    return messages;
  }

  @call
  summarize(): Contract {
    this.assert_owner();
    return this;
  }

  @call
  transfer(): void {
    this.assert_owner();

    assert(
      this.contributions.received > BigInt(0),
      "No received (pending) funds to be transferred"
    );

    const self = near.jsvmJsContractName();
    const promise = near.promiseBatchCreate(this.owner);

    // transfer earnings to owner
    near.promiseBatchActionTransfer(promise, this.contributions.received);

    // confirm transfer complete
    const complete = near.promiseThen(
      promise,
      self,
      "on_transfer_complete",
      "{}",
      0,
      XCC_GAS
    );

    return near.promiseReturn(complete);
  }

  @call
  on_transfer_complete(): void {
    assert_self();
    assert_single_promise_success();

    near.log("transfer complete");
    // reset contribution tracker
    recordTransfer(this.contributions);
  }

  // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------

  private assert_owner(): void {
    const caller = near.predecessorAccountId();
    assert(
      this.owner == caller,
      "Only the owner of this contract may call this method"
    );
  }

  private assert_financial_safety_limits(deposit: bigint | number): void {
    const new_total = BigInt(Number(deposit)) + this.contributions.received;
    assert(
      deposit <= CONTRIBUTION_SAFETY_LIMIT,
      "You are trying to attach too many NEAR Tokens to this call.  There is a safe limit while in beta of 5 NEAR"
    );
    assert(
      new_total <= CONTRIBUTION_SAFETY_LIMIT,
      "Maximum contributions reached.  Please call transfer() to continue receiving funds."
    );
  }
}
