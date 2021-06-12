import { ContractPromiseBatch, Context, base58, u128, env, logging, ContractPromise } from "near-sdk-as"
import { MIN_ACCOUNT_BALANCE, AccountId, XCC_GAS } from "../../utils";


const CODE = includeBytes("../../../build/release/thanks.wasm")

@nearBindgen
export class Contract {

  say_thanks_without_account(recipient: string, message: string): void {
    assert(false, "Not implemented")
  }

  deploy_contract(): void {
    // storing meme metadata requires some storage staking (balance locked to offset cost of data storage)
    assert(
      u128.ge(Context.attachedDeposit, MIN_ACCOUNT_BALANCE),
      "Minimum account balance must be attached to initialize a meme (0.1 NEAR)"
    );

    const targetAccount = full_account()

    assert(env.isValidAccountID(targetAccount), "Account name must be valid NEAR account name")

    logging.log("attempting to create meme")

    let promise = ContractPromiseBatch.create(targetAccount)
      .create_account()
      .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(CODE)))
      .add_full_access_key(base58.decode(Context.senderPublicKey))

    promise.function_call(
      "init",
      new ThanksInitArgs(),
      Context.attachedDeposit,
      XCC_GAS
    )

    promise.then(Context.contractName).function_call(
      "on_contract_deployed",
      new ThanksNameAsArgs(),
      u128.Zero,
      XCC_GAS
    )
  }

  on_contract_deployed(meme: AccountId): void {
    let results = ContractPromise.getResults();
    let memeCreated = results[0];

    // Verifying the remote contract call succeeded.
    // https://nomicon.io/RuntimeSpec/Components/BindingsSpec/PromisesAPI.html?highlight=promise#returns-3
    switch (memeCreated.status) {
      case 0:
        // promise result is not complete
        logging.log("Account creation for [ " + full_account() + " ] is pending")
        break;
      case 1:
        // promise result is complete and successful
        logging.log("Account creation for [ " + full_account() + " ] succeeded")
        // call registry to register new account creation
        break;
      case 2:
        // promise result is complete and failed
        logging.log("Account creation for [ " + full_account() + " ] failed")
        break;

      default:
        logging.log("Unexpected value for promise result [" + memeCreated.status.toString() + "]");
        break;
    }
  }

}

function full_account(): string {
  return "thanks." + Context.sender
}

@nearBindgen
class ThanksInitArgs {
  constructor(
    public owner: string = Context.sender,
  ) { }
}

@nearBindgen
class ThanksNameAsArgs {
  constructor(
    public account: string = full_account()
  ) { }
}
