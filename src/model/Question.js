const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  userName: {
    type: String,
  },
  questionText: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
