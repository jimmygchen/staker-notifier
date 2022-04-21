class SMSNotifier {
    constructor() {

    }

    notify (message) {
        console.log(`SMS sent to ${message}`);
    }
}

module.exports = { SMSNotifier }