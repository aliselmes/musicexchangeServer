
const express = require('express');
const Gig =  require('../models/gigs');

const gigRouter = express.Router();

gigRouter.route('/')
.get((req, res, next) => {
    Gig.find()
    .then(gigs => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gigs);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Gig.create(req.body)
    .then(gig => {
        console.log('Gig Created ', gig);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(gig);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /gigs');
})
.delete((req, res, next) => {
    Gig.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

gigRouter.route('/:gigId')
.get((req, res, next) => {
    Gig.findById(req.params.gigId)
    .then(gig => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gig);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /gigs/${req.params.gigId}`);
})
.put((req, res, next) => {
    Gig.findByIdAndUpdate(req.params.gigId, {
        $set: req.body
    }, { new: true })
    .then(gig => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gig);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Gig.findByIdAndDelete(req.params.gigId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = gigRouter;