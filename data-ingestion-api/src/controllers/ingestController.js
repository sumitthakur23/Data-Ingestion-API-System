const BatchProcessor = require('../services/batchProcessor');
const { v4: uuidv4 } = require('uuid');

class IngestController {
    constructor(ingestionStore) {
        this.ingestionStore = ingestionStore; // <-- use the passed instance!
        this.batchProcessor = new BatchProcessor(this.ingestionStore);
    }

    async handleIngest(req, res) {
        const { ids, priority } = req.body;

        if (!Array.isArray(ids) || ids.length === 0 || !this.isValidPriority(priority)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const ingestionId = uuidv4();
        this.ingestionStore.addIngestion(ingestionId, priority, ids);
        // Enqueue all batches for this ingestion
        const ingestion = this.ingestionStore.getIngestion(ingestionId);
        for (const batch of ingestion.batches) {
            this.batchProcessor.enqueueBatch({ ...batch, ingestionId, priority, createdAt: ingestion.createdAt });
        }

        return res.status(200).json({ ingestion_id: ingestionId });
    }

    isValidPriority(priority) {
        return ['HIGH', 'MEDIUM', 'LOW'].includes(priority);
    }
}

module.exports = IngestController;