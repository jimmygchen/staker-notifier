const accountSid = 'AC22edf3c824a4178b6fbe3b2438b7b51b';
const authToken = 'INSERT TOKEN HERE';
const client = require('twilio')(accountSid, authToken);

class SMSNotifier {
    constructor() {

    }

    notify (message) {
        console.log(`SMS message: ${message}`);
        client.messages
            .create({
                body: message,
                from: 'INSERT NUMBER HERE',
                to: 'INSERT NUMBER HERE'
            })
            .then(message => console.log(message.sid));
    }
}

module.exports = { SMSNotifier }