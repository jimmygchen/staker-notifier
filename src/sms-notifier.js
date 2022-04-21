const accountSid = 'AC22edf3c824a4178b6fbe3b2438b7b51b';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

class SMSNotifier {
    constructor() {

    }

    notify (message) {
        console.log(`SMS message: ${message}`);
        client.messages
            .create({
                body: message,
                from: '+19206773875',
                to: '+41792990136'
            })
            .then(message => console.log(message.sid));
    }
}

module.exports = { SMSNotifier }