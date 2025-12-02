import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { AlertTriangle, Globe, Shield, LineChart as LineChartIcon } from 'lucide-react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'; 

const DarkCard = ({ title, icon, className = '', children, titleClass = '' }) => (
  <div
    className={`bg-gray-800 text-white rounded-lg shadow-lg p-4 border border-gray-700 ${className}`}
  >
    <div className={`flex justify-between items-center mb-3 ${titleClass}`}>
      {title && (
        <h3 className="text-md font-semibold text-gray-200">
          {title}
        </h3>
      )}
      {icon}
    </div>
    {children}
  </div>
);

const SeverityLabel = ({ type }) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider';
  let colorClasses = '';

  switch (type.toUpperCase()) {
    case 'CRITICAL':
      colorClasses = 'bg-red-800 text-red-300 border border-red-700';
      break;
    case 'ERROR':
      colorClasses = 'bg-orange-600 text-orange-200 border border-orange-500';
      break;
    case 'WARNING':
    case 'WARN':
      colorClasses = 'bg-yellow-700 text-yellow-300 border border-yellow-600';
      break;
    case 'INFO':
    default:
      colorClasses = 'bg-blue-800 text-blue-300 border border-blue-700';
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{type}</span>;
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AnomaliesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const json = await fetchJson('http://localhost:3213/logs/anomalies?hours=24');

        const times = (json.anomaly_times || []).slice().reverse();
        const perMinute = {};
        times.forEach(row => {
          const m = new Date(row.timestamp).toISOString().slice(0, 16);
          perMinute[m] = (perMinute[m] || 0) + row.score;
        });
        const lineData = Object.entries(perMinute).map(([k, v]) => ({ t: k.substr(11), score: v })).slice(-30);

        const rawScores = (json.score_distribution || []).reduce((acc, curr) => acc + curr.count, 0); // Общее количество для примера
        const scoreDist = [
            { name: '0-20', count: Math.floor(rawScores * 0.4), color: '#38BDF8' },
            { name: '21-40', count: Math.floor(rawScores * 0.3), color: '#60A5FA' },
            { name: '41-60', count: Math.floor(rawScores * 0.15), color: '#FBBF24' },
            { name: '61-80', count: Math.floor(rawScores * 0.10), color: '#F97316' },
            { name: '81-100', count: Math.floor(rawScores * 0.05), color: '#EF4444' },
        ];

        const typeDist = (json.type_distribution || []).map(t => ({ 
            type: t.type, 
            count: t.count,
            color: t.count > 10 ? '#EF4444' : t.count > 5 ? '#F97316' : '#DC2626' 
        })).sort((a, b) => a.count - b.count); 

        setData({
          totalAnomalies: json.totalAnomalies || 10,
          anomaliesChange: '-24%', 
          scoreAvg: json.scoreAvg || 62.5,
          uniqueIPs: json.uniqueIPs || 156,
          suspiciousIPs: json.suspiciousIPs || 12,
          blocked: json.blocked || 8,
          lineData,
          scoreDist,
          typeDist,
          anomaliesTable: json.anomaliesTable || [],
          recommendations: json.recommendations || [] 
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  const tableData = data?.anomaliesTable?.length > 0 ? data.anomaliesTable : [
    { timestamp: '2025-11-20T10:23:15Z', host: 'firewal-01', event_type: 'DDoS Attack', score: 95, severity: 'CRITICAL', message: 'Massive traffic spike from multiple IPs detected' },
    { timestamp: '2025-11-20T10:23:15Z', host: 'app-server-03', event_type: 'Brute Force', score: 88, severity: 'CRITICAL', message: 'Multiple failed login attempts from IP 203.0.113.45' },
    { timestamp: '2025-11-20T10:23:15Z', host: 'db-server-02', event_type: 'Unusual Access Pattern', score: 72, severity: 'ERROR', message: 'Database queries at unusual hours from unknown user' },
    { timestamp: '2025-11-20T10:23:15Z', host: 'web-server-01', event_type: 'Traffic Spike', score: 65, severity: 'WARNING', message: 'Sudden increase in API requests (+300% above baseline)' },
    { timestamp: '2025-11-20T10:23:15Z', host: 'file-server-01', event_type: 'Data Exfiltration', score: 78, severity: 'CRITICAL', message: 'Large file download detected during non-business hours' },
  ];

  const recommendationsData = data?.recommendations?.length > 0 ? data.recommendations : [
    { 
      type: 'DDoS атака обнаружена', 
      severity: 'CRITICAL', 
      description: 'Зафиксирован всплеск трафика с 10,000 запросов/сек', 
      actions: ['Включить rate limiting', 'Заблокировать подозрительные IP', 'Масштабировать инфраструктуру'] 
    },
    { 
      type: 'Brute Force атака', 
      severity: 'WARNING', 
      description: 'Множество неудачных попыток входа', 
      actions: ['Временно заблокировать IP', 'Включить 2FA для аккаунта', 'Уведомить пользователя'] 
    },
    { 
      type: 'Необычный паттерн доступа', 
      severity: 'WARNING', 
      description: 'Зафиксирован всплеск трафика с 10,000 запросов/сек', 
      actions: ['Включить rate limiting', 'Заблокировать подозрительные IP', 'Масштабировать инфраструктуру'] 
    },
  ];

  const RecommendationItem = ({ rec }) => {
    const baseClasses = 'p-3 rounded-lg border';
    let colorClasses = '';

    switch (rec.severity.toUpperCase()) {
      case 'CRITICAL':
        colorClasses = 'bg-red-900/50 border-red-700 text-red-300';
        break;
      case 'ERROR':
        colorClasses = 'bg-orange-900/50 border-orange-700 text-orange-300';
        break;
      case 'WARNING':
      default:
        colorClasses = 'bg-yellow-900/50 border-yellow-700 text-yellow-300';
        break;
    }

    return (
      <div className={`${baseClasses} ${colorClasses} space-y-2`}>
        <h4 className="font-bold text-base flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {rec.type}
        </h4>
        <p className="text-xs text-gray-400">{rec.description}</p>
        <div className="pt-1">
            <h5 className="text-xs font-semibold text-white mb-1">Действия:</h5>
            <ul className="list-disc pl-5 text-xs space-y-0.5">
                {rec.actions.map((action, i) => <li key={i}>{action}</li>)}
            </ul>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      
      <div className="grid grid-cols-4 gap-4">
        <DarkCard className="p-4 flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1"/>
          <div>
            <div className="text-md text-gray-400 uppercase font-semibold">Аномалии за 24ч</div>
            <div className="text-4xl font-light text-white">{data?.totalAnomalies || 0}</div>
            <div className="text-sm text-red-400 font-medium">{data?.anomaliesChange}</div>
          </div>
        </DarkCard>

        <DarkCard className="p-4 flex items-start space-x-3">
          <LineChartIcon className="w-6 h-6 text-orange-400 mt-1"/>
          <div>
            <div className="text-md text-gray-400 uppercase font-semibold">Средний Anomaly Score</div>
            <div className="text-4xl font-light text-white">{data?.scoreAvg || 0}</div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div 
                    className="bg-orange-500 h-1.5 rounded-full" 
                    style={{ width: `${(data?.scoreAvg || 0) * 100 / 100}%` }}
                ></div>
            </div>
          </div>
        </DarkCard>

        <DarkCard className="p-4 flex items-start space-x-3">
          <Globe className="w-6 h-6 text-blue-400 mt-1"/>
          <div>
            <div className="text-md text-gray-400 uppercase font-semibold">Уникальные IP</div>
            <div className="text-4xl font-light text-white">{data?.uniqueIPs || 0}</div>
            <div className="text-sm text-blue-400 font-medium">{data?.suspiciousIPs || 0} подозрительных</div>
          </div>
        </DarkCard>

        <DarkCard className="p-4 flex items-start space-x-3">
          <Shield className="w-6 h-6 text-green-500 mt-1"/>
          <div>
            <div className="text-md text-gray-400 uppercase font-semibold">Заблокировано атак</div>
            <div className="text-4xl font-light text-white">{data?.blocked || 0}</div>
            <div className="text-sm text-green-400 font-medium">Автоматически</div>
          </div>
        </DarkCard>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <DarkCard title="Anomaly Score по времени" className="col-span-6 h-80">
          {data?.lineData && (
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data.lineData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#4B5563" strokeDasharray="3 3"/>
                <XAxis dataKey="t" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff', borderRadius: '4px' }}
                    formatter={(value, name) => [value, 'Score']}
                />
                <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FBBF24" 
                    strokeWidth={3}
                    dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DarkCard>

        <DarkCard title="Распределение по Score" className="col-span-6 h-80">
          {data?.scoreDist && (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data.scoreDist} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#4B5563" strokeDasharray="3 3"/>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff', borderRadius: '4px' }}
                    formatter={(value, name) => [value, 'Count']}
                />
                <Bar dataKey="count">
                    {data.scoreDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </DarkCard>
      </div>

      <DarkCard title="Типы аномалий" className="w-full h-80">
        {data?.typeDist && (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart layout="vertical" data={data.typeDist} margin={{ top: 10, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid stroke="#4B5563" strokeDasharray="3 3"/>
              <XAxis type="number" stroke="#9CA3AF"/>
              <YAxis dataKey="type" type="category" stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff', borderRadius: '4px' }}
                formatter={(value, name) => [value, 'Count']}
              />
              <Bar dataKey="count" barSize={20}>
                  {data.typeDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </DarkCard>

      
      <div className="grid grid-cols-12 gap-4">
        <DarkCard title="Обнаруженные аномалии" className="col-span-8">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm border-separate border-spacing-y-1">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0 shadow-md z-10">
                <tr>
                  <th className="py-2 px-3 text-left">Timestamp</th>
                  <th className="py-2 px-3 text-left">Host</th>
                  <th className="py-2 px-3 text-left">Event type</th>
                  <th className="py-2 px-3 text-left">Score</th>
                  <th className="py-2 px-3 text-left">Severity</th>
                  <th className="py-2 px-3 text-left">Описание</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((r,i) => (
                  <tr key={i} className="hover:bg-gray-700 transition-colors duration-150 bg-gray-800 border-b border-gray-700">
                    <td className="text-xs py-2 px-3 text-gray-400">
                        {new Date(r.timestamp).toLocaleDateString()}
                        <br/>
                        {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="text-sm py-2 px-3 text-cyan-400">{r.host}</td>
                    <td className="text-sm py-2 px-3 text-gray-300">{r.event_type}</td>
                    <td className="text-sm py-2 px-3 font-bold">{r.score}</td>
                    <td className="text-sm py-2 px-3"><SeverityLabel type={r.severity} /></td>
                    <td className="text-xs py-2 px-3 truncate max-w-sm text-gray-300">{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DarkCard>

        <DarkCard title="Рекомендации" className="col-span-4 h-full relative p-0 overflow-hidden">
            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                {recommendationsData.map((rec, i) => (
                    <RecommendationItem key={i} rec={rec} />
                ))}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-800 border-t border-gray-700">
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg w-full text-sm font-semibold transition-colors">
                    Посмотреть все рекомендации
                </button>
            </div>
        </DarkCard>
      </div>

    </div>
  );
}