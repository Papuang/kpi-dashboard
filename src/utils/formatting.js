export const formatKpiValue = (value, kpi) => {
  if (value === null || value === undefined) return 'N/A';
  let formattedValue = value.toLocaleString();

  if (!kpi || !kpi.value) return formattedValue;

  const kpiValueString = String(kpi.value);

  if (kpiValueString.includes('%')) {
    formattedValue = `${parseFloat(value).toFixed(1)}%`;
  } else if (kpiValueString.includes('£')) {
    if (kpiValueString.includes('M')) {
      formattedValue = `£${(parseFloat(value) / 1000000).toFixed(1)}M`;
    } else {
      formattedValue = `£${parseFloat(value).toLocaleString()}`;
    }
  } else if (kpiValueString.includes('k')) {
    formattedValue = `${(parseFloat(value) / 1000).toFixed(1)}k`;
  }

  return formattedValue;
};