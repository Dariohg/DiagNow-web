import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    // Para el token de demostración, simplemente verificamos si comienza con 'demo_token'
                    if (savedToken.startsWith('demo_token')) {
                        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                        setCurrentUser(savedUser);
                        setToken(savedToken);
                        setIsAuthenticated(true);
                    } else {
                        // Para tokens JWT reales
                        const decoded = jwt_decode.jwtDecode(savedToken);
                        const currentTime = Date.now() / 1000;

                        if (decoded.exp && decoded.exp < currentTime) {
                            logout();
                        } else {
                            setCurrentUser({
                                id: decoded.id,
                                email: decoded.email,
                                name: decoded.name,
                                lastName: decoded.lastName,
                            });
                            setToken(savedToken);
                            setIsAuthenticated(true);
                        }
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem('diagnow_token', authToken);
        localStorage.setItem('diagnow_user', JSON.stringify(userData));
        setToken(authToken);
        setCurrentUser(userData);
        setIsAuthenticated(true);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        currentUser,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;