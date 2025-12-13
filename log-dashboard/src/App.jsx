import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LogsPage from './pages/LogsPage';
import AnomaliesPage from './pages/AnomaliesPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPanelPage from './pages/AdminPanelPage';

export default function App() {
  const [user, setUser] = useState(null); 

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/anomalies" element={<AnomaliesPage />} />
            <Route path='/admin' element={<AdminPanelPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
