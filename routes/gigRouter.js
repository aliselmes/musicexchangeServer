const express = require('express');
const Gig =  require('../models/gigs');
const authenticate = require('../authenticate');
const cors = require('./cors');

const gigRouter = express.Router();

gigRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Gig.find()
    .then(gigs => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gigs);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    req.body.author = req.user._id;
    Gig.create(req.body)
    .then(gig => {
        console.log('Gig Created ', gig);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(gig);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /gigs');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Gig.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

gigRouter.route('/:gigId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Gig.findById(req.params.gigId)
    .then(gig => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gig);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /gigs/${req.params.gigId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Gig.findById(req.params.gigId)
    .populate('author')
    .then(gig => {
        if (gig) {
            console.log(gig);
            console.log(typeof gig);
            if (req.user._id.equals(gig.author._id)) {
                Gig.findByIdAndUpdate(req.params.gigId, {  
                    $set: req.body
                }, { new: true })
                .then(gig => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(gig); 
                })
                .catch(err => next(err));
            } else {
                const err = new Error('Operation not authorized!');
                err.status = 403;
                return next(err);
            }
        } else {
            const err = new Error(`Gig ${req.params.gigId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Gig.findById(req.params.gigId)
    .populate('author')
    .then(gig => {
        if (gig) {
            console.log(gig);
            console.log(typeof gig);
            if (req.user._id.equals(gig.author._id)) {
                Gig.findByIdAndDelete(req.params.gigId)
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
            const err = new Error(`Gig ${req.params.gigId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = gigRouter;