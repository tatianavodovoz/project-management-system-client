import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        return <Navigate to="/login" />;
    }

    // Если пользователь авторизован, показываем защищенный контент
    return <>{children}</>;
};

export default PrivateRoute; 