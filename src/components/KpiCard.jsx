import React from 'react';

const KpiCard = ({ id, title, measurement, formula, value, target, change, period, invertColor = false, onClick, isReportMode, onSelect, isSelected, anomaly }) => {
  const isNorthStar = measurement.includes('✧');
  const isPositiveChange = change >= 0;
  const isGood = invertColor ? !isPositiveChange : isPositiveChange;
  
  const changeColorClass = isGood ? 'text-adarga-positive' : 'text-adarga-negative';
  const changeSign = change > 0 ? '+' : '';

  const measurementParts = measurement.split('✧');

  const periodStyles = {
    year: {
      dot: 'bg-red-400/30',
      overlay: 'bg-red-400/30',
    },
    quarter: {
      dot: 'bg-blue-400/30',
      overlay: 'bg-blue-400/30',
    },
    month: {
      dot: 'bg-orange-400/30',
      overlay: 'bg-orange-400/30',
    },
    week: {
      dot: 'bg-green-400/30',
      overlay: 'bg-green-400/30',
    },
  };
  const periodDotColor = periodStyles[period]?.dot;
  const periodOverlayClass = periodStyles[period]?.overlay || 'bg-adarga-bg/90';

  let cardClasses = isNorthStar 
      ? 'bg-adarga-card border-adarga-northstar/50 hover:border-adarga-northstar'
      : 'bg-adarga-card border-adarga-border hover:border-adarga-text';

  if (isReportMode) {
    cardClasses = isSelected
      ? 'bg-adarga-card border-adarga-northstar' 
      : 'bg-adarga-card border-adarga-border opacity-60 hover:opacity-100';
  }

  const handleClick = isReportMode ? onSelect : onClick;

  return (
    <div onClick={handleClick} className={`relative group/tooltip rounded-xl border transition-all duration-300 w-full p-2 ${cardClasses} ${isReportMode ? 'cursor-pointer' : 'cursor-help'}`}>
      
      {isReportMode && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-adarga-text border-adarga-text' : 'border-adarga-border'}`}>
            {isSelected && <span className="text-adarga-bg text-xs font-bold">✓</span>}
          </div>
        </div>
      )}

      {anomaly && (
          <div className="absolute top-1.5 right-2.5 z-20">
              <span className="text-sm">⚠️</span>
          </div>
      )}

      {/* Formula overlay */}
      <div className={`absolute inset-0 p-4 flex items-center justify-center ${periodOverlayClass} backdrop-blur-sm rounded-xl opacity-0 pointer-events-none transition-opacity duration-300 group-hover/tooltip:opacity-100 z-10`}>
        <p className="text-adarga-text text-center text-[10px] font-bold italic">{formula}</p>
      </div>

      {/* KPI card data */}
      <div className={`transition-opacity duration-300 ${!isReportMode && 'group-hover/tooltip:opacity-20'}`}>
        <div className="mb-2">
          <p className={`text-[9px] text-adarga font-bold italic tracking-wider leading-tight pt-1`}>
            {measurementParts.length > 1 ? (
              <>
                <span className="text-adarga-northstar">✧</span>
                {measurementParts[1]}
              </> 
            ) : ( measurement )}
          </p>
        </div>
        <h3 className={`text-[10px] text-white font-bold tracking-widest leading-tight mb-3 text-center`}>
          <span className={`w-1.5 h-1.5 rounded-full ${periodDotColor} inline-block align-middle mr-1.5`}></span>
          <span className="align-middle">{title}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${periodDotColor} inline-block align-middle ml-1.5`}></span>
        </h3>
        
        <div>
          <div className="flex items-center text-center">
            <div className="w-1/3" />
            <div className="w-1/3 text-2xl font-bold text-adarga-text tracking-tight">
                {value}
            </div>
            <div className="text-left">
              <span className="ml-2 text-xs text-adarga-muted font-medium">
                <span className="italic">{target}</span>
                <span> 🎯</span>
              </span>
            </div>
          </div>
          <div className="text-[11px] font-bold mt-1 flex justify-center items-center gap-1 italic">
            <span className={`${changeColorClass}`}>
              {changeSign}{change}%
            </span>
            <span className="text-adarga-text font-medium">
              vs. last {period}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;