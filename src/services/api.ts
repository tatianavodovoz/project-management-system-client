import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
    (config) => {
        console.log('Отправляем запрос:', {
            url: config.url,
            method: config.method,
            data: config.data
        });

        const token = localStorage.getItem('token');
        if (token) {
            console.log(token);
            config.data = {
                ...config.data,
                token: token // Добавляем токен в тело запроса
            };

        }
        return config;
    },
    (error) => {
        console.error('Ошибка при подготовке запроса:', error);
        return Promise.reject(error);
    }
);

// Обработка ошибок
api.interceptors.response.use(
    (response) => {
        console.log('Получен ответ:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Ошибка при выполнении запроса:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (!error.response) {
            return Promise.reject(new Error('Сервер недоступен. Проверьте подключение к интернету.'));
        }

        if (error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);