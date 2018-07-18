const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        trim: true,
        type: String,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    }, 
    password: {
        required: true,
        type: String,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            required: true,
            type: String
        }
    }]
})


UserSchema.methods.genAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({
        _id: user._id.toHexString(), access
    }, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({email, password}).then((user) => {
        if (!user) 
            return Promise.reject();

        return user;
    });
    
}

UserSchema.statics.findByToken = function(token) {
    var User = this;

    var decoded;

    try{
        jwt.verify(token, 'abc123', (err, dec) => {    
            if (!dec)
                return Promise.reject();
            decoded = dec;
        });
        
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
    
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};