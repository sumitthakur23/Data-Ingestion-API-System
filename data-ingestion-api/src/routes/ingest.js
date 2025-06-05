const express = require('express');

module.exports = (ingestController) => {
    const router = express.Router();
    router.post('/', (req, res) => ingestController.handleIngest(req, res));
    return router;
};