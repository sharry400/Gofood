const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const foodItems = require('./data/foodItems.json');
const URL = "mongodb://localhost:27017/gofood";

const mongoDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('MongoDB Connected Successfully');

        const foodItemCount = await FoodItem.countDocuments();
        if (foodItemCount === 0) {
            await FoodItem.insertMany(foodItems);
            console.log(`Inserted ${foodItems.length} food items into MongoDB`);
        }
    } catch (error) {
        console.error('MongoDB setup failed:', error.message);
    }
};

module.exports = mongoDB;