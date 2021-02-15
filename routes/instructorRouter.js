const express = require('express');
const Instructor =  require('../models/instructors');
const authenticate = require('../authenticate');

const instructorRouter = express.Router();

instructorRouter.route('/')
.get((req, res, next) => {
    Instructor.find()
    .then(instructor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Instructor.create(req.body)
    .then(instructor => {
        console.log('Instructor Created ', instructor);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /instructors');
})
.delete((req, res, next) => {
    Instructor.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

instructorRouter.route('/:instructorId')
.get((req, res, next) => {
    Instructor.findById(req.params.instructorId)
    .then(instructor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 405;
    res.end(`POST operation not supported on /instructors/${req.params.instructorId}`);
})
.put((req, res, next) => {
    Instructor.findByIdAndUpdate(req.params.instructorId, {
        $set: req.body
    }, { new: true })
    .then(instructor => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(instructor);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
   Instructor.findByIdAndDelete(req.params.instructorId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = instructorRouter;