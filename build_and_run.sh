echo Start local network...
# setup dfinity
cd dqueue
npm i
dfx start &>dfx.log &
sleep 10
echo Create canisters...
dfx canister create --all
echo Deploy...
dfx deploy
# subscribe
dfx canister call dqueue setup
# start twillio sender
export CANISTER_ID=$(dfx canister id dqueue)
cd ../twilio_sender
npm i
npm start
