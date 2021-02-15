const express = require('express');
const Musician =  require('../models/musicians');
const authenticate = require('../authenticate');

const musicianRouter = express.Router();

musicianRouter.route('/')
.get((req, res, next) => {
    Musician.find()
    .then(musician => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(musician);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    req.body.author = req.user._id;
    Musician.create(req.body)
    .then(musician => {
        console.log('Musician Created ', musician);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(musician);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /musicians');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Musician.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

musicianRouter.route('/:musicianId')
.get((req, res, next) => {
    Musician.findById(req.params.musicianId)
    .then(musician => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(musician);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /musicians/${req.params.musicianId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Musician.findById(req.params.musicianId)
    .populate('author')
    .then(musician => {
        if (musician) {
            console.log(musician);
            console.log(typeof musician);
            if (req.user._id.equals(musician.author._id)) {
                Musician.findByIdAndUpdate(req.params.musicianId, {  
                    $set: req.body
                }, { new: true })
                .then(musician => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(musician); 
                })
                .catch(err => next(err));
            } else {
                const err = new Error('Operation not authorized!');
                err.status = 403;
                return next(err);
            }
        } else {
            const err = new Error(`Musician ${req.params.musicianId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Musician.findById(req.params.musicianId)
    .populate('author')
    .then(musician => {
        if (musician) {
            console.log(musician);
            console.log(typeof musician);
            if (req.user._id.equals(musician.author._id)) {
                Musician.findByIdAndDelete(req.params.musicianId)
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
            const err = new Error(`Musician ${req.params.musicianId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = musicianRouter;