require('dotenv').config();

const config = {
    balanceChecker: {
        beaconAPIs: process.env.BEACON_API_LIST,
        pollIntervalSeconds: process.env.POLL_INTERVAL_SECONDS || 384 // default to 1 epoch
    },
    sms: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        from: process.env.SMS_FROM,
        to: process.env.SMS_TO
    },
    pubkeys: process.env.VALIDATOR_PUBKEYS.split(',')
}

module.exports = { config }
