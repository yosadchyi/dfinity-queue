import Queue "./Queue";
import Def "./Definitions";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import icp_sms "canister:icp_sms";

actor {
    var q: Queue.Queue<Def.Message> = Queue.nil();

	public func setup() {
		let result = await icp_sms.subscribe("enqueue");
		assert(result);
	};

    public func enqueue(phone: Text, message: Text) : async Def.EnqueueMessageResponse {
		let msg: Def.Message = {phone = phone; message = message};
		q := Queue.enqueue(msg, q);
		return #ok(msg);
    };

	public func dequeueAll(): async [Def.Message] {
		var result : [Def.Message] = [];

		while (not Queue.isEmpty(q)) {
			let (m, q0) = Queue.dequeue(q);
			q := q0;

			result := Array.append<Def.Message>(result, [Option.unwrap(m)]);
		};
		return result;
    };
};
