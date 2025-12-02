import React, { useEffect, useState, useCallback } from 'react';
import fetchJson from '../utils/fetchJson';
import { CSVLink } from 'react-csv';
import { 
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';


const SeverityLabel = ({ type }) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider';
  let colorClasses = '';

  switch (type.toUpperCase()) {
    case 'CRITICAL':
      colorClasses = 'bg-red-800 text-red-300 border border-red-700';
      break;
    case 'ERROR':
      colorClasses = 'bg-red-700 text-red-300 border border-red-600';
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

export default function LogsPage() {
  const [filters, setFilters] = useState({
    keyword: '',
    from: '',
    to: '',
    source: '',
    host: '',
    levels: { INFO: true, WARN: true, ERROR: true, CRITICAL: true }
  });

  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetails, setShowDetails] = useState(true); 

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.keyword) query.append('keyword', filters.keyword);
      if (showDatePicker && filters.from) query.append('from', filters.from);
      if (showDatePicker && filters.to) query.append('to', filters.to);
      if (filters.source) query.append('source', filters.source);
      if (filters.host) query.append('host', filters.host);
      const activeLevels = Object.keys(filters.levels).filter(l => filters.levels[l]);
      if (activeLevels.length > 0 && activeLevels.length < 4) {
          query.append('levels', activeLevels.join(','));
      }
      

      const json = await fetchJson(`http://localhost:3213/logs/filter?${query.toString()}`);
      setLogs(json);
      setSelectedLog(prev => json.find(l => l.id === prev?.id) || json[0] || null);

      const uniqueSources = [...new Set(json.map(l => l.source).filter(Boolean))];
      const uniqueHosts = [...new Set(json.map(l => l.host).filter(Boolean))];
      setSources(uniqueSources);
      setHosts(uniqueHosts);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, showDatePicker]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleLevelChange = (level) => {
    setFilters(f => ({
        ...f,
        levels: { ...f.levels, [level]: !f.levels[level] }
    }));
  };

  const handleSelectChange = (e, filterName) => {
    setFilters(f => ({ ...f, [filterName]: e.target.value }));
  };

  const FiltersPanel = (
    <div className="col-span-3 bg-gray-800 text-gray-300 p-0 rounded-l shadow-xl border-r border-gray-700 space-y-5">
      <h2 className="text-white text-md font-semibold px-4 pt-4 flex items-center">
        <FunnelIcon className="w-5 h-5 mr-2 text-cyan-500" />
        ФИЛЬТРЫ
      </h2>
      
      <div className="px-4 space-y-5">
        <div className="space-y-1">
          <label className="text-xs uppercase font-medium">Поиск по ключевым словам</label>
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              value={filters.keyword} 
              onChange={e => setFilters(f => ({...f, keyword: e.target.value}))} 
              onKeyDown={(e) => { if (e.key === 'Enter') loadLogs(); }}
              placeholder="Поиск..."
              className="bg-gray-700 border border-gray-600 w-full pl-10 pr-3 py-2 rounded-lg text-sm placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-medium">Дата/время</label>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${showDatePicker ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Выбрать период
          </button>
          
          {showDatePicker && (
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <input 
                type="datetime-local" 
                value={filters.from} 
                onChange={e => setFilters(f => ({...f, from: e.target.value}))} 
                className="bg-gray-700 border border-gray-600 w-full px-3 py-2 rounded-lg text-sm text-gray-300"
              />
              <input 
                type="datetime-local" 
                value={filters.to} 
                onChange={e => setFilters(f => ({...f, to: e.target.value}))} 
                className="bg-gray-700 border border-gray-600 w-full px-3 py-2 rounded-lg text-sm text-gray-300"
              />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase font-medium">Источник логов</label>
          <select 
            value={filters.source} 
            onChange={e => handleSelectChange(e, 'source')} 
            className="bg-gray-700 border border-gray-600 w-full px-3 py-2 rounded-lg text-sm text-gray-300 appearance-none custom-select"
          >
            <option value="">Все источники</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase font-medium">Host</label>
          <select 
            value={filters.host} 
            onChange={e => handleSelectChange(e, 'host')} 
            className="bg-gray-700 border border-gray-600 w-full px-3 py-2 rounded-lg text-sm text-gray-300 appearance-none custom-select"
          >
            <option value="">Все хосты</option>
            {hosts.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div className="space-y-2 pb-5">
          <label className="text-xs uppercase font-medium">Уровень логов</label>
          <div className="flex flex-col space-y-1 mt-1">
            {Object.keys(filters.levels).map(l => (
              <label 
                key={l} 
                className="flex items-center gap-3 text-sm cursor-pointer hover:text-white transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={filters.levels[l]} 
                  onChange={() => handleLevelChange(l)}
                  className="form-checkbox h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded"
                />
                <span className={`font-semibold ${
                    l === 'CRITICAL' ? 'text-red-400' : 
                    l === 'ERROR' ? 'text-red-300' : 
                    l === 'WARN' ? 'text-yellow-400' : 
                    'text-blue-400'
                }`}>{l}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );


  const LogTablePanel = (
    <div className={`col-span-${showDetails ? '6' : '9'} bg-gray-800 text-gray-300 p-4 rounded-lg shadow-xl flex flex-col space-y-3`}>
      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">Логи событий ({logs.length})</h2>
        <CSVLink 
          data={logs} 
          filename={"logs.csv"} 
          className="bg-gray-700 hover:bg-gray-600 text-cyan-400 px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Экспорт
        </CSVLink>
      </div>

      <div className="overflow-auto max-h-[85vh] custom-scrollbar">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0 shadow-md z-10">
            <tr>
              <th className="py-2 px-3 text-left rounded-l-md">ID</th>
              <th className="py-2 px-3 text-left">Timestamp</th>
              <th className="py-2 px-3 text-left">Host</th>
              <th className="py-2 px-3 text-left">Source</th>
              <th className="py-2 px-3 text-left">Severity</th>
              <th className="py-2 px-3 text-left rounded-r-md">Message</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="text-center py-4 text-cyan-400">Загрузка...</td></tr>
            ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Нет логов, соответствующих фильтрам.</td></tr>
            ) : (
                logs.map((log,i) => (
                    <tr 
                        key={log.id || i} 
                        className={`cursor-pointer hover:bg-gray-700 transition-colors duration-150 ${selectedLog?.id === log.id ? 'bg-gray-700 border-l-4 border-cyan-500' : 'bg-gray-800'}`} 
                        onClick={() => { setSelectedLog(log); setShowDetails(true); }}
                    >
                        <td className="p-3 text-xs">{log.id || i+1}</td>
                        <td className="p-3 text-xs">{new Date(log.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false})}</td>
                        <td className="p-3 text-sm text-cyan-400">{log.host}</td>
                        <td className="p-3 text-xs">{log.source}</td>
                        <td className="p-3"><SeverityLabel type={log.severity} /></td>
                        <td className="p-3 text-xs truncate max-w-sm">{log.message}</td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DetailsPanel = (
    <div 
        className={`fixed top-0 right-0 h-full bg-gray-800 text-gray-300 p-4 shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto w-1/4 ${showDetails ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center pb-3 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">Подробности события</h2>
        <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {selectedLog ? (
        <div className="text-sm space-y-4 pt-4">
          <div className="space-y-1">
            <h3 className="text-sm uppercase font-semibold text-gray-400">Общая информация</h3>
            <p><span className="font-medium text-white">Timestamp:</span> {new Date(selectedLog.timestamp).toLocaleString()}</p>
            <p><span className="font-medium text-white">Host:</span> {selectedLog.host}</p>
            <p><span className="font-medium text-white">Source:</span> {selectedLog.source}</p>
            <p><span className="font-medium text-white">Severity:</span> <SeverityLabel type={selectedLog.severity} /></p>
            <p><span className="font-medium text-white">Event Type:</span> {selectedLog.event_type || 'N/A'}</p>
          </div>

          <div className="space-y-1 pt-3 border-t border-gray-700">
            <h3 className="text-sm uppercase font-semibold text-gray-400">Сообщение (Полное)</h3>
            <p className="whitespace-pre-wrap bg-gray-900 p-2 rounded text-xs text-gray-200">{selectedLog.message}</p>
          </div>
          
          <div className="space-y-1 pt-3 border-t border-gray-700">
            <h3 className="text-sm uppercase font-semibold text-gray-400">JSON RAW</h3>
            <div className="text-xs bg-gray-900 p-2 rounded overflow-x-auto font-mono text-gray-400">
              <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500 pt-4">Выберите лог для просмотра подробностей.</div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white flex">
      {FiltersPanel}
      <div className="flex-grow p-4">
        {LogTablePanel}
      </div>
      {showDetails && DetailsPanel}
      {!showDetails && (
        <button 
          onClick={() => setShowDetails(true)} 
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg z-50"
          title="Открыть подробности"
        >
          <FunnelIcon className="w-6 h-6 rotate-90" />
        </button>
      )}
    </div>
  );
}