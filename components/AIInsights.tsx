
import React, { useState } from 'react';
import { Alert, LogEntry } from '../types';
import { analyzeThreats } from '../services/geminiService';
import { ICONS } from '../constants';

interface Props {
  alerts: Alert[];
  logs: LogEntry[];
}

const AIInsights: React.FC<Props> = ({ alerts, logs }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeThreats(alerts, logs);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Security Researcher Insight
          </h2>
          <p className="text-sm text-slate-400 mt-1">AI-augmented threat analysis and mitigation strategy.</p>
        </div>
        <button 
          onClick={triggerAnalysis}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              {ICONS.Zap}
              Run Researcher Analysis
            </>
          )}
        </button>
      </div>

      <div className="min-h-[100px] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/50 p-6">
        {!analysis && !isAnalyzing ? (
          <p className="text-slate-500 text-sm">Submit current telemetry for expert AI analysis.</p>
        ) : isAnalyzing ? (
          <p className="text-blue-400 text-sm animate-pulse">Scanning patterns and correlated vectors...</p>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
