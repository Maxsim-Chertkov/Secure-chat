const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const port = 3000;

// Указываем папку для раздачи статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Запускаем HTTP сервер
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Создаём WebSocket сервер
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Новое WebSocket подключение.');

    // Обработка входящих сообщений
    ws.on('message', (message) => {
        console.log('Получено сообщение:', message);

        // Рассылка сообщения всем подключённым клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    // Обработка отключения
    ws.on('close', () => {
        console.log('Клиент отключился.');
    });
});
