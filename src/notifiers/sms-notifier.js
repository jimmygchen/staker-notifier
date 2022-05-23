import twilio from 'twilio';

const MAX_SMS_LENGTH = 100; // 160 - additional text from twilio trial account (40) - date time (20)

class SMSNotifier {
  constructor(config) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken)
  }

  notify(message) {
    console.log(`Sending SMS: ${message}`);

    const dateTime = new Date().toISOString().slice(0, 19) + 'Z';

    this.client.messages
      .create({
        body: this.#truncateMessage(`${dateTime} ${message}`),
        from: this.config.from,
        to: this.config.to
      })
      .then(message => console.debug(`Message successfully sent: ${message.sid}`))
      .catch(err => console.error(`Error sending message: ${err}`));
  }

  #truncateMessage(message) {
    if (message.length > MAX_SMS_LENGTH) {
      return message.slice(0, MAX_SMS_LENGTH - 3) + '...';
    }
    return message;
  }
}

export { SMSNotifier };