# Data Ingestion API

This project implements a simple data ingestion API system using Node.js and Express. It provides two main endpoints for submitting data ingestion requests and checking their status. The system processes data asynchronously in batches while respecting rate limits and prioritizing requests based on their specified priority.

## Project Structure

```
data-ingestion-api
├── src
│   ├── app.js                  # Entry point of the application
│   ├── routes
│   │   ├── ingest.js           # Route for ingestion API
│   │   └── status.js           # Route for status API
│   ├── controllers
│   │   ├── ingestController.js  # Controller for handling ingestion requests
│   │   └── statusController.js  # Controller for handling status requests
│   ├── services
│   │   ├── ingestionService.js   # Service for processing ingestion logic
│   │   └── batchProcessor.js      # Service for managing batch processing
│   ├── models
│   │   ├── ingestionStore.js      # Model for persisting ingestion and batch statuses
│   │   └── enums.js               # Enum definitions for priorities
│   └── utils
│       └── uuid.js                # Utility for generating unique UUIDs
├── tests
│   └── ingestion.test.js          # Tests for the ingestion and status endpoints
├── package.json                   # NPM configuration file
├── .gitignore                     # Files and directories to ignore by Git
├── README.md                      # Project documentation
└── jest.config.js                 # Jest configuration file
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sumitthakur23/Data-Ingestion-API-System.git
   cd data-ingestion-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:5000`.

4. **Run Tests**
   ```bash
   npm test
   ```

## API Endpoints

### Ingestion API

- **Endpoint:** `POST /ingest`
- **Request Body:**
  ```json
  {
    "ids": [1, 2, 3, 4, 5],
    "priority": "HIGH"
  }
  ```
- **Response:**
  ```json
  {
    "ingestion_id": "abc123"
  }
  ```

### Status API

- **Endpoint:** `GET /status/<ingestion_id>`
- **Response:**
  ```json
  {
    "ingestion_id": "abc123",
    "status": "triggered",
    "batches": [
      {
        "batch_id": "uuid",
        "ids": [1, 2, 3],
        "status": "completed"
      },
      {
        "batch_id": "uuid",
        "ids": [4, 5],
        "status": "triggered"
      }
    ]
  }
  ```

## Design Choices

- The API is designed to handle ingestion requests in batches of 3 IDs at a time, respecting a rate limit of 1 batch every 5 seconds.
- Prioritization of requests is implemented to ensure that higher priority requests are processed before lower priority ones.
- The application uses an in-memory store for persisting ingestion and batch statuses, which can be replaced with a database for production use.

## Testing

Extensive tests are provided to ensure that the API behaves as expected, including checks for rate limits and priority handling.

## License

This project is licensed under the MIT License.