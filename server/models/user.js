const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: {
        type: 'String',
        trim: true,
        minlength: 1,
        required: true
    },
    
    age: {
        type: 'Number',
        required: true
    },

    gender: {
        type: 'String',
        required: true
    }
})

module.exports = {User};