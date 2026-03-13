import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { formatKpiValue } from '../utils/formatting';

const LinkIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    fill="currentColor" 
    viewBox="0 0 16 16" 
    className="mr-1.5"
  >
    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
  </svg>
);

const CustomizedLabel = (props) => {
    const { x, y, value, index, kpi } = props;

    if (!kpi || value === null || value === undefined) {
      return null;
    }
    const { period } = kpi;

    let showLabel = false;

    if (period === 'year') {
        showLabel = true;
    } else if (period === 'quarter') {
        showLabel = true;
    } else if (period === 'month') {
        if ((index + 1) % 3 === 0) {
            showLabel = true;
        }
    } else if (period === 'week') {
        if ((index + 1) % 13 === 0) {
            showLabel = true;
        }
    }

    if (!showLabel) {
        return null;
    }

    const formattedValue = formatKpiValue(value, kpi);

    return (
        <text x={x} y={y} dy={-10} fill="#666" fontSize={14} textAnchor="middle">
            {formattedValue}
        </text>
    );
};

const KpiModal = ({ kpi, onClose, calculateForecast }) => {
  if (!kpi) return null;

  const chartData = kpi.historicalData ? calculateForecast(kpi.historicalData) : [];

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const valueFormatter = (value) => formatKpiValue(value, kpi);

  const tooltipFormatter = (value, name, props) => {
      if (name === 'Forecast' && props.payload.value !== null) {
          return null;
      }
      return [valueFormatter(value), null];
  }

  const labelFormatter = (label) => {
    return <span className="font-bold">{label}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white text-gray-800 p-5 rounded-lg w-11/12 max-w-4xl" onClick={handleModalClick}>
        <div className="flex justify-between items-center border-b border-gray-200 pb-2.5 mb-5">
          <h2 className="font-bold text-2xl">{kpi.title}</h2>
          <div className="flex items-center">
            <button className="flex items-center bg-transparent border-none text-gray-500 cursor-pointer mr-4 text-lg">
              <LinkIcon />
              View data
            </button>
            <button onClick={onClose} className="border-none bg-transparent text-2xl cursor-pointer">X</button>
          </div>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} isAnimationActive={false}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={valueFormatter} />
              <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} isAnimationActive={false} />
              <Line type="monotone" dataKey="value" name="Actual" strokeWidth={2} stroke="#8884d8" activeDot={{ r: 8 }} dot={{ r: 4 }} isAnimationActive={false}>
                <LabelList dataKey="value" content={<CustomizedLabel kpi={kpi} />} />
              </Line>
              <Line type="monotone" dataKey="forecast" name="Forecast" strokeWidth={2} stroke="#82ca9d" strokeDasharray="5 5" dot={{ r: 4 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KpiModal;
