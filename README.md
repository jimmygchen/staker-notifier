# Staker Notifier

A simple notification tool for Ethereum stakers to track validator health and statuses.

The ultimate goal of this tool is to make the stakers' lives easier and better by reducing the amount of manual effort and stress from looking after validators and keeping up with changes to the clients and network.

## Table of Contents

- [Alert types](#alert-types)
- [Notification Channels](#notification-channels)
- [Prerequisite](#prerequisite)
- [Quick Start](#quick-start)
- [Contribute](#contribute)

## Alert types

Staker Notifier currently tracks the following events:
- **Balance**: when the balance of one or more validators has decreased for a few consecutive epochs
- **Status**: when the validator status has changed or when a new validator has been added to the beacon chain.

### Example messages:
- *"2022-05-24T10:18:47Z Validator 82 has transitioned from pending_queued to active_ongoing."*
- *"2022-05-24T10:21:11Z 1 out of 3 validators have balance reduced since last epoch. Please check validator(s) 81"*

Please see additional alert types that are being considered in [issue list](https://github.com/jchen86/staker-notifier/labels/alert%20type)

## Notification channels

Currently only **SMS** notification is supported - This is the original idea that started this project, to be notified without installing a mobile app and without needing Internet access.

However, additional notification channels are being considered and may be implemented depending on demand. See issue list [here](https://github.com/jchen86/staker-notifier/issues?q=is%3Aissue+is%3Aopen+label%3A%22notification+channel%22)

## Prerequisite

1. **A [Twilio](https://www.twilio.com/messaging) account & number**: Staker Notifier requires the usage of a third-party SMS provider, however the usage will be minimal unless a large number of notifications are sent. A free trial credit is currently being offered to new users that should last for quite a while.

2. **Access to one or multiple Beacon node API endpoints**, such as [Infura](https://infura.io) or your own Beacon node. **[Infura](https://infura.io) is an ethereum node provider and is optional for using Staker Notifier, as you can also choose to use your own node. However, it could come handy as a fallback ([issue](https://github.com/jchen86/staker-notifier/issues/17) to be implemented) when there are issues with the beacon node. 

## Quick start

1. Set up a [Twilio](https://www.twilio.com/messaging) account. In the Twilio console:
   - Copy the 'Account SID' and 'Auth Token'. This will be used in step 3. 
   - Buy a number. This will be the 'From' number for sending the SMS.
   - Add a verified caller ID to use it as the 'To' number for outbound calls/messages.

2. Create an [Infura](https://infura.io) account (Optional if connecting to your own Beacon node). In the Infura dashboard:
   - Create new project and select 'ETH2' Product.
   - Once created, got to 'Project Settings' and copy the https endpoint. This will be used in step 3.

3. Create a `.env` file at the current working directory with the following contents (See [example here](.env.template)):

   | Name                                   | Description                                                     |
   | -------------------------------------- | --------------------------------------------------------------- |
   | VALIDATOR_PUBKEYS                      | Comma separated list of validator public keys with 0x prefixes. |
   | BEACON_API_LIST                        | Beacon node url from step 2. Currently only one url is used.    |
   | TWILIO_ACCOUNT_SID                     | 'Account SID' from step 1.                                      |
   | TWILIO_AUTH_TOKEN                      | 'Auth Token' from step 1.                                       |
   | SMS_FROM                               | 'From' number from step 1.                                      |
   | SMS_TO                                 | 'To' number from step 1.                                        |
   | BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS | Optional. Number of epochs before resending alert. Default: 20. |


4. Run one of the following commands:
   - with Docker:
     ```
     docker run --env-file .env jchen86/staker-notifier
     ```
   - with Node (>=16):
     ```
     npm install && npm start
     ```

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/jchen86/staker-notifier/issues).
