import {logger} from '../logger.js';
import {TelegramBotApiClient} from '../telegram-bot-api-client.js';

class TelegramNotifier {
    constructor(config) {
        this.chatID = config.chatID;
        this.client = new TelegramBotApiClient(config.botURL, config.botToken);
    }

    notify(message) {
        logger.info(`Sending telegram message to chat_id[${this.chatID}] via bot: ${message}`);
        this.client.sendMessage(this.chatID, message)
            .then(r => logger.info("Message sent to " + this.chatID))
            .catch(err => logger.error('Error sending a message', err));
    }

}

export {TelegramNotifier};
