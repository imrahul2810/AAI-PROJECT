// ===== DAY 2: Full dashboard logic =====

const STATUS_LABELS = {
  ontime: "ON TIME",
  delayed: "DELAYED",
  cancelled: "CANCELLED",
  landed: "LANDED"
};

let allFlights = [];       // full dataset currently loaded (live or mock)
let currentFilter = "all"; // active filter button
let currentSearch = "";    // active search text

// ---------- Data loading ----------

async function loadFlights() {
  try {
    if (!CONFIG || !CONFIG.API_KEY || CONFIG.API_KEY === "DEMO_KEY_REPLACE_ME") {
      throw new Error("No valid API key configured");
    }

    const url = `${CONFIG.API_BASE_URL}?access_key=${CONFIG.API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`API responded with ${response.status}`);

    const data = await response.json();
    if (!data.data || data.data.length === 0) throw new Error("Empty API response");

    allFlights = data.data.map(mapApiFlightToLocal);
    setDataMode("LIVE", true);

  } catch (err) {
    console.warn("Falling back to mock data:", err.message);
    const res = await fetch("data/mockFlights.json");
    allFlights = await res.json();
    setDataMode("MOCK DATA (offline fallback)", false);
  }

  applyFiltersAndRender();
}

// Converts AviationStack's response shape into our simpler local shape
function mapApiFlightToLocal(f) {
  let status = "ontime";
  if (f.flight_status === "cancelled") status = "cancelled";
  else if (f.flight_status === "landed") status = "landed";
  else if (f.departure && f.departure.delay) status = "delayed";

  return {
    flightNumber: f.flight?.iata || "N/A",
    airline: f.airline?.name || "Unknown",
    origin: f.departure?.iata || "---",
    destination: f.arrival?.iata || "---",
    type: "departure",
    scheduledTime: (f.departure?.scheduled || "").slice(11, 16) || "--:--",
    gate: f.departure?.gate || "TBD",
    status: status
  };
}

function setDataMode(label, isLive) {
  const el = document.getElementById("dataMode");
  el.textContent = `MODE: ${label}`;
  el.style.color = isLive ? "var(--green)" : "var(--amber)";
}

// ---------- Rendering ----------

function renderRow(flight) {
  return `
    <div class="flight-row">
      <span class="cell-time">${flight.scheduledTime}</span>
      <span class="cell-flight">${flight.flightNumber}</span>
      <span class="cell-airline">${flight.airline}</span>
      <span class="cell-route">${flight.origin}<span class="arrow">&rarr;</span>${flight.destination}</span>
      <span class="cell-gate">${flight.gate}</span>
      <span class="status-badge status-${flight.status}">${STATUS_LABELS[flight.status]}</span>
    </div>
  `;
}

function renderFlights(flights) {
  const boardBody = document.getElementById("boardBody");

  if (flights.length === 0) {
    boardBody.innerHTML = `<div class="loading-message">No flights match your search/filter.</div>`;
    return;
  }

  boardBody.innerHTML = flights.map(renderRow).join("");
}

function updateStats(flights) {
  document.getElementById("statTotal").textContent = flights.length;
  document.getElementById("statOnTime").textContent = flights.filter(f => f.status === "ontime").length;
  document.getElementById("statDelayed").textContent = flights.filter(f => f.status === "delayed").length;
  document.getElementById("statCancelled").textContent = flights.filter(f => f.status === "cancelled").length;
}

// ---------- Filtering + Search ----------

function applyFiltersAndRender() {
  let result = allFlights;

  // Apply filter
  if (currentFilter === "arrival" || currentFilter === "departure") {
    result = result.filter(f => f.type === currentFilter);
  } else if (currentFilter === "delayed") {
    result = result.filter(f => f.status === "delayed");
  } else if (currentFilter === "cancelled") {
    result = result.filter(f => f.status === "cancelled");
  }

  // Apply search
  if (currentSearch.trim() !== "") {
    const q = currentSearch.trim().toLowerCase();
    result = result.filter(f =>
      f.flightNumber.toLowerCase().includes(q) ||
      f.airline.toLowerCase().includes(q) ||
      f.origin.toLowerCase().includes(q) ||
      f.destination.toLowerCase().includes(q)
    );
  }

  renderFlights(result);
  updateStats(allFlights); // stats always reflect full dataset, not filtered view
}

// ---------- Event wiring ----------

function setupFilterButtons() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      applyFiltersAndRender();
    });
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  const doSearch = () => {
    currentSearch = input.value;
    applyFiltersAndRender();
  };

  btn.addEventListener("click", doSearch);
  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") doSearch();
  });
}

// ---------- Clock ----------

function updateClock() {
  const now = new Date();
  document.getElementById("liveClock").textContent = now.toLocaleTimeString("en-IN", { hour12: false });
}

// ---------- Auto refresh ----------

function startAutoRefresh() {
  setInterval(loadFlights, 30000); // refresh every 30s
}

// ---------- Init ----------

setInterval(updateClock, 1000);
updateClock();
setupFilterButtons();
setupSearch();
loadFlights();
startAutoRefresh();
