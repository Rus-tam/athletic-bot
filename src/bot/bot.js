require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');

const DB_URL = process.env.DB_URL;
const TOKEN = process.env.TOKEN;

const bot = new TelegramApi(TOKEN, { polling: true });

module.exports = bot;
