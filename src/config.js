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
  pubkeys: process.env.VALIDATOR_PUBKEYS.split(','),
  alerts: {
    validatorBalanceReduced: {
      minEpochsToTrigger: 3
    }
  }
}

export { config };
