/**
 * Страница профиля пользователя.
 * Позволяет просматривать и редактировать информацию о пользователе:
 * имя, email и отображает роль пользователя (только для чтения).
 */
import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { Client } from '../types';
import { api } from '../services/api';
import { useManage } from '../providers/manage-provider';

const Profile: React.FC = () => {
    // Состояния компонента
    const [profile, setProfile] = useState<Client | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? (JSON.parse(storedUser) as Client) : null;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Client>>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const {isAdmin} = useManage();

    /**
     * Обработчик изменения полей формы
     * @param e - событие изменения поля
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Обработчик отправки формы
     * @param e - событие отправки формы
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const id = profile?.client_id
            await api.put(`/clients/${id}`, formData);
            setProfile(formData as Client);
            setIsEditing(false);
            setMessage({ text: 'Профиль успешно обновлен', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ text: 'Ошибка при обновлении профиля', type: 'error' });
        }
    };

    // Отображение загрузки при отсутствии данных
    if (!profile) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography>Загрузка...</Typography>
            </Container>
        );
    }

    const handleLogout = () => {
        // Удаляем все данные аутентификации
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };


    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                {/* Заголовок и кнопка редактирования */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">
                        Профиль пользователя
                    </Typography>
                    {!isEditing && (
                        <Button
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать
                        </Button>
                    )}
                </Box>

                {/* Форма профиля */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Поле имени */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Имя"
                                name="client_name"
                                value={isEditing ? formData.client_name : profile.client_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        {/* Поле email */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="client_email"
                                type="email"
                                value={isEditing ? formData.client_email : profile.client_email}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        {/* Поле роли (только для чтения) */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Роль"
                                value={isAdmin ? "Админ" : "Пользователь"}
                                disabled
                            />
                        </Grid>
                        {/* Кнопки действий при редактировании */}
                        {isEditing && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(profile);
                                        }}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Сохранить
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }}>
                    Выйти
                </Button>
            </Box>

            {/* Уведомления */}
            <Snackbar
                open={!!message}
                autoHideDuration={6000}
                onClose={() => setMessage(null)}
            >
                <Alert
                    onClose={() => setMessage(null)}
                    severity={message?.type}
                    sx={{ width: '100%' }}
                >
                    {message?.text}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile; 