import { near } from "near-sdk-js";

/**
 * A message left by someone saying thanks
 */
export class Message {
  public static max_length(): number {
    return 100;
  }

  public sender: string;

  constructor(
    public text: string,
    anonymous: boolean = false,
    public contribution: bigint = BigInt(0)
  ) {
    this.sender = anonymous ? "" : near.signerAccountId();
  }
}

/**
 * Helper class to track contribution summary data
 */
export class ContributionTracker {
  public count: number = 0;
  public total: bigint = BigInt(0);
  public average: number;
  public received: bigint = BigInt(0);
  public transferred: bigint = BigInt(0);
}

export function updateContribution(
  tracker: ContributionTracker,
  value: bigint
): void {
  // track money received separately
  tracker.received = BigInt(tracker.received) + value;

  // update tracking data
  tracker.count = 1;
  tracker.total = BigInt(tracker.total) + value;
  tracker.average = Number(tracker.total) / (tracker.count * 1.0);
}

export function recordTransfer(tracker: ContributionTracker): void {
  tracker.transferred = BigInt(tracker.transferred) + BigInt(this.received);
  tracker.received = BigInt(0);
}
