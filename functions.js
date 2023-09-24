function splitSections(text, section) {
  const profileSummary = text;
  //
  var profileSummarysections = {};

  // Define the keywords to split the sections
  var ProfileSummarykeywords = [
    "QuickSummary\n",
    "\n\nSkills",
    "\n\nOpportunities",
    "\n \nMarketAnalysis\n",
    "\n\nRecommendationsforImprovement",
  ];

  var InsightsKeyWord = [
    "ProfileAnalysis\n",
    "\n\nKnowledgeEconomyInterventions\n",
    "\n\nStrategy\n",
    "\n\nActionPlan\n",
    "\n\nEcosystemCreation\n",
    "\nSuggestionsfortheKnowledgeEconomyAdvisor\n",
  ];

  var CCS = [
    "PersonalDetails\n",
    "\n\nWorkExperience\n",
    "\n\nEducationalBackground\n",
    "\n\nCareerAspirations\n",
    "\n\nLanguageProficiency\n",
    "\n\nFuturePlans\n",
    "\n\nKeyTakeaways\n",
  ];
  var DACC = [
    "\nPersonalInformation\n",
    "\n\nEducationalBackground\n",
    "\n\nCareerAspirations\n",
    "\n\nSkillset\n",
    "\n\nAvailabilityandConstraints\n",
    "\n\nGoalsandMotivations\n",
    "\n\nPotentialCareerPaths\n",
    "\n\nAttitudeandBehavior\n",
    "\n\nPassionandInterests\n",
    "\n\nWorkStyleandPreferences\n",
    "\n\nEmotionalIntelligence\n",
    "\n\nResilienceandStressManagement\n",
    "\n\nAdaptability\n",
    "\n\nRiskTaking\n",
  ];
  var CSA = [
    "Short-TermOpportunities\n",
    "\n\nLong-TermOpportunities\n",
    "\n\nSkillingOpportunities\n",
    "\n\nLeadershipTraining\n",
  ];
  // var selectedArray =
  //   section === "Profile Summary" ? ProfileSummarykeywords : InsightsKeyWord;
  switch (section) {
    case "Profile Summary":
      selectedArray = ProfileSummarykeywords;
      break;
    case "Insights":
      selectedArray = InsightsKeyWord;
      break;
    case "CCS":
      selectedArray = CCS;
      break;
    case "DACC":
      selectedArray = DACC;
      break;
    case "CSA":
      selectedArray = CSA;
      break;
    default:
      console.log("It's the weekend!");
  }

  // Create a regular expression pattern that matches any of the keywords
  var regexPattern = new RegExp(`(${selectedArray.join("|")})`, "g");

  // Split the text into sections using the regular expression
  var sectionArray = profileSummary.split(regexPattern);

  // Iterate through the sections and store them in the object
  for (let i = 1; i < sectionArray.length; i += 2) {
    const sectionName = sectionArray[i].trim();
    const sectionContent = sectionArray[i + 1].trim();
    profileSummarysections[sectionName] = sectionContent;
  }

  // Print the extracted sections
  return profileSummarysections;
}

module.exports = splitSections;
