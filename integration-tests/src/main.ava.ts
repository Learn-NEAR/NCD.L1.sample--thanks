import { Worker, NearAccount } from "near-workspaces";
import anyTest, { TestFn } from "ava";

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("test-account");
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);
  // JavaScript contracts require calling 'init' function upon deployment
  await root.call(contract, "init", { owner: root.accountId });

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("should return default account state", async (t) => {
  const { root, contract } = t.context.accounts;
  const summary = await root.call(contract, "summarize", {});
  console.log(summary);
  t.truthy(summary, "No summary provided");
});

test("should list messages", async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(
    contract,
    "say",
    { message: "Howdy", anonymous: true },
    { attachedDeposit: "1" }
  );
  await root.call(contract, "say", { message: "Howdy", anonymous: false });
  const messages: Array<any> = await root.call(contract, "list", {});
  console.log(messages);
  const summary = await root.call(contract, "summarize", {});
  console.log(summary);
  t.assert(messages.length === 2, "Messages not saved correctly");
});
