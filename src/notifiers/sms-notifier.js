import twilio from 'twilio';
import { logger } from '../logger.js';

const MAX_SMS_LENGTH = 120; // 160 - additional text from twilio trial account (40)

class SMSNotifier {
  constructor(config) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken)
  }

  notify(message) {
    logger.info(`Sending SMS: ${message}`);

    const dateTime = new Date().toISOString().slice(0, 19) + 'Z';

    this.client.messages
      .create({
        body: this.#truncateMessage(`${dateTime} ${message}`),
        from: this.config.from,
        to: this.config.to
      })
      .then(message => logger.debug(`Message successfully sent: ${message.sid}`))
      .catch(err => logger.error('Error sending message', err));
  }

  #truncateMessage(message) {
    if (message.length > MAX_SMS_LENGTH) {
      return message.slice(0, MAX_SMS_LENGTH - 3) + '...';
    }
    return message;
  }
}

export { SMSNotifier };