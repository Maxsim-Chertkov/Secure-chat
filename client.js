const WebSocket = require('ws');
const crypto = require('crypto');
const args = require('minimist')(process.argv.slice(2));

// Проверка аргументов командной строки
const name = args.name || "User";
const sessionId = args.sessionId;
const key = args.key;

if (!sessionId || !key) {
    console.error("Ошибка: Укажите sessionId и key через аргументы командной строки.");
    process.exit(1);
}

console.log(`Привет, ${name}! Вы подключаетесь к сессии ${sessionId}`);

// Создание WebSocket подключения
const ws = new WebSocket(`ws://localhost:8080/chat?sessionId=${sessionId}`);

// Функции шифрования и расшифровки
function encryptMessage(message, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decryptMessage(encryptedMessage, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Обработка событий WebSocket
ws.on('open', () => {
    console.log('Подключение установлено. Вы можете отправлять сообщения.');
    sendMessage(); // Функция для отправки сообщений
});

ws.on('message', (data) => {
    try {
        const decryptedMessage = decryptMessage(data, key);
        console.log(`Получено сообщение: ${decryptedMessage}`);
    } catch (error) {
        console.error('Ошибка при расшифровке сообщения:', error.message);
    }
});

ws.on('close', () => {
    console.log('Соединение закрыто.');
});

ws.on('error', (error) => {
    console.error('Ошибка соединения:', error.message);
});

// Функция для отправки сообщений
function sendMessage() {
    const stdin = process.openStdin();
    stdin.addListener('data', (input) => {
        const message = input.toString().trim();
        if (message.toLowerCase() === 'exit') {
            ws.close();
            process.exit(0);
        } else {
            const encryptedMessage = encryptMessage(message, key);
            ws.send(encryptedMessage);
            console.log(`Отправлено сообщение: ${message} (зашифровано: ${encryptedMessage})`);
        }
    });
}
