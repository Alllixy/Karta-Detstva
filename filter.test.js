<<<<<<< HEAD
const testClubs = [
    { id: 1, name: "Гитара", city: "Находка", district: "МЖК", age_from: 8, age_to: 16, price: 1200, type: "музыка" },
    { id: 2, name: "Английский", city: "Находка", district: "МЖК", age_from: 6, age_to: 14, price: 1500, type: "английский" },
    { id: 3, name: "Робототехника", city: "Находка", district: "МЖК", age_from: 9, age_to: 13, price: 1600, type: "робототехника" },
    { id: 4, name: "Танцы", city: "Находка", district: "Рыбный порт", age_from: 7, age_to: 15, price: 1300, type: "танцы" },
    { id: 5, name: "Рисование", city: "Москва", district: "Центральный", age_from: 5, age_to: 12, price: 0, type: "рисование" }
];

// Функция фильтрации
function filterClubs(clubs, filters) {
    let result = [...clubs];
    
    if (filters.city) {
        result = result.filter(c => c.city === filters.city);
    }
    
    if (filters.age) {
        const age = parseInt(filters.age);
        result = result.filter(c => age >= c.age_from && age <= c.age_to);
    }
    
    if (filters.district) {
        result = result.filter(c => c.district === filters.district);
    }
    
    if (filters.type) {
        result = result.filter(c => c.type === filters.type);
    }
    
    if (filters.free === true) {
        result = result.filter(c => c.price === 0);
    }
    
    return result;
}

// Тест 1: Фильтрация по городу
test('Фильтр по городу Находка должен вернуть 4 кружка', () => {
    const result = filterClubs(testClubs, { city: "Находка" });
    expect(result.length).toBe(4);
});

// Тест 2: Фильтрация по возрасту 7 лет
test('Фильтр по возрасту 7 лет должен вернуть кружки где возраст подходит', () => {
    const result = filterClubs(testClubs, { age: "7" });
    expect(result.length).toBe(3);
});

// Тест 3: Фильтрация по типу "музыка"
test('Фильтр по типу музыка должен вернуть кружок Гитара', () => {
    const result = filterClubs(testClubs, { type: "музыка" });
    expect(result[0].name).toBe("Гитара");
    expect(result.length).toBe(1);
});

// Тест 4: Фильтрация по бесплатным
test('Фильтр бесплатные должен вернуть кружок с ценой 0', () => {
    const result = filterClubs(testClubs, { free: true });
    expect(result[0].price).toBe(0);
});

// Тест 5: Фильтр по нескольким параметрам
test('Фильтр по городу Находка и району Рыбный порт', () => {
    const result = filterClubs(testClubs, { city: "Находка", district: "Рыбный порт" });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Танцы");
=======
const testClubs = [
    { id: 1, name: "Гитара", city: "Находка", district: "МЖК", age_from: 8, age_to: 16, price: 1200, type: "музыка" },
    { id: 2, name: "Английский", city: "Находка", district: "МЖК", age_from: 6, age_to: 14, price: 1500, type: "английский" },
    { id: 3, name: "Робототехника", city: "Находка", district: "МЖК", age_from: 9, age_to: 13, price: 1600, type: "робототехника" },
    { id: 4, name: "Танцы", city: "Находка", district: "Рыбный порт", age_from: 7, age_to: 15, price: 1300, type: "танцы" },
    { id: 5, name: "Рисование", city: "Москва", district: "Центральный", age_from: 5, age_to: 12, price: 0, type: "рисование" }
];

// Функция фильтрации
function filterClubs(clubs, filters) {
    let result = [...clubs];
    
    if (filters.city) {
        result = result.filter(c => c.city === filters.city);
    }
    
    if (filters.age) {
        const age = parseInt(filters.age);
        result = result.filter(c => age >= c.age_from && age <= c.age_to);
    }
    
    if (filters.district) {
        result = result.filter(c => c.district === filters.district);
    }
    
    if (filters.type) {
        result = result.filter(c => c.type === filters.type);
    }
    
    if (filters.free === true) {
        result = result.filter(c => c.price === 0);
    }
    
    return result;
}

// Тест 1: Фильтрация по городу
test('Фильтр по городу Находка должен вернуть 4 кружка', () => {
    const result = filterClubs(testClubs, { city: "Находка" });
    expect(result.length).toBe(4);
});

// Тест 2: Фильтрация по возрасту 7 лет
test('Фильтр по возрасту 7 лет должен вернуть кружки где возраст подходит', () => {
    const result = filterClubs(testClubs, { age: "7" });
    expect(result.length).toBe(3);
});

// Тест 3: Фильтрация по типу "музыка"
test('Фильтр по типу музыка должен вернуть кружок Гитара', () => {
    const result = filterClubs(testClubs, { type: "музыка" });
    expect(result[0].name).toBe("Гитара");
    expect(result.length).toBe(1);
});

// Тест 4: Фильтрация по бесплатным
test('Фильтр бесплатные должен вернуть кружок с ценой 0', () => {
    const result = filterClubs(testClubs, { free: true });
    expect(result[0].price).toBe(0);
});

// Тест 5: Фильтр по нескольким параметрам
test('Фильтр по городу Находка и району Рыбный порт', () => {
    const result = filterClubs(testClubs, { city: "Находка", district: "Рыбный порт" });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Танцы");
>>>>>>> 3284730a6b3dd3d05b2ecf6ee1e0da599e5065df
});