const express = require('express');

module.exports = (statusController) => {
    const router = express.Router();
    router.get('/:ingestion_id', (req, res) => statusController.handleStatus(req, res));
    return router;
};