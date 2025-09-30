import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(correctOption) {
        return correctOption < this.options.length;
      },
      message: 'Correct option index must be within options array bounds'
    }
  }
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
