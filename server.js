/**
 * NX-LIB | СЕРВЕРНАЯ ЧАСТЬ (Backend)
 * Исправленная и дополненная версия для папки 'public'
 */

// 1. ИМПОРТ БИБЛИОТЕК
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <-- ДОБАВИЛ: нужно для правильных путей к папкам

const app = express();
const PORT = 3000; // <-- ИЗМЕНИЛ: Давай использовать 3000, это стандарт

// 2. НАСТРОЙКА
app.use(cors());
app.use(express.json());

// --- ВАЖНОЕ ИСПРАВЛЕНИЕ ---
// Говорим серверу: "Ищи все файлы сайта (html, css, js) в папке public"
app.use(express.static(path.join(__dirname, 'public')));

// 3. ПОДКЛЮЧЕНИЕ К MONGODB
const mongoURI = 'mongodb://localhost:27017/nx-lib';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Успешное подключение к MongoDB'))
    .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// 4. СХЕМА (ТЕПЕРЬ ЭТО КНИГИ)
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, default: 'Неизвестный автор' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', BookSchema);

// 5. МАРШРУТЫ API

// Получить все книги
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка', error: error.message });
    }
});

// Добавить книгу
app.post('/api/books', async (req, res) => {
    try {
        // Ждем от сайта: title, author, price, imageUrl
        const { title, author, price, imageUrl, description } = req.body;
        const newBook = new Book({ title, author, price, imageUrl, description });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка сохранения', error: error.message });
    }
});

// 6. ЗАПУСК
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен!`);
    console.log(`🌍 Сайт доступен здесь: http://localhost:${PORT}`);
});