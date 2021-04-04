# Thanks

This contract is used by students of the NCD program to give thanks to one another.

Sketch:

```ts
// ------------------------------------
// public methods
// ------------------------------------

/**
 * give thanks to the owner of the contract
 * and optionally attach tokens
 */
function say(message: string, anonymous: bool): bool

// ------------------------------------
// owner methods
// ------------------------------------

/**
 * show all messages and users
 */
function list(): Array<Message>

/**
 * generate a summary report
 */
function summarize(): ContributionTracker
```
