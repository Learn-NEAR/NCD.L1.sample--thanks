import { assert, near } from "near-sdk-js";

/**
 * Function to assert that the contract has called itself
 */
export function assert_self(): void {
  const caller = near.predecessorAccountId();
  const self = near.jsvmJsContractName();
  assert(caller == self, "Only this contract may call itself");
}

export function assert_single_promise_success(): void {
  const resultsCount = near.promiseResultsCount();
  assert(resultsCount === BigInt(1), "Expected exactly one promise result");
  const result = near.promiseResult(0);
  assert(result === "AVAILABLE", "Expected PromiseStatus to be successful");
}
