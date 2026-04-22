const mongoose = require('mongoose')
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if(!MONGO_URI) {
            throw new Error('MONGO_URI is not defined')
        }
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;