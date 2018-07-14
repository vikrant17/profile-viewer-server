const express = require('express');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');

const port  = process.env.PORT || 3000;

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/user/:name', (req, res) => {
    const name = req.params.name;

    // User.findOne({name}).then((doc) => {
    //     if (!doc) {
    //         throw Error('no name found');
    //     }
    //     doc = _.pick(doc, ['name', 'age', 'gender']);
    //     res.status(200).send(doc);
        
    // }).catch(e => {
    //     res.status(400).send(e);
    // })

    res.status(404).send(name);

});

app.listen(port, () => {
    console.log('app is listening on port ' + port);
});

