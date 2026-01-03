document.addEventListener('DOMContentLoaded', () => {
    const bookGrid = document.getElementById('bookGrid');
    const resultsCount = document.getElementById('resultsCount');
    const addBookForm = document.getElementById('addBookForm');

    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }, 10);
    }

    async function fetchBooks() {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const books = await response.json();
            renderBooks(books);
        } catch (err) {
            console.error('Ошибка загрузки книг:', err);
            bookGrid.innerHTML = `<p style="color: red; text-align: center; grid-column: 1 / -1;">Не удалось загрузить книги. Проверьте подключение к серверу.</p>`;
            showToast('Ошибка загрузки книг', true);
        }
    }

    function renderBooks(books) {
        bookGrid.innerHTML = '';
        resultsCount.textContent = `Найдено ${books.length} изданий`;

        if (books.length === 0) {
            bookGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px; opacity: 0.7;">
                    <i class="fas fa-book-open" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
                    <h3>В архиве пока нет книг</h3>
                    <p>Добавьте первую книгу с помощью формы выше.</p>
                </div>
            `;
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card-minimal reveal active';
            card.innerHTML = `
                <div class="card-img" style="aspect-ratio: 2/3; position: relative; overflow: hidden; border-radius: 8px;">
                    <img src="${book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Cover'}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h4 style="margin-top: 15px; margin-bottom: 5px;">${book.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${book.author}</p>
                <div style="margin-top: 10px; font-size: 0.75rem; color: var(--accent); font-weight: 700;">$${book.price}</div>
                <a href="reader.html?id=${book._id}" class="btn btn-outline" style="width: 100%; margin-top: 20px; font-size: 0.85rem;">Читать</a>
            `;
            bookGrid.appendChild(card);
        });
    }

    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = addBookForm.querySelector('button[type="submit"]');

        const bookData = {
            title: document.getElementById('addTitle').value,
            author: document.getElementById('addAuthor').value,
            price: Number(document.getElementById('addPrice').value),
            imageUrl: document.getElementById('addImage').value
        };

        if (!bookData.title || !bookData.author || !bookData.price) {
            showToast('Пожалуйста, заполните все обязательные поля.', true);
            return;
        }

        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Добавление...';

        try {
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            if (res.ok) {
                showToast('Книга успешно добавлена!');
                addBookForm.reset();
                fetchBooks();
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            console.error('Ошибка отправки:', err);
            showToast('Не удалось добавить книгу.', true);
        } finally {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.textContent = 'Добавить в архив';
        }
    });

    fetchBooks();
});
