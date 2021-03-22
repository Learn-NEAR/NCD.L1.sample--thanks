![Near, Inc. logo](https://near.org/wp-content/themes/near-19/assets/img/logo.svg?t=1553011311)

## Design

### Interface

```ts
export function showYouKnow(): void;
```

- "View" function (ie. a function that does NOT alter contract state)
- Takes no parameters
- Returns nothing

```ts
export function showYouKnow2(): bool;
```

- "View" function (ie. a function that does NOT alter contract state)
- Takes no parameters
- Returns true

```ts
export function sayHello(): string;
```

- "View" function
- Takes no parameters
- Returns a string

```ts
export function sayMyName(): string;
```

- "Change" function (although it does NOT alter state, it DOES read from `context`, [see docs for details](https://docs.near.org/docs/develop/contracts/as/intro))
- Takes no parameters
- Returns a string

```ts
export function saveMyName(): void;
```

- "Change" function (ie. a function that alters contract state)
- Takes no parameters
- Saves the sender account name to contract state
- Returns nothing

```ts
export function saveMyMessage(message: string): bool;
```

- "Change" function
- Takes a single parameter message of type string
- Saves the sender account name and message to contract state
- Returns nothing

```ts
export function getAllMessages(): Array<string>;
```

- "Change" function
- Takes no parameters
- Reads all recorded messages from contract state (this can become expensive!)
- Returns an array of messages if any are found, otherwise empty array
