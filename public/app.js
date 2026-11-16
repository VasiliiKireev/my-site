// 1. Эффект матрицы (падающие символы)
const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);

// 2. Инициализация карты Leaflet
const map = L.map("map").setView([20, 0], 2);
// Темный стиль карты (CartoDB Dark Matter)
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "© OpenStreetMap © CartoDB"
}).addTo(map);

// Демо-данные для точек (можно менять в зависимости от года)
const breachData = [
    { coords: [37.0902, -95.7129], count: 150, country: "США" },
    { coords: [51.1657, 10.4515], count: 80, country: "Германия" },
    { coords: [61.5240, 105.3188], count: 120, country: "Россия" },
    { coords: [35.8617, 104.1954], count: 90, country: "Китай" },
    { coords: [-25.2744, 133.7751], count: 40, country: "Австралия" }
];

// Функция для добавления точек на карту
function addMarkers(year) {
    // Удаляем старые маркеры, если есть
    map.eachLayer((layer) => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });

    breachData.forEach(breach => {
        // Немного случайности для демонстрации смены года
        const randomFactor = year === 2023 ? 1 : (year === 2024 ? 1.2 : (year === 2025 ? 1.5 : 1.8));
        const radius = Math.sqrt(breach.count * randomFactor) * 2;
        const color = radius > 25 ? "#f00" : (radius > 15 ? "#ff0" : "#0f0");

        L.circleMarker(breach.coords, {
            radius: radius,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }).addTo(map).bindPopup(`<b>${breach.country}</b><br>Утечек: ${Math.round(breach.count * randomFactor)} млн`);
    });
}

// Инициализация точек
addMarkers(2023);

// Обработка кнопок выбора года
document.querySelectorAll(".year-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".year-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const year = parseInt(e.target.textContent);
        addMarkers(year);
    });
});

// 3. Обработка формы проверки email (демо-режим)
const form = document.getElementById("check-form");
const emailInput = document.getElementById("emailInput");
const resultBox = document.getElementById("result");

// Функция для проигрывания звука (заглушка)
function playSound(type) {
    if (!document.getElementById("soundCheck").checked) return;
    // Здесь можно добавить реальный звук через AudioContext или файл
    console.log("Звук: " + type);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    resultBox.className = "result-box active"; // Делаем видимым
    resultBox.innerHTML = "<p>Поиск в базе данных...</p>";

    // Имитация задержки сети
    setTimeout(() => {
        if (email === "test@example.com") {
            resultBox.className = "result-box danger active";
            resultBox.innerHTML = `
                <h3>🔴 НАЙДЕНЫ УТЕЧКИ</h3>
                <p>Email <b>${email}</b> найден в 3 утечках.</p>
                <ul>
                    <li>Adobe (2013) — 152 млн аккаунтов</li>
                    <li>LinkedIn (2012) — 164 млн аккаунтов</li>
                    <li>Canva (2019) — 137 млн аккаунтов</li>
                </ul>
                <p>Срочно смените пароль!</p>
            `;
            playSound("danger");
        } else {
            resultBox.className = "result-box clean active";
            resultBox.innerHTML = `<h3>✅ УТЕЧЕК НЕ НАЙДЕНО</h3><p>Ваш email <b>${email}</b> не найден в известных базах.</p>`;
            playSound("clean");
        }
    }, 800);
});

// Клик по демо-email для автозаполнения
document.querySelector(".demo-email").addEventListener("click", () => {
    emailInput.value = "test@example.com";
});
