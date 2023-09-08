function splitSections(text){
    const profileSummary = text;
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
const sectionArray = text.split(regexPattern);

// Iterate through the sections and store them in the object
for (let i = 1; i < sectionArray.length; i += 2) {
  const sectionName = sectionArray[i].trim();
  const sectionContent = sectionArray[i + 1].trim();
  sections[sectionName] = sectionContent;
}

// Print the extracted sections
return sections;

}
module.exports = {splitSections}