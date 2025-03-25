import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Компоненты
import Header from './components/Layout/Header';
import BoardList from './components/Board/BoardList';
import BoardDetail from './pages/BoardDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { ManageProvider } from './providers/manage-provider';

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
const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // Если чего-то не хватает, очищаем всё
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    return false;
  }
  
  try {
    // Проверяем, что user - валидный JSON
    JSON.parse(user);
    return true;
  } catch {
    // Если user невалидный, очищаем всё
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    return false;
  }
};

export const App: React.FC = () => {
  const isAuthenticated = isUserAuthenticated();
  console.log('Текущий статус аутентификации:', isAuthenticated);
  console.log('isAdmin в localStorage:', localStorage.getItem('isAdmin'));

  return (
    <ThemeProvider theme={theme}>
      <ManageProvider>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          {/* Публичные маршруты */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/boards" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/boards" replace /> : <Register />} 
          />

          {/* Защищенные маршруты */}
          <Route 
            path="/boards" 
            element={isAuthenticated ? <BoardList /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/boards/:boardId" 
            element={isAuthenticated ? <BoardDetail /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} 
          />

          {/* Редирект с корневого маршрута */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/boards" : "/login"} replace />} 
          />

          {/* Обработка несуществующих маршрутов */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/boards" : "/login"} replace />} 
          />
        </Routes>
      </Router>
      </ManageProvider>
    </ThemeProvider>
  );
}; 