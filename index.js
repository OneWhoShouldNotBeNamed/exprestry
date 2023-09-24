const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require('cors');

const splitSections = require("./functions");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

const app = express();
app.options('*', cors()); // Respond to all OPTIONS requests with CORS headers

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the list of allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);




const PORT = process.env.PORT || 3000;

const credentials = require("./secrets.json"); // Replace with your service account key path
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const spreadsheetId = "1ckVrmZxieR26pdN39GVEgEcwdJnHUWmrP8kpNloTuE4";
// const range = 'AICO'; // Adjust this range to match your sheet

// Set up a route to fetch data
app.get("/api/data", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: "v4", auth });
  range = req.query.sheet;
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const data = result.data.values;
    const mergedObject = {};
    const columnToMatch = 0; // Index of the column to match (e.g., column B is index 1)
    const targetValue = req.query.id.toString(); // The value you want to match
    const matchingRow = data.find((row) => row[columnToMatch] === targetValue);
    console.log(matchingRow);
    if (matchingRow) {
      // res.send(matchingRow)
      if (range === "AICO") {
        profileSummary = splitSections(matchingRow[2], "Profile Summary");
        insight = splitSections(matchingRow[3], "Insights");
        mergedObject = { ...profileSummary, ...insight };
      } else if (range === "CareerSparsh") {
        res.send(matchingRow)
      }
    
    } else {
      res.json({ message: "No matching row found." });
    }
  } catch (err) {
    console.error("Error fetching data from Google Sheets:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
