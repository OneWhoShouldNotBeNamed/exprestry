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

  const sheets = google.sheets({ version: 'v4', auth });
  range = req.query.sheet
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const data = result.data.values;

    const columnToMatch = 0; // Index of the column to match (e.g., column B is index 1)
    const targetValue = req.query.id.toString(); // The value you want to match
    const matchingRow = data.find(row => row[columnToMatch] === targetValue);
    console.log(matchingRow);
    if (matchingRow) {
      // res.json(matchingRow);
      const text = matchingRow;

      // Define an object to store the sections
      const sections = {};
      
      // Use regular expressions to split the text into sections
      const regex = /(Quick Summary|Skills|Opportunities|Market Analysis|Recommendations for Improvement)/g;
      let matches;
      let lastIndex = 0;
      
      while ((matches = regex.exec(text)) !== null) {
          const sectionName = matches[1];
          const sectionStartIndex = matches.index;
          
          // Extract the content between sections
          const sectionContent = text.substring(lastIndex, sectionStartIndex).trim();
          
          // Update the lastIndex
          lastIndex = sectionStartIndex + matches[0].length;
          
          // Store the section content in the sections object
          sections[sectionName] = sectionContent;
      }
      
      // Add the last section (after the last keyword)
      sections["Recommendations for Improvement"] = text.substring(lastIndex).trim();
      
      // Print the extracted sections
      // console.log(sections);
      res.send(sections)
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
