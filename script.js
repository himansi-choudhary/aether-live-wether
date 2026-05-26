/* ============================================================
   AETHER WEATHER — script.js
   Full weather app logic, API calls, animations
   ============================================================

   ⚡ SETUP:
   1. Get a free API key at https://openweathermap.org/api
   2. Replace 'YOUR_API_KEY_HERE' below with your key
   ============================================================ */

const API_KEY = 'YOUR_API_KEY_HERE';
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

/* ── DOM References ── */
const cityInput      = document.getElementById('cityInput');
const searchBtn      = document.getElementById('searchBtn');
const weatherCard    = document.getElementById('weatherCard');
const loaderWrap     = document.getElementById('loaderWrap');
const emptyState     = document.getElementById('emptyState');
const errorToast     = document.getElementById('errorToast');
const errorMsg       = document.getElementById('errorMsg');

/* Weather data fields */
const cityName       = document.getElementById('cityName');
const countryCode    = document.getElementById('countryCode');
const currentDate    = document.getElementById('currentDate');
const currentTime    = document.getElementById('currentTime');
const weatherIconImg = document.getElementById('weatherIconImg');
const tempValue      = document.getElementById('tempValue');
const feelsLike      = document.getElementById('feelsLike');
const weatherDesc    = document.getElementById('weatherDesc');
const humidity       = document.getElementById('humidity');
const windSpeed      = document.getElementById('windSpeed');
const tempMinMax     = document.getElementById('tempMinMax');
const visibility     = document.getElementById('visibility');
const sunrise        = document.getElementById('sunrise');
const sunset         = document.getElementById('sunset');
const pressureVal    = document.getElementById('pressureVal');
const pressureBar    = document.getElementById('pressureBar');
const lastUpdated    = document.getElementById('lastUpdated');

/* Canvases */
const particleCanvas = document.getElementById('particle-canvas');
const rainCanvas     = document.getElementById('rain-canvas');
const snowCanvas     = document.getElementById('snow-canvas');

/* ── State ── */
let currentTheme      = 'default';
let animationFrameId  = null;
let rainInterval      = null;
let snowInterval      = null;
let clockInterval     = null;

/* ============================================================
   CLOCK — updates every second
============================================================ */
function updateClock() {
  const now  = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = now.toLocaleDateString('en-US', opts);
  currentTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ============================================================
   PARTICLE SYSTEM (ambient floating particles)
============================================================ */
(function initParticles() {
  const ctx = particleCanvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = particleCanvas.width  = window.innerWidth;
    H = particleCanvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : H + 10;
      this.r   = Math.random() * 1.5 + 0.3;
      this.a   = Math.random() * 0.5 + 0.05;
      this.vy  = -(Math.random() * 0.4 + 0.1);
      this.vx  = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress  = this.life / this.maxLife;
      const fadeAlpha = Math.sin(progress * Math.PI) * this.a;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${fadeAlpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

/* ============================================================
   RAIN ANIMATION
============================================================ */
function startRain() {
  rainCanvas.classList.remove('hidden');
  rainCanvas.width  = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  const ctx  = rainCanvas.getContext('2d');
  const drops = Array.from({ length: 200 }, () => ({
    x:     Math.random() * rainCanvas.width,
    y:     Math.random() * rainCanvas.height,
    len:   Math.random() * 15 + 10,
    speed: Math.random() * 8 + 4,
    alpha: Math.random() * 0.35 + 0.1,
  }));

  function drawRain() {
    ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.len);
      ctx.strokeStyle = `rgba(174,214,241,${d.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      d.y += d.speed;
      if (d.y > rainCanvas.height) {
        d.y = -20;
        d.x = Math.random() * rainCanvas.width;
      }
    });
    rainInterval = requestAnimationFrame(drawRain);
  }
  drawRain();
}

function stopRain() {
  rainCanvas.classList.add('hidden');
  cancelAnimationFrame(rainInterval);
  const ctx = rainCanvas.getContext('2d');
  ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
}

/* ============================================================
   SNOW ANIMATION
============================================================ */
function startSnow() {
  snowCanvas.classList.remove('hidden');
  snowCanvas.width  = window.innerWidth;
  snowCanvas.height = window.innerHeight;
  const ctx    = snowCanvas.getContext('2d');
  const flakes = Array.from({ length: 120 }, () => ({
    x:     Math.random() * snowCanvas.width,
    y:     Math.random() * snowCanvas.height,
    r:     Math.random() * 3 + 1,
    speed: Math.random() * 1.5 + 0.5,
    drift: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.7 + 0.2,
  }));

  function drawSnow() {
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    flakes.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.fill();
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > snowCanvas.height + 5) {
        f.y = -5;
        f.x = Math.random() * snowCanvas.width;
      }
    });
    snowInterval = requestAnimationFrame(drawSnow);
  }
  drawSnow();
}

function stopSnow() {
  snowCanvas.classList.add('hidden');
  cancelAnimationFrame(snowInterval);
  const ctx = snowCanvas.getContext('2d');
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
}

/* ============================================================
   THEME MANAGER
   Maps weather condition IDs → visual themes
============================================================ */
const THEMES = {
  sunny:   { cls: 'theme-sunny',   clouds: 0.2 },
  clear:   { cls: 'theme-sunny',   clouds: 0.2 },
  cloudy:  { cls: 'theme-cloudy',  clouds: 0.8 },
  rainy:   { cls: 'theme-rainy',   clouds: 1.0, rain: true },
  snow:    { cls: 'theme-snow',    clouds: 0.7, snow: true },
  night:   { cls: 'theme-night',   clouds: 0.3 },
  thunder: { cls: 'theme-thunder', clouds: 1.0, rain: true },
  fog:     { cls: 'theme-fog',     clouds: 0.9 },
};

function getThemeFromCondition(weatherId, isNight) {
  if (isNight) return THEMES.night;
  if (weatherId >= 200 && weatherId < 300) return THEMES.thunder;
  if (weatherId >= 300 && weatherId < 600) return THEMES.rainy;
  if (weatherId >= 600 && weatherId < 700) return THEMES.snow;
  if (weatherId >= 700 && weatherId < 800) return THEMES.fog;
  if (weatherId === 800) return THEMES.sunny;
  if (weatherId > 800)   return THEMES.cloudy;
  return THEMES.clear;
}

function applyTheme(theme) {
  /* Remove all theme classes */
  document.body.classList.remove(
    'theme-sunny','theme-rainy','theme-cloudy','theme-snow',
    'theme-night','theme-thunder','theme-fog'
  );

  /* Stop current effects */
  stopRain();
  stopSnow();

  /* Apply new theme */
  if (theme.cls) document.body.classList.add(theme.cls);

  /* Cloud opacity */
  const cloudsEl = document.getElementById('clouds');
  cloudsEl.style.opacity = theme.clouds;

  /* Precipitation */
  if (theme.rain) startRain();
  if (theme.snow) startSnow();
}

/* ============================================================
   ANIMATED TEMPERATURE COUNTER
============================================================ */
function animateTemp(target) {
  const el       = tempValue;
  const current  = parseInt(el.textContent) || 0;
  const diff     = target - current;
  const steps    = 30;
  let   step     = 0;

  const timer = setInterval(() => {
    step++;
    const eased = current + diff * (1 - Math.pow(1 - step / steps, 3));
    el.textContent = Math.round(eased);
    if (step >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

/* ============================================================
   UI HELPERS
============================================================ */
function showLoader()  {
  loaderWrap.classList.add('visible');
  weatherCard.classList.remove('visible');
  emptyState.classList.add('hidden');
  hideError();
}

function hideLoader()  { loaderWrap.classList.remove('visible'); }

function showCard()    {
  weatherCard.classList.add('visible');
  emptyState.classList.add('hidden');
}

function showError(msg) {
  errorMsg.textContent  = msg;
  errorToast.classList.add('visible');
  setTimeout(() => errorToast.classList.remove('visible'), 4000);
}

function hideError()   { errorToast.classList.remove('visible'); }

function formatTime(unixTs, offsetSecs) {
  const d = new Date((unixTs + offsetSecs) * 1000);
  const h = d.getUTCHours().toString().padStart(2,'0');
  const m = d.getUTCMinutes().toString().padStart(2,'0');
  return `${h}:${m}`;
}

/* ============================================================
   API FETCH
============================================================ */
async function fetchWeather(city) {
  if (!city.trim()) {
    showError('Please enter a city name.');
    return;
  }

  /* Demo mode guard */
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    hideLoader();
    showError('⚠ Please add your OpenWeatherMap API key in script.js to see live data.');
    loadDemoData(city);
    return;
  }

  showLoader();

  try {
    const url      = `${API_BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error('City not found. Check spelling and try again.');
      if (response.status === 401) throw new Error('Invalid API key. Check your OpenWeatherMap key.');
      throw new Error(`Request failed (${response.status}). Please try again.`);
    }

    const data = await response.json();
    hideLoader();
    renderWeather(data);

  } catch (err) {
    hideLoader();
    showError(err.message || 'Network error. Please check your connection.');
  }
}

/* ============================================================
   DEMO DATA (shown when no API key is set)
============================================================ */
function loadDemoData(city) {
  const demo = {
    name:       city || 'Mumbai',
    sys:        { country: 'IN', sunrise: 1700000000, sunset: 1700044000 },
    timezone:   19800,
    weather:    [{ id: 800, description: 'clear sky', icon: '01d' }],
    main:       { temp: 32, feels_like: 36, temp_min: 28, temp_max: 35, humidity: 72, pressure: 1012 },
    wind:       { speed: 4.5 },
    visibility: 8000,
    dt:         Date.now() / 1000,
  };
  renderWeather(demo);
}

/* ============================================================
   RENDER WEATHER
============================================================ */
function renderWeather(data) {
  /* ── Location ── */
  cityName.textContent    = data.name;
  countryCode.textContent = data.sys.country;

  /* ── Icon ── */
  const iconCode          = data.weather[0].icon;
  weatherIconImg.src      = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconImg.alt      = data.weather[0].description;

  /* ── Temperature ── */
  animateTemp(Math.round(data.main.temp));
  feelsLike.textContent   = Math.round(data.main.feels_like);

  /* ── Description ── */
  weatherDesc.textContent = data.weather[0].description;

  /* ── Stats ── */
  humidity.textContent    = `${data.main.humidity}%`;
  windSpeed.textContent   = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  tempMinMax.textContent  = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
  visibility.textContent  = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '—';
  sunrise.textContent     = formatTime(data.sys.sunrise, data.timezone);
  sunset.textContent      = formatTime(data.sys.sunset,  data.timezone);

  /* ── Pressure Bar (900–1060 hPa range) ── */
  const pres = data.main.pressure;
  pressureVal.textContent = `${pres} hPa`;
  const pct = Math.min(100, Math.max(0, ((pres - 900) / 160) * 100));
  setTimeout(() => { pressureBar.style.width = `${pct}%`; }, 200);

  /* ── Last Updated ── */
  const updatedAt = new Date();
  lastUpdated.textContent = `Updated ${updatedAt.getHours().toString().padStart(2,'0')}:${updatedAt.getMinutes().toString().padStart(2,'0')}`;

  /* ── Theme ── */
  const weatherId = data.weather[0].id;
  const nowUnix   = data.dt + data.timezone;
  const isNight   = nowUnix < data.sys.sunrise || nowUnix > data.sys.sunset;
  const theme     = getThemeFromCondition(weatherId, isNight);
  applyTheme(theme);

  /* ── Show Card ── */
  showCard();
}

/* ============================================================
   CLOCK — tick every second
============================================================ */
updateClock();
clockInterval = setInterval(updateClock, 1000);

/* ============================================================
   EVENT LISTENERS
============================================================ */
searchBtn.addEventListener('click', () => {
  fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchWeather(cityInput.value.trim());
});

/* Clear error on new input */
cityInput.addEventListener('input', hideError);

/* Resize canvases on window resize */
window.addEventListener('resize', () => {
  rainCanvas.width  = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  snowCanvas.width  = window.innerWidth;
  snowCanvas.height = window.innerHeight;
});

/* ============================================================
   AUTO-LOAD — detect user location on first visit
============================================================ */
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (API_KEY === 'f766d27e30a0a8bd17535a0ac1dd659c') return; /* skip in demo mode */
        const { latitude: lat, longitude: lon } = pos.coords;
        showLoader();
        try {
          const url  = `${API_BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
          const res  = await fetch(url);
          const data = await res.json();
          hideLoader();
          renderWeather(data);
          cityInput.value = data.name;
        } catch {
          hideLoader();
        }
      },
      () => { /* user denied geolocation — do nothing */ }
    );
  }
});
