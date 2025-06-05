class IngestionStore {
    constructor() {
        this.ingestions = {};
    }

    addIngestion(ingestionId, priority, ids) {
        this.ingestions[ingestionId] = {
            status: 'yet_to_start',
            batches: this.createBatches(ids),
            priority: priority,
            createdAt: Date.now()
        };
    }

    createBatches(ids) {
        const batches = [];
        for (let i = 0; i < ids.length; i += 3) {
            batches.push({
                batchId: this.generateBatchId(),
                ids: ids.slice(i, i + 3),
                status: 'yet_to_start'
            });
        }
        return batches;
    }

    generateBatchId() {
        return 'batch-' + Math.random().toString(36).substr(2, 9);
    }

    getIngestion(ingestionId) {
        return this.ingestions[ingestionId] || null;
    }

    updateBatchStatus(ingestionId, batchId, status) {
        const ingestion = this.getIngestion(ingestionId);
        if (ingestion) {
            const batch = ingestion.batches.find(b => b.batchId === batchId);
            if (batch) {
                batch.status = status;
            }
        }
    }

    updateIngestionStatus(ingestionId, status) {
        const ingestion = this.getIngestion(ingestionId);
        if (ingestion) {
            ingestion.status = status;
        }
    }
}

module.exports = IngestionStore;