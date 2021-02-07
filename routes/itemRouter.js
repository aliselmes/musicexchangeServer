const express = require('express');
const Item =  require('../models/items');

const itemRouter = express.Router();

itemRouter.route('/')
.get((req, res, next) => {
    Item.find()
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Item.create(req.body)
    .then(item => {
        console.log('Item Created ', item);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /items');
})
.delete((req, res, next) => {
    Item.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

itemRouter.route('/:itemId')
.get((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /items/${req.params.itemId}`);
})
.put((req, res, next) => {
    Item.findByIdAndUpdate(req.params.itemId, {
        $set: req.body
    }, { new: true })
    .then(item => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
   Item.findByIdAndDelete(req.params.itemId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = itemRouter;