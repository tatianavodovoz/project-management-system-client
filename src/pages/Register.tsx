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
  FormControlLabel,
  Switch
} from '@mui/material';
import { api } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const { confirmPassword, isAdmin, ...data } = formData;
      const registerData = {
        client_email: data.email,
        client_password: data.password,
        client_name: data.name,
        client_role: isAdmin ? 'admin' : 'user'
      };

      const response = await api.post('/clients', registerData);
      console.log('Данные для регистрации:', registerData);
      console.log('Ответ сервера:', response.data);
      
      const userData = {
        client_id: response.data.client_id,
        client_email: response.data.client_email,
        client_name: response.data.client_name,
        client_admin: response.data.client_admin, 
        client_token: response.data.client_token,
        //client_role: response.data.client_role 
      };
      
      console.log('Сохраняем в localStorage данные:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', JSON.stringify(response.data.client_admin));
      
      
      navigate('/boards');
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error.response || error);
      
      if (error.response) {
        if (error.response.data.detail?.includes('client_client_email_key')) {
          setError('Пользователь с таким email уже существует');
        } else {
          setError(error.response.data.message || 'Ошибка при регистрации. Попробуйте позже.');
        }
      } else if (error.request) {
        setError('Сервер недоступен. Проверьте подключение к интернету.');
      } else {
        setError('Ошибка при отправке данных. Попробуйте позже.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Регистрация
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Имя"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  name="isAdmin"
                  color="primary"
                />
              }
              label="Зарегистрироваться как администратор"
              sx={{ mt: 2 }}
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
            >
              Зарегистрироваться
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                {"Уже есть аккаунт? Войдите"}
              </Link>
            </Box>
          </form>
        </Paper>
    </Container>
  );
};

export default Register; 