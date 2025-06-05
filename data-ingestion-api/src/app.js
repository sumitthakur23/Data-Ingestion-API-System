const express = require('express');
const bodyParser = require('body-parser');
const IngestionStore = require('./models/ingestionStore');
const IngestController = require('./controllers/ingestController');
const StatusController = require('./controllers/statusController');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Create a single ingestion store instance
const ingestionStore = new IngestionStore();
const ingestController = new IngestController(ingestionStore);
const statusController = new StatusController(ingestionStore);

// Pass controller instances to routes
const ingestRoutes = require('./routes/ingest')(ingestController);
const statusRoutes = require('./routes/status')(statusController);

app.use('/ingest', ingestRoutes);
app.use('/status', statusRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

// For testing
module.exports = app;