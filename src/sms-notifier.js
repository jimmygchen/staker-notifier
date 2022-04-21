const accountSid = 'AC22edf3c824a4178b6fbe3b2438b7b51b';
const authToken = '';
const client = require('twilio')(accountSid, authToken);
client.logLevel = 'debug';

class SMSNotifier {
    constructor() {

    }

    notify (message) {
        console.log(`SMS sent to ${message}`);
        client.messages
            .create({
                body: 'Hello there!',
                from: '+19206773875',
                to: '+41792990136'
            })
            .then(message => console.log(message.sid));
    }
}

module.exports = { SMSNotifier }