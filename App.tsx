
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LogEntry, Alert, LogSeverity, AlertType, IDSStats } from './types';
import { generateRandomLog, ICONS } from './constants';
import LogStream from './components/LogStream';
import AlertCenter from './components/AlertCenter';
import DashboardStats from './components/DashboardStats';
import AIInsights from './components/AIInsights';

const MAX_LOGS = 50;

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<IDSStats>({
    totalLogs: 0,
    criticalAlerts: 0,
    uniqueIps: 0,
    threatScore: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Track IP activity for detection logic
  const ipActivityRef = useRef<Record<string, { attempts: number; ports: Set<number>; lastSeen: number }>>({});

  const processLogForAlerts = useCallback((log: LogEntry) => {
    const now = Date.now();
    const ip = log.sourceIp;
    
    if (!ipActivityRef.current[ip]) {
      ipActivityRef.current[ip] = { attempts: 0, ports: new Set(), lastSeen: now };
    }
    
    const activity = ipActivityRef.current[ip];
    activity.lastSeen = now;
    activity.ports.add(log.port);

    // BRUTE FORCE DETECTION
    if (log.payload.toLowerCase().includes('login') && log.status === 'FAILURE') {
      activity.attempts += 1;
      if (activity.attempts >= 5) {
        const newAlert: Alert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: AlertType.BRUTE_FORCE,
          sourceIp: ip,
          severity: LogSeverity.CRITICAL,
          description: `Multiple failed authentication attempts detected from ${ip}. Current count: ${activity.attempts}`,
          involvedLogs: [log.id]
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        activity.attempts = 0; // Reset after alert
      }
    }

    // PORT SCANNING DETECTION
    if (activity.ports.size > 15) {
      const newAlert: Alert = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type: AlertType.PORT_SCAN,
        sourceIp: ip,
        severity: LogSeverity.HIGH,
        description: `Source ${ip} contacted ${activity.ports.size} distinct ports in a short period. Possible mapping activity.`,
        involvedLogs: [log.id]
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      activity.ports.clear(); // Reset after alert
    }

    // SQL INJECTION DETECTION
    const sqliPatterns = ['union select', 'or 1=1', '--', 'xp_cmdshell'];
    if (sqliPatterns.some(pattern => log.payload.toLowerCase().includes(pattern))) {
      const newAlert: Alert = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type: AlertType.SQL_INJECTION,
        sourceIp: ip,
        severity: LogSeverity.CRITICAL,
        description: `SQL Injection pattern detected in payload from ${ip}: "${log.payload.slice(0, 30)}..."`,
        involvedLogs: [log.id]
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateRandomLog();
      
      setLogs(prev => [newLog, ...prev].slice(0, MAX_LOGS));
      setStats(prev => ({
        totalLogs: prev.totalLogs + 1,
        criticalAlerts: prev.criticalAlerts + (newLog.severity === LogSeverity.CRITICAL ? 1 : 0),
        uniqueIps: Object.keys(ipActivityRef.current).length,
        threatScore: Math.min(100, Math.floor((prev.criticalAlerts / (prev.totalLogs + 1)) * 500) + 10)
      }));
      
      setChartData(prev => [
        ...prev, 
        { time: new Date().toLocaleTimeString(), volume: Math.floor(Math.random() * 100) + 50 }
      ].slice(-20));

      processLogForAlerts(newLog);
    }, 2000);

    return () => clearInterval(interval);
  }, [processLogForAlerts]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sentinel-AI <span className="text-blue-500">IDS</span></h1>
              <p className="text-[10px] text-slate-500 mono uppercase tracking-widest">Intrusion Detection & Response Engine v3.0</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              SYSTEMS OPERATIONAL
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI MONITORING ACTIVE
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="text-xs text-slate-500 mono">SOC_REGION: US-EAST-1</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full p-6 space-y-8">
        {/* Stats Section */}
        <DashboardStats stats={stats} chartData={chartData} />

        {/* Lower Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[500px]">
          <div className="xl:col-span-3">
            <LogStream logs={logs} />
          </div>
          <div className="xl:col-span-1">
            <AlertCenter alerts={alerts} />
          </div>
        </div>

        {/* AI Insight Section */}
        <AIInsights alerts={alerts} logs={logs} />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-6 bg-slate-950">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-600 mono flex items-center gap-2">
            &copy; 2024 SENTINEL-AI RESEARCH LABS // EYES ON TARGET
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold">Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold">Threat Feed</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Utility SVG for branding
const ShieldAlert = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default App;
