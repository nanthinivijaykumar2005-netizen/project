
import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Globe, 
  Terminal,
  AlertTriangle,
  Info
} from 'lucide-react';
import { LogSeverity, AlertType, LogEntry } from './types';

export const SEVERITY_COLORS = {
  [LogSeverity.INFO]: 'text-blue-400 bg-blue-400/10',
  [LogSeverity.LOW]: 'text-green-400 bg-green-400/10',
  [LogSeverity.MEDIUM]: 'text-yellow-400 bg-yellow-400/10',
  [LogSeverity.HIGH]: 'text-orange-400 bg-orange-400/10',
  [LogSeverity.CRITICAL]: 'text-red-400 bg-red-400/10 animate-pulse-red',
};

export const ICONS = {
  Shield: <ShieldCheck className="w-5 h-5" />,
  Alert: <ShieldAlert className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Triangle: <AlertTriangle className="w-5 h-5" />,
  Info: <Info className="w-5 h-5" />
};

const IPS = [
  '192.168.1.45', '10.0.0.12', '172.16.0.5', '45.12.33.102', 
  '185.22.41.9', '91.234.5.1', '103.44.12.56', '5.10.123.4'
];

const PAYLOADS = [
  'GET /api/v1/user HTTP/1.1',
  'POST /login HTTP/1.1 - username=admin',
  'SELECT * FROM users WHERE id=1 OR 1=1',
  'GET /etc/passwd HTTP/1.1',
  'SYN Flood attempted on port 80',
  'Heartbeat check OK',
  'TCP Handshake complete',
  'Data transfer 50.4KB'
];

export const generateRandomLog = (): LogEntry => {
  const sourceIp = IPS[Math.floor(Math.random() * IPS.length)];
  const isMalicious = Math.random() < 0.15;
  const payload = isMalicious 
    ? PAYLOADS[Math.floor(Math.random() * 4) + 2] 
    : PAYLOADS[Math.floor(Math.random() * 2)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    sourceIp,
    destIp: '10.0.0.1',
    port: Math.floor(Math.random() * 65535),
    protocol: ['TCP', 'UDP', 'HTTP'][Math.floor(Math.random() * 3)] as any,
    payload,
    bytes: Math.floor(Math.random() * 5000),
    status: isMalicious ? 'FAILURE' : 'SUCCESS',
    severity: isMalicious ? LogSeverity.HIGH : LogSeverity.INFO,
  };
};
