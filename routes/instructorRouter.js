const express = require('express');
const Instructor =  require('../models/instructors');
const authenticate = require('../authenticate');
const cors = require('./cors');

const instructorRouter = express.Router();

instructorRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Instructor.find()
    .then(instructor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.author = req.user._id;
    Instructor.create(req.body)
    .then(instructor => {
        console.log('Instructor Created ', instructor);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /instructors');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Instructor.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

instructorRouter.route('/:instructorId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Instructor.findById(req.params.instructorId)
    .then(instructor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /instructors/${req.params.instructorId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Instructor.findById(req.params.instructorId)
    .populate('author')
    .then(instructor => {
        if (instructor) {
            console.log(instructor);
            console.log(typeof instructor);
            if (req.user._id.equals(instructor.author._id)) {
                Instructor.findByIdAndUpdate(req.params.instructorId, {  
                    $set: req.body
                }, { new: true })
                .then(instructor => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(instructor); 
                })
                .catch(err => next(err));
            } else {
                const err = new Error('Operation not authorized!');
                err.status = 403;
                return next(err);
            }
        } else {
            const err = new Error(`Instructor ${req.params.instructorId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Instructor.findById(req.params.instructorId)
    .populate('author')
    .then(instructor => {
        if (instructor) {
            console.log(instructor);
            console.log(typeof instructor);
            if (req.user._id.equals(instructor.author._id)) {
                Instructor.findByIdAndDelete(req.params.instructorId)
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
            const err = new Error(`Instructor ${req.params.instructorId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = instructorRouter;