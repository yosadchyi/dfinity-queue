module {
    public type Message = {
        phone: Text;
        message: Text;
    };

    public type EnqueueMessageResponse = {
        #ok: Message;
        #error: {
            #empty;
            #badRequest: {
                #badPhone;
                #textTooLong;
                #emptyText;
            };
            #other: Text;
        }
    };
}
