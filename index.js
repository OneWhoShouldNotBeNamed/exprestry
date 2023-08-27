const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const credentials = JSON.parse(fs.readFileSync('secrets.json'));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const spreadsheetId = '1ckVrmZxieR26pdN39GVEgEcwdJnHUWmrP8kpNloTuE4';
const range = 'Sheet1!A1:D'; // Adjust this range to match your sheet

// Set up a route to authorize the app
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// Set up a route to handle the callback after authorization
app.get('/auth/callback', async (req, res) => {
  const { code,id } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range,
      },
      (err, result) => {
        if (err) {
          console.error('Error fetching data from Google Sheets:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        const data = result.data.values;
        const columnToMatch = 0; // Index of the column to match (e.g., column B is index 1)
        const targetValue = 1; // The value you want to match

        const matchingRow = data.find(row => row[columnToMatch] === targetValue);
        if (matchingRow) {
          res.json(matchingRow);
        } else {
          res.json({ message: 'No matching row found.' });
        }
      }
    );
  } catch (err) {
    console.error('Error during token exchange:', err);
    res.status(500).json({ error: 'Token exchange error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
