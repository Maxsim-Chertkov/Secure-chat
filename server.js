const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Указываем папку, которая будет использоваться для раздачи статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера на порту 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
