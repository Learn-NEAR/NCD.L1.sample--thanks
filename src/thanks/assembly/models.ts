import { Context, u128, PersistentVector } from "near-sdk-as";
import { AccountId } from "../../utils";

/**
 * A message left by someone saying thanks
 */
@nearBindgen
export class Message {
  public static max_length(): i32 { return 100 as i32 };

  public sender: AccountId

  constructor(
    public text: string,
    anonymous: bool = false,
    public contribution: u128 = u128.Zero
  ) {
    this.sender = anonymous ? '' : Context.sender
  }
}

/**
 * Helper class to track contribution summary data
 */
@nearBindgen
export class ContributionTracker {
  public count: u32 = 0;
  public total: u128 = u128.Zero;
  public average: f64;
  public received: u128 = u128.Zero
  public transferred: u128 = u128.Zero

  update(value: u128): void {
    // track money received separately
    this.received = u128.add(this.received, value);

    // update tracking data
    this.count += 1;
    this.total = u128.add(this.total, value);
    this.average = u128.div(this.total, u128.from(this.count)).toF64();
  }

  record_transfer(): void {
    this.transferred = u128.add(this.transferred, this.received)
    this.received = u128.Zero
  }
}

/**
 * setup a generic subclass instead of duplicating the get_last method
 */
@nearBindgen
export class Vector<T> extends PersistentVector<T> {
  /**
   * this method isn't normally available on a PersistentVector
   * so we add it here to make our lives easier when returning the
   * last `n` items for comments, votes and donations
   * @param count
   */
  get_last(count: i32): Array<T> {
    const n = min(count, this.length);
    const startIndex = this.length - n;
    const result = new Array<T>();
    for (let i = startIndex; i < this.length; i++) {
      const entry = this[i];
      result.push(entry);
    }
    return result;
  }
}
