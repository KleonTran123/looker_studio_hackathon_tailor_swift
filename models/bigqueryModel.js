const { BigQuery } = require('@google-cloud/bigquery'); 
const bigqueryClient = new BigQuery();

const datasetId = process.env.DATASET_ID;
const analysisTableId = process.env.ANALYSIS_TABLE_ID;
const dataTableId = process.env.DATA_TABLE_ID;
var date = (new Date()).toISOString().split('T')[0];

exports.checkAnalysisExists = async (params) => {
  //We can implement multiple text numbers to have multiple text fields as well, we would then select display_text, text_number
    const query = `
    SELECT display_text
    FROM \`${bigqueryClient.projectId}.${datasetId}.${analysisTableId}\`
    WHERE job_title = @job_title
      AND language_name = @language_name
      AND country_name = @country_name
    LIMIT 1
  `;

  const options = {
    query: query,
    params: {
      job_title: params.job_title,
      language_name: params.language_name,
      country_name: params.country_name,
    },
  };

  const [rows] = await bigqueryClient.query(options);
  return rows.length > 0;
};

exports.queryData = async (params) => {
  const query = `
    SELECT *
    FROM \`${bigqueryClient.projectId}.${datasetId}.${dataTableId}\`
    WHERE country_name = @country_name
  `;

  const options = {
    query: query,
    params: {
      country_name: params.country_name,
    },
  };

  console.log('Executing query with options:', options);

  try {
    const [rows] = await bigqueryClient.query(options);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

exports.insertAnalysis = async (params, analysisText) => {
  const cleanedAnalysisText = analysisText.replace(/\n/g, ' ');

  const rows = [
    {
        //Hardcoded text_number for simplicity, could be implemented for more texts
      text_number: 2,
      job_title: params.job_title,
      language_name: params.language_name,
      country_name: params.country_name,
      display_text: cleanedAnalysisText,
      created_at: date, 
    },
  ];

  console.log('Inserting rows:', rows);

  try {
    await bigqueryClient
      .dataset(datasetId)
      .table(analysisTableId)
      .insert(rows);

    console.log('Data inserted successfully.');
  } catch (err) {
    console.error('Error inserting data:', err);

    if (err.name === 'PartialFailureError') {
      err.errors.forEach((error) => {
        console.error('Row that failed to insert:', error.row);
        error.errors.forEach((e) => {
          console.error(`Error reason: ${e.reason}`);
          console.error(`Error message: ${e.message}`);
          console.error(`Error location: ${e.location}`);
        });
      });
    } else {
      console.error('Insert failed with error:', err);
    }

    throw err; 
  }
};
