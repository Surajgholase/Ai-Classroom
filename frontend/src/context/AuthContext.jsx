import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('token/', { username, password });
        const { access } = response.data;
        localStorage.setItem('token', access);
        const decoded = jwtDecode(access);
        setUser(decoded);
        return decoded;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
