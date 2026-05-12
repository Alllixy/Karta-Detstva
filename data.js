<<<<<<< HEAD
// Ждём загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    
    // Загружаем кружки при загрузке страницы
    loadClubs();
    
    // Обработчик кнопки поиска
    searchBtn.addEventListener('click', loadClubs);
});

async function loadClubs() {
    // Получаем значения фильтров
    const age = document.getElementById('ageFilter').value;
    const district = document.getElementById('districtFilter').value;
    const type = document.getElementById('typeFilter').value;
    const freeOnly = document.getElementById('freeOnly').checked;
    
    // Строим URL для запроса
    let url = '/api/clubs?city=Находка';
    
    if (age) url += `&age=${age}`;
    if (district) url += `&district=${encodeURIComponent(district)}`;
    if (type) url += `&type=${encodeURIComponent(type)}`;
    if (freeOnly) url += `&free=true`;
    
    try {
        const response = await fetch(url);
        const clubs = await response.json();
        
        // Отображаем результаты
        displayResults(clubs);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('results').innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}

function displayResults(clubs) {
    const resultsDiv = document.getElementById('results');
    
    if (clubs.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">😕 Кружков не найдено. Попробуйте изменить параметры поиска.</div>';
        return;
    }
    
    resultsDiv.innerHTML = clubs.map(club => `
        <div class="card">
            <h3>${club.name}</h3>
            <p>📍 ${club.address}</p>
            <p>🏢 ${club.district}</p>
            <p>👶 Возраст: ${club.age_from}-${club.age_to} лет</p>
            <p>📞 ${club.phone}</p>
            <p>🕐 ${club.schedule}</p>
            <div class="price ${club.price === 0 ? 'free' : ''}">
                ${club.price === 0 ? 'Бесплатно' : club.price + ' ₽ / месяц'}
            </div>
            <button onclick="viewClub(${club.id})">Подробнее</button>
        </div>
    `).join('');
}

function viewClub(id) {
    // Показываем модальное окно или переходим на страницу кружка
    alert(`Функция просмотра кружка ${id} будет добавлена позже`);
=======
// Ждём загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    
    // Загружаем кружки при загрузке страницы
    loadClubs();
    
    // Обработчик кнопки поиска
    searchBtn.addEventListener('click', loadClubs);
});

async function loadClubs() {
    // Получаем значения фильтров
    const age = document.getElementById('ageFilter').value;
    const district = document.getElementById('districtFilter').value;
    const type = document.getElementById('typeFilter').value;
    const freeOnly = document.getElementById('freeOnly').checked;
    
    // Строим URL для запроса
    let url = '/api/clubs?city=Находка';
    
    if (age) url += `&age=${age}`;
    if (district) url += `&district=${encodeURIComponent(district)}`;
    if (type) url += `&type=${encodeURIComponent(type)}`;
    if (freeOnly) url += `&free=true`;
    
    try {
        const response = await fetch(url);
        const clubs = await response.json();
        
        // Отображаем результаты
        displayResults(clubs);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('results').innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}

function displayResults(clubs) {
    const resultsDiv = document.getElementById('results');
    
    if (clubs.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">😕 Кружков не найдено. Попробуйте изменить параметры поиска.</div>';
        return;
    }
    
    resultsDiv.innerHTML = clubs.map(club => `
        <div class="card">
            <h3>${club.name}</h3>
            <p>📍 ${club.address}</p>
            <p>🏢 ${club.district}</p>
            <p>👶 Возраст: ${club.age_from}-${club.age_to} лет</p>
            <p>📞 ${club.phone}</p>
            <p>🕐 ${club.schedule}</p>
            <div class="price ${club.price === 0 ? 'free' : ''}">
                ${club.price === 0 ? 'Бесплатно' : club.price + ' ₽ / месяц'}
            </div>
            <button onclick="viewClub(${club.id})">Подробнее</button>
        </div>
    `).join('');
}

function viewClub(id) {
    // Показываем модальное окно или переходим на страницу кружка
    alert(`Функция просмотра кружка ${id} будет добавлена позже`);
>>>>>>> 3284730a6b3dd3d05b2ecf6ee1e0da599e5065df
}