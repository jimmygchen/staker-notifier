import {logger} from '../logger.js';
import {TelegramBotApiClient} from '../telegram-bot-api-client.js';
import {config} from "../config.js";

const telegramBotClient = new TelegramBotApiClient(config.telegram.botURL, config.telegram.botToken);

class TelegramNotifier {
    constructor(config) {
        this.chatID = config.chatID;
        this.client = new TelegramBotApiClient(config.telegram.botURL, config.telegram.botToken);
    }

    notify(message) {
        if (this.chatID) {
            logger.info(`Sending telegram message to chat_id[${this.chatID}] via bot: ${message}`);
            telegramBotClient.sendMessage(this.chatID, message).then(r => logger.info("Message sent to " + this.chatID));
        } else {
            logger.info(`Telegram message not configured`);
        }
    }

}

export {TelegramNotifier};
