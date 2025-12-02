import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

const SidebarItem = ({ to, icon, label, badgeCount }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = 'flex items-center p-3 rounded-lg transition-colors duration-200';
  const activeClasses = 'bg-cyan-500 text-gray-900 font-semibold shadow-md'; 
  const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';
  
  return (
    <Link to={to} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      
      <span className="ml-3 flex-grow">{label}</span>
      
      {badgeCount > 0 && (
        <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
          {badgeCount}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar() {
    const anomalyCount = 40; 
    
    return (
      <aside className="bg-gray-900 text-white w-56 min-h-screen pt-4 flex flex-col border-r border-gray-800">

        <nav className="flex flex-col gap-1 p-2">
          
          <SidebarItem 
            to="/" 
            icon={<ChartBarIcon className="w-5 h-5" />} 
            label="Dashboard" 
          />
          
          <SidebarItem 
            to="/logs" 
            icon={<DocumentTextIcon className="w-5 h-5" />} 
            label="Логи" 
          />
          
          <SidebarItem 
            to="/anomalies" 
            icon={<ExclamationTriangleIcon className="w-5 h-5" />} 
            label="Аномалии" 
            badgeCount={anomalyCount}
          />
          
        </nav>
      </aside>
    );
}