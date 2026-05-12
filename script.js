let map = null;
let mapVisible = false;
let currentClubs = [];
let currentRoute = null;
let isAdminMode = false;
let editingClubId = null;
let clubsCoordinates = new Map();

// Инициализация карты при загрузке страницы
function initMap() {
    if (typeof ymaps === 'undefined') {
        document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;">Ошибка загрузки карты</div>';
        return;
    }
    
    ymaps.ready(() => {
        map = new ymaps.Map("map", {
            center: [42.826, 132.892],
            zoom: 13,
            controls: ['zoomControl']
        });
    });
}
// Показать/скрыть карту
function toggleMap() {
    const container = document.getElementById('mapContainer');
    const btn = document.getElementById('toggleMapBtn');
    
    if (mapVisible) {
        container.style.display = 'none';
        btn.textContent = 'Показать карту';
    } else {
        container.style.display = 'block';
        setTimeout(() => {
            if (map) {
                map.container.fitToViewport();
            }
        }, 100);
        btn.textContent = 'Скрыть карту';
        if (!map && typeof ymaps !== 'undefined') {
            ymaps.ready(() => {
                map = new ymaps.Map("map", {
                    center: [42.826, 132.892],
                    zoom: 13,
                    controls: ['zoomControl']
                });
                if (currentClubs.length > 0) {
                    displayOnMap(currentClubs);
                }
            });
        } else if (map && currentClubs.length > 0) {
            setTimeout(() => {
                displayOnMap(currentClubs);
            }, 100);
        }
    }
    mapVisible = !mapVisible;
}
// Загрузка списка городов 
async function loadCities() {
    const response = await fetch('/api/cities');
    const cities = await response.json();
    const citySelect = document.getElementById('citySelect');
    citySelect.innerHTML = '<option value="Находка">Находка</option>';
    citySelect.value = 'Находка';
    await loadDistricts();
    await loadClubs();
}
// Загрузка районов для выбранного города
async function loadDistricts() {
    const city = document.getElementById('citySelect').value;
    if (!city) {
        document.getElementById('districtFilter').innerHTML = '<option value=""></option>';
        return;
    }
    const response = await fetch(`/api/districts?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    const districtSelect = document.getElementById('districtFilter');
    districtSelect.innerHTML = '<option value=""></option>';
    if (data.districts) {
        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}
// Загрузка списка городов для модального окна
async function loadModalCities() {
    const response = await fetch('/api/cities');
    const cities = await response.json();
    const citySelect = document.getElementById('editClubCity');
    citySelect.innerHTML = '<option value="">Выберите город</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        citySelect.appendChild(option);
    });
}
// Загрузка районов в модальном окне
async function loadModalDistricts() {
    const city = document.getElementById('editClubCity').value;
    if (!city) {
        document.getElementById('editClubDistrict').innerHTML = '<option value="">Выберите район</option>';
        return;
    }
    const response = await fetch(`/api/districts?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    const districtSelect = document.getElementById('editClubDistrict');
    districtSelect.innerHTML = '<option value="">Выберите район</option>';
    if (data.districts) {
        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}
// Загрузка кружков с фильтрацией
async function loadClubs() {
    const city = document.getElementById('citySelect').value;
    const district = document.getElementById('districtFilter').value;
    const type = document.getElementById('typeFilter').value;
    const freeOnly = document.getElementById('freeOnly').checked;
    const birthDate = document.getElementById('birthDate').value;
    const ageYear = document.getElementById('ageYear').value;
    
    let url = `/api/clubs`;
    let params = new URLSearchParams();
    
    if (city && city !== '') params.append('city', city);
    if (district && district !== '') params.append('district', district);
    if (type && type !== '') params.append('type', type);
    if (freeOnly) params.append('free', 'true');
    
    let age = null;
    if (birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    } else if (ageYear) {
        age = new Date().getFullYear() - parseInt(ageYear);
    }
    
    if (age && age >= 3 && age <= 17) {
        params.append('age', age);
    }
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    try {
        const response = await fetch(url);
        currentClubs = await response.json();
        displayResults(currentClubs);
        if (mapVisible && map) {
            displayOnMap(currentClubs);
        }
    } catch (error) {
        document.getElementById('results').innerHTML = '<div class="no-results">Ошибка загрузки</div>';
    }
}
// Отображение карточек кружков на странице
function displayResults(clubs) {
    const resultsDiv = document.getElementById('results');
    
    if (clubs.length === 0 && !isAdminMode) {
        resultsDiv.innerHTML = '<div class="no-results">Кружки не найдены. Измените параметры поиска.</div>';
        return;
    }
    
    if (isAdminMode) {
        let html = `<div class="add-card" onclick="openAddModal()">
            <div class="plus">+</div>
            <div class="add-text">Добавить кружок</div>
        </div>`;
        
        html += clubs.map(club => `
            <div class="card" onclick="openEditModal(${club.id})">
                <div class="card-title">${club.name}</div>
                <div class="card-details">
                    <div>${club.address}</div>
                    <div>${club.district}</div>
                    <div>${club.age_from}-${club.age_to} лет</div>
                    <div>${club.schedule}</div>
                </div>
                <div class="card-phone">${club.phone}</div>
                <div class="card-price">
                    <div class="price-value ${club.price === 0 ? 'free' : ''}">
                        ${club.price === 0 ? 'Бесплатно' : club.price + ' руб/мес'}
                    </div>
                </div>
            </div>
        `).join('');
        
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = clubs.map(club => `
            <div class="card" onclick="showRoute(${club.id})">
                <div style="width:100%; height:100px; background:#f0f0f0; border-radius:8px; margin-bottom:8px; display:flex; align-items:center; justify-content:center;">
                    <span style="font-size:24px;">📷</span>
                </div>
                <div class="card-title">${club.name}</div>
                <div class="card-details">
                    <div>${club.address}</div>
                    <div>${club.district}</div>
                    <div>${club.age_from}-${club.age_to} лет</div>
                    <div>${club.schedule}</div>
                </div>
                <div class="card-phone">${club.phone}</div>
                <div class="card-price" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size:10px; color:#999;">⭐⭐⭐⭐☆ (4 отзыва)</div>
                    <div class="price-value ${club.price === 0 ? 'free' : ''}">
                        ${club.price === 0 ? 'Бесплатно' : club.price + ' руб/мес'}
                    </div>
                </div>
            </div>
        `).join('');
        console.log('Отображаются кружки:', clubs);
    }
}
// Открытие модального окна для добавления кружка
function openAddModal() {
    editingClubId = null;
    document.getElementById('clubModalTitle').textContent = 'Добавление кружка';
    document.getElementById('editClubName').value = '';
    document.getElementById('editClubAddress').value = '';
    loadModalCities();
    document.getElementById('editClubDistrict').innerHTML = '<option value="">Выберите район</option>';
    document.getElementById('editClubAgeFrom').value = '';
    document.getElementById('editClubAgeTo').value = '';
    document.getElementById('editClubPrice').value = '';
    document.getElementById('editClubType').value = '';
    document.getElementById('editClubPhone').value = '';
    document.getElementById('editClubSchedule').value = '';
    document.getElementById('deleteClubBtn').style.display = 'none';
    document.getElementById('clubModal').style.display = 'block';
}
// Открытие модального окна для редактирования кружка
async function openEditModal(clubId) {
    const club = currentClubs.find(c => c.id === clubId);
    if (!club) return;
    
    editingClubId = clubId;
    document.getElementById('clubModalTitle').textContent = 'Редактирование кружка';
    document.getElementById('editClubName').value = club.name;
    document.getElementById('editClubAddress').value = club.address;
    document.getElementById('editClubAgeFrom').value = club.age_from;
    document.getElementById('editClubAgeTo').value = club.age_to;
    document.getElementById('editClubPrice').value = club.price;
    document.getElementById('editClubType').value = club.type;
    document.getElementById('editClubPhone').value = club.phone;
    document.getElementById('editClubSchedule').value = club.schedule;
    document.getElementById('deleteClubBtn').style.display = 'block';
    
    const citiesResponse = await fetch('/api/cities');
    const cities = await citiesResponse.json();
    const citySelect = document.getElementById('editClubCity');
    citySelect.innerHTML = '<option value="">Выберите город</option>';
    
    for (const city of cities) {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        if (city.name === club.city) {
            option.selected = true;
        }
        citySelect.appendChild(option);
    }
    
    const districtsResponse = await fetch(`/api/districts?city=${encodeURIComponent(club.city)}`);
    const districtsData = await districtsResponse.json();
    const districtSelect = document.getElementById('editClubDistrict');
    districtSelect.innerHTML = '<option value="">Выберите район</option>';
    
    if (districtsData.districts) {
        for (const district of districtsData.districts) {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            if (district === club.district) {
                option.selected = true;
            }
            districtSelect.appendChild(option);
        }
    }
    
    document.getElementById('clubModal').style.display = 'block';
}
// Сохранение кружка
async function saveClub() {
    const name = document.getElementById('editClubName').value.trim();
    const address = document.getElementById('editClubAddress').value.trim();
    const city = document.getElementById('editClubCity').value;
    const district = document.getElementById('editClubDistrict').value;
    const age_from = document.getElementById('editClubAgeFrom').value;
    const age_to = document.getElementById('editClubAgeTo').value;
    const price = document.getElementById('editClubPrice').value;
    const type = document.getElementById('editClubType').value;
    let phone = document.getElementById('editClubPhone').value.trim();
    const schedule = document.getElementById('editClubSchedule').value.trim();
    
    if (!name) {
        alert('Укажите название кружка');
        return;
    }
    if (!address) {
        alert('Укажите адрес');
        return;
    }
    if (!city || city === '') {
        alert('Выберите город');
        return;
    }
    if (!district || district === '' || district === 'Выберите район') {
        alert('Выберите район');
        return;
    }
    if (!age_from) {
        alert('Укажите возраст ОТ');
        return;
    }
    if (!age_to) {
        alert('Укажите возраст ДО');
        return;
    }
    if (!price && price !== '0') {
        alert('Укажите цену (0 - бесплатно)');
        return;
    }
    if (!phone) {
        alert('Укажите номер телефона');
        return;
    }
    if (!schedule) {
        alert('Укажите расписание');
        return;
    }
    if (!type || type === '' || type === 'Выберите тип кружка') {
        alert('Выберите тип кружка');
        return;
    }
    
    const ageFromNum = parseInt(age_from);
    const ageToNum = parseInt(age_to);
    const priceNum = parseInt(price);
    
    if (isNaN(ageFromNum) || ageFromNum < 3 || ageFromNum > 17) {
        alert('Возраст ОТ должен быть числом от 3 до 17');
        return;
    }
    if (isNaN(ageToNum) || ageToNum < 3 || ageToNum > 17) {
        alert('Возраст ДО должен быть числом от 3 до 17');
        return;
    }
    if (ageFromNum > ageToNum) {
        alert('Возраст ОТ не может быть больше Возраста ДО');
        return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
        alert('Цена должна быть числом (0 - бесплатно)');
        return;
    }
    
    const phoneDigits = phone.replace(/[^0-9+]/g, '');
    if (phoneDigits.length < 10) {
        alert('Введите корректный номер телефона (минимум 10 цифр)');
        return;
    }
    
    const data = {
        name: name,
        address: address,
        city: city,
        district: district,
        age_from: ageFromNum,
        age_to: ageToNum,
        price: priceNum,
        type: type,
        phone: phone,
        schedule: schedule,
        description: "Кружок"
    };

    const url = editingClubId ? `/api/clubs/${editingClubId}` : '/api/clubs';
    const method = editingClubId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            document.getElementById('clubModal').style.display = 'none';
            loadClubs();
        } else {
            alert('Ошибка сервера при сохранении');
        }
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка соединения с сервером');
    }
}
// Удаление кружка
async function deleteClub() {
    if (!editingClubId) return;
    
    if (confirm('Удалить кружок?')) {
        try {
            const response = await fetch(`/api/clubs/${editingClubId}`, { method: 'DELETE' });
            if (response.ok) {
                document.getElementById('clubModal').style.display = 'none';
                loadClubs();
            } else {
                alert('Ошибка удаления');
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка удаления');
        }
    }
}
// Получение текущего местоположения пользователя
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        } else {
            reject('Геолокация не поддерживается');
        }
    });
}
// Построение маршрута
async function showRoute(clubId) {
    const club = currentClubs.find(c => c.id === clubId);
    if (!club) return;

    if (!mapVisible) {
        toggleMap();
    }

    const waitForMap = () => {
        return new Promise((resolve) => {
            if (map && typeof ymaps !== 'undefined') {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (map && typeof ymaps !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    };

    await waitForMap();
    buildRouteFromAddress(club.address, club.name);
}
function buildRoute(startCoords, endCoords) {
    ymaps.route([startCoords, endCoords])
        .then(function(route) {
            if (currentRoute) {
                map.geoObjects.remove(currentRoute);
            }
            currentRoute = route;
            map.geoObjects.add(route);
            
            const distance = route.getLength();
            const distanceKm = (distance / 1000).toFixed(1);
            const duration = route.getJamsTime();
            const minutes = Math.floor(duration / 60);
            
            map.setBounds(route.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 50
            });
        })
        .catch(function(error) {
            const placemark = new ymaps.Placemark(endCoords);
            map.geoObjects.add(placemark);
            map.setCenter(endCoords, 15);
        });
}
function buildRouteFromAddress(address, clubName) {
    if (typeof ymaps === 'undefined') {
        alert('Карта не загружена');
        return;
    }
    
    const club = currentClubs.find(c => c.name === clubName);
    const city = club ? club.city : null;
    
    let fullAddress = address;
    
    if (city && !fullAddress.includes(city)) {
        fullAddress = `${city}, ${fullAddress}`;
    }
    
    if (!fullAddress.includes('Россия')) {
        fullAddress = `Россия, ${fullAddress}`;
    }

    ymaps.geocode(fullAddress, { results: 1 })
        .then(function(res) {
            const firstGeoObject = res.geoObjects.get(0);
            if (!firstGeoObject) {
                alert('Не удалось найти адрес: ' + fullAddress);
                return;
            }
            const clubCoords = firstGeoObject.geometry.getCoordinates();
            buildRouteWithCoords(clubCoords);
        })
        .catch(function(error) {
            alert('Не удалось найти адрес: ' + fullAddress);
        });
}
function buildRouteWithCoords(clubCoords) {
    if (currentRoute) {
        map.geoObjects.remove(currentRoute);
        currentRoute = null;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                buildRoute(userCoords, clubCoords);
            },
            function(error) {
                const mapCenter = map.getCenter();
                buildRoute(mapCenter, clubCoords);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );
    } else {
        const mapCenter = map.getCenter();
        buildRoute(mapCenter, clubCoords);
    }
}
// Отображение меток на карте
function displayOnMap(clubs) {
    if (!map) return;
    
    map.geoObjects.removeAll();
    
    clubs.forEach(club => {
        if (clubsCoordinates.has(club.id)) {
            const coords = clubsCoordinates.get(club.id);
            const placemark = new ymaps.Placemark(coords, {
                balloonContent: `<b>${club.name}</b><br>${club.address}<br>${club.phone}`
            });
            placemark.events.add('click', () => showRoute(club.id));
            map.geoObjects.add(placemark);
        } else {
            let fullAddress = club.address;
            
            if (club.city && !fullAddress.includes(club.city)) {
                fullAddress = `${club.city}, ${fullAddress}`;
            }
            
            if (!fullAddress.includes('Россия')) {
                fullAddress = `Россия, ${fullAddress}`;
            }
            
            ymaps.geocode(fullAddress, { results: 1 }).then(res => {
                const obj = res.geoObjects.get(0);
                if (obj) {
                    const coords = obj.geometry.getCoordinates();
                    clubsCoordinates.set(club.id, coords);
                    const placemark = new ymaps.Placemark(coords, {
                        balloonContent: `<b>${club.name}</b><br>${club.address}<br>${club.phone}`
                    });
                    placemark.events.add('click', () => showRoute(club.id));
                    map.geoObjects.add(placemark);
                }
            });
        }
    });
}
// Вход в режим администратора
function enterAdminMode() {
    isAdminMode = true;
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('adminBtn').style.display = 'none';
    document.getElementById('filtersContainer').style.display = 'none';
    document.getElementById('mainTitle').textContent = 'Админ-панель';
    document.getElementById('mainSubtitle').style.display = 'none';
    document.body.classList.add('admin-mode');
    
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.style.display = 'none';
    }
    
    loadClubs();
}
// Выход из режима администратор
function exitAdminMode() {
    isAdminMode = false;
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('adminBtn').style.display = 'block';
    document.getElementById('filtersContainer').style.display = 'block';
    document.getElementById('mainTitle').textContent = 'Карта детства';
    document.getElementById('mainSubtitle').style.display = 'block';
    document.body.classList.remove('admin-mode');
    loadClubs();
}
// Запуск всех функций после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadCities();
    
    document.getElementById('searchBtn').addEventListener('click', loadClubs);
    document.getElementById('toggleMapBtn').addEventListener('click', toggleMap);
    document.getElementById('citySelect').addEventListener('change', () => {
        loadDistricts();
        loadClubs();
    });
    
    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
        document.getElementById('birthDate').value = '';
        document.getElementById('ageYear').value = '';
        document.getElementById('citySelect').value = 'Находка';
        document.getElementById('districtFilter').innerHTML = '<option value=""></option>';
        document.getElementById('typeFilter').value = '';
        document.getElementById('freeOnly').checked = false;
        loadDistricts();
        loadClubs();
    });
    
    const loginModal = document.getElementById('loginModal');
    document.getElementById('adminBtn').onclick = () => {
        loginModal.style.display = 'block';
    };
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            loginModal.style.display = 'none';
            document.getElementById('clubModal').style.display = 'none';
        };
    });
    
    window.onclick = (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === document.getElementById('clubModal')) document.getElementById('clubModal').style.display = 'none';
    };
    
    document.getElementById('loginBtn').onclick = async () => {
        const login = document.getElementById('adminLogin').value;
        const password = document.getElementById('adminPassword').value;
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        const data = await response.json();
        if (data.success) {
            loginModal.style.display = 'none';
            enterAdminMode();
            document.getElementById('adminLogin').value = '';
            document.getElementById('adminPassword').value = '';
        } else {
            alert('Неверный логин или пароль');
        }
    };
    
    document.getElementById('logoutBtn').onclick = () => {
        exitAdminMode();
    };
    
    document.getElementById('saveClubBtn').onclick = saveClub;
    document.getElementById('deleteClubBtn').onclick = deleteClub;
    document.getElementById('editClubCity').addEventListener('change', loadModalDistricts);

    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.log);
}

});