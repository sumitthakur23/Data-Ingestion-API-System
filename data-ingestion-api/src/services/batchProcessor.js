class BatchProcessor {
    constructor(ingestionStore) {
        this.ingestionStore = ingestionStore;
        this.processingQueue = [];
        this.isProcessing = false;
    }

    enqueueBatch(batch) {
        this.processingQueue.push(batch);
        this.processBatches();
    }

    async processBatches() {
        if (this.isProcessing || this.processingQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.processingQueue.length > 0) {
            const batch = this.processingQueue.shift();
            await this.processBatch(batch);
            await this.delay(5000); // Respect rate limit of 1 batch per 5 seconds
        }

        this.isProcessing = false;
    }

    async processBatch(batch) {
        const { ids, batchId } = batch;
        const results = [];

        for (const id of ids) {
            // Simulate fetching data from an external API
            await this.delay(1000); // Simulate processing time
            results.push({ id, data: 'processed' });
        }

        this.ingestionStore.updateBatchStatus(batchId, 'completed', results);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BatchProcessor;