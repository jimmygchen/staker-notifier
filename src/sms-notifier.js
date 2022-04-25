const twilio = require('twilio');
class SMSNotifier {
    constructor(config) {
        this.config = config;
        this.client = twilio(config.accountSid, config.authToken)
    }

    notify(message) {
        console.log(`Sending SMS: ${message}`);
        this.client.messages
            .create({
                body: message,
                from: this.config.from,
                to: this.config.to
            })
            .then(message => console.log(`Message successfully sent: ${message.sid}`))
            .catch(err => console.error(`Error sending message: ${err}`));
    }
}

module.exports = { SMSNotifier }