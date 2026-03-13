
const {onCall} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const {setGlobalOptions} = require("firebase-functions");

setGlobalOptions({maxInstances: 10});

// --- Mock Data Generation ---
const generateHistoricalData = (points = 12) => {
  return Array.from({length: points}, (_, i) => ({
    date: `Point ${i + 1}`,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));
};

const allKpiData = {
  b1: {value: "14,250", historicalData: generateHistoricalData()},
  b2: {value: "8,430", historicalData: generateHistoricalData()},
  b3: {value: "3,200", historicalData: generateHistoricalData()},
  b4: {value: "42%", historicalData: generateHistoricalData(4)},
  b5: {value: "185", historicalData: generateHistoricalData(4)},
  b6: {value: "18%", historicalData: generateHistoricalData(4)},
  b7: {value: "12", historicalData: generateHistoricalData(4)},
  b8: {value: "6.5%", historicalData: generateHistoricalData(4)},
  b9: {value: "£1,225", historicalData: generateHistoricalData(4)},
  u1: {value: "1,850", historicalData: generateHistoricalData()},
  u2: {value: "2.1%", historicalData: generateHistoricalData(4)},
  u3: {value: "64", historicalData: generateHistoricalData(4)},
  u4: {value: "5,600", historicalData: generateHistoricalData()},
  u5: {value: "4.8%", historicalData: generateHistoricalData(52)},
  u6: {value: "12", historicalData: generateHistoricalData(4)},
  i1: {value: "12", historicalData: generateHistoricalData(4)},
  i2: {value: "4", historicalData: generateHistoricalData(4)},
  i3: {value: "£4.2M", historicalData: generateHistoricalData(4)},
  i4: {value: "125%", historicalData: generateHistoricalData(4)},
};


// --- Generic KPI Data Fetcher ---

const getKpiData = (kpiId, source) => {
  logger.info(`Fetching ${source} data for kpiId: ${kpiId}`, {
    structuredData: true,
  });
  // In a real app, you would have specific logic for each source.
  // e.g., connect to Google Analytics, Stripe, Salesforce, etc.
  return allKpiData[kpiId] || {value: "N/A", historicalData: []};
};

// --- Callable Functions for different data sources ---

exports.getAnalyticsData = onCall((request) => {
  return getKpiData(request.data.kpiId, "Google Analytics");
});

exports.getStripeData = onCall((request) => {
  return getKpiData(request.data.kpiId, "Stripe");
});

exports.getCrmData = onCall((request) => {
  return getKpiData(request.data.kpiId, "CRM (e.g., Salesforce)");
});

exports.getSurveyData = onCall((request) => {
  return getKpiData(request.data.kpiId, "Survey (e.g., SurveyMonkey)");
});

exports.getLinkedInData = onCall((request) => {
  return getKpiData(request.data.kpiId, "LinkedIn");
});

exports.getMediaData = onCall((request) => {
  return getKpiData(request.data.kpiId, "Media Monitoring");
});

exports.getCustomData = onCall((request) => {
  return getKpiData(request.data.kpiId, "Custom Source");
});
