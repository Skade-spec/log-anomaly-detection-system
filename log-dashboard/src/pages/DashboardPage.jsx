import { useEffect, useState } from 'react';
import fetchJson from '../utils/fetchJson';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import {
  ServerStackIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const DarkCard = ({ title, icon, className = '', children, titleClass = '' }) => (
  <div
    className={`bg-gray-800 text-white rounded-lg shadow-lg p-4 border border-gray-700 ${className}`}
  >
    <div className={`flex justify-between items-start mb-3 ${titleClass}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      {icon}
    </div>
    {children}
  </div>
);

const SeverityLabel = ({ type }) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider';
  let colorClasses = '';

  switch (type.toUpperCase()) {
    case 'CRITICAL':
      colorClasses = 'bg-red-900 text-red-400 border border-red-700';
      break;
    case 'ERROR':
      colorClasses = 'bg-red-800 text-red-300 border border-red-600';
      break;
    case 'WARNING':
    case 'WARN': 
      colorClasses = 'bg-yellow-800 text-yellow-300 border border-yellow-600';
      break;
    case 'INFO':
    default:
      colorClasses = 'bg-blue-800 text-blue-300 border border-blue-600';
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{type}</span>;
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const json = await fetchJson('http://localhost:3213/logs/dashboard');
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const computeChange = (today, yesterday) => {
    const todayNum = Number(today) || 0;
    const yesterdayNum = Number(yesterday) || 0;

    if (yesterdayNum === 0) {
        if (todayNum > 0) return '+100%';
        return '0%';
    }
    const diff = todayNum - yesterdayNum;
    return `${diff > 0 ? '+' : ''}${((diff / yesterdayNum) * 100).toFixed(1)}%`;
  };

  const logs24h = data?.logs_24h;
  const anomalies = data?.anomalies;
  const sources = data?.sources;
  const activity = data?.activity;
  const lastLogs = data?.last_logs;
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      
      <div className="grid grid-cols-12 gap-4">
        
        <DarkCard title="Логи за последние 24 часа" titleClass="text-green-500" className="col-span-3">
          <div className="text-4xl font-light text-blue-400 mt-2">
            {logs24h?.count || 0}
          </div>
          <div className={`text-sm font-semibold mt-1 flex items-center ${logs24h && logs24h.count > logs24h.yesterday ? 'text-green-400' : 'text-gray-400'}`}>
            <span className="mr-1">
                {computeChange(logs24h?.count, logs24h?.yesterday)}
            </span>
            <span className="text-gray-400 font-normal"> vs вчера</span>
          </div>
          <div className="mt-4 h-16">
            {logs24h?.chart && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={logs24h.chart}> 
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#34D399" 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </DarkCard>

        <DarkCard 
          title="Обнаруженные аномалии" 
          icon={<ExclamationTriangleIcon className="w-6 h-6 text-yellow-500"/>}
          className="col-span-3"
        >
          <div className="text-5xl font-light text-yellow-400">{anomalies?.total || 0}</div>
          <ul className="text-sm mt-3 space-y-1 font-mono">
            {anomalies?.byType && Object.entries(anomalies.byType).map(([type, count]) => (
              <li key={type} className="flex justify-between items-center text-gray-300">
                <span className="uppercase text-xs">{type}</span> 
                <span className={`font-bold ${type === 'CRITICAL' ? 'text-red-500' : type === 'ERROR' ? 'text-red-400' : 'text-yellow-400'}`}>{count}</span>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard 
          title="Активные источники логов" 
          icon={<ServerStackIcon className="w-6 h-6 text-green-500"/>}
          className="col-span-3"
        >
          <div className="text-5xl font-light text-green-400">{sources?.total || 0}</div>
          <ul className="text-sm mt-3 space-y-1">
            <li className="flex justify-between items-center text-gray-300">
              <span className="flex items-center"><span className="h-2 w-2 mr-2 rounded-full bg-green-500"></span>Active:</span> 
              <span className="font-bold">{sources?.active || 0}</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span className="flex items-center"><span className="h-2 w-2 mr-2 rounded-full bg-yellow-500"></span>Warning:</span> 
              <span className="font-bold">{sources?.warning || 0}</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span className="flex items-center"><span className="h-2 w-2 mr-2 rounded-full bg-gray-500"></span>Offline:</span> 
              <span className="font-bold">{sources?.offline || 0}</span>
            </li>
          </ul>
        </DarkCard>
      </div>

      ---

      <DarkCard title="Активность логов по времени" className="w-full h-96">
        {activity?.length && (
            <ResponsiveContainer width="100%" height="95%">
              <LineChart data={activity} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#4B5563" strokeDasharray="3 3"/> 
                <XAxis dataKey="time" stroke="#9CA3AF" interval={activity.length > 20 ? 10 : 0} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff', borderRadius: '4px' }}
                  labelStyle={{ color: '#E5E7EB' }}
                  formatter={(value, name, props) => [`Logs: ${value}`, props.payload.time]}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#60A5FA" 
                  strokeWidth={3} 
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
        )}
      </DarkCard>

      ---

      <DarkCard title="Последние события" className="w-full mt-6">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 pr-4">Timestamp</th>
              <th className="py-2 pr-4">Host</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Event type</th>
              <th className="py-2 pr-4">Severity</th>
              <th className="py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {lastLogs?.map((log, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-gray-700 transition-colors">
                <td className="text-xs py-2 pr-4 text-gray-400">
                    {new Date(log.timestamp).toLocaleDateString()}
                    <br/>
                    {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="text-sm py-2 pr-4 text-blue-400 font-medium">{log.host}</td>
                <td className="text-xs py-2 pr-4 text-gray-300">{log.source}</td>
                <td className="text-xs py-2 pr-4 text-gray-300">{log.event_type}</td> 
                <td className="text-sm py-2 pr-4">
                    <SeverityLabel type={log.severity} />
                </td>
                <td className="text-xs py-2 text-gray-300">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DarkCard>
    </div>
  );
}