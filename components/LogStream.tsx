
import React from 'react';
import { LogEntry } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface Props {
  logs: LogEntry[];
}

const LogStream: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Network Stream
        </h3>
        <span className="text-xs text-slate-500 mono">{logs.length} events buffered</span>
      </div>
      <div className="p-0 overflow-y-auto flex-grow mono text-[11px] leading-relaxed">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm">
            <tr className="text-slate-500 border-b border-slate-800 uppercase tracking-tighter">
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Source IP</th>
              <th className="px-4 py-2">Dest Port</th>
              <th className="px-4 py-2">Protocol</th>
              <th className="px-4 py-2">Payload</th>
              <th className="px-4 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2 text-slate-500 whitespace-nowrap">
                  {/* Fixed: Use 'as any' for options to allow fractionalSecondDigits if TypeScript definitions are outdated in the project environment */}
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 } as any)}
                </td>
                <td className="px-4 py-2 text-blue-300">{log.sourceIp}</td>
                <td className="px-4 py-2 text-purple-300">{log.port}</td>
                <td className="px-4 py-2 text-slate-400">{log.protocol}</td>
                <td className="px-4 py-2">
                  <span className={`${SEVERITY_COLORS[log.severity].split(' ')[0]} font-medium truncate max-w-xs inline-block`}>
                    {log.payload}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 
                    log.status === 'BLOCKED' ? 'bg-slate-500/10 text-slate-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="p-10 text-center text-slate-600 italic">
            Waiting for network traffic...
          </div>
        )}
      </div>
    </div>
  );
};

export default LogStream;
