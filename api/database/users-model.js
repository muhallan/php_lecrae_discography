const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true,
        min: 3
    }
});

mongoose.model(process.env.USER_MODEL, UserSchema, process.env.USER_COLLECTION);
