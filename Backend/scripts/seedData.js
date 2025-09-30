import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../model/Quiz.js';
import connectDB from '../database/db.js';

dotenv.config();

const sampleQuestions = [
  {
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctOption: 2
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: 1
  },
  {
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctOption: 1
  },
  {
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctOption: 2
  },
  {
    text: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctOption: 1
  },
  {
    text: "Which programming language is known for its use in web development?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctOption: 2
  },
  {
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctOption: 2
  },
  {
    text: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctOption: 1
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing questions
    await Quiz.deleteMany({});
    console.log('Cleared existing quiz questions');
    
    // Insert sample questions
    const insertedQuestions = await Quiz.insertMany(sampleQuestions);
    console.log(`Successfully seeded ${insertedQuestions.length} quiz questions`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
