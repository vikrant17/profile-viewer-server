const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Profile} = require('./models/profile');
const {authenticate} = require('./middleware/authenticate');

const port  = process.env.PORT || 3000;

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    next();
});

app.use(bodyParser.json());

// app.get('/user/:name', (req, res) => {
//     const name = req.params.name;

//     User.findOne({name}).then((doc) => {
//         if (!doc) {
//             throw Error('no name found');
//         }
//         doc = _.pick(doc, ['name', 'age', 'gender']);
//         res.status(200).send(doc);
        
//     }).catch(e => {
//         res.status(400).send(e);
//     })
// });

app.post('/signup', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);


    user.save().then(() => {
        const profile = new Profile({userId: user._id});
        profile.save();
        return user.genAuthToken();
    }).then((token) => {
        res.status(200).send({token});
    }).catch(e => {
        res.status(400).send(e);
    });
})


app.delete('/logout', authenticate, (req, res) => {
    const uid = req.user._id;
    User.findById(uid).then(user => {
        return user.removeToken(req.token);
    }).then(() => {
        res.status(200).send({message: "loggedout"})
    }).catch(e => {
        res.status(404).send(e)
    })
})

app.post('/login', (req, res) => {
    var {email, password} = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(email, password).then((user) => {
        return user.genAuthToken();
    }).then((token) => {
        res.status(200).send({token});
    }).catch(e => {
        res.status(404).send(e);
    });

})

app.get('/profile', authenticate, (req, res) => {

    const uid = req.user._id;
    
    Profile.findOne({userId: uid}).then(user => {

        if (!user)
            res.status(400).send('no such user');

        res.status(200).send(user)
    }).catch(e => {
        res.status(404).send(e)
    });

})

app.patch('/profile/edit', authenticate, (req, res) => {

    const {name, value} = _.pick(req.body, ['name', 'value']);


    const uid = req.user._id;
  

    Profile.findOneAndUpdate({userId: uid}, {
        $set: {
            [name] : value
        }
    }).then((update) => {
        res.status(200).send(update);
    }).catch(e => {
        res.status(400).send(e);
    })
})


app.listen(port, () => {
    console.log('app is listening on port ' + port);
});

