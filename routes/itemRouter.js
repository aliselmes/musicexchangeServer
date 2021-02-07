const express = require('express');
const itemRouter =  express.Router();

itemRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the items to you');
})
.post((req, res) => {
    res.end(`Will add the item: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /items');
})
.delete((req, res) => {
    res.end('Deleting all items');
});

itemRouter.route('/:itemId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the item: ${req.params.itemId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /items/${req.params.itemId}`);
})
.put((req, res) => {
    res.write(`Updating the item: ${req.params.itemId}\n`);
    res.end(`Will update the item: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting item: ${req.params.itemId}`);
});


module.exports = itemRouter;