use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
#[allow(unused_imports)]
use near_sdk::{env, near_bindgen};
use near_sdk::serde::{Deserialize, Serialize};

use crate::utils::{
    AccountId,
};


#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
/// A message by someone saying thanks
pub struct Message{
    pub text: String,
    contribution: u128,
    sender: Option<AccountId>,
}


impl Message{
    pub fn max_length() -> usize {
        100
    }

    pub fn new(
        text: String,
        anonymous: bool,
        contribution: u128,

    ) -> Self {

        // let anonymous: bool = anonymous.unwrap_or(false);
        // let contribution: u128 = contribution.unwrap_or(0);

        let sender: Option<AccountId> = match anonymous{
            true => None,
            false => Some(env::signer_account_id())
        };

        Message{
            text,
            contribution,
            sender,
        }
    }
}


#[near_bindgen]
#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
/// Helper class to track contribution summary data
pub struct ContributionTracker {
    count: u32,
    total: u128,
    average: f64,
    pub received: u128,
    transferred: u128,
}

impl Default for ContributionTracker{
    fn default() -> Self {
        ContributionTracker{
            count: 0,
            total: 0,
            average: 0.,
            received: 0,
            transferred: 0,
        }
    }
}


impl ContributionTracker{
    pub fn update(&mut self, value: u128) {
        // track money received separately
        self.received = self.received + value;

        // update tracking data
        self.count += 1;
        self.total = self.total + value;
        self.average = (self.total as f64) /(self.count as f64);
    }

    pub fn record_transfer(&mut self) {
        self.transferred = self.transferred + self.received;
        self.received = 0;
    }
}

// Not sure why this is required. Maybe before there were more calls to it. Maybe later there will be more calls to this function.

/// Setup a generic function instead of duplicating the get_last method
pub fn get_last<D: Clone>(persistent_vec: &Vec<D>, count: i32) -> Vec<D> {
    let length: usize = persistent_vec.len() as usize;
    let n: usize = std::cmp::min(count as usize, length);
    let start_index: usize = length - n;
    let mut result: Vec<D> = Vec::with_capacity(n);

    for i in start_index..length{
        let value: &D = persistent_vec.get(i).unwrap();
        result.push(value.clone());
    }

    result
}