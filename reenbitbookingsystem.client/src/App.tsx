import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsAuthenticated(true);
    }, []);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <div className="min-h-screen py-8 px-4">
            {isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;