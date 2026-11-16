const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '© Stadia Maps' }).addTo(map);
L.circleMarker([39.8, -98.5], { radius: 14, fillColor: '#ef4444', fillOpacity: 0.8, color: '#fff', weight: 2 }).addTo(map).bindPopup('США: 96.7 млн');
L.circleMarker([61.5, 105.3], { radius: 14, fillColor: '#ef4444', fillOpacity: 0.8, color: '#fff', weight: 2 }).addTo(map).bindPopup('Россия: 78.4 млн');

const drawer = document.getElementById('drawer');
document.getElementById('drawerToggle').onclick = () => drawer.classList.add('open');
document.getElementById('drawerClose').onclick = () => drawer.classList.remove('open');

document.getElementById('checkBtn').onclick = async () => {
  const email = document.getElementById('emailInput').value;
  const res = document.getElementById('result');
  res.innerHTML = 'Проверка...';
  try {
    const r = await fetch('/api/check/' + email);
    const d = await r.json();
    res.innerHTML = '<p style="color:red">🔴 Найдена утечка: ' + d.breaches[0].Title + '</p>';
  } catch(e) { res.innerHTML = 'Ошибка'; }
};
