import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from '@mui/material';
import { api } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Поле ${name} изменено на:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Форма отправлена');
    
    // Базовая валидация
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Начинаем процесс входа...');
      console.log('Данные формы:', formData);
      
      const loginData = {
        client_email: formData.email,
        client_password: formData.password
      };
      console.log('Подготовленные данные для отправки:', loginData);
      
      console.log('Отправляем запрос на сервер...');
      const response = await api.post('/clients/login', loginData);
      console.log('Получен ответ от сервера:', response.data);

      console.log('Сохраняем данные в localStorage...');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAdmin', response.data.user.client_admin ? 'true' : 'false');
      
      console.log('Данные успешно сохранены, переходим на доски...');
      
      // Принудительно обновляем страницу и перенаправляем
      window.location.href = '/boards';
    } catch (error: any) {
      console.error('Подробности ошибки:', {
        error,
        response: error.response,
        message: error.message,
        stack: error.stack
      });
      
      setError(
        error.response?.data?.message || 
        error.message || 
        'Ошибка при входе в систему'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  
  return (
    <Container component="main" maxWidth="xs">
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Вход в систему
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/register" variant="body2">
                {"Нет аккаунта? Зарегистрируйтесь"}
              </Link>
            </Box>
          </form>
        </Paper>
    </Container>
  );
};

export default Login; 