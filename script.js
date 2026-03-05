// Данные о залах
const hallsData = {
    billiard: {
        title: "Бильярдная комната",
        icon: "🎱",
        description: "Профессиональная бильярдная комната с тремя столами русского бильярда. Идеальное место для любителей интеллектуального спорта и стратегических игр.",
        features: [
            "Профессиональный бильярдный стол",
            "Профессиональные кии",
            "Зона для зрителей",
        ],
        schedule: "Единое расписание комплекса",
    },
    tennis: {
        title: "Теннисная комната",
        icon: "🎾",
        description: "Современный зал для настольного тенниса с профессиональными столами и качественным покрытием. Отличное место для развития реакции и координации.",
        features: [
            "Профессиональный теннисный стол",
            "Качественное освещение",
            "Профессиональные ракетки",
        ],
        schedule: "Единое расписание комплекса",
    },
    volleyball: {
        title: "Волейбольно-футбольный зал",
        icon: "⚽",
        description: "Универсальный спортивный зал с разметкой для волейбола и мини-футбола. Профессиональное покрытие и современное оборудование.",
        features: [
            "Разметка для волейбола и мини-футбола",
            "Спортивное покрытие",
            "Балкон для зрителей",
        ],
        schedule: "Единое расписание комплекса",
    },
    gym: {
        title: "Тренажерный зал",
        icon: "🏋️",
        description: "Современный тренажерный зал с кардио-зоной и силовыми тренажерами. Профессиональное оборудование для эффективных тренировок.",
        features: [
            "Силовые тренажеры",
            "Свободные веса",
        ],
        schedule: "Единое расписание комплекса",
    }
};

// ==================== ФУНКЦИИ ЗАЛОВ ====================

function showHallDetails(hallType) {
    const hall = hallsData[hallType];
    const modal = document.getElementById('hallModal');
    const content = document.getElementById('hallContent');

    content.innerHTML = `
        <div class="hall-details">
            <div>
                <div class="hall-image">
                    ${hall.icon}
                </div>
                <div class="hall-info">
                    <h3>${hall.title}</h3>
                    <p>${hall.description}</p>
                    <div class="hall-features">
                        <h4>Оснащение:</h4>
                        <ul>
                            ${hall.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <div class="hall-schedule">
                    <h4>📅 Режим работы:</h4>
                    <div class="unified-schedule">
                        <div class="schedule-item"><span> Пн-Пт</span><span> 08:00 – 21:00</span></div>
                        <div class="schedule-item"><span> Суббота</span><span> 10:00 – 13:00</span></div>
                        <div class="schedule-item"><span> Воскресенье</span><span> 09:00 – 15:00</span></div>
                    </div>
                </div>
                <div class="hall-rules">
                    <h4>📋 Правила посещения:</h4>
                    <ul>
                        <li>Спортивная форма обязательна</li>
                        <li>Сменная обувь</li>
                        <li>Соблюдение расписания</li>
                        <li>Бережное отношение к оборудованию</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.getElementById('hallModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

function setupEventListeners() {

    // Закрытие модальных окон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
}

function createFloatingDots() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot';
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255,255,255,${Math.random() * 0.2 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 8 + 8}s linear infinite;
        `;
        hero.appendChild(dot);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    createFloatingDots();
});

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 29, 60, 0.98)';
            header.style.padding = '0.5rem 0';
        } else {
            header.style.background = 'rgba(10, 29, 60, 0.95)';
            header.style.padding = '1rem 0';
        }
    }
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});
