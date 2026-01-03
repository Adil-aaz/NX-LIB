document.addEventListener('DOMContentLoaded', () => {
    const bookGrid = document.getElementById('bookGrid');
    const resultsCount = document.getElementById('resultsCount');

    // Загружаем книги из локального файла
    if (typeof initialBooks !== 'undefined') {
        renderBooks(initialBooks);
    } else {
        console.error('Данные о книгах (initialBooks) не найдены.');
        bookGrid.innerHTML = `<p style="color: red; text-align: center; grid-column: 1 / -1;">Ошибка: не удалось загрузить данные о книгах.</p>`;
    }

    function renderBooks(books) {
        bookGrid.innerHTML = '';
        resultsCount.textContent = `Найдено ${books.length} изданий`;

        if (books.length === 0) {
            bookGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px; opacity: 0.7;">
                    <i class="fas fa-book-open" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить критерии поиска.</p>
                </div>
            `;
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card-minimal reveal active';
            card.dataset.title = book.title;
            card.dataset.genre = book.genre;
            card.dataset.year = book.year;
            card.dataset.status = book.status;
            card.dataset.lang = book.lang;
            card.dataset.rating = book.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1); // Add random rating for sorting

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

    // Удаляем форму добавления книг, так как она не будет работать на статическом сайте
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Управление каталогом недоступно в этой версии.</p>';
    }
});
