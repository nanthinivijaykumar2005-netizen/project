
import React from 'react';
import { Alert } from '../types';
import { ICONS, SEVERITY_COLORS } from '../constants';

interface Props {
  alerts: Alert[];
}

const AlertCenter: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          {ICONS.Alert} Threat Intelligence
        </h3>
      </div>
      <div className="p-4 overflow-y-auto flex-grow space-y-4">
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-600">
            <div className="p-3 bg-slate-800/50 rounded-full mb-3">
              {ICONS.Shield}
            </div>
            <p className="text-xs">No active threats detected in this session</p>
          </div>
        )}
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-slate-950 border-l-4 border-red-500 p-4 rounded-r shadow-lg animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-start mb-1">
              <span className="text-red-400 text-xs font-bold uppercase mono tracking-widest">{alert.type}</span>
              <span className="text-[10px] text-slate-500 mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-slate-200 font-semibold mb-1">{alert.sourceIp}</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{alert.description}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${SEVERITY_COLORS[alert.severity]}`}>
                {alert.severity}
              </span>
              <button className="text-[10px] text-blue-400 hover:text-blue-300 underline font-medium">
                Quarantine IP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertCenter;
