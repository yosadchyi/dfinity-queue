import {CronJob} from 'cron';
import {config} from "dotenv";
import {IDL} from '@dfinity/candid';
import {HttpAgent} from '@dfinity/agent';
import {Actor} from '@dfinity/agent';
import fetch from 'node-fetch';
import twilio from "twilio";

const idlFactory = () => {
    const Message = IDL.Record({'message': IDL.Text, 'phone': IDL.Text});
    const EnqueueMessageResponse = IDL.Variant({
        'ok': Message,
        'error': IDL.Variant({
            'other': IDL.Text,
            'empty': IDL.Null,
            'badRequest': IDL.Variant({
                'emptyText': IDL.Null,
                'textTooLong': IDL.Null,
                'badPhone': IDL.Null,
            }),
        }),
    });
    return IDL.Service({
        'dequeueAll': IDL.Func([], [IDL.Vec(Message)], []),
        'enqueue': IDL.Func([IDL.Text, IDL.Text], [EnqueueMessageResponse], []),
        'setup': IDL.Func([], [], ['oneway']),
    });
};

config();

const init = async () => {
    let agent = new HttpAgent({host: "http://127.0.0.1:8000", fetch: fetch});
    agent.fetchRootKey().then(key => agent.getPrincipal().then(r => {
        let dqueue = Actor.createActor(idlFactory, {agent, canisterId: process.env.CANISTER_ID});
        let client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

        new CronJob('*/10 * * * * *', () => {
            console.log('Fetching messages from queue...');
            dqueue.dequeueAll().then(r => {
                r.forEach(m => {
                    client.messages.create({
                        body: m.message,
                        to: m.phone,  // Text this number
                        from: process.env.TWILIO_PHONE // From a valid Twilio number
                    }).then(message => console.log(message.sid));
                });
            });
        }, null, true);
    }));
};

init().then(() => console.log('twillio_sender started...'));
