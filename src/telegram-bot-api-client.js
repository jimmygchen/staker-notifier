import axios from 'axios';
import {logger} from './logger.js';

class TelegramBotApiClient {
    constructor(botAPI, botToken) {
        this.botAPI = botAPI;
        this.botToken = botToken;
        this.http = axios.create({
            baseURL: this.botAPI + this.botToken
        })
    }

    async sendMessage(chatID, message) {
        const body = {
            chat_id: chatID,
            text: message
        }

        try {
            await this.http.post('/sendMessage', body);
        } catch (err) {
            logger.error(`Request to sendMessage failed with error`, err);
            throw err
        }
    }

}

export {TelegramBotApiClient};
