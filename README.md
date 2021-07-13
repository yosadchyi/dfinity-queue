# Sample Dfinity Application

This application includes:
- Message publisher
- FIFO Queue
- Twillio Sender

It works on Local IC. Applications are very simple and several obvious things are missing:
- security checks,
- several code checks.

# Prerequisites

- Installed `dfx`
- Installed `node.js` (14+)
- Installed `rust`
- No software running on port 8000

# HOWTO

1. First of all customize twilio_sender TWILIO credentials and phone number.
2. To build and run everything run `build_and_run.sh` script in the root directory it will create 
all canisters, build and deploy them.
3. Invoke `dfx canister call icp_sms dispatch_message '("+380634327246", "1")'` to publish messages, you can set your number to get messages.
