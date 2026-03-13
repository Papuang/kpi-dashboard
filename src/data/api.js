import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase'; // Import the initialized Firebase app

const functions = getFunctions(app); // Pass the app to getFunctions()

// Helper function to call a Firebase Function
const callApi = async (functionName, params) => {
  try {
    const func = httpsCallable(functions, functionName);
    const response = await func(params);
    return response.data;
  } catch (error) {
    console.error(`Error calling function ${functionName}:`, error);
    // Return a default structure on error to prevent UI crashes
    return { value: 'Error', historicalData: [] };
  }
};

// --- Data Fetching Functions for each KPI from mockKpis.js ---

// Buyers
export const getWebsiteTraffic = () => callApi('getAnalyticsData', { kpiId: 'b1' });
export const getWebsiteContentViews = () => callApi('getAnalyticsData', { kpiId: 'b2' });
export const getSearchVolume = () => callApi('getAnalyticsData', { kpiId: 'b3' });
export const getAIVisibilityRate = () => callApi('getCustomData', { kpiId: 'b4' });
export const getMQLs = () => callApi('getCrmData', { kpiId: 'b5' });
export const getLeadVelocityRate = () => callApi('getCrmData', { kpiId: 'b6' });
export const getCustomerGrowth = () => callApi('getCrmData', { kpiId: 'b7' });
export const getLeadToCustomerRate = () => callApi('getCrmData', { kpiId: 'b8' });
export const getCustomerAcquisitionCost = () => callApi('getCrmData', { kpiId: 'b9' });

// Users
export const getMonthlyActiveUsers = () => callApi('getAnalyticsData', { kpiId: 'u1' });
export const getChurnRate = () => callApi('getStripeData', { kpiId: 'u2' });
export const getNetPromoterScore = () => callApi('getSurveyData', { kpiId: 'u3' });
export const getOwnedContentViews = () => callApi('getAnalyticsData', { kpiId: 'u4' });
export const getLinkedInEngagementRate = () => callApi('getLinkedInData', { kpiId: 'u5' });
export const getMediaCoverage = () => callApi('getMediaData', { kpiId: 'u6' });

// Investors
export const getActivePipeline = () => callApi('getCrmData', { kpiId: 'i1' });
export const getIOIs = () => callApi('getCrmData', { kpiId: 'i2' });
export const getAnnualRecurringRevenue = () => callApi('getStripeData', { kpiId: 'i3' });
export const getRevenueGrowthRate = () => callApi('getStripeData', { kpiId: 'i4' });


// --- Mapping KPI IDs to fetching functions ---

export const kpiFetchMap = {
  // Buyers
  b1: getWebsiteTraffic,
  b2: getWebsiteContentViews,
  b3: getSearchVolume,
  b4: getAIVisibilityRate,
  b5: getMQLs,
  b6: getLeadVelocityRate,
  b7: getCustomerGrowth,
  b8: getLeadToCustomerRate,
  b9: getCustomerAcquisitionCost,
  // Users
  u1: getMonthlyActiveUsers,
  u2: getChurnRate,
  u3: getNetPromoterScore,
  u4: getOwnedContentViews,
  u5: getLinkedInEngagementRate,
  u6: getMediaCoverage,
  // Investors
  i1: getActivePipeline,
  i2: getIOIs,
  i3: getAnnualRecurringRevenue,
  i4: getRevenueGrowthRate,
};

// --- Main Data Fetching Logic ---

export const fetchAllKpiData = async (kpis) => {
  const allKpiPromises = Object.keys(kpis).flatMap(category =>
    kpis[category].map(kpi => {
      const fetchFunc = kpiFetchMap[kpi.id];
      if (fetchFunc) {
        return fetchFunc().then(data => ({
          ...kpi,
          ...data, // value and historicalData
        }));
      }
      return Promise.resolve(kpi); // Return original KPI if no fetch function is mapped
    })
  );

  const allKpis = await Promise.all(allKpiPromises);

  // Re-group the KPIs back into their categories
  const newDashboardData = {
    buyers: [],
    users: [],
    investors: [],
  };

  allKpis.forEach(kpi => {
    if (kpi.id.startsWith('b')) {
      newDashboardData.buyers.push(kpi);
    } else if (kpi.id.startsWith('u')) {
      newDashboardData.users.push(kpi);
    } else if (kpi.id.startsWith('i')) {
      newDashboardData.investors.push(kpi);
    }
  });

  return newDashboardData;
};