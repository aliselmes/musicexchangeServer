const express = require('express');
const Musician =  require('../models/musicians');

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
.post((req, res, next) => {
    Musician.create(req.body)
    .then(musician => {
        console.log('Musician Created ', musician);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(musician);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /musicians');
})
.delete((req, res, next) => {
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
.put((req, res, next) => {
    Musician.findByIdAndUpdate(req.params.musicianId, {
        $set: req.body
    }, { new: true })
    .then(musician => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(musician);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
   Musician.findByIdAndDelete(req.params.musicianId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = musicianRouter;