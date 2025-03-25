import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useManage } from '../../providers/manage-provider';


// Функция проверки авторизации (такая же, как в App.tsx)
const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
  
  try {
    JSON.parse(user);
    return true;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = isUserAuthenticated();
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const { isAdmin, setIsAdmin } = useManage();

    const handleLogout = () => {
        // Удаляем все данные аутентификации
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Принудительно обновляем страницу и перенаправляем на логин
        window.location.href = '/login';
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            setIsAdmin(true);
        }
    }, []);

    console.log('User data from localStorage:', userData);
    console.log('Is user authenticated:', !!user);
    console.log('IsAdmin state:', isAdmin);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Project Management System
                </Typography>
                {isAuthenticated && user ? (
                    <>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {isAdmin ? 'Админ' : 'Пользователь'}
                        </Typography>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {user.client_name || 'Пользователь'}
                        </Typography>
                        <Button color="inherit" onClick={() => navigate('/boards')}>
                            Доски
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header; 