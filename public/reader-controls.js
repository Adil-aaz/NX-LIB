/* =========================================
   READER CONTROLS SCRIPT
   Font size and theme controls for reader
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initReaderControls();
    initReaderProgress();
    initMobileReadingMode();
});

/* --- Reader Controls --- */
function initReaderControls() {
    let fontSize = 100; // Base font size percentage
    const readerText = document.getElementById('readerText');
    const fontDisplay = document.querySelector('.font-size-display');
    const decreaseBtn = document.getElementById('decreaseFont');
    const increaseBtn = document.getElementById('increaseFont');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Загрузить сохраненные настройки
    const savedFontSize = localStorage.getItem('reader-font-size');
    const savedTheme = localStorage.getItem('reader-theme');

    if (savedFontSize) {
        fontSize = parseInt(savedFontSize);
        updateFontSize();
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Уменьшить шрифт
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (fontSize > 80) {
                fontSize -= 10;
                updateFontSize();
            }
        });
    }

    // Увеличить шрифт
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (fontSize < 150) {
                fontSize += 10;
                updateFontSize();
            }
        });
    }

    function updateFontSize() {
        if (readerText) {
            readerText.style.fontSize = fontSize + '%';
        }
        if (fontDisplay) {
            fontDisplay.textContent = fontSize + '%';
        }
        localStorage.setItem('reader-font-size', fontSize);
    }

    // Переключение тем
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('reader-theme', theme);
        });
    });

    function applyTheme(theme) {
        // Убираем все классы тем
        document.body.classList.remove('theme-dark', 'theme-sepia', 'theme-light');

        // Добавляем выбранную тему
        if (theme !== 'light') {
            document.body.classList.add('theme-' + theme);
        }

        // Обновляем active класс на кнопках
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
    }
}

/* --- Reading Progress Bar --- */
function initReaderProgress() {
    const progressBar = document.getElementById('progressBar');

    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

/* --- Chapter Navigation --- */
const prevBtn = document.querySelector('.nav-chapter-btn.prev');
const nextBtn = document.querySelector('.nav-chapter-btn.next');

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        alert('Следующая глава еще не доступна');
    });
}

if (prevBtn && !prevBtn.classList.contains('disabled')) {
    prevBtn.addEventListener('click', () => {
        alert('Предыдущая глава');
    });
}

/* --- Mobile Reading Mode для reader.html --- */
function initMobileReadingMode() {
    const readingToggle = document.getElementById('readingModeToggle');

    if (readingToggle) {
        let isReadingMode = false;

        readingToggle.addEventListener('click', () => {
            isReadingMode = !isReadingMode;
            const readerNav = document.querySelector('.reader-nav');
            const chapterFooter = document.querySelector('.chapter-footer');

            if (isReadingMode) {
                document.body.classList.add('reading-mode');
                readingToggle.querySelector('i').classList.remove('fa-book-open');
                readingToggle.querySelector('i').classList.add('fa-times');
                readingToggle.style.background = '#111';

                // Скрыть навигацию
                if (readerNav) readerNav.style.display = 'none';
                if (chapterFooter) chapterFooter.style.display = 'none';
            } else {
                document.body.classList.remove('reading-mode');
                readingToggle.querySelector('i').classList.remove('fa-times');
                readingToggle.querySelector('i').classList.add('fa-book-open');
                readingToggle.style.background = '#7C3AED';

                // Показать навигацию
                if (readerNav) readerNav.style.display = 'flex';
                if (chapterFooter) chapterFooter.style.display = 'flex';
            }
        });
    }
}

console.log('Reader Controls Loaded');
