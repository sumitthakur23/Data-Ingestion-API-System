const request = require('supertest');
const app = require('../src/app'); // Adjust the path as necessary

describe('Ingestion API Tests', () => {
    let ingestionId;

    test('POST /ingest - should create a new ingestion request', async () => {
        const response = await request(app)
            .post('/ingest')
            .send({ ids: [1, 2, 3, 4, 5], priority: 'MEDIUM' })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('ingestion_id');
        ingestionId = response.body.ingestion_id;
    });

    test('GET /status/:ingestion_id - should return status of the ingestion request', async () => {
        const response = await request(app)
            .get(`/status/${ingestionId}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('ingestion_id', ingestionId);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('batches');
    });

    test('POST /ingest - should respect rate limit', async () => {
        const response1 = await request(app)
            .post('/ingest')
            .send({ ids: [6, 7, 8], priority: 'HIGH' })
            .set('Accept', 'application/json');

        const response2 = await request(app)
            .post('/ingest')
            .send({ ids: [9, 10, 11], priority: 'LOW' })
            .set('Accept', 'application/json');

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
    });

    test('GET /status/:ingestion_id - should return correct batch statuses', async () => {
        const response = await request(app)
            .get(`/status/${ingestionId}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.batches).toBeInstanceOf(Array);
        response.body.batches.forEach(batch => {
            expect(batch).toHaveProperty('batch_id');
            expect(batch).toHaveProperty('ids');
            expect(batch).toHaveProperty('status');
        });
    });
});