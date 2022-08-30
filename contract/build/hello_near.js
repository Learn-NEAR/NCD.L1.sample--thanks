function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

function call(target, key, descriptor) {}
function NearBindgen(target) {
  return class extends target {
    static _init() {
      // @ts-ignore
      let args = target.deserializeArgs();
      let ret = new target(args); // @ts-ignore

      ret.init(); // @ts-ignore

      ret.serialize();
      return ret;
    }

    static _get() {
      let ret = Object.create(target.prototype);
      return ret;
    }

  };
}

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
function log(...params) {
  env.log(`${params.map(x => x === undefined ? 'undefined' : x) // Stringify undefined
  .map(x => typeof x === 'object' ? JSON.stringify(x) : x) // Convert Objects to strings
  .join(' ')}` // Convert to string
  );
}
function signerAccountId() {
  env.signer_account_id(0);
  return env.read_register(0);
}
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return env.read_register(0);
}
function attachedDeposit() {
  return env.attached_deposit();
}
function panic(msg) {
  if (msg !== undefined) {
    env.panic(msg);
  } else {
    env.panic();
  }
}
function storageRead(key) {
  let ret = env.storage_read(key, 0);

  if (ret === 1n) {
    return env.read_register(0);
  } else {
    return null;
  }
}
function jsvmJsContractName() {
  env.jsvm_js_contract_name(0);
  return env.read_register(0);
}
function storageGetEvicted() {
  return env.read_register(EVICTED_REGISTER);
}
function input() {
  env.input(0);
  return env.read_register(0);
}
function promiseThen(promiseIndex, accountId, methodName, args, amount, gas) {
  return env.promise_then(promiseIndex, accountId, methodName, args, amount, gas);
}
function promiseBatchCreate(accountId) {
  return env.promise_batch_create(accountId);
}
function promiseBatchActionTransfer(promiseIndex, amount) {
  env.promise_batch_action_transfer(promiseIndex, amount);
}
function promiseResultsCount() {
  return env.promise_results_count();
}
var PromiseResult;

(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));

function promiseResult(resultIdx) {
  let status = env.promise_result(resultIdx, 0);

  if (status == PromiseResult.Successful) {
    return env.read_register(0);
  } else if (status == PromiseResult.Failed || status == PromiseResult.NotReady) {
    return status;
  } else {
    panic(`Unexpected return code: ${status}`);
  }
}
function promiseReturn(promiseIdx) {
  env.promise_return(promiseIdx);
}
function storageWrite(key, value) {
  let exist = env.storage_write(key, value, EVICTED_REGISTER);

  if (exist === 1n) {
    return true;
  }

  return false;
}
function storageRemove(key) {
  let exist = env.storage_remove(key, EVICTED_REGISTER);

  if (exist === 1n) {
    return true;
  }

  return false;
}

class NearContract {
  deserialize() {
    const rawState = storageRead("STATE");

    if (rawState) {
      const state = JSON.parse(rawState); // reconstruction of the contract class object from plain object

      let c = this.default();
      Object.assign(this, state);

      for (const item in c) {
        if (c[item].constructor?.deserialize !== undefined) {
          this[item] = c[item].constructor.deserialize(this[item]);
        }
      }
    } else {
      throw new Error("Contract state is empty");
    }
  }

  serialize() {
    storageWrite("STATE", JSON.stringify(this));
  }

  static deserializeArgs() {
    let args = input();
    return JSON.parse(args || "{}");
  }

  static serializeReturn(ret) {
    return JSON.stringify(ret);
  }

  init() {}

}

function u8ArrayToBytes(array) {
  let ret = "";

  for (let e of array) {
    ret += String.fromCharCode(e);
  }

  return ret;
} // TODO this function is a bit broken and the type can't be string

function assert(b, str) {
  if (b) {
    return;
  } else {
    throw Error("assertion failed: " + str);
  }
}

const ERR_INDEX_OUT_OF_BOUNDS = "Index out of bounds";
const ERR_INCONSISTENT_STATE = "The collection is an inconsistent state. Did previous smart contract execution terminate unexpectedly?";

function indexToKey(prefix, index) {
  let data = new Uint32Array([index]);
  let array = new Uint8Array(data.buffer);
  let key = u8ArrayToBytes(array);
  return prefix + key;
} /// An iterable implementation of vector that stores its content on the trie.
/// Uses the following map: index -> element


class Vector {
  constructor(prefix) {
    this.length = 0;
    this.prefix = prefix;
  }

  len() {
    return this.length;
  }

  isEmpty() {
    return this.length == 0;
  }

  get(index) {
    if (index >= this.length) {
      return null;
    }

    let storageKey = indexToKey(this.prefix, index);
    return JSON.parse(storageRead(storageKey));
  } /// Removes an element from the vector and returns it in serialized form.
  /// The removed element is replaced by the last element of the vector.
  /// Does not preserve ordering, but is `O(1)`.


  swapRemove(index) {
    if (index >= this.length) {
      throw new Error(ERR_INDEX_OUT_OF_BOUNDS);
    } else if (index + 1 == this.length) {
      return this.pop();
    } else {
      let key = indexToKey(this.prefix, index);
      let last = this.pop();

      if (storageWrite(key, JSON.stringify(last))) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }

  push(element) {
    let key = indexToKey(this.prefix, this.length);
    this.length += 1;
    storageWrite(key, JSON.stringify(element));
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    } else {
      let lastIndex = this.length - 1;
      let lastKey = indexToKey(this.prefix, lastIndex);
      this.length -= 1;

      if (storageRemove(lastKey)) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }

  replace(index, element) {
    if (index >= this.length) {
      throw new Error(ERR_INDEX_OUT_OF_BOUNDS);
    } else {
      let key = indexToKey(this.prefix, index);

      if (storageWrite(key, JSON.stringify(element))) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }

  extend(elements) {
    for (let element of elements) {
      this.push(element);
    }
  }

  [Symbol.iterator]() {
    return new VectorIterator(this);
  }

  clear() {
    for (let i = 0; i < this.length; i++) {
      let key = indexToKey(this.prefix, i);
      storageRemove(key);
    }

    this.length = 0;
  }

  toArray() {
    let ret = [];

    for (let v of this) {
      ret.push(v);
    }

    return ret;
  }

  serialize() {
    return JSON.stringify(this);
  } // converting plain object to class object


  static deserialize(data) {
    let vector = new Vector(data.prefix);
    vector.length = data.length;
    return vector;
  }

}
class VectorIterator {
  constructor(vector) {
    this.current = 0;
    this.vector = vector;
  }

  next() {
    if (this.current < this.vector.len()) {
      let value = this.vector.get(this.current);
      this.current += 1;
      return {
        value,
        done: false
      };
    }

    return {
      value: null,
      done: true
    };
  }

}

/**
 * A message left by someone saying thanks
 */

class Message {
  static max_length() {
    return 100;
  }

  constructor(text, anonymous = false, contribution = BigInt(0)) {
    this.text = text;
    this.contribution = contribution;
    this.sender = anonymous ? "" : signerAccountId();
  }

}
/**
 * Helper class to track contribution summary data
 */

class ContributionTracker {
  count = 0;
  total = BigInt(0);
  received = BigInt(0);
  transferred = BigInt(0);
}
function updateContribution(tracker, value) {
  // track money received separately
  tracker.received = BigInt(tracker.received) + value; // update tracking data

  tracker.count = 1;
  tracker.total = BigInt(tracker.total) + value;
  tracker.average = Number(tracker.total) / (tracker.count * 1.0);
}
function recordTransfer(tracker) {
  tracker.transferred = BigInt(tracker.transferred) + BigInt(this.received);
  tracker.received = BigInt(0);
}

/**
 * Function to assert that the contract has called itself
 */

function assert_self() {
  const caller = predecessorAccountId();
  const self = jsvmJsContractName();
  assert(caller == self, "Only this contract may call itself");
}
function assert_single_promise_success() {
  const resultsCount = promiseResultsCount();
  assert(resultsCount === BigInt(1), "Expected exactly one promise result");
  const result = promiseResult(0);
  assert(result === "AVAILABLE", "Expected PromiseStatus to be successful");
}

var _class, _class2;
const ONE_NEAR = BigInt(10e24);
const TGAS = BigInt(10e14);
const XCC_GAS = BigInt(5) * TGAS; // max 5 NEAR accepted to this contract before it forces a transfer to the owner

const CONTRIBUTION_SAFETY_LIMIT = ONE_NEAR * BigInt(5);

BigInt.prototype["toJSON"] = function () {
  return this.toString();
}; // The @NearBindgen decorator allows this code to compile to Base64.


let Contract = NearBindgen(_class = (_class2 = class Contract extends NearContract {
  // private messages: Vector<Message> = new Vector<Message>("m")
  contributions = new ContributionTracker();

  constructor({
    owner,
    allow_anonymous = true
  }) {
    super();
    this.owner = owner;
    this.allow_anonymous = allow_anonymous;
    this.messages = new Vector("messages");
  }

  default() {
    return new Contract({
      owner: signerAccountId()
    });
  }

  say({
    message,
    anonymous = false
  }) {
    // guard against too much money being deposited to this account in beta
    const deposit = BigInt(Number(attachedDeposit()));
    this.assert_financial_safety_limits(deposit); // guard against invalid message size

    assert(message.length > 0, "Message length cannot be 0");
    assert(message.length < Message.max_length(), "Message length is too long, must be less than " + Message.max_length().toString() + " characters.");

    if (!this.allow_anonymous) {
      assert(!anonymous, "Anonymous messages are not allowed by this contract");
    }

    if (deposit > BigInt(0)) {
      // this.contributions.update(deposit);
      updateContribution(this.contributions, deposit);
    }

    this.messages.push(new Message(message, anonymous, deposit));
    return true;
  } // ----------------------------------------------------------------------------
  // OWNER methods
  // ----------------------------------------------------------------------------


  list() {
    this.assert_owner();
    const messages = [];
    const length = this.messages.len();

    for (let i = Math.max(length - 10, 0); i < length; i++) {
      messages.push(this.messages.get(i));
    }

    return messages;
  }

  summarize() {
    this.assert_owner();
    return this;
  }

  transfer() {
    this.assert_owner();
    assert(this.contributions.received > BigInt(0), "No received (pending) funds to be transferred");
    const self = jsvmJsContractName();
    const promise = promiseBatchCreate(this.owner); // transfer earnings to owner

    promiseBatchActionTransfer(promise, this.contributions.received); // confirm transfer complete

    const complete = promiseThen(promise, self, "on_transfer_complete", "{}", 0, XCC_GAS);
    return promiseReturn(complete);
  }

  on_transfer_complete() {
    assert_self();
    assert_single_promise_success();
    log("transfer complete"); // reset contribution tracker

    recordTransfer(this.contributions);
  } // --------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------


  assert_owner() {
    const caller = predecessorAccountId();
    assert(this.owner == caller, "Only the owner of this contract may call this method");
  }

  assert_financial_safety_limits(deposit) {
    const new_total = BigInt(deposit.toString()) + this.contributions.received;
    assert(deposit <= CONTRIBUTION_SAFETY_LIMIT, "You are trying to attach too many NEAR Tokens to this call.  There is a safe limit while in beta of 5 NEAR");
    assert(new_total <= CONTRIBUTION_SAFETY_LIMIT, "Maximum contributions reached.  Please call transfer() to continue receiving funds.");
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "say", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "say"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "list", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "list"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "summarize", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "summarize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "transfer", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "transfer"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "on_transfer_complete", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "on_transfer_complete"), _class2.prototype)), _class2)) || _class;
function init() {
  Contract._init();
}
function on_transfer_complete() {
  let _contract = Contract._get();

  _contract.deserialize();

  let args = _contract.constructor.deserializeArgs();

  let ret = _contract.on_transfer_complete(args);

  _contract.serialize();

  if (ret !== undefined) env.value_return(_contract.constructor.serializeReturn(ret));
}
function transfer() {
  let _contract = Contract._get();

  _contract.deserialize();

  let args = _contract.constructor.deserializeArgs();

  let ret = _contract.transfer(args);

  _contract.serialize();

  if (ret !== undefined) env.value_return(_contract.constructor.serializeReturn(ret));
}
function summarize() {
  let _contract = Contract._get();

  _contract.deserialize();

  let args = _contract.constructor.deserializeArgs();

  let ret = _contract.summarize(args);

  _contract.serialize();

  if (ret !== undefined) env.value_return(_contract.constructor.serializeReturn(ret));
}
function list() {
  let _contract = Contract._get();

  _contract.deserialize();

  let args = _contract.constructor.deserializeArgs();

  let ret = _contract.list(args);

  _contract.serialize();

  if (ret !== undefined) env.value_return(_contract.constructor.serializeReturn(ret));
}
function say() {
  let _contract = Contract._get();

  _contract.deserialize();

  let args = _contract.constructor.deserializeArgs();

  let ret = _contract.say(args);

  _contract.serialize();

  if (ret !== undefined) env.value_return(_contract.constructor.serializeReturn(ret));
}

export { Contract, init, list, on_transfer_complete, say, summarize, transfer };
//# sourceMappingURL=hello_near.js.map
