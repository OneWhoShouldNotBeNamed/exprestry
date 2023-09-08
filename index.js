const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
import { splitSections } from './functions.js';

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
    //  splitText = splitSections(matchingRow[2])
    //  res.send(splitText);

      // res.set('Content-Type', 'text/html');
      // res.send(Buffer.from(`<textarea>${matchingRow}</textarea>  
      // <br />
      // <textarea>${data}</textarea>
      // `));

      const profileSummary = matchingRow[2];
      // Define an object to store the sections
      const profileSummarysections = {};
      
      // Define the keywords to split the sections
      const ProfileSummarykeywords = [
        "QuickSummary\n",
        "\n\nSkills",
        "\n\nOpportunities",
        "\n \nMarketAnalysis\n",
        "\n\nRecommendationsforImprovement",
      ];
      
      // Create a regular expression pattern that matches any of the keywords
      const regexPattern = new RegExp(`(${ProfileSummarykeywords.join("|")})`, "g");
      
      // Split the text into sections using the regular expression
      const sectionArray = profileSummary.split(regexPattern);
      
      // Iterate through the sections and store them in the object
      for (let i = 1; i < sectionArray.length; i += 2) {
        const sectionName = sectionArray[i].trim();
        const sectionContent = sectionArray[i + 1].trim();
        profileSummarysections[sectionName] = sectionContent;
      }
      
      // Print the extracted sections
      res.send(profileSummarysections);



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
