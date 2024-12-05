const bigqueryModel = require('../models/bigqueryModel');
const geminiModel = require('../models/geminiModel');


exports.handleAnalyzeRequest = async (req, res) => {
  try {
    // Extract parameters
    const { job_title, language_name, country_name } = req.query;

    if (!job_title || !language_name || !country_name) {
      return res.status(400).send('Missing required parameters.');
    }

    // Decode parameters
    const decodedParams = {
      job_title: decodeURIComponent(job_title),
      language_name: decodeURIComponent(language_name),
      country_name: decodeURIComponent(country_name),
    
    };

    // Check if analysis exists
    const analysisExists = await bigqueryModel.checkAnalysisExists(decodedParams);

    if (analysisExists) {
      // Analysis exists
      res.send(`
        <html>
          <head><title>Analysis Available</title></head>
          <body>
            <h1>Your analysis is ready!</h1>
            <p>We found an existing analysis matching your criteria.</p>
            <p>Please return to the Looker Studio dashboard and reload the report to view the analysis.</p>
          </body>
        </html>
      `);
    } else {
      // Analysis does not exist
      res.send(`
        <html>
          <head><title>Generating Analysis</title></head>
          <body>
            <h1>Your analysis is being generated...</h1>
            <p>We're generating your analysis. Please return to the Looker Studio dashboard in a few minutes and reload the report to view the analysis.</p>
          </body>
        </html>
      `);

      // Generate analysis in the background
      generateAndStoreAnalysis(decodedParams).catch((error) => {
        console.error('Error generating analysis:', error);
      });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};

async function generateAndStoreAnalysis(params) {
  // Query data from BigQuery
  const data = await bigqueryModel.queryData(params);

  // Generate analysis using Gemini AI
  const analysisText = await geminiModel.generateAnalysis(params, data);
  // Insert analysis into BigQuery
  await bigqueryModel.insertAnalysis(params, analysisText);
}
