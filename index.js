const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const credentials = require('./secrets.json'); // Replace with your service account key path
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const spreadsheetId = '1ckVrmZxieR26pdN39GVEgEcwdJnHUWmrP8kpNloTuE4';
// const range = 'AICO'; // Adjust this range to match your sheet

// Set up a route to fetch data
app.get('/api/data', async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  // console.log(req.query);
  //      res.json(req.query);

  const sheets = google.sheets({ version: 'v4', auth });
  range = req.sheet
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const data = result.data.values;
    // res.json(result);

    const columnToMatch = 0; // Index of the column to match (e.g., column B is index 1)
    const targetValue = req.id; // The value you want to match
    const matchingRow = data.find(row => row[columnToMatch] === targetValue);
    console.log(matchingRow);
    if (matchingRow) {
      res.json(matchingRow);
    } else {
      res.json({ message: 'No matching row found.' });
    }
  } catch (err) {
    console.error('Error fetching data from Google Sheets:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
