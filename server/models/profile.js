const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = {Profile}