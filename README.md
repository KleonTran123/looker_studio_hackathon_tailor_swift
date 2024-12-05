# Tailor Swift
Tailor Swift allows users to generate personalized reports by selecting their language, role, and target country through a simple interface. The backend processes these inputs, checks if a report already exists, and if not, generates a new analysis using Google BigQuery and Google Generative AI (Gemini). More parameters can be added over time, enabling dynamic SQL queries based on user inputs and normalizing roles, languages, and filters for free-form entries. The system also supports generating multiple texts by using a text_number parameter. Additionally, with the inclusion of a created_at timestamp, the backend ensures that analyses older than a week are automatically refreshed, keeping the reports up-to-date with the latest insights.

# Project Structure

.env: Contains environment variables. Ensure this file is properly configured before running the application.

config: Holds configuration files, including settings for databases, APIs, or other services.

controllers: Includes controller logic for handling requests and responses.

index.js: The main entry point of the application.

models: Defines the data models used in the application.

routes: Defines the application's routing logic.

service account api key: Add your json bigquery api key with roles Viewer and User

 # Requirements

Node.js

Ensure Node.js is installed (version 16 or higher is recommended).

Install npm for dependency management.

Use this one-liner to install dependencies: npm install dotenv express  @google-cloud/bigquery @google/generative-ai

# Setting up the Environment Variables

The .env file is crucial for configuring the application. Here’s how to fill in each field:

GOOGLE_APPLICATION_CREDENTIALS: Path to your Google Cloud service account JSON file. 

PROJECT_ID: The Google Cloud project ID. 

PORT: The port number the application should listen on. The default is usually 8080.

PORT=8080

DATASET_ID: The BigQuery dataset ID where your data resides.


 The following two should be in the same DATASET for now:

ANALYSIS_TABLE_ID: The table ID within the BigQuery dataset for checking and storing analysis data.

DATA_TABLE_ID: The table ID within the BigQuery dataset that you will query to feed information to Gemini.

GEMINI_API: The API key or endpoint for accessing Google Generative AI (Gemini).



# Running the Application

To start the application, use the following command:

node index.js

# Key Features

  -Allows users to generate personalized reports from Looker Studio by selecting their language, role, and target country. Then, after clicking on the URL handled by this backend, the report will have the generated text.

  -The backend processes user inputs, checks for existing reports, and generates new analyses if needed.

  -Integrates Google BigQuery and Google Generative AI (Gemini) for advanced data analysis and report generation.

# Acknowledgements
This project was developed independently during Google's Looker and Looker Studio Hackathon, leveraging the following tools and technologies:

Node.js: The core runtime environment (version 16 or higher recommended).

NPM: For managing project dependencies with the following one-liner:

npm install dotenv express @google-cloud/bigquery @google/generative-ai

# License

This project is licensed under the GNU General Public License v3.0 (GPLv3). You may obtain a copy of the license at https://www.gnu.org/licenses/gpl-3.0.en.html.

