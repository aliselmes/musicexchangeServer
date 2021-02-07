
const express = require('express');
const gigRouter =  express.Router();

gigRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the gigs to you');
})
.post((req, res) => {
    res.end(`Will add the gig: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /gigs');
})
.delete((req, res) => {
    res.end('Deleting all gigs');
});

gigRouter.route('/:gigId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the gig: ${req.params.gigId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /gigs/${req.params.gigId}`);
})
.put((req, res) => {
    res.write(`Updating the gig: ${req.params.gigId}\n`);
    res.end(`Will update the gig: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting gig: ${req.params.gigId}`);
});

module.exports = gigRouter;