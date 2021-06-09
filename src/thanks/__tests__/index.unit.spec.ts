import { Context} from "near-sdk-core"
import { VMContext } from "near-sdk-as"
import { Contract } from "../assembly/index"
import { AccountId } from "../../utils"

// use `logging.log()` to log to terminal
// use `log()` to log in testing blocks
// "near call \$CONTRACT init '{\"owner\":\"'\$OWNER'\"}' --accountId \$CONTRACT"

const owner = 'ben'

let contract: Contract;
beforeEach(() => {
  contract = new Contract(owner);
})

describe('Send Message', () => {

  it('Throws AssertionError if string is empty', () => {
    expect(() => {
      // log(`Context.predecessor: ${Context.predecessor}`)
      // log(`Context.sender: ${Context.sender}`)
      // log(`Context.contractName: ${Context.contractName}`)
      contract.say("");
    }).toThrow();
  });

  it('Throws if message is too long', () => {
    const longMessage: string = "This is a really long message that should throw an error for being longer than 100 characters as is set by the max_length property on the Message class.";
    expect(() => {
      contract.say(longMessage);
    }).toThrow();
  });

});
 
describe('List Messages', () => {
  // seed messages for list() method

  it('Lists the last 10 messages', () => {
    contract.say("first message")
    contract.say("second message")
    contract.say("third message")
    contract.say("fourth message")
    contract.say("fifth message")
    contract.say("sixth message")
    contract.say("seventh message")
    contract.say("eigth message")
    contract.say("nineth message")
    contract.say("tenth message")
    contract.say("eleventh message")
    // from https://github.com/near/near-sdk-as/blob/master/near-mock-vm/assembly/context.ts
    VMContext.setPredecessor_account_id(owner)
    const last10 = contract.list()
    log(last10)
    expect(last10.length).toBe(10);
  });

});