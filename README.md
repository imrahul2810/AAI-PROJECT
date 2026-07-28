# AAI-PROJECT — Flight Status Dashboard

Real-time flight status dashboard for Indian airports — search, filter, and track arrivals/departures with live status updates. Built with HTML, CSS & JavaScript, powered by the AviationStack API with offline mock-data fallback.

## Features

- **Live flight data** via the AviationStack API
- **Automatic offline fallback** — if the live API fails or hits the free-tier rate limit, the dashboard automatically switches to a sample dataset of Indian domestic flights, so it always stays functional
- **Search** by flight number, airline, or airport code
- **Filters** — All / Arrivals / Departures / Delayed / Cancelled
- **Live stats bar** — total flights, on-time, delayed, cancelled counts
- **Auto-refresh** every 30 seconds
- **Responsive design** — works on desktop and mobile
- Visual design inspired by classic airport split-flap departure boards

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (no frameworks)
- [AviationStack API](https://aviationstack.com/) for live flight data
- Git/GitHub for version control

## Project Structure

\`\`\`
AAI-PROJECT/
├── index.html            # Main page structure
├── style.css             # Styling (split-flap board theme)
├── script.js              # App logic: fetch, render, search, filter
├── config.example.js   # Template for API key setup
├── config.js               # Your actual API key (gitignored, not in repo)
└── data/
    └── mockFlights.json   # Offline fallback flight data (Indian airports)
\`\`\`

## How to Run

1. Clone this repository
   \`\`\`bash
   git clone https://github.com/arunrkumar017/AAI-PROJECT.git
   cd AAI-PROJECT
   \`\`\`
2. Set up your API key:
   - Copy `config.example.js` and rename the copy to `config.js`
   - Sign up for a free API key at [aviationstack.com](https://aviationstack.com/)
   - Paste your key into `config.js`
3. Run a local server (required — opening `index.html` directly will block data fetching due to browser security policies):
   \`\`\`bash
   python -m http.server 8000
   \`\`\`
4. Open `http://localhost:8000` in your browser

## Design Notes

The dashboard is styled after mechanical split-flap airport boards — dark control-room background, amber accent for flight data, and color-coded status badges (green = on-time, amber = delayed, red = cancelled).

## Fallback Behavior

If the AviationStack API key is missing, invalid, or the request fails for any reason (rate limit, network issue), the dashboard automatically loads `data/mockFlights.json`, a set of realistic Indian domestic flights (Air India, IndiGo, SpiceJet, Vistara). This ensures the dashboard is never broken during a live demo, even without internet access or API quota.

## Author

**Rahul Kumar** — built as part of an internship project submission for Airports Authority of India.
