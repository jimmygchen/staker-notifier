# Staker Notifier

A simple notification tool for Ethereum stakers & validator operators to track their validator health and statuses. Run it easily in your own infrastructure without disclosing information about your validator to 3rd parties.

Staker Notifier currently tracks the following events:
- **Balance**: when balance of one or more validators have reduced since the previous epoch
- **Status**: when validator status has changed or when new validator has been added to the Beacon chain

Currently only **SMS** notification is supported.

## Prerequisite

- A [Twilio](https://www.twilio.com/messaging) account & number
- Access to a Beacon node API endpoint, such as [Infura](https://infura.io) or your own Beacon node

## Quick start (with Docker)

1. Set up a [Twilio](https://www.twilio.com/messaging) account (comes with free trial credit). In the Twilio console:
   - Copy the 'Account SID' and 'Auth Token'. This will be used in step 3. 
   - Buy a number. This will be the 'From' number for sending the SMS.
   - Add a verified caller ID to use it as the 'To' number for outbound calls/messages.

2. Create an [Infura](https://infura.io) account (Optional if connecting to your own Beacon node). In the Infura dashboard:
   - Create new project and select 'ETH2' Product.
   - Once created, got to 'Project Settings' and copy the https endpoint. This will be used in step 3.

3. Create a `.env` file at the current working directory with the following contents:

   ```
   VALIDATOR_PUBKEYS=[comma separated list of validator public keys (with 0x prefix)]
   BEACON_API_LIST=[enter the beacon node url from step 2. Currently only one url is used]
   TWILIO_ACCOUNT_SID=[enter the 'Account SID' from step 1]
   TWILIO_AUTH_TOKEN=[enter the 'Auth Token' from step 1]
   SMS_FROM=[enter the 'From' number from step 1]
   SMS_TO=[enter the 'To' number from step 1]
   ```

4. Run one of the following commands:
   - with Docker:
     ```
     docker run --env-file .env jchen86/staker-notifier
     ```
   - with Node (>=16):
     ```
     npm install && npm start
     ```
