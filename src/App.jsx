
import React, { useState, useEffect } from 'react';
import { dashboardData } from './data/mockKpis';
import KpiCard from './components/KpiCard';
import KpiModal from './components/KpiModal';
import ReportModal from './components/ReportModal';
import adargaLogo from './assets/adarga.png';
import { app, model } from './firebase'; // Import the model from firebase.js
import { getAuth, signInAnonymously } from 'firebase/auth';

const App = () => {
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [isReportMode, setIsReportMode] = useState(false);
  const [selectedKpis, setSelectedKpis] = useState({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthReady(true);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed: ", error);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleKpiClick = (kpi) => {
    if (!isReportMode) {
      setSelectedKpi(kpi);
    }
  };

  const handleCloseModal = () => {
    setSelectedKpi(null);
  };

  const handleToggleReportMode = () => {
    setIsReportMode(!isReportMode);
    setSelectedKpis({}); // Clear selections when toggling
  };

  const handleKpiSelection = (kpiId) => {
    setSelectedKpis(prev => ({ ...prev, [kpiId]: !prev[kpiId] }));
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setIsReportModalOpen(true);
    setAiResult(''); // Clear previous results

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        const errorMsg = "Error: You must be signed in to generate a report.";
        console.error(errorMsg);
        setAiResult(errorMsg);
        setIsLoading(false);
        return;
    }
    
    const reportData = allKpis.filter(kpi => selectedKpis[kpi.id]);
    
    const kpiInfo = reportData.map(kpi => {
      const historicalDataString = kpi.historicalData.map(p => `(${p.date}: ${p.value})`).join(', ');
      
      const forecastData = calculateForecast(kpi.historicalData);
      const futureForecastPoint = forecastData.length > 1 ? forecastData[forecastData.length - 1] : null;
      let forecastString = "Not enough data for forecast.";
      if (futureForecastPoint && futureForecastPoint.forecast !== null) {
        forecastString = `The forecast for the next period is approximately ${futureForecastPoint.forecast.toFixed(2)}.`;
      }
      
      const anomalyString = kpi.anomaly ? 'The latest data point is considered a potential anomaly.' : 'No anomaly detected in the latest data point.';

      return `
KPI: "${kpi.title}"
- Measurement: ${kpi.measurement || 'N/A'}
- Formula: ${kpi.formula || 'N/A'}
- Current Value: ${kpi.value}
- Target: ${kpi.target}
- Recent Change: ${kpi.change}% vs. last ${kpi.period}
- Anomaly Check: ${anomalyString}
- Historical Data: [${historicalDataString}]
- Forecast: ${forecastString}
      `.trim();
    }).join('\\n\\n---\\n\\n');

    const prompt = `
      Generate a detailed analysis based on the following KPI data. ${aiPrompt}:


      ---
      ${kpiInfo}
    `;

    try {
      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          setAiResult(prev => prev + chunkText);
      }

    } catch (error) {
      console.error("Error generating report: ", error);
      const userFriendlyError = `
### Report Generation Failed

We're sorry, but an unexpected error occurred while trying to generate the AI report. This could be due to a temporary issue with the service or your network connection.

**What you can do:**
- **Wait a moment and try again.**
- **Check your internet connection.**
- **If the problem persists, please contact support and provide the technical details below.**

---
**Technical Details:**
\`\`\`
${error.message || 'An unknown error occurred.'}
\`\`\`
      `;
      setAiResult(userFriendlyError);
    } finally {
      setIsLoading(false);
      setIsReportMode(false);
      setSelectedKpis({});
    }
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportContent('');
    setAiPrompt('');
    setAiResult('');
    setSelectedKpis({});
  };

    // AI Utility Functions
    const calculateForecast = (history) => {
        if (!history || history.length < 2) return history;

        const n = history.length;
        const x = history.map((_, i) => i);
        const y = history.map(p => p.value);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const lastPoint = history[n - 1];

        // Create a new array for the chart, starting with historical data
        const chartData = history.map(point => ({ ...point, forecast: null }));

        // The forecast line starts from the last actual point.
        // To make it a continuous line in recharts, we set the forecast value for the last point.
        chartData[n-1].forecast = lastPoint.value; // Start forecast from the actual last value

        // Add a future forecast point
        chartData.push({
            date: 'Future',
            value: null, // No actual value
            forecast: slope * n + intercept
        });

        return chartData;
    };

  const isAnomaly = (history) => {
    if (!history || history.length < 5) return false;
    const values = history.map(p => p.value);
    const recentValues = values.slice(0, values.length - 1);
    const lastValue = values[values.length - 1];
    const mean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const stdDev = Math.sqrt(recentValues.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / recentValues.length);
    return Math.abs(lastValue - mean) > 2 * stdDev;
  };

  const allKpis = [...dashboardData.buyers, ...dashboardData.users, ...dashboardData.investors].map(kpi => ({
    ...kpi,
    anomaly: isAnomaly(kpi.historicalData),
  }));

  const column1 = allKpis.slice(0, 4);
  const column2 = allKpis.slice(4, 6);
  const column3 = allKpis.slice(6, 9);
  const column4 = allKpis.slice(9, 12);
  const column5 = allKpis.slice(12, 15);
  const column6 = allKpis.slice(15, 17);
  const column7 = allKpis.slice(17, 19);

  const periodKey = [
    { period: 'year', color: 'bg-red-400/30', label: 'Annual' },
    { period: 'quarter', color: 'bg-blue-400/30', label: 'Quarterly' },
    { period: 'month', color: 'bg-orange-400/30', label: 'Monthly' },
    { period: 'week', color: 'bg-green-400/30', label: 'Weekly' },
  ];

  return (
    <div className="h-screen w-full bg-adarga-bg text-adarga-muted p-6 flex flex-col overflow-hidden font-sans">

      {/* Header Area */}
      <header className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <img src={adargaLogo} alt="Adarga" className="h-20" />
          <span className="text-adarga-muted font-light text-4xl">|</span>
          <div>
            <h1 className="text-xl font-bold text-adarga-text tracking-tight">
              Strategic KPI Dashboard
            </h1>
            <p className="text-[11px] text-adarga-muted uppercase tracking-[0.3em] font-medium">
              Marketing & Growth Performance Analytics
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
           <button onClick={handleToggleReportMode} disabled={!isAuthReady} className="text-sm font-bold bg-adarga-card border border-adarga-border px-3 py-1.5 rounded-full hover:bg-adarga-text hover:text-adarga-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isReportMode ? 'Cancel' : 'Generate Report'}
            </button>
          <div className="flex items-center gap-2 bg-adarga-bg border border-adarga-northstar/50 px-3 py-1.5 rounded-full">
            <span className="text-adarga-northstar text-[10px] font-black">✧</span>
            <span className="text-[10px] font-bold text-adarga-northstar tracking-wider">North Star</span>
          </div>
          <div className="text-[10px] font-bold text-adarga-muted px-3 py-1.5 border border-adarga-border rounded-full">
            Q1 2026
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-adarga-muted px-3 py-1.5 border border-adarga-border rounded-full">
            {periodKey.map(item => (
              <div key={item.period} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                <span className="tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-[3fr_2fr_2fr] gap-8 min-h-0">

        {/* Buyers Section (3 columns) */}
        <section className="flex flex-col min-h-0 bg-adarga-card/30 rounded-2xl p-4 border border-adarga-border/50">
          <h2 className="text-xs font-black mb-4 text-adarga-text uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-adarga-buyers rounded-full"></span> Buyers
          </h2>
          <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Website</h3>
              {column1.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Leads</h3>
              {column2.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Accounts</h3>
              {column3.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
          </div>
        </section>

        {/* Users Section (2 columns) */}
        <section className="flex flex-col min-h-0 bg-adarga-card/30 rounded-2xl p-4 border border-adarga-border/50">
          <h2 className="text-xs font-black mb-4 text-adarga-text uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-adarga-users rounded-full"></span> Users
          </h2>
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Utility</h3>
              {column4.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Engagement</h3>
              {column5.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
          </div>
        </section>

        {/* Investors Section (2 columns) */}
        <section className="flex flex-col min-h-0 bg-adarga-card/30 rounded-2xl p-4 border border-adarga-border/50">
          <h2 className="text-xs font-black mb-4 text-adarga-text uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-adarga-investors rounded-full"></span> Investors
          </h2>
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Sentiment</h3>
              {column6.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
            <div className="flex flex-col text-center space-y-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-adarga-text">Finances</h3>
              {column7.map(kpi => <KpiCard key={kpi.id} {...kpi} isReportMode={isReportMode} onSelect={() => handleKpiSelection(kpi.id)} isSelected={selectedKpis[kpi.id]} onClick={() => handleKpiClick(kpi)} />)}
            </div>
          </div>
        </section>

      </main>

        {
            isReportMode && (
                <div className="fixed bottom-6 right-6 z-20 flex items-center gap-4">
                   <textarea
                        className="bg-adarga-card border border-adarga-border rounded-lg p-2 text-adarga-text resize-none" 
                        placeholder="Enter a prompt for the AI..." 
                        value={aiPrompt} 
                        onChange={(e) => setAiPrompt(e.target.value)} />
                    <button onClick={handleGenerateReport} disabled={isLoading || !isAuthReady} className="text-lg font-bold bg-adarga-text text-adarga-bg px-6 py-3 rounded-full hover:bg-adarga-northstar transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            )
        }

      <KpiModal kpi={selectedKpi} onClose={handleCloseModal} calculateForecast={calculateForecast} />
      <ReportModal isOpen={isReportModalOpen} onClose={handleCloseReportModal} reportContent={aiResult || reportContent} />

    </div>
  );
};

export default App;