import { useState } from 'react';
import { UserIcon, LockClosedIcon, ArrowRightOnRectangleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!username || !password) {
            setErr('Имя пользователя и пароль обязательны.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3213/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Неверные данные');
            }

            onLogin?.(data);

        } catch (error) {
            setErr(error.message || 'Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
        <div className="flex justify-center mb-6">
            <ArrowRightOnRectangleIcon className="w-12 h-12 text-cyan-500" />
        </div>
        <h2 className="text-2xl font-light mb-6 text-center text-white">Вход в Log Dashboard</h2>
        
        {err && (
            <div className="bg-red-900/40 text-red-300 p-3 rounded-lg mb-4 text-sm flex items-center border border-red-700">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                {err}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Имя пользователя</label>
            <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Введите username"
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 pl-10 pr-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-400">Пароль</label>
            <div className="relative">
                <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Введите Пароль"
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 pl-10 pr-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-colors duration-200 flex justify-center items-center ${
              loading 
                ? 'bg-cyan-700 text-cyan-300 cursor-not-allowed' 
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Проверка...
                </>
            ) : (
                'Войти'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-400 hover:text-cyan-500 transition-colors">Забыли пароль?</a>
        </div>
      </div>
    </div>
  );
}
