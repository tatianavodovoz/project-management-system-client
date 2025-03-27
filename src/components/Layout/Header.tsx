import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useManage } from '../../providers/manage-provider';


const Header: React.FC = () => {
    const navigate = useNavigate();
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const { isAdmin, setIsAdmin } = useManage();

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
        <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #2196F3, #21CBF3)', boxShadow: 3 }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Project Management System
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2, fontSize: 16, fontWeight: 500 }}>
                        {isAdmin ? 'Админ' : 'Пользователь'}
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/profile')} sx={{ mr: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }}>
                        Профиль
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/boards')} sx={{ mr: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }}>
                        Доски
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 