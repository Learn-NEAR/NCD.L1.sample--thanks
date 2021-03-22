import {
  showYouKnow,
  showYouKnow2,
  sayHello,
  sayMyName,
  saveMyName,
  saveMyMessage,
  getAllMessages,
} from "../assembly";
import { storage, PersistentDeque, VMContext, VM } from "near-sdk-as";

const contract = "greeting";
const alice = "alice";
const message1 = "hooray!";
const message2 = "yaşasın!";
const message3 = "beleza!";

let messages: PersistentDeque<string>;

describe("Greeting", () => {
  beforeEach(() => {
    VMContext.setCurrent_account_id(contract);
    VMContext.setSigner_account_id(alice);
    messages = new PersistentDeque<string>("messages");
  });

  it("should respond to showYouKnow()", () => {
    expect(showYouKnow).not.toThrow();
    expect(VM.logs()).toContainEqual("showYouKnow() was called");
  });

  it("should respond to showYouKnow2()", () => {
    expect(showYouKnow2()).toBeTruthy();
    expect(VM.logs()).toContainEqual("showYouKnow2() was called");
  });

  it("should respond to sayHello()", () => {
    expect(sayHello()).toStrictEqual("Hello!");
    expect(VM.logs()).toContainEqual("sayHello() was called");
  });

  it("should respond to sayMyName()", () => {
    expect(sayMyName()).toStrictEqual("Hello, " + alice + "!");
    expect(VM.logs()).toContainEqual("sayMyName() was called");
  });

  it("should respond to saveMyName()", () => {
    expect(saveMyName).not.toThrow();
    expect(storage.getString("last_sender")).toStrictEqual(alice);
    expect(VM.logs()).toContainEqual("saveMyName() was called");
  });

  it("should respond to saveMyMessage()", () => {
    const expected = alice + " says " + message1;
    expect(saveMyMessage(message1)).toBeTruthy();
    expect(messages.first).toStrictEqual(expected);
    expect(VM.logs()).toContainEqual("saveMyMessage() was called");
  });

  it("should respond to getAllMessages()", () => {
    messages.pushFront(message1);
    messages.pushFront(message2);
    messages.pushFront(message3);

    const output = getAllMessages();
    expect(output).toHaveLength(3);
    expect(messages).toHaveLength(0);

    expect(VM.logs()).toContainEqual("getAllMessages() was called");
  });
});
