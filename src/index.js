const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const datastore = require('nedb-promise');

const port = process.env.PORT || 3000;
const app = express();

const dbpath = './data/test.db';
const db = datastore({ filename: dbpath, autoload: true });

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.get('/', (req, res) => {
    res.render('index', { });
});

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

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});