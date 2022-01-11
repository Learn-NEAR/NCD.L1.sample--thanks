mod models;
mod utils;


use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
#[allow(unused_imports)]
use near_sdk::{env, PromiseIndex, near_bindgen};
use near_sdk::serde::{Deserialize, Serialize};

use crate::{
    utils::{
        AccountId,
        ONE_NEAR,
        XCC_GAS,
        assert_self,
        assert_single_promise_success,
    },
    models::{
        Message,
        ContributionTracker,
        get_last,
    }
};


near_sdk::setup_alloc!();


/// max 5 NEAR accepted to this contract before it forces a transfer to the owner
const CONTRIBUTION_SAFETY_LIMIT: u128 = ONE_NEAR * 5;


#[near_bindgen]
#[derive(Clone, Default, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Contract {
    owner: AccountId,
    allow_anonymous: bool,
    contributions: ContributionTracker,
    messages: Vec<Message>,
}

#[near_bindgen]
impl Contract{

    /// Initialize contract with owner ID and other config data
    /// (note: this method is called "constructor" in the singleton contract code)
    #[init]
    pub fn init(
        owner: AccountId,
        allow_anonymous: bool,
    ) -> Self{
        // let allow_anonymous: bool = allow_anonymous.unwrap_or(true);
        let contributions: ContributionTracker = ContributionTracker::default();
        let messages: Vec<Message> = Vec::new();

        Contract{
            owner,
            allow_anonymous,
            contributions,
            messages,
        }
    }

    // ------------------------------------
    // public methods
    // ------------------------------------

    /// Give thanks to the owner of the contract and 
    /// optionally attach tokens.
    pub fn say(
        &mut self,
        message: String,
        anonymous: bool,
    ) -> bool {
        // let anonymous: bool = anonymous.unwrap_or(false);

        // guard agaisnt too much money being deposited to this account in beta
        let deposit = env::attached_deposit();

        self.assert_financial_safety_limits(deposit);

        // guard agaisnt invalid message size
        assert!(message.len() > 0, "Message length cannot be 0");
        assert!(message.len() < Message::max_length(), "Message length is too long, must be less than {} characters.", Message::max_length());

        if !self.allow_anonymous {
            assert!(!anonymous, "Anonymous messages are not allowed by this contract");
        };

        if deposit > 0 {
            self.contributions.update(deposit);
        };

        self.messages.push(Message::new(
            message,                        // text: &str, 
            anonymous,                      // anonymous: Option<bool>, 
            deposit,                        // contribution: Option<u128>,
        ));

        true
    }

    // -----------------------------------------------------------------------
    // Owner methods
    // -----------------------------------------------------------------------
    
    /// Show all messages and users.
    pub fn list(&self) -> Vec<Message> {
        self.assert_owner();
        let messages = &self.messages;

        return get_last(
            messages,                       // persistent_vec: &Vec<D>, 
            10,                             // count: i32,
        );
    }

    /// Generate a summary report.
    pub fn summarize(&self) -> Contract {
        self.assert_owner();
        return self.clone();
    }

    /// Transfer received funds to owner account.
    pub fn transfer(&self){
        self.assert_owner();

        assert!(self.contributions.received > 0, "No received (pending) funds to be transferred");

        let to_self = env::current_account_id();
        let to_owner = env::promise_batch_create(self.owner.clone());

        // transfer earnings to owner then confirm transfer complete
        env::promise_batch_action_transfer(
            to_owner,                           // promise_index: PromiseIndex, 
            self.contributions.received,        // amount: Balance,
        );

        let then: PromiseIndex = env::promise_batch_then(
            to_owner,                           // promise_index: PromiseIndex, 
            to_self,                            // account_id: A,
        );

        env::promise_batch_action_function_call(
            then,                               // promise_index: PromiseIndex, 
            "on_transfer_complete".as_bytes(),  // method_name: &[u8], 
            "{}".as_bytes(),                    // arguments: &[u8], 
            0,                                  // amount: Balance, 
            XCC_GAS,                            // gas: Gas,
        );
    }

    pub fn on_transfer_complete(&mut self) {
        assert_self();

        assert_single_promise_success();

        env::log("transfer complete".as_bytes());
        // reset contribution tracker
        self.contributions.record_transfer();
    }


    // -----------------------------------------------------------------------
    // Private methods
    // -----------------------------------------------------------------------

    fn assert_owner(&self) {
        let caller = env::predecessor_account_id();
        let owner = self.owner.clone();
        let error_message = format!("Only the owner of this contract may call this method owner: {}, caller: {}",owner, caller);

        assert!(owner.eq_ignore_ascii_case(&caller), "{}", error_message);
    }

    fn assert_financial_safety_limits(&self, deposit: u128) {
        let received = self.contributions.received;
        let new_total = deposit + received;

        assert!(deposit <= CONTRIBUTION_SAFETY_LIMIT, "You are trying to attach too many NEAR Tokens to this call.  There is a safe limit while in beta of 5 NEAR");
        assert!(new_total <= CONTRIBUTION_SAFETY_LIMIT, "Maximum contributions reached.  Please call transfer() to continue receiving funds.");
    }
}