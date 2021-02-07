const express = require('express');
const musicianRouter =  express.Router();

musicianRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the musicians to you');
})
.post((req, res) => {
    res.end(`Will add the musician: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /musicians');
})
.delete((req, res) => {
    res.end('Deleting all musicians');
});

musicianRouter.route('/:musicianId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the musician: ${req.params.musicianId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /musicians/${req.params.musicianId}`);
})
.put((req, res) => {
    res.write(`Updating the musician: ${req.params.musicianId}\n`);
    res.end(`Will update the musician: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting musician: ${req.params.musicianId}`);
});

module.exports = musicianRouter;