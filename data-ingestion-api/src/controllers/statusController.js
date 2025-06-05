class StatusController {
    constructor(ingestionStore) {
        this.ingestionStore = ingestionStore;
    }

    handleStatus(req, res) {
        const { ingestion_id } = req.params;
        // FIX: use getIngestion, not getIngestionById
        const ingestionData = this.ingestionStore.getIngestion(ingestion_id);

        if (!ingestionData) {
            return res.status(404).json({ error: 'Ingestion ID not found' });
        }

        const batches = ingestionData.batches.map(batch => ({
            batch_id: batch.batchId,
            ids: batch.ids,
            status: batch.status
        }));

        const overallStatus = this.getOverallStatus(batches);

        return res.json({
            ingestion_id,
            status: overallStatus,
            batches
        });
    }

    getOverallStatus(batches) {
        const statuses = batches.map(batch => batch.status);
        if (statuses.every(status => status === 'yet_to_start')) {
            return 'yet_to_start';
        }
        if (statuses.some(status => status === 'triggered')) {
            return 'triggered';
        }
        return 'completed';
    }
}

module.exports = StatusController;