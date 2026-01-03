/* =========================================
   NX-LIB | MINIMALIST REFACTOR - LOGIC
   Version 3.0.0 - Mobile Enhanced
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initLoginModal();
    initScrollReveal();
    initFAQAccordion();
    initMobileMenu();
    initThemeToggle();
    initMobileFeatures(); // Новые мобильные фишки
    initCatalog();
});

// --- Функционал Каталога (Поиск, Фильтры, Сортировка) ---
function initCatalog() {
    const searchInput = document.getElementById('catalogSearch');
    const bookGrid = document.getElementById('bookGrid');
    if (!bookGrid) return; // Выход, если мы не на странице каталога

    const bookCards = Array.from(bookGrid.getElementsByClassName('book-card-minimal'));
    const genreBtns = document.querySelectorAll('.genre-btn');
    const yearCheckboxes = document.querySelectorAll('#yearFilters input');
    const statusRadios = document.querySelectorAll('#statusFilters input');
    const langFilter = document.getElementById('langFilter');
    const sortSelect = document.getElementById('catalogSort');
    const resultsCount = document.getElementById('resultsCount');
    const genreFilters = document.getElementById('genreFilters');
    const paginationBtns = document.querySelectorAll('.pagination-btn'); // Добавлен класс в HTML позже или используем существующие

    // Функция фильтрации
    function filterBooks() {
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase();
        const activeGenreBtn = document.querySelector('.genre-btn.active');
        const activeGenre = activeGenreBtn ? activeGenreBtn.dataset.genre : 'all';

        const selectedYears = Array.from(yearCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value);

        const activeStatusRadio = document.querySelector('#statusFilters input:checked');
        const activeStatus = activeStatusRadio ? activeStatusRadio.value : 'all';

        const activeLang = langFilter ? langFilter.value : 'all';

        let visibleCount = 0;

        bookCards.forEach(card => {
            const title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
            const genre = card.dataset.genre;
            const year = parseInt(card.dataset.year);
            const status = card.dataset.status;
            const lang = card.dataset.lang;

            // Проверка поиска
            const matchesSearch = title.includes(query);

            // Проверка жанра
            const matchesGenre = activeGenre === 'all' || genre === activeGenre;

            // Проверка статуса
            const matchesStatus = activeStatus === 'all' || status === activeStatus;

            // Проверка языка
            const matchesLang = activeLang === 'all' || lang === activeLang;

            // Проверка года
            let matchesYear = selectedYears.length === 0;
            if (!matchesYear) {
                selectedYears.forEach(range => {
                    if (range === '2020-2024' && year >= 2020 && year <= 2024) matchesYear = true;
                    if (range === '2010-2019' && year >= 2010 && year <= 2019) matchesYear = true;
                    if (range === '2000-2009' && year >= 2000 && year <= 2009) matchesYear = true;
                    if (range === 'old' && year < 2000) matchesYear = true;
                });
            }

            if (matchesSearch && matchesGenre && matchesStatus && matchesYear && matchesLang) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        });

        if (resultsCount) resultsCount.textContent = `Найдено ${visibleCount} изданий`;
    }

    // Обработка жанров
    if (genreFilters) {
        genreFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.genre-btn');
            if (!btn) return;

            genreBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--text-primary)';
                b.style.borderColor = 'var(--border-color)';
            });

            btn.classList.add('active');
            btn.style.background = 'var(--accent)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--accent)';

            filterBooks();

            // Тактильный отклик при выборе жанра
            if (navigator.vibrate) navigator.vibrate(5);
        });
    }

    // Обработка поиска (с дебаунсом)
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterBooks, 300);
        });
    }

    // Обработка сайдбара
    yearCheckboxes.forEach(i => i.addEventListener('change', filterBooks));
    statusRadios.forEach(i => i.addEventListener('change', filterBooks));
    if (langFilter) langFilter.addEventListener('change', filterBooks);

    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const val = sortSelect.value;
            const sorted = bookCards.sort((a, b) => {
                if (val === 'title') return (a.dataset.title || '').localeCompare(b.dataset.title || '');
                if (val === 'rating') return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
                if (val === 'new') return parseInt(b.dataset.year || 0) - parseInt(a.dataset.year || 0);
                return 0;
            });

            bookGrid.innerHTML = '';
            sorted.forEach(card => bookGrid.appendChild(card));
            filterBooks();
        });
    }

    // Пагинация (имитация)
    const allPaginationBtns = document.querySelectorAll('button.btn-outline');
    // Поскольку у нас нет спец классов для пагинации в HTML, найдем их по контексту (футер каталога)
    const paginationContainer = document.querySelector('div[style*="justify-content: center; gap: 10px;"]');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn || btn.textContent === '...') return;

            const btns = paginationContainer.querySelectorAll('button');
            btns.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--text-primary)';
                b.style.borderColor = 'var(--border-color)';
            });

            if (!btn.querySelector('i')) { // Если это не стрелка
                btn.style.background = 'var(--accent)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--accent)';
            }

            // Прокрутка наверх при переключении страницы
            window.scrollTo({ top: bookGrid.offsetTop - 150, behavior: 'smooth' });
        });
    }

    // Начальное состояние
    const activeBtn = document.querySelector('.genre-btn.active');
    if (activeBtn) {
        activeBtn.style.background = 'var(--accent)';
        activeBtn.style.color = 'white';
        activeBtn.style.borderColor = 'var(--accent)';
    }

    filterBooks();
}

/* --- 1. Login Modal Logic --- */
function initLoginModal() {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const openBtnMobile = document.getElementById('openLoginMobile');
    const closeBtn = document.getElementById('closeLogin');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modal && openBtn) {
        openBtn.addEventListener('click', openModal);

        if (openBtnMobile) {
            openBtnMobile.addEventListener('click', () => {
                closeMobileMenu(); // Close mobile menu first
                openModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Handle form submission (mock)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Вход выполнен успешно!');
            closeModal();
        });
    }
}

/* --- 2. Scroll Reveal Animation --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);

    // Initial check on load
    revealOnScroll();
}

/* --- 3. FAQ Accordion Logic --- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            const icon = question.querySelector('i');
            question.addEventListener('click', () => {
                const isActive = answer.style.display === 'block';

                // Close all other items
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    if (otherAnswer) otherAnswer.style.display = 'none';
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                });

                // Toggle current item
                if (!isActive) {
                    answer.style.display = 'block';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.style.display = 'none';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
}

/* --- 4. Mobile Menu Logic (специально для смартфонов) --- */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!navToggle || !mobileMenu) return;

    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        navToggle.querySelector('i').classList.remove('fa-bars');
        navToggle.querySelector('i').classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        navToggle.querySelector('i').classList.remove('fa-times');
        navToggle.querySelector('i').classList.add('fa-bars');
        document.body.style.overflow = '';
    }

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 200);
            });
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Make closeMobileMenu globally accessible
        window.closeMobileMenu = closeMobileMenu;
    }
}

/* --- 5. Mobile Reading Mode (специально для смартфонов) --- */
function initMobileReadingMode() {
    const readingToggle = document.getElementById('readingModeToggle');

    if (readingToggle) {
        let isReadingMode = false;

        readingToggle.addEventListener('click', () => {
            isReadingMode = !isReadingMode;

            if (isReadingMode) {
                document.body.classList.add('reading-mode');
                readingToggle.querySelector('i').classList.remove('fa-book-open');
                readingToggle.querySelector('i').classList.add('fa-times');
                readingToggle.style.background = '#111';
            } else {
                document.body.classList.remove('reading-mode');
                readingToggle.querySelector('i').classList.remove('fa-times');
                readingToggle.querySelector('i').classList.add('fa-book-open');
                readingToggle.style.background = '#7C3AED';
            }
        });
    }
}

/* --- 6. Touch Gesture Support для мобильных --- */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 100;
    const mobileMenu = document.getElementById('mobileMenu');

    // Swipe right to open menu (from left edge)
    if (touchEndX - touchStartX > swipeThreshold && touchStartX < 50) {
        if (mobileMenu && !mobileMenu.classList.contains('active')) {
            document.getElementById('navToggle').click();
        }
    }

    // Swipe left to close menu
    if (touchStartX - touchEndX > swipeThreshold) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            window.closeMobileMenu();
        }
    }
}

/* --- 7. Дополнительные утилиты --- */
// Плавная прокрутка уже обрабатывается через CSS scroll-behavior
// Кастомный курсор удален для соответствия минимализму


/* --- 8. Глобальное переключение темы --- */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('nx-lib-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);

            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (newTheme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }

            localStorage.setItem('nx-lib-theme', newTheme);
        });
    }
}

/* --- 9. Продвинутые мобильные фишки --- */
function initMobileFeatures() {
    // 1. Индикатор прогресса прокрутки
    const scrollBar = document.getElementById('scrollBar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollBar) {
            scrollBar.style.width = scrolled + "%";
        }

        // Появление кнопки Наверх
        if (backToTop) {
            if (winScroll > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    // Плавный скролл наверх
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            hapticFeedback(10); // Вибрация
        });
    }

    // 2. Интеграция с Web Share API
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            hapticFeedback(20);
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'NX-LIB — Цифровой архив знаний',
                        text: 'Посмотрите эту удивительную библиотеку знаний!',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Отмена шеринга');
                }
            } else {
                alert('Копирование ссылки...');
                navigator.clipboard.writeText(window.location.href);
            }
        });
    }

    // 3. Тактильная отдача (Вибрация)
    function hapticFeedback(ms) {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(ms);
        }
    }

    // Применяем вибрацию ко всем кнопкам для "премиум" ощущения
    document.querySelectorAll('.btn, .dock-item, .theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => hapticFeedback(5));
    });
}

console.log('NX-LIB Interactive Layer Loaded.');
console.log('Mobile Features: Enabled');
console.log('Touch Gestures: Active');
console.log('Theme Toggle: Ready');
console.log('NX-LIB Mobile Optimized - Active');
