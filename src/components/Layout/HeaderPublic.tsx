import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const HeaderPublic: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Project Management System
                </Typography>
                <>
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/register')}>
                        Регистрация
                    </Button>
                </>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderPublic; 