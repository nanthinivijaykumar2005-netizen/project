
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { IDSStats, LogEntry } from '../types';
import { ICONS } from '../constants';

interface Props {
  stats: IDSStats;
  chartData: any[];
}

const DashboardStats: React.FC<Props> = ({ stats, chartData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: stats.totalLogs, icon: ICONS.Terminal, color: 'text-blue-400' },
          { label: 'Threat Score', value: stats.threatScore + '%', icon: ICONS.Shield, color: stats.threatScore > 50 ? 'text-red-400' : 'text-green-400' },
          { label: 'Unique IPs', value: stats.uniqueIps, icon: ICONS.Globe, color: 'text-purple-400' },
          { label: 'Active Alerts', value: stats.criticalAlerts, icon: ICONS.Triangle, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold mono">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-xl h-[300px]">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            {ICONS.Activity} Network Traffic Profile
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} hide />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTraffic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl h-[300px]">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            {ICONS.Zap} Top Attack Vectors
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Brute', count: 12 },
              { name: 'Scan', count: 25 },
              { name: 'SQLi', count: 8 },
              { name: 'C2', count: 3 }
            ]} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={40} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                { [0, 1, 2, 3].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#f87171', '#fb923c', '#fbbf24', '#f472b6'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
