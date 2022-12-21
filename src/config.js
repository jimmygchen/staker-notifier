import dotenv from 'dotenv';

dotenv.config();

const config = {
    beaconAPIs: process.env.BEACON_API_LIST,
    sms: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        from: process.env.SMS_FROM,
        to: process.env.SMS_TO
    },
    telegram: {
        botURL: process.env.TELEGRAM_BOT_API_URL,
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatID: process.env.TELEGRAM_CHAT_ID
    },
    pubkeys: process.env.VALIDATOR_PUBKEYS.split(','),
    alerts: {
        validatorBalanceReduced: {
            minEpochsToTrigger: 3,
            notifyIntervalEpochs: process.env.BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS || 20
        }
    }
}

export {config};
