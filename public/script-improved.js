/* =========================================
   NX-LIB | SCRIPT - SENIOR IMPROVED VERSION
   With error handling, accessibility, and best practices
   ========================================= */

// Utility: Debounce для оптимизации performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Safe localStorage wrapper с error handling
const safeStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`НЕ удалось прочитать из localStorage: ${key}`, error);
            return null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`НЕ удалось сохранить в localStorage: ${key}`, error);
            return false;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initLoginModal();
    initScrollReveal();
    initFAQAccordion();
    initMobileMenu();
    initThemeToggle();
});

/* --- 1. Login Modal Logic --- */
function initLoginModal() {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const openBtnMobile = document.getElementById('openLoginMobile');
    const closeBtn = document.getElementById('closeLogin');

    if (!modal || !openBtn) return; // Early return если элементов нет

    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false'); // A11y
        document.body.style.overflow = 'hidden';

        // Focus trap
        const firstFocusable = modal.querySelector('input, button');
        if (firstFocusable) firstFocusable.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true'); // A11y
        document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openModal);

    if (openBtnMobile) {
        openBtnMobile.addEventListener('click', () => {
            if (typeof closeMobileMenu === 'function') {
                closeMobileMenu();
            }
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: Add actual validation here
            alert('Вход выполнен успешно!');
            closeModal();
        });
    }
}

/* --- 2. Scroll Reveal Animation с debounce --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Debounced scroll для лучшей производительности
    window.addEventListener('scroll', debounce(revealOnScroll, 50));

    // Initial check
    revealOnScroll();
}

/* --- 3. FAQ Accordion Logic --- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question?.querySelector('i');

        if (!question || !answer) return;

        // A11y attributes
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('tabindex', '0');

        const toggleAnswer = () => {
            const isActive = answer.style.display === 'block';

            // Close all
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-question i');
                const otherQuestion = otherItem.querySelector('.faq-question');
                if (otherAnswer) otherAnswer.style.display = 'none';
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                answer.style.display = 'block';
                if (icon) icon.style.transform = 'rotate(180deg)';
                question.setAttribute('aria-expanded', 'true');
            }
        };

        question.addEventListener('click', toggleAnswer);

        // Keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAnswer();
            }
        });
    });
}

/* --- 4. Mobile Menu Logic --- */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!navToggle || !mobileMenu) return;

    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');

        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }

        navToggle.setAttribute('aria-expanded', 'true'); // A11y
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');

        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        navToggle.setAttribute('aria-expanded', 'false'); // A11y
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 200);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Global для использования в других функциях
    window.closeMobileMenu = closeMobileMenu;
}

/* --- 5. Theme Toggle с error handling --- */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // A11y attributes
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    themeToggle.setAttribute('aria-pressed', 'false');

    // Load saved theme
    const savedTheme = safeStorage.getItem('nx-lib-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        themeToggle.setAttribute('aria-pressed', 'true');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');

        if (!icon) return;

        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.setAttribute('aria-pressed', 'true');
            safeStorage.setItem('nx-lib-theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.setAttribute('aria-pressed', 'false');
            safeStorage.setItem('nx-lib-theme', 'light');
        }
    });
}

/* --- 6. Touch Gestures --- */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true }); // Passive для производительности

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    const swipeThreshold = 100;
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenu) return;

    // Swipe right to open
    if (touchEndX - touchStartX > swipeThreshold && touchStartX < 50) {
        if (!mobileMenu.classList.contains('active')) {
            const navToggle = document.getElementById('navToggle');
            if (navToggle) navToggle.click();
        }
    }

    // Swipe left to close
    if (touchStartX - touchEndX > swipeThreshold) {
        if (mobileMenu.classList.contains('active') && typeof window.closeMobileMenu === 'function') {
            window.closeMobileMenu();
        }
    }
}

console.log('NX-LIB Enhanced - Ready ✅');
console.log('✓ Error handling');
console.log('✓ Accessibility');
console.log('✓ Debounced scroll');
console.log('✓ Safe storage');
