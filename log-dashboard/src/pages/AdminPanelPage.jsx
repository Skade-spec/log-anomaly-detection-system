import { useEffect, useState } from 'react';
import fetchJson from '../utils/fetchJson';
import {
  UserPlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const DarkCard = ({ title, icon, children }) => (
  <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 border border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      {icon}
    </div>
    {children}
  </div>
);

const RoleBadge = ({ role }) => {
  const base = 'px-2 py-0.5 rounded text-xs font-semibold uppercase border';
  const styles = {
    admin: 'bg-red-900 text-red-400 border-red-700',
    security: 'bg-blue-900 text-blue-400 border-blue-700',
    user: 'bg-gray-700 text-gray-300 border-gray-600',
  };
  return <span className={`${base} ${styles[role] || styles.user}`}>{role}</span>;
};

export default function AdminPanelPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchJson('http://localhost:3213/admin/users');
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    await fetchJson('http://localhost:3213/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
    setNewUser({ username: '', password: '', role: 'user' });
    loadUsers();
  };

  const changeRole = async (id, role) => {
    await fetchJson(`http://localhost:3213/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm('Удалить пользователя?')) return;
    await fetchJson(`http://localhost:3213/admin/users/${id}`, {
      method: 'DELETE',
    });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      <DarkCard
        title="Создание пользователя"
        icon={<UserPlusIcon className="w-5 h-5 text-cyan-400" />}
      >
        <div className="grid grid-cols-4 gap-3">
          <input
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            placeholder="username"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="password"
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            placeholder="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">user</option>
            <option value="security">security</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={createUser}
            className="bg-cyan-600 hover:bg-cyan-700 rounded text-sm font-semibold"
          >
            Создать
          </button>
        </div>
      </DarkCard>

      <DarkCard
        title="Пользователи системы"
        icon={<ShieldCheckIcon className="w-5 h-5 text-green-400" />}
      >
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 text-left">Username</th>
              <th className="py-2">Role</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t border-gray-800 hover:bg-gray-700"
              >
                <td className="py-2 text-blue-400 font-medium flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  {u.username}
                </td>
                <td className="py-2 text-center">
                  <RoleBadge role={u.role} />
                </td>
                <td className="py-2 flex justify-center gap-2">
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                  >
                    <option value="user">user</option>
                    <option value="security">security</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users.length && !loading && (
          <div className="text-center text-gray-500 text-sm py-4">
            Пользователей нет
          </div>
        )}
      </DarkCard>
    </div>
  );
}
