// Пароль для скрытого входа
const DIRECTOR_PASSWORD = "sport123";
let isDirectorLoggedIn = false;
let passwordBuffer = "";

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

// ==================== СКРЫТЫЙ ВВОД ПАРОЛЯ ====================

document.addEventListener('keydown', function(e) {
    // Добавляем символ в буфер
    passwordBuffer += e.key;

    // Проверяем последние 8 символов на совпадение с паролем
    if (passwordBuffer.slice(-DIRECTOR_PASSWORD.length) === DIRECTOR_PASSWORD) {
        handleSecretLogin();
        passwordBuffer = ""; // Сбрасываем буфер
    }

    // Ограничиваем длину буфер
    if (passwordBuffer.length > 20) {
        passwordBuffer = passwordBuffer.slice(-20);
    }
});

function handleSecretLogin() {
    isDirectorLoggedIn = true;
    localStorage.setItem('directorLoggedIn', 'true');
    localStorage.setItem('lastLogin', Date.now());
    showDirectorInterface();
    showNotification('Режим директора активирован!', 'success');
}

// ==================== ФУНКЦИИ ДИРЕКТОРА ====================

function showDirectorInterface() {
    const newsPanel = document.getElementById('newsAdminPanel');
    const staffPanel = document.getElementById('staffAdminPanel');

    if (newsPanel) newsPanel.style.display = 'block';
    if (staffPanel) staffPanel.style.display = 'block';

    showDeleteButtons();
    loadNews(); // Перезагружаем новости для отображения кнопок удаления
    loadStaff(); // Перезагружаем сотрудников для отображения кнопок редактирования/удаления
}

function logoutDirector() {
    isDirectorLoggedIn = false;
    localStorage.removeItem('directorLoggedIn');
    localStorage.removeItem('lastLogin');
    hideDirectorInterface();
    showNotification('Режим директора отключен', 'success');
}

function checkAutoLogout() {
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin && (Date.now() - parseInt(lastLogin)) > 24 * 60 * 60 * 1000) {
        isDirectorLoggedIn = false;
        localStorage.removeItem('directorLoggedIn');
        localStorage.removeItem('lastLogin');
        hideDirectorInterface();
    }
}

function hideDirectorInterface() {
    const newsPanel = document.getElementById('newsAdminPanel');
    const staffPanel = document.getElementById('staffAdminPanel');

    if (newsPanel) newsPanel.style.display = 'none';
    if (staffPanel) staffPanel.style.display = 'none';

    hideDeleteButtons();
    loadNews(); // Перезагружаем новости для скрытия кнопок удаления
    loadStaff(); // Перезагружаем сотрудников для скрытия кнопок редактирования/удаления
}

function showDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'flex';
    });
    document.querySelectorAll('.delete-staff').forEach(btn => {
        btn.style.display = 'flex';
    });
    document.querySelectorAll('.edit-staff').forEach(btn => {
        btn.style.display = 'flex';
    });
}

function hideDeleteButtons() {
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.style.display = 'none';
    });
    document.querySelectorAll('.delete-staff').forEach(btn => {
        btn.style.display = 'none';
    });
    document.querySelectorAll('.edit-staff').forEach(btn => {
        btn.style.display = 'none';
    });
}

// ==================== ЭКСПОРТ ДАННЫХ ====================

function exportData() {
    const news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    const staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];

    const data = {
        news: news,
        staff: staff,
        exportDate: new Date().toLocaleString('ru-RU')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sportcomplex-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showNotification('Данные экспортированы!', 'success');
}

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

// ==================== ФУНКЦИИ НОВОСТЕЙ ====================

function loadNews() {
    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    displayNews(news);
}

function displayNews(news) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    newsContainer.innerHTML = '';

    if (news.length === 0) {
        newsContainer.innerHTML = '<div class="no-news"><p>Пока нет новостей. Следите за обновлениями!</p></div>';
        return;
    }

    news.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <button class="delete-news" onclick="deleteNews(${item.id})" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}">×</button>
            <div class="news-date">${item.date}</div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        `;
        newsContainer.appendChild(newsCard);
    });
}

function addNews(e) {
    e.preventDefault();

    const title = document.getElementById('newsTitle').value;
    const text = document.getElementById('newsText').value;
    const date = document.getElementById('newsDate').value;

    if (!title || !text || !date) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;

    const newNews = {
        id: newId,
        title: title,
        text: text,
        date: date
    };

    news.unshift(newNews);
    localStorage.setItem('sportComplexNews', JSON.stringify(news));

    displayNews(news);
    document.getElementById('addNewsForm').reset();
    showNotification('Новость успешно добавлена!', 'success');
}

function deleteNews(id) {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
        return;
    }

    let news = JSON.parse(localStorage.getItem('sportComplexNews')) || [];
    news = news.filter(item => item.id !== id);
    localStorage.setItem('sportComplexNews', JSON.stringify(news));

    displayNews(news);
    showNotification('Новость удалена!', 'success');
}

// ==================== ФУНКЦИИ СОТРУДНИКОВ ====================

function loadStaff() {
    let staff = JSON.parse(localStorage.getItem('sportComplexStaff'));

    // Если сотрудников нет, создаем тестовых сотрудников
    if (!staff || staff.length === 0) {
        staff = [];
        localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    }

    displayStaff(staff);
}

function displayStaff(staff) {
    const staffContainer = document.getElementById('staffContainer');
    if (!staffContainer) return;

    staffContainer.innerHTML = '';

    if (staff.length === 0) {
        staffContainer.innerHTML = '<div class="no-staff"><p>Информация о сотрудниках появится скоро</p></div>';
        return;
    }

    staff.forEach(item => {
        const staffCard = document.createElement('div');
        staffCard.className = 'staff-card';
        staffCard.innerHTML = `
            <div class="staff-actions" style="display: ${isDirectorLoggedIn ? 'flex' : 'none'}; justify-content: space-between; margin-bottom: 10px;">
                <button class="edit-staff" onclick="editStaff(${item.id})" style="background: #ffc107; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✏️</button>
                <button class="delete-staff" onclick="deleteStaff(${item.id})" style="background: #dc3545; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; color: white;">×</button>
            </div>
            <div class="staff-photo">👤</div>
            <h3>${item.name}</h3>
            <div class="staff-position">${item.position}</div>
            <p>${item.description}</p>
        `;
        staffContainer.appendChild(staffCard);
    });
}

function addStaff(e) {
    e.preventDefault();

    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const description = document.getElementById('staffDescription').value;

    if (!name || !position || !description) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];
    const newId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1;

    const newStaff = {
        id: newId,
        name: name,
        position: position,
        description: description
    };

    staff.push(newStaff);
    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));

    displayStaff(staff);
    document.getElementById('addStaffForm').reset();
    showNotification('Сотрудник успешно добавлен!', 'success');
}

function deleteStaff(id) {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        return;
    }

    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];
    staff = staff.filter(item => item.id !== id);
    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));

    displayStaff(staff);
    showNotification('Сотрудник удален!', 'success');
}

let editingStaffId = null;

function editStaff(id) {
    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];
    const staffMember = staff.find(item => item.id === id);

    if (staffMember) {
        editingStaffId = id;

        // Заполняем форму данными сотрудника
        document.getElementById('staffName').value = staffMember.name;
        document.getElementById('staffPosition').value = staffMember.position;
        document.getElementById('staffDescription').value = staffMember.description;

        // Меняем кнопку на "Сохранить изменения"
        const form = document.getElementById('addStaffForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Сохранить изменения';
        submitBtn.onclick = updateStaff;

        // Прокручиваем к форме
        document.getElementById('staff').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateStaff(e) {
    e.preventDefault();

    if (!editingStaffId) {
        showNotification('Ошибка: ID сотрудника не найден', 'error');
        return;
    }

    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const description = document.getElementById('staffDescription').value;

    if (!name || !position || !description) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    let staff = JSON.parse(localStorage.getItem('sportComplexStaff')) || [];

    const staffIndex = staff.findIndex(item => item.id === editingStaffId);
    if (staffIndex !== -1) {
        staff[staffIndex] = {
            id: editingStaffId,
            name: name,
            position: position,
            description: description
        };
    }

    localStorage.setItem('sportComplexStaff', JSON.stringify(staff));
    displayStaff(staff);

    // Возвращаем обычную кнопку
    const submitBtn = document.querySelector('#addStaffForm button[type="submit"]');
    submitBtn.textContent = 'Добавить сотрудника';
    submitBtn.onclick = addStaff;

    document.getElementById('addStaffForm').reset();
    editingStaffId = null;
    showNotification('Данные сотрудника обновлены!', 'success');
}

// ==================== УВЕДОМЛЕНИЯ ====================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007BFF'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

function checkLoginStatus() {
    const savedLogin = localStorage.getItem('directorLoggedIn');
    const lastLogin = localStorage.getItem('lastLogin');

    if (savedLogin === 'true' && lastLogin && (Date.now() - parseInt(lastLogin)) < 24 * 60 * 60 * 1000) {
        isDirectorLoggedIn = true;
        showDirectorInterface();
    }
}

function setupEventListeners() {
    // Форма добавления новости
    const addNewsForm = document.getElementById('addNewsForm');
    if (addNewsForm) {
        addNewsForm.addEventListener('submit', addNews);
    }

    // Форма добавления сотрудника
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', addStaff);
    }

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

    // Кнопка выхода для директора
    const logoutBtn = document.getElementById('logoutDirector');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutDirector);
    }

    // Кнопка экспорта данных
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
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
    loadNews();
    loadStaff();
    setupEventListeners();
    createFloatingDots();
    checkLoginStatus();
    checkAutoLogout();
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