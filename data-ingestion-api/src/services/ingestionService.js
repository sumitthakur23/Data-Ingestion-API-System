class IngestionService {
    constructor(ingestionStore, batchProcessor) {
        this.ingestionStore = ingestionStore;
        this.batchProcessor = batchProcessor;
    }

    async handleIngest(ids, priority) {
        const ingestionId = this.ingestionStore.createIngestion(ids, priority);
        const batches = this.createBatches(ids);
        
        for (const batch of batches) {
            await this.batchProcessor.enqueueBatch(ingestionId, batch);
        }

        return ingestionId;
    }

    createBatches(ids) {
        const batches = [];
        for (let i = 0; i < ids.length; i += 3) {
            batches.push(ids.slice(i, i + 3));
        }
        return batches;
    }
}

module.exports = IngestionService;