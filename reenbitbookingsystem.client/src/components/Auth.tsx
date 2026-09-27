import { useState } from 'react';
import { loginUser, registerUser } from '../dal/services';

export default function Auth({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;


        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser({ email, password });
                localStorage.setItem('token', data.accessToken);
                onLogin();
            } else {
                await registerUser({ email, password });
                setSuccessMessage('Успішна реєстрація! Тепер увійдіть.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err: any) {
            setError('Помилка ' + (isLogin ? 'входу' : 'реєстрації') + '. Перевірте дані.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isLogin ? 'Вхід у систему' : 'Реєстрація'}
            </h2>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Обробка...</span>
                    ) : (
                        isLogin ? 'Увійти' : 'Зареєструватися'
                    )}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccessMessage('');
                    }}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition"
                >
                    {isLogin ? 'Немає акаунту? Зареєструватися' : 'Вже є акаунт? Увійти'}
                </button>
            </div>
        </div>
    );
}