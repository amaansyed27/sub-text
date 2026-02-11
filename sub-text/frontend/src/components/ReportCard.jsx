import { useState } from 'react';

function RedFlagItem({ flag }) {
    const [expanded, setExpanded] = useState(false);

    const riskColor =
        flag.risk_level === 'High' ? 'bg-alert-red/10 border-alert-red text-alert-red' :
            flag.risk_level === 'Medium' ? 'bg-orange-100 border-orange-500 text-orange-700' :
                'bg-green-100 border-green-500 text-green-700';

    return (
        <div className={`mb-4 border-l-4 rounded-r-lg p-4 transition-all ${riskColor.replace('text', 'border')}`}>
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${riskColor}`}>
                            {flag.risk_level} Risk
                        </span>
                        <span className="text-sm font-semibold text-slate-500">{flag.category}</span>
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">{flag.description}</h4>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    {expanded ? '▲' : '▼'}
                </button>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm font-mono text-slate-600 bg-white p-3 rounded border border-slate-200 italic">
                        "{flag.quote}"
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ReportCard({ report }) {
    if (!report) return null;

    const scoreColor =
        report.overall_risk_score > 80 ? 'text-green-500' :
            report.overall_risk_score > 50 ? 'text-orange-500' :
                'text-red-600';

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-legal-blue">Audit Report</h2>
                    <p className="text-slate-500">Summary of findings</p>
                </div>
                <div className="text-right">
                    <div className={`text-5xl font-black ${scoreColor}`}>
                        {report.overall_risk_score}
                    </div>
                    <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Safety Score</div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold text-legal-blue mb-2">Executive Summary</h3>
                <p className="text-slate-600 leading-relaxed">{report.summary}</p>
            </div>

            <div>
                <h3 className="text-xl font-bold text-legal-blue mb-4">Detected Red Flags</h3>
                {report.red_flags.length === 0 ? (
                    <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-700 font-bold">No significant red flags detected.</p>
                    </div>
                ) : (
                    report.red_flags.map((flag, index) => (
                        <RedFlagItem key={index} flag={flag} />
                    ))
                )}
            </div>
        </div>
    );
}
