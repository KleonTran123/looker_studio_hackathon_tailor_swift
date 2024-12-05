require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const analyzeRoute = require('./routes/analyze.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the analyze route
app.use('/analyze', analyzeRoute);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
