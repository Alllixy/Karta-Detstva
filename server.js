const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Список кружков
const clubs = [
    { id: 1, name: "Гитара", city: "Находка", district: "МЖК", age_from: 8, age_to: 16, price: 1200, type: "музыка", address: "бульвар Энтузиастов, 1, Находка, Приморский край", phone: "+7 (423) 111-11-11", schedule: "Вт/Чт 15:00-17:00" },
    { id: 2, name: "Английский язык", city: "Находка", district: "МЖК", age_from: 6, age_to: 14, price: 1500, type: "английский", address: "Северный проспект, 2, Находка, Приморский край", phone: "+7 (423) 222-22-22", schedule: "Пн/Ср 16:00-18:00" },
    { id: 3, name: "Робототехника", city: "Находка", district: "МЖК", age_from: 9, age_to: 13, price: 1600, type: "робототехника", address: "улица Дзержинского, 40, Находка, Приморский край", phone: "+7 (423) 404-04-04", schedule: "Вт/Чт 15:00-17:00" },
    { id: 4, name: "Современные танцы", city: "Находка", district: "МЖК", age_from: 7, age_to: 15, price: 1300, type: "танцы", address: "бульвар Энтузиастов, 12к3, Находка, Приморский край", phone: "+7 (423) 333-33-33", schedule: "Вт/Чт 17:00-19:00" },
    { id: 5, name: "Рисование", city: "Находка", district: "МЖК", age_from: 5, age_to: 12, price: 1000, type: "рисование", address: "Северный проспект, 18, Находка, Приморский край", phone: "+7 (423) 444-44-44", schedule: "Ср/Сб 10:00-12:00" },
    { id: 6, name: "Карате", city: "Находка", district: "МЖК", age_from: 8, age_to: 14, price: 1200, type: "спорт", address: "бульвар Энтузиастов, 14, Находка, Приморский край", phone: "+7 (423) 101-01-01", schedule: "Вт/Чт/Сб 17:00-19:00" },
    { id: 7, name: "Футбол", city: "Находка", district: "Рыбный порт", age_from: 7, age_to: 14, price: 1000, type: "спорт", address: "Находкинский проспект, 66А, Находка, Приморский край", phone: "+7 (423) 666-66-66", schedule: "Вт/Чт/Сб 15:00-17:00" },
    { id: 8, name: "Фортепиано", city: "Находка", district: "Рыбный порт", age_from: 5, age_to: 12, price: 1300, type: "музыка", address: "Находкинский проспект, 70, Находка, Приморский край", phone: "+7 (423) 777-77-77", schedule: "Пн/Ср 15:00-17:00" },
    { id: 9, name: "Спортивные танцы", city: "Находка", district: "Рыбный порт", age_from: 6, age_to: 14, price: 1400, type: "танцы", address: "Верхне-Морская улица, 104А, Находка, Приморский край", phone: "+7 (423) 555-55-55", schedule: "Пн/Ср/Пт 18:00-20:00" },
    { id: 10, name: "Шахматы", city: "Находка", district: "Рыбный порт", age_from: 6, age_to: 14, price: 800, type: "шахматы", address: "Находкинский проспект, 70, Находка, Приморский край", phone: "+7 (423) 888-88-88", schedule: "Вт/Чт 16:00-18:00" },
    { id: 11, name: "Дзюдо", city: "Находка", district: "Тихоокеанская", age_from: 8, age_to: 14, price: 0, type: "спорт", address: "Находкинский проспект, 49, Находка, Приморский край", phone: "+7 (423) 303-03-03", schedule: "Пн/Ср/Пт 18:00-20:00" },
    { id: 12, name: "Вокал", city: "Находка", district: "Южный", age_from: 7, age_to: 15, price: 1200, type: "музыка", address: "Спортивная улица, 27, Находка, Приморский край", phone: "+7 (423) 202-02-02", schedule: "Пн/Ср 17:00-18:30" },
    { id: 13, name: "Программирование", city: "Находка", district: "Южный", age_from: 10, age_to: 15, price: 1700, type: "программирование", address: "Спортивная улица, 27, Находка, Приморский край", phone: "+7 (423) 505-05-05", schedule: "Пн/Ср/Пт 16:00-18:00" },
    { id: 14, name: "Театральная студия", city: "Находка", district: "Южный", age_from: 7, age_to: 15, price: 1100, type: "театр", address: "Спортивная улица, 35, Находка, Приморский край", phone: "+7 (423) 999-99-99", schedule: "Пн/Ср 18:00-20:00" },
    { id: 15, name: "Рисование", city: "Находка", district: "Южный", age_from: 5, age_to: 10, price: 0, type: "рисование", address: "Бокситогорская улица, 38, Находка, Приморский край", phone: "+7 (423) 606-06-06", schedule: "Сб/Вс 10:00-12:00" },
    { id: 16, name: "Бальные танцы", city: "Находка", district: "1-й участок", age_from: 5, age_to: 12, price: 1300, type: "танцы", address: "улица Пирогова, 54А, Находка, Приморский край", phone: "+7 (423) 707-07-07", schedule: "Сб/Вс 11:00-13:00" },
    { id: 17, name: "Гитара", city: "Находка", district: "1-й участок", age_from: 8, age_to: 14, price: 0, type: "музыка", address: "улица Арсеньева, 12, Находка, Приморский край", phone: "+7 (423) 808-08-08", schedule: "Вт/Чт 14:00-16:00" },
    { id: 18, name: "Легкая атлетика", city: "Находка", district: "Ближняя Пограничная", age_from: 7, age_to: 15, price: 900, type: "спорт", address: "улица Мичурина, 10А, Находка, Приморский край", phone: "+7 (423) 909-09-09", schedule: "Пн/Ср/Пт 15:00-17:00" },
    { id: 19, name: "Английский язык", city: "Находка", district: "Ближняя Пограничная", age_from: 7, age_to: 12, price: 1600, type: "английский", address: "Пограничная улица, 40А, Находка, Приморский край", phone: "+7 (423) 010-10-10", schedule: "Пн/Ср 15:00-17:00" },
    { id: 20, name: "Шахматы", city: "Находка", district: "Дальняя Пограничная", age_from: 7, age_to: 14, price: 0, type: "шахматы", address: "улица Попова, 20, Находка, Приморский край", phone: "+7 (423) 444-55-66", schedule: "Сб 11:00-13:00" },
    { id: 21, name: "Рукоделие", city: "Находка", district: "Падь Ободная", age_from: 7, age_to: 12, price: 700, type: "рукоделие", address: "Почтовый переулок, 11, Находка, Приморский край", phone: "+7 (423) 111-22-33", schedule: "Вт/Пт 15:00-17:00" },
    { id: 22, name: "Хор", city: "Находка", district: "Падь Ободная", age_from: 6, age_to: 12, price: 900, type: "музыка", address: "Комсомольская улица, 32, Находка, Приморский край", phone: "+7 (423) 333-44-55", schedule: "Вт/Чт 15:00-16:30" },
    { id: 23, name: "Баскетбол", city: "Находка", district: "Соленое Озеро", age_from: 8, age_to: 14, price: 1000, type: "спорт", address: "проспект Мира, 39, Находка, Приморский край", phone: "+7 (423) 222-33-44", schedule: "Пн/Ср/Пт 16:00-18:00" },
    { id: 24, name: "Волейбол", city: "Находка", district: "Соленое Озеро", age_from: 9, age_to: 15, price: 1000, type: "спорт", address: "Озёрный бульвар, 10, Находка, Приморский край", phone: "+7 (423) 555-66-77", schedule: "Вт/Чт 17:00-19:00" },
    { id: 25, name: "Керамика", city: "Находка", district: "Мыс Астафьева", age_from: 7, age_to: 13, price: 800, type: "рукоделие", address: "улица Астафьева, 17, Находка, Приморский край", phone: "+7 (423) 666-77-88", schedule: "Ср/Пт 14:00-16:00" }
];

// Список городов
const cities = [
    { id: 1, name: "Находка", default: true }
];

// Список районов в городах
const districts = {
    "Находка": ["МЖК", "Рыбный порт", "Южный", "1-й участок", "Ближняя Пограничная", "Дальняя Пограничная", "Падь Ободная", "Соленое Озеро", "Ленинская", "Мыс Астафьева"]
};

// Логин и пароль для админа
const adminCredentials = { login: "1", password: "1" };
let isAdminLoggedIn = false;

// Кэш для результатов фильтрации по городу
const cityCache = new Map();

// Получение списка городов
app.get('/api/cities', (req, res) => {
    res.json(cities);
});

// Получение кружков с фильтрацией
app.get('/api/clubs', (req, res) => {
    let filteredClubs = [...clubs];
    
    // Фильтр по городу 
    if (req.query.city) {
        const city = req.query.city;
        if (cityCache.has(city)) {
            filteredClubs = [...cityCache.get(city)];
        } else {
            filteredClubs = filteredClubs.filter(c => c.city === city);
            cityCache.set(city, [...filteredClubs]);
        }
    }
    
    // Фильтр по возрасту
    if (req.query.age) {
        const age = parseInt(req.query.age);
        filteredClubs = filteredClubs.filter(c => age >= c.age_from && age <= c.age_to);
    }
    
    // Фильтр по району
    if (req.query.district) {
        filteredClubs = filteredClubs.filter(c => c.district === req.query.district);
    }
    
    // Фильтр по типу
    if (req.query.type) {
        filteredClubs = filteredClubs.filter(c => c.type === req.query.type);
    }
    
    // Фильтр по цене (бесплатные)
    if (req.query.free === 'true') {
        filteredClubs = filteredClubs.filter(c => c.price === 0);
    }
    
    res.json(filteredClubs);
});

app.get('/api/clubs/:id', (req, res) => {
    const club = clubs.find(c => c.id === parseInt(req.params.id));
    club ? res.json(club) : res.status(404).json({ error: 'Кружок не найден' });
});

// Вход в админ-панель
app.post('/api/admin/login', (req, res) => {
    const { login, password } = req.body;
    if (login === adminCredentials.login && password === adminCredentials.password) {
        isAdminLoggedIn = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/api/admin/logout', (req, res) => {
    isAdminLoggedIn = false;
    res.json({ success: true });
});

app.get('/api/admin/check', (req, res) => {
    res.json({ isAdmin: isAdminLoggedIn });
});

// Добавление нового кружка
app.post('/api/clubs', (req, res) => {
    if (!isAdminLoggedIn) {
        return res.status(403).json({ error: 'Доступ только для администратора' });
    }
    
    const newClub = req.body;
    newClub.id = clubs.length + 1;
    clubs.push(newClub);
    res.json(newClub);
});

app.get('/api/districts', (req, res) => {
    const city = req.query.city;
    if (city && districts[city]) {
        res.json({ districts: districts[city] });
    } else {
        res.json({ districts: [] });
    }
});

// Удаление кружка
app.delete('/api/clubs/:id', (req, res) => {
    if (!isAdminLoggedIn) {
        return res.status(403).json({ error: 'Доступ только для администратора' });
    }
    
    const id = parseInt(req.params.id);
    const index = clubs.findIndex(c => c.id === id);
    if (index !== -1) {
        clubs.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Кружок не найден' });
    }
});

// Редактирование кружка
app.put('/api/clubs/:id', (req, res) => {
    if (!isAdminLoggedIn) {
        return res.status(403).json({ error: 'Доступ только для администратора' });
    }
    
    const id = parseInt(req.params.id);
    const index = clubs.findIndex(c => c.id === id);
    if (index !== -1) {
        clubs[index] = { ...clubs[index], ...req.body, id: id };
        res.json(clubs[index]);
    } else {
        res.status(404).json({ error: 'Кружок не найден' });
    }
});

app.listen(port, () => {
    console.log(`Сервер на http://localhost:${port}`);
});