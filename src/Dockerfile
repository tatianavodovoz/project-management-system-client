# Используем официальный образ Node.js в качестве базового
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения
COPY . .

# Собираем приложение
RUN npm run build

# Используем Nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY . .

# Открываем порт 
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]