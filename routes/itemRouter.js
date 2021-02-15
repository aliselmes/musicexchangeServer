const express = require('express');
const Item =  require('../models/items');
const authenticate = require('../authenticate');

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
.post(authenticate.verifyUser, (req, res, next) => {
    req.body.author = req.user._id;
    Item.create(req.body)
    .then(item => {
        console.log('Item Created ', item);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /items');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.put(authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Item.findById(req.params.itemId)
    .populate('author')
    .then(item => {
        if (item) {
            console.log(item);
            console.log(typeof item);
            if (req.user._id.equals(item.author._id)) {
                Item.findByIdAndUpdate(req.params.itemId, {  
                    $set: req.body
                }, { new: true })
                .then(item => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(item); 
                })
                .catch(err => next(err));
            } else {
                const err = new Error('Operation not authorized!');
                err.status = 403;
                return next(err);
            }
        } else {
            const err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Item.findById(req.params.itemId)
    .populate('author')
    .then(item => {
        if (item) {
            console.log(item);
            console.log(typeof item);
            if (req.user._id.equals(item.author._id)) {
                Item.findByIdAndDelete(req.params.itemId)
                .then(response => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch(err => next(err));
            } else {
                const err = new Error('Operation not authorized!');
                err.status = 403;
                return next(err);
            }
        } else {
            const err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = itemRouter;