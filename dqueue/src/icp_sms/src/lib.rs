use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use ic_cdk::storage;
use std::collections::BTreeMap;
use regex::Regex;

type SubscribersStore = BTreeMap<Principal, String>;

#[derive(CandidType, Deserialize)]
enum DispatchResult {
    Ok(bool),
    Error(String),
}

#[update]
fn subscribe(callback: String) -> bool {
    let caller = ic_cdk::api::caller();
    let subscribers_store = storage::get_mut::<SubscribersStore>();
    subscribers_store.insert(caller, callback);
    ic_cdk::print("subscribed");
    return true;
}

#[update]
async fn dispatch_message(phone_number: String, message: String) -> DispatchResult {
    if message.trim().is_empty() {
        return DispatchResult::Error("EmptyText".to_string());
    }

    let re = Regex::new(
        r#"(?x)
          (?:\+?1)?                       # Country Code Optional
          [\s\.]?
          (([2-9]\d{2})|\(([2-9]\d{2})\)) # Area Code
          [\s\.\-]?
          ([2-9]\d{2})                    # Exchange Code
          [\s\.\-]?
          (\d{4})                         # Subscriber Number"#,
    ).unwrap();
    
    if !re.is_match(&phone_number) {
        return DispatchResult::Error("InvalidPhoneNumber".to_string());
    }

    let subscribers_store = storage::get::<SubscribersStore>();

    for (subscriber, callback) in subscribers_store {
        ic_cdk::print(subscriber.to_text() + ": callback " + callback);
        let _call_result: Result<(), _> = ic_cdk::api::call::call(*subscriber, callback, (&phone_number, &message, )).await;
    }
    return DispatchResult::Ok(true);
}
