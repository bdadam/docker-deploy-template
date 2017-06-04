const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const datastore = require('nedb-promise');

const port = process.env.PORT || 3000;
const app = express();

const dbpath = './data/test.db';
const db = datastore({ filename: dbpath, autoload: true });

app.disable('x-powered-by');
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

const measureRequestTime = (req, res, next) => {
    const startTime = process.hrtime();
    const send = res.send.bind(res);
    res.send = (...args) => {
        const totalTime = process.hrtime(startTime);
        const totalTimeInMs = (totalTime[0] * 1e9 + totalTime[1]) / 1e6;

        res.header({
            'Server-Timing': `handle=${totalTimeInMs}; "Total time to handle request", x=123; "Test 123"`
        });

        send(...args);
    };

    next();
};

app.use(measureRequestTime);

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.get('/', (req, res) => {
    res.render('index', {});
});

const apiRouter = require('./api');

app.use('/api/gql', measureRequestTime, apiRouter);

app.get('/database', async (req, res) => {
    const wholeDatabase = await db.find({});
    res.json(wholeDatabase);
});

app.get('/:id', async (req, res) => {
    const data = await db.findOne({ _id: req.params.id });
    res.render('data', { data });
});

app.put('/api/data/:_id', bodyParser.json({}), (req, res) => {
    const data = req.body.data;
    const _id = req.params._id;

    db.insert(Object.assign({ data }, { _id }))
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = app;

const jwt = require('jsonwebtoken');
const token = jwt.sign({ userid: '12345', test: 'TEST' }, 'secret', { expiresIn: '30 days', issuer: 'test issuer' });
// const token = jwt.sign({ userid: '12345', test: 'TEST', iat: 1000 }, 'secret', { expiresIn: '30 days', issuer: 'test issuer' });
// const token = jwt.sign({ userid: '12345', test: 'TEST' }, 'secret', { expiresIn: '30 days', issuer: 'test issuer unknown' });
console.log(token);

jwt.verify(token, 'secret', { issuer: 'test issuer', expiresIn: '30 days' }, (err, res) => {
    console.log(err);
    console.log(res);
});
