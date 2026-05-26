# ◈ Aether Weather

<div align="center">

![Aether Weather Banner](https://img.shields.io/badge/Aether-Weather-5dd8ff?style=for-the-badge&logo=cloud&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge&logo=openstreetmap&logoColor=white)

**A premium glassmorphism weather app with real-time data, dynamic themes, and cinematic animations.**

[Live Demo](#) · [Get API Key](https://openweathermap.org/api) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## ✦ Preview

> Seven dynamic themes that shift the entire visual atmosphere based on live weather conditions.

| ☀️ Sunny | 🌧 Rainy | ❄️ Snow | ⚡ Thunder |
|----------|----------|---------|-----------|
| Warm amber gradients + drifting clouds | Dark blue + animated rain canvas | Deep navy + snowfall particles | Purple storm + lightning flashes |

| 🌙 Night | ⛅ Cloudy | 🌫 Fog |
|----------|----------|-------|
| Near-black + violet orbs | Grey glassmorphism tones | Muted slate atmosphere |

---

## ✦ Features

### 🌐 Live Weather Data
- Real-time temperature, humidity, wind speed, visibility
- Min/max temperature range
- Sunrise & sunset times (timezone-aware)
- Atmospheric pressure with animated bar
- Auto-detect location via browser geolocation

### 🎨 Premium UI/UX
- **Glassmorphism** weather card with backdrop blur and layered transparency
- **7 auto-switching visual themes** based on weather condition and time of day
- **Animated gradient orbs** — three floating orbs unique to each theme
- **Moving cloud layers** — five depth-layered clouds continuously drifting
- **Neon glow accents** that adapt per theme
- Fully **responsive** — mobile, tablet, and desktop

### ✨ Advanced Animations
- `<canvas>` rain simulation — 200 individual raindrop particles
- `<canvas>` snowfall — 120 flakes with natural drift
- Ambient floating particle system — 80 particles with fade lifecycle
- Animated temperature counter — smooth eased number rollup
- Staggered stat card entrance animations
- Shimmer button effect + pulsing loader rings
- Lightning flash overlay for thunderstorm theme
- Floating weather icon (continuous gentle bob)

### ⚙️ Technical
- Zero dependencies — pure Vanilla JS, HTML5, CSS3
- `async/await` fetch with full error handling
- CSS custom properties for theme switching
- `requestAnimationFrame` canvas rendering loops
- Geolocation API support

---

## ✦ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/himansi-choudhary/aether-weather.git
cd aether-weather
```

### 2. Get a free API key

1. Go to [openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to **API Keys** in your dashboard
4. Copy your key (free tier includes 1,000 calls/day)

### 3. Add your API key

Open `script.js` and replace the placeholder on line 10:

```js
// Before
const API_KEY = 'YOUR_API_KEY_HERE';

// After
const API_KEY = 'a1b2c3d4e5f6...'; // your actual key
```

### 4. Open in browser

```bash
# Option A — just open the file
open index.html

# Option B — serve locally (recommended)
npx serve .
# or
python3 -m http.server 8080
```

> **No build step required.** Works directly in any modern browser.

---

## ✦ Project Structure

```
aether-weather/
├── index.html          # App shell & markup
├── style.css           # Glassmorphism styles + 7 theme definitions
├── script.js           # API logic, canvas animations, theme engine
└── README.md
```

Or use the single-file `aether-weather.html` — everything inlined, just open and run.

---

## ✦ Theme Engine

Themes are automatically selected based on the OpenWeatherMap condition ID and local time:

| Condition ID | Theme | Visual Effect |
|---|---|---|
| 800 (clear day) | `theme-sunny` | Amber/orange orbs, light clouds |
| 800 (clear night) | `theme-night` | Near-black bg, violet orbs |
| 801–804 | `theme-cloudy` | Grey tones, heavy cloud layer |
| 300–599 | `theme-rainy` | Dark blue, rain canvas |
| 600–699 | `theme-snow` | Deep navy, snow canvas |
| 700–799 | `theme-fog` | Muted slate, dense clouds |
| 200–299 | `theme-thunder` | Purple storm, rain + lightning |

Each theme overrides a set of CSS variables (`--bg-from`, `--bg-mid`, `--orb1`, `--accent`, etc.) which cascade through the entire UI.

---

## ✦ API Reference

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current):

```
GET https://api.openweathermap.org/data/2.5/weather
  ?q={city name}
  &appid={API key}
  &units=metric
```

**Free tier limits:** 60 calls/minute · 1,000,000 calls/month

---

## ✦ Customization

### Change temperature unit to Fahrenheit
In `script.js`, change `units=metric` to `units=imperial`, then update the `°C` labels in `index.html` to `°F`.

### Add more cities / default city
```js
// In script.js, replace the geolocation block or add a default:
window.addEventListener('load', () => {
  fetchWeather('Tokyo'); // auto-load on startup
});
```

### Adjust animation intensity
Reduce particle count in `script.js`:
```js
// Ambient particles (default 80)
particles = Array.from({ length: 40 }, () => new Particle());

// Rain drops (default 200)
const drops = Array.from({ length: 100 }, ...);
```

---

## ✦ Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari / Chrome | ✅ Responsive |

---

## ✦ License

MIT License — free to use, modify, and distribute.

---

## ✦ Acknowledgements

- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- Fonts: [Outfit](https://fonts.google.com/specimen/Outfit) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts
- Icons: inline SVG (no external icon library)

---

<div align="center">

Made with obsessive attention to detail.

⭐ Star this repo if you found it useful!

</div>
