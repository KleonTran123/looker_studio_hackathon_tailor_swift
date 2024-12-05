const { BigQuery } = require('@google-cloud/bigquery');

const bigqueryClient = new BigQuery({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

module.exports = bigqueryClient;