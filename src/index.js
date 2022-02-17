require('dotenv').config();
const bot = require('./bot/bot');
const mongoose = require('mongoose');
const Card = require('./model/Card');
const Question = require('./model/Question');

const DB_URL = process.env.DB_URL;

const start = () => {
  const buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Информация по картам', callback_data: 'cardInfo' }],
        [{ text: 'Задайте вопрос', callback_data: 'question' }],
      ],
    }),
  };

  bot.setMyCommands([
    {
      command: '/start',
      description: 'Начать',
    },
  ]);

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Выберите задачу для меня', buttons);
    }
  });

  bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id;
    if (msg.data === 'cardInfo') {
      const cardInfo = await Card.find();
      await bot.sendMessage(chatId, cardInfo[0].text);
    } else if (msg.data === 'question') {
      await bot.sendMessage(chatId, 'Введите свой вопрос в ОДНОМ сообщении');
      bot.on('message', async msg => {
        const chatId = msg.from.id;
        const firstName = msg.from.first_name;
        const userName = msg.from.username;
        const questionText = msg.text;

        const question = new Question({
          chatId,
          firstName,
          userName,
          questionText,
        });

        await question.save();

        await bot.sendMessage(
          chatId,
          'Спасибо за Ваш вопрос. Наш оператор ответит при первой возможности',
        );
      });
    }
  });
};

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected with mongoose');
    start();
  })
  .catch(err => console.log(err));
