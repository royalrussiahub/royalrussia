// script.js

// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Анимация элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию к карточкам
    const animatedElements = document.querySelectorAll('.feature-card, .team-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Эффект параллакса для hero-image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // Плавное появление элементов навигации
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            link.style.transition = 'all 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // ============= ГАЛЕРЕЯ =============
    // Фильтрация галереи
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (filterButtons.length > 0 && galleryCards.length > 0) {
        // Функция фильтрации
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');

                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Фильтруем карточки
                galleryCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        // Анимация появления
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = 'fadeIn 0.6s ease';
                        }, 10);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        // Эффект при наведении на карточки галереи
        galleryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Клик для увеличения
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                const description = this.querySelector('p').textContent;
                
                console.log(`Открыть: ${title} - ${description}`);
                
                // Простой эффект клика
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });

        // Ленивая загрузка для галереи
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        galleryCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            galleryObserver.observe(card);
        });
    }
});

// Эффект курсора
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .team-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        }
    });
});

// Возврат карточек в исходное положение
document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('feature-card') || e.target.classList.contains('team-card')) {
        e.target.style.transform = '';
    }
});

// Счетчик для статистики на главной странице
const animateCounter = (element, target, duration) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Запуск анимации счетчиков при их появлении на экране
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                entry.target.classList.add('animated');
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    statNumber.textContent = '0';
                    setTimeout(() => {
                        animateCounter(statNumber, number, 2000);
                        setTimeout(() => {
                            statNumber.textContent = text;
                        }, 2000);
                    }, 200);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card, .stat-item').forEach(card => {
    statObserver.observe(card);
});

// Добавляем эффект ripple к кнопкам
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Добавляем CSS для анимации ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);