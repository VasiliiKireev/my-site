document.addEventListener("DOMContentLoaded", () => {
    // 1. Инициализация карты
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB'
    }).addTo(map);

    // Данные для карты (пример)
    const breachData = [
        { coords: [37.0902, -95.7129], count: 150, country: "США" },
        { coords: [51.1657, 10.4515], count: 80, country: "Германия" },
        { coords: [61.5240, 105.3188], count: 120, country: "Россия" },
        { coords: [35.8617, 104.1954], count: 90, country: "Китай" },
        { coords: [-25.2744, 133.7751], count: 40, country: "Австралия" }
    ];

    breachData.forEach(breach => {
        const radius = Math.sqrt(breach.count) * 2;
        const color = radius > 25 ? "#ff4444" : (radius > 15 ? "#ffbb33" : "#00ff88");
        L.circleMarker(breach.coords, {
            radius: radius, fillColor: color, color: color, weight: 1, opacity: 1, fillOpacity: 0.6
        }).addTo(map).bindPopup(`<b>${breach.country}</b><br>Утечек: ${breach.count} млн`);
    });

    // 2. Обработка формы
    const form = document.getElementById('check-form');
    const emailInput = document.getElementById('emailInput');
    const resultBox = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        
        resultBox.className = 'result-box active';
        resultBox.innerHTML = '<p>Поиск в базе данных...</p>';

        setTimeout(() => {
            if (email === 'test@example.com') {
                resultBox.className = 'result-box danger active';
                resultBox.innerHTML = `
                    <h3>🔴 Высокий риск</h3>
                    <p>Найдено 3 утечки, содержащие этот email:</p>
                    <ul>
                        <li><b>Adobe (2013)</b> · Аккаунтов: 152,000,000</li>
                        <li><b>LinkedIn (2012)</b> · Аккаунтов: 164,000,000</li>
                        <li><b>Canva (2019)</b> · Аккаунтов: 137,000,000</li>
                    </ul>
                    <p>Если ваш пароль был скомпрометирован — немедленно смените его и включите двухфакторную аутентификацию.</p>
                `;
            } else {
                resultBox.className = 'result-box clean active';
                resultBox.innerHTML = `
                    <h3>✅ Низкий риск</h3>
                    <p>Этот email не найден в известных публичных утечках.</p>
                    <p>Рекомендация: используйте уникальные пароли и включите двухфакторную аутентификацию.</p>
                `;
            }
        }, 1000);
    });
});
