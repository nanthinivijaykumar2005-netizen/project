
export enum LogSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertType {
  BRUTE_FORCE = 'Brute Force Attempt',
  PORT_SCAN = 'Port Scanning',
  SQL_INJECTION = 'SQL Injection Pattern',
  DATA_EXFILTRATION = 'Abnormal Data Transfer',
  MALICIOUS_C2 = 'Suspected C2 Communication'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP';
  payload: string;
  bytes: number;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  severity: LogSeverity;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: AlertType;
  sourceIp: string;
  severity: LogSeverity;
  description: string;
  involvedLogs: string[];
}

export interface IDSStats {
  totalLogs: number;
  criticalAlerts: number;
  uniqueIps: number;
  threatScore: number;
}
