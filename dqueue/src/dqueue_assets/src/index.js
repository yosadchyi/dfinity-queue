import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as dqueue_idl, canisterId as dqueue_id } from 'dfx-generated/dqueue';

const agent = new HttpAgent();
const dqueue = Actor.createActor(dqueue_idl, { agent, canisterId: dqueue_id });

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  const greeting = await dqueue.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
