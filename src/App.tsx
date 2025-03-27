import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Компоненты
import Header from './components/Layout/Header';
import BoardList from './components/Board/BoardList';
import BoardDetail from './pages/BoardDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { ManageProvider } from './providers/manage-provider';
import HeaderPublic from './components/Layout/HeaderPublic';

// Создаем тему для Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Функция проверки авторизации
const isUserAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  console.log(token)
  if (token === undefined || token === null) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    return false;
  }
  return true;
};

export const App: React.FC = () => {
  const isAuthenticated = isUserAuthenticated();
  console.log(isAuthenticated)

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isAuthenticated ? (
          <ManageProvider>
            <Header />
            <Routes>
              <Route path="/boards" element={<BoardList />} />
              <Route path="*" element={<Navigate to="/boards" replace />} />
              <Route path="/profile" element={<Profile/>} />
            </Routes>
          </ManageProvider>
        ) : (
          <>
          <HeaderPublic />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '90vh',
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Box>
          </>
        )}

      </ThemeProvider>
    </Router>
  );
}; 