/* ================= Pseudo iOS — logika ================= */
"use strict";

const $ = (s) => document.querySelector(s);
const state = {
  unlocked: false,
  dark: localStorage.getItem("p-ios-dark") === "1",
  wallpaper: localStorage.getItem("p-ios-wall") || "default",
  installed: JSON.parse(localStorage.getItem("p-ios-installed") || "[]"),
  notes: JSON.parse(localStorage.getItem("p-ios-notes") || '["Witaj w pseudo iOS! 🎉","Kliknij ➕, aby dodać notatkę."]'),
  toggles: { wifi: true, bt: true, dnd: false, rot: true },
};

/* ---------- Zegar / data ---------- */
const DAYS = ["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"];
const MONTHS = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];

function tick() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  $("#sb-time").textContent = `${hh}:${mm}`;
  $("#lock-time").textContent = `${hh}:${mm}`;
  $("#lock-date").textContent = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  document.querySelectorAll(".hand").forEach((h) => {
    if (h._anim !== undefined) _setHand(h, d);
  });
}
function _setHand(h, d = new Date()) {
  const s = d.getSeconds(), m = d.getMinutes() + s / 60, hr = d.getHours() % 12 + m / 60;
  const deg = h.classList.contains("h") ? hr * 30 : h.classList.contains("m") ? m * 6 : s * 6;
  h.style.transform = `rotate(${deg}deg)`;
}
setInterval(tick, 1000);
tick();

/* ---------- Ekran blokady ---------- */
function unlock() {
  state.unlocked = true;
  $("#lock-screen").classList.add("locked-unlock");
}
function lock() {
  state.unlocked = false;
  closeApp();
  $("#control-center").classList.remove("open");
  $("#lock-screen").classList.remove("locked-unlock");
}
$("#lock-screen").addEventListener("click", unlock);
$(".lock-hint").addEventListener("click", (e) => { e.stopPropagation(); unlock(); });
$("#home-indicator").addEventListener("click", () => { if (state.unlocked) lock(); });

/* ---------- Definicje aplikacji ---------- */
const APPS = [
  { id: "clock",    name: "Zegar",       glyph: "⏰", bg: "linear-gradient(180deg,#3a3a3c,#1c1c1e)" },
  { id: "calc",     name: "Kalkulator",  glyph: "🧮", bg: "linear-gradient(180deg,#ff9500,#c76c00)" },
  { id: "notes",    name: "Notatki",     glyph: "📝", bg: "linear-gradient(180deg,#ffd60a,#f5b000)" },
  { id: "settings", name: "Ustawienia",  glyph: "⚙️", bg: "linear-gradient(180deg,#a7adb8,#6c7178)" },
  { id: "weather",  name: "Pogoda",      glyph: "☀️", bg: "linear-gradient(180deg,#4a90d9,#23538f)" },
  { id: "photos",   name: "Zdjęcia",     glyph: "🌸", bg: "linear-gradient(180deg,#f9f9f9,#e8e8ec)" },
  { id: "music",    name: "Muzyka",      glyph: "🎵", bg: "linear-gradient(180deg,#fc3c44,#c71d25)" },
  { id: "appstore", name: "App Store",   glyph: "🛍️", bg: "linear-gradient(180deg,#2ab5ff,#0060df)" },
  { id: "about",    name: "iOS Web",     glyph: "", bg: "linear-gradient(180deg,#2c2c2e,#000)" },
];

const CATALOG = [
  { id: "kalendarz", name: "Kalendarz", desc: "Kalendarz miesięczny z bieżącym dnia", glyph: "📅", bg: "linear-gradient(180deg,#ffffff,#f2f2f7)", label: "#ff453a" },
  { id: "czat",      name: "Czat",       desc: "Rozmowa z asystentem demo", glyph: "💬", bg: "linear-gradient(180deg,#30d158,#248a3d)", label: "#fff" },
  { id: "mapa",      name: "Mapy",       desc: "Umieszczaj pinezki na mapie", glyph: "🗺️", bg: "linear-gradient(180deg,#64d2ff,#0a84ff)", label: "#fff" },
  { id: "kamera",    name: "Kamera",     desc: "Podgląd z kamery (wymaga zgody)", glyph: "📷", bg: "linear-gradient(180deg,#8e8e93,#48484a)", label: "#fff" },
  { id: "gra",       name: "Refleks",    desc: "Mini\u00a0gra na szybkość reakcji", glyph: "🎮", bg: "linear-gradient(180deg,#bf5af2,#8944ab)", label: "#fff" },
  { id: "kubek",     name: "Kostka",     desc: "Losowanie kością i monetą", glyph: "🎲", bg: "linear-gradient(180deg,#ff9f0a,#c76c00)", label: "#fff" },
];

function allApps() {
  return APPS.concat(state.installed.map((id) => CATALOG.find((a) => a.id === id)).filter(Boolean));
}
const DOCK = [
  { id: "safari",  glyph: "🧭", bg: "linear-gradient(180deg,#2ab5ff,#0074db)" },
  { id: "music",   glyph: "🎵", bg: "linear-gradient(180deg,#fc3c44,#c71d25)" },
  { id: "notes",   glyph: "📝", bg: "linear-gradient(180deg,#ffd60a,#f5b000)" },
  { id: "settings",glyph: "⚙️", bg: "linear-gradient(180deg,#a7adb8,#6c7178)" },
];

function renderHome() {
  const grid = $("#apps-grid");
  grid.innerHTML = "";
  allApps().forEach((a, i) => {
    const b = document.createElement("button");
    b.className = "app-icon";
    b.style.animationDelay = `${i * 0.05}s`;
    b.innerHTML = `<span class="glyph" style="background:${a.bg}">${a.glyph || '<svg viewBox="0 0 24 24" width="34" fill="#fff"><path d="M16.4 12.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5.7-1 1.3-2.1 1.5-2.2-.1 0-2.9-1.1-3-4.7zM14 4.6c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z"/></svg>'}</span><span class="app-label">${a.name}</span>`;
    b.addEventListener("click", () => openApp(a.id));
    grid.appendChild(b);
  });
  const dock = $("#dock");
  dock.innerHTML = "";
  DOCK.forEach((d) => {
    const el = document.createElement("div");
    el.className = "dock-icon";
    el.style.background = d.bg;
    el.textContent = d.glyph;
    el.addEventListener("click", () => openApp(d.id));
    dock.appendChild(el);
  });
}
renderHome();

/* ---------- Otwieranie aplikacji ---------- */
const RENDERERS = {};

function openApp(id) {
  if (!state.unlocked) { unlock(); }
  const app = allApps().find((a) => a.id === id);
  $("#app-title").textContent = app?.name || "iOS Web";
  $("#app-body").innerHTML = "";
  (RENDERERS[id] || RENDERERS.about)($("#app-body"), id);
  $("#app-view").classList.add("open");
}
function closeApp() {
  if (window.__camStream) { window.__camStream.getTracks().forEach((t) => t.stop()); window.__camStream = null; }
  $("#app-view").classList.remove("open");
}
$("#app-close").addEventListener("click", closeApp);

/* ---------- Zegar ---------- */
RENDERERS.clock = (el) => {
  el.innerHTML = `
    <div class="clock-face"><div class="hand h"></div><div class="hand m"></div><div class="hand s"></div></div>
    <div class="clock-digital" id="cd"></div>
    <div class="set-group"><div class="set-row"><span>⏱ Stoper</span><button class="btn-primary" style="width:auto;padding:8px 18px" id="sw-btn">Start</button></div>
    <div class="set-row"><span id="sw-display">00:00.0</span></div></div>`;
  const hands = el.querySelectorAll(".hand");
  _setHand(hands[0]); _setHand(hands[1]); _setHand(hands[2]);
  hands.forEach((h) => { h._anim = 1; _setHand(h); });
  const cd = el.querySelector("#cd");
  setInterval(() => {
    const d = new Date();
    cd.textContent = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  }, 1000);
  const d = new Date();
  cd.textContent = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  let t0 = null, swInt = null;
  const swBtn = el.querySelector("#sw-btn"), swDisp = el.querySelector("#sw-display");
  swBtn.addEventListener("click", () => {
    if (t0) { clearInterval(swInt); t0 = null; swBtn.textContent = "Start"; return; }
    t0 = Date.now();
    swInt = setInterval(() => {
      const ms = Date.now() - t0;
      swDisp.textContent = `${String(Math.floor(ms/60000)).padStart(2,"0")}:${String(Math.floor(ms/1000)%60).padStart(2,"0")}.${Math.floor(ms/100)%10}`;
    }, 100);
    swBtn.textContent = "Stop";
  });
};

/* ---------- Kalkulator ---------- */
RENDERERS.calc = (el) => {
  const keys = ["AC","±","%","÷","7","8","9","×","4","5","6","−","1","2","3","＋","0",".", "="];
  el.innerHTML = `<div class="calc-grid"><div class="calc-screen">0</div></div>`;
  const grid = el.querySelector(".calc-grid");
  let cur = "0", prev = null, op = null, fresh = true;
  const scr = el.querySelector(".calc-screen");
  const upd = () => { scr.textContent = cur.length > 9 ? Number(cur).toPrecision(7) : cur; };
  const calc = () => {
    const a = parseFloat(prev), b = parseFloat(cur);
    if (op === "＋") return a + b; if (op === "−") return a - b;
    if (op === "×") return a * b; if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
  };
  keys.forEach((k) => {
    const b = document.createElement("button");
    b.className = "calc-btn" + (/[÷×−＋=]/.test(k) ? " op" : /AC|±|%/.test(k) ? " fn" : "") + (k === "0" ? " zero" : "");
    b.textContent = k;
    b.style.fontSize = k === "0" ? "26px" : "";
    b.addEventListener("click", () => {
      if (/[0-9]/.test(k)) { cur = fresh || cur === "0" ? k : cur + k; fresh = false; }
      else if (k === ".") { if (!cur.includes(".")) cur += "."; fresh = false; }
      else if (k === "AC") { cur = "0"; prev = null; op = null; fresh = true; }
      else if (k === "±") { cur = String(parseFloat(cur) * -1); }
      else if (k === "%") { cur = String(parseFloat(cur) / 100); }
      else if (k === "=") { if (op && prev !== null) { cur = String(+calc().toPrecision(10)); prev = null; op = null; fresh = true; } }
      else { if (op && prev !== null && !fresh) cur = String(+calc().toPrecision(10)); prev = cur; op = k; fresh = true; }
      upd();
    });
    grid.appendChild(b);
  });
  upd();
};

/* ---------- Notatki ---------- */
RENDERERS.notes = (el) => {
  el.innerHTML = `
    <input type="text" class="note-input" id="note-input" placeholder="Nowa notatka…">
    <button class="btn-primary" id="note-add">➕ Dodaj notatkę</button>
    <div id="notes-list" style="margin-top:16px"></div>`;
  const list = el.querySelector("#notes-list");
  const rend = () => {
    list.innerHTML = "";
    if (!state.notes.length) list.innerHTML = '<p style="opacity:.5;text-align:center;padding:20px">Brak notatek</p>';
    state.notes.forEach((n, i) => {
      const d = document.createElement("div");
      d.className = "note-item";
      d.innerHTML = `<span>${n.replace(/</g, "&lt;")}</span><button class="note-del" title="Usuń">🗑</button>`;
      d.querySelector(".note-del").addEventListener("click", () => { state.notes.splice(i, 1); save(); rend(); });
      list.appendChild(d);
    });
  };
  const save = () => localStorage.setItem("p-ios-notes", JSON.stringify(state.notes));
  el.querySelector("#note-add").addEventListener("click", () => {
    const inp = el.querySelector("#note-input");
    if (inp.value.trim()) { state.notes.unshift(inp.value.trim()); inp.value = ""; save(); rend(); }
  });
  rend();
};

/* ---------- Ustawienia ---------- */
RENDERERS.settings = (el) => {
  el.innerHTML = `
    <div class="set-group">
      <div class="set-row"><span>🌙 Tryb ciemny</span><input type="checkbox" id="opt-dark" ${state.dark ? "checked" : ""}></div>
      <div class="set-row"><span>📶 Wi-Fi</span><input type="checkbox" id="opt-wifi" ${state.toggles.wifi ? "checked" : ""}></div>
      <div class="set-row"><span>🔇 Nie przeszkadzać</span><input type="checkbox" id="opt-dnd" ${state.toggles.dnd ? "checked" : ""}></div>
    </div>
    <div class="set-group"><div class="set-row"><span style="width:100%">🖼 Tapeta</span></div>
      <div class="set-row" style="gap:14px">
        <button class="wall-swatch" data-w="default" style="background:linear-gradient(135deg,#1e3c72,#7f53ac)"></button>
        <button class="wall-swatch" data-w="red" style="background:linear-gradient(135deg,#7f1d3f,#f76b8a)"></button>
        <button class="wall-swatch" data-w="green" style="background:linear-gradient(135deg,#0f3443,#34e89e)"></button>
        <button class="wall-swatch" data-w="dark" style="background:linear-gradient(135deg,#0f0f14,#414345)"></button>
      </div>
    </div>
    <div class="set-group"><div class="set-row"><span>ℹ️ Wersja systemu</span><span>Pseudo iOS 1.0 (web)</span></div></div>`;
  el.querySelector("#opt-dark").addEventListener("change", (e) => setDark(e.target.checked));
  [["wifi", "#opt-wifi"], ["dnd", "#opt-dnd"]].forEach(([k, sel]) => {
    el.querySelector(sel).addEventListener("change", (e) => { state.toggles[k] = e.target.checked; syncToggles(); });
  });
  el.querySelectorAll(".wall-swatch").forEach((w) =>
    w.addEventListener("click", () => { setWall(w.dataset.w); })
  );
};

function setDark(v) {
  state.dark = v;
  document.body.classList.toggle("dark", v);
  localStorage.setItem("p-ios-dark", v ? "1" : "0");
}
function setWall(w) {
  state.wallpaper = w;
  const hs = $("#home-screen");
  hs.className = "";
  if (w !== "default") hs.classList.add(`wallpaper-${w}`);
  localStorage.setItem("p-ios-wall", w);
}
setDark(state.dark);
setWall(state.wallpaper);

/* ---------- Pogoda (dane demo) ---------- */
RENDERERS.weather = (el) => {
  const days = [["Dziś","☀️",24,14],["Wt","⛅️",22,13],["Śr","🌧",18,12],["Cz","⛈",16,11],["Pt","☀️",25,15],["So","🌤",23,14],["Nd","☀️",26,16]];
  el.innerHTML = `<div class="weather-hero"><div style="font-size:20px;opacity:.9">Warszawa</div><div class="big">24°</div><div>☀️ Słonecznie</div><div style="opacity:.8;margin-top:4px">Maks. 26° · Min. 14°</div></div><div class="forecast"></div><p style="opacity:.5;font-size:12px;margin-top:10px;text-align:center">Dane demonstracyjne — brak połączenia z API.</p>`;
  const fc = el.querySelector(".forecast");
  days.forEach(([d, ic, hi, lo]) => {
    const c = document.createElement("div");
    c.className = "day";
    c.innerHTML = `<div style="font-weight:600">${d}</div><div style="font-size:24px;margin:6px 0">${ic}</div><div>${hi}° <span style="opacity:.5">${lo}°</span></div>`;
    fc.appendChild(c);
  });
};

/* ---------- Zdjęcia ---------- */
RENDERERS.photos = (el) => {
  const em = ["🌸","🌅","🏔","🌊","🌴","🌉","🍂","🦋","🌺","🌇","🏖","🍁"];
  el.innerHTML = `<div class="photos-grid"></div>`;
  const g = el.querySelector(".photos-grid");
  const colors = ["#f9a8d4","#fcd34d","#6ee7b7","#93c5fd","#c4b5fd","#fca5a5","#a5b4fc","#5eead4","#fdba74","#f9a8d4","#86efac","#fda4af"];
  em.forEach((e, i) => {
    const p = document.createElement("div");
    p.className = "photo";
    p.style.background = colors[i % colors.length];
    p.textContent = e;
    p.addEventListener("click", () => { p.style.transform = "scale(1.1) rotate(" + (i % 2 ? 4 : -4) + "deg)"; setTimeout(() => (p.style.transform = ""), 300); });
    g.appendChild(p);
  });
};

/* ---------- Muzyka ---------- */
RENDERERS.music = (el) => {
  const tracks = [
    { t: "Nocny Mix", a: "DJ Przygoda", art: "💿" },
    { t: "Latem 2024", a: "Zespół Słońce", art: "🌞" },
    { t: "Chill Beats", a: "Lo-Fi Kawa", art: "🎧" },
  ];
  let idx = 0, playing = false;
  el.innerHTML = `<div class="music-card"><span class="music-art" id="m-art">💿</span><div class="music-title" id="m-title"></div><div class="music-artist" id="m-artist"></div><div class="music-controls"><button id="m-prev">⏮</button><button id="m-play">▶️</button><button id="m-next">⏭</button></div></div>`;
  const rend = () => {
    el.querySelector("#m-art").textContent = tracks[idx].art;
    el.querySelector("#m-title").textContent = tracks[idx].t;
    el.querySelector("#m-artist").textContent = tracks[idx].a;
    el.querySelector("#m-play").textContent = playing ? "⏸" : "▶️";
    el.querySelector("#m-art").style.animationPlayState = playing ? "running" : "paused";
  };
  el.querySelector("#m-play").addEventListener("click", () => { playing = !playing; rend(); });
  el.querySelector("#m-next").addEventListener("click", () => { idx = (idx + 1) % tracks.length; rend(); });
  el.querySelector("#m-prev").addEventListener("click", () => { idx = (idx - 1 + tracks.length) % tracks.length; rend(); });
  rend();
};

/* ---------- iOS Web (o systemie) ---------- */
RENDERERS.about = (el) => el.innerHTML = `<div class="music-card" style="padding-top:40px"><span style="font-size:84px"></span><h2 style="margin:12px 0">Pseudo iOS 1.0</h2><p style="opacity:.7;line-height:1.7">Symulator systemu iOS działający w przeglądarce.<br> HTML + CSS + JavaScript — zero frameworków.<br><br>✦ Ekran blokady i unlock<br>✦ Ekran główny z ikonami i dockiem<br>✦ Centrum sterowania<br>✦ Kalkulator, notatki (localStorage), zegar ze stoperem<br>✦ Tryb ciemny i tapety<br>✦ Pogoda, zdjęcia, odtwarzacz muzyki</p><p style="opacity:.4;margin-top:16px;font-size:12px">To nie jest produkt Apple. Projekt hobbystyczny.</p>`;

/* Safari-look placeholder */
RENDERERS.safari = (el) => el.innerHTML = `<div style="text-align:center;padding-top:60px"><div style="font-size:70px">🧭</div><h3 style="margin:12px 0">Safari (demo)</h3><p style="opacity:.6">Wersja okienkowa przeglądarki — wpisz adres, aby zobaczyć placeholder.</p><input class="note-input" placeholder="https://…" onkeydown="if(event.key==='Enter'){this.value='';alert('To tylko demo 😄')}"></div>`;

/* ---------- Centrum sterowania ---------- */
function syncToggles() {
  document.querySelectorAll(".cc-btn").forEach((b) => b.classList.toggle("on", !!state.toggles[b.dataset.k]));
  document.querySelectorAll(".cc-wide").forEach((b) => {
    if (b.dataset.k === "flash") b.classList.toggle("on", !!state.flash);
  });
}
function toggleCC(e) {
  if (!state.unlocked) return;
  const y = e.clientY ?? 0;
  if (y < 80) $("#control-center").classList.add("open");
}
$("#status-bar").addEventListener("click", (e) => {
  if (state.unlocked) $("#control-center").classList.toggle("open");
});
document.addEventListener("click", (e) => {
  const cc = $("#control-center");
  if (cc.classList.contains("open") && !cc.contains(e.target) && !$("#status-bar").contains(e.target)) cc.classList.remove("open");
});
document.querySelectorAll(".cc-btn").forEach((b) =>
  b.addEventListener("click", () => { const k = b.dataset.k; state.toggles[k] = !state.toggles[k]; syncToggles(); })
);
document.querySelectorAll(".cc-wide").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.k === "flash") state.flash = !state.flash;
    if (b.dataset.k === "calc") { openApp("calc"); $("#control-center").classList.remove("open"); }
    syncToggles();
  })
);
$("#cc-brightness input").addEventListener("input", (e) => {
  $("#phone").style.filter = `brightness(${e.target.value / 100})`;
});
$("#cc-volume input").addEventListener("input", () => {});
syncToggles();

/* Klawiatura: Enter = unlock, Escape = lock/close */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !state.unlocked) unlock();
  if (e.key === "Escape") { if ($("#app-view").classList.contains("open")) closeApp(); else if (state.unlocked) lock(); }
});

/* ================= App Store ================= */
RENDERERS.appstore = (el) => {
  el.innerHTML = `<div id="store-list"></div>`;
  const list = el.querySelector("#store-list");
  const save = () => localStorage.setItem("p-ios-installed", JSON.stringify(state.installed));
  const rend = () => {
    list.innerHTML = "";
    const head = document.createElement("div");
    head.style.cssText = "text-align:center;padding:6px 0 16px;opacity:.6;font-size:13px";
    head.textContent = `${CATALOG.length} aplikacji · ${state.installed.length} zainstalowane`;
    list.appendChild(head);
    CATALOG.forEach((a) => {
      const row = document.createElement("div");
      row.className = "store-item";
      const isInst = state.installed.includes(a.id);
      row.innerHTML = `
        <span class="glyph" style="background:${a.bg};width:56px;height:56px;font-size:28px;flex-shrink:0;color:${a.label || "#fff"}">${a.glyph}</span>
        <div class="store-info"><b>${a.name}</b><small>${a.desc}</small></div>
        <button class="store-btn ${isInst ? "remove" : ""}">${isInst ? "Usuń" : "Pobierz"}</button>`;
      row.querySelector(".store-btn").addEventListener("click", () => {
        if (isInst) {
          state.installed = state.installed.filter((x) => x !== a.id);
        } else {
          state.installed.push(a.id);
        }
        save(); renderHome(); rend();
      });
      row.querySelector(".glyph").addEventListener("click", () => { if (isInst) openApp(a.id); });
      list.appendChild(row);
    });
  };
  rend();
};

/* ================= Kalendarz ================= */
const CDAYS = ["Pn","Wt","Śr","Cz","Pt","So","Nd"];
function renderCal(el, y, m) {
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const monthNames = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
  let html = `<div class="cal-head"><button class="cal-nav" data-d="-1">‹</button><b style="font-size:20px">${monthNames[m]} ${y}</b><button class="cal-nav" data-d="1">›</button></div><div class="cal-grid">`;
  CDAYS.forEach((d) => html += `<span class="cal-dow">${d}</span>`);
  for (let i = 0; i < first; i++) html += "<span></span>";
  const today = new Date();
  for (let d = 1; d <= days; d++) {
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    html += `<span class="cal-day ${isToday ? "today" : ""}">${d}</span>`;
  }
  html += "</div>";
  el.innerHTML = html;
  el.querySelectorAll(".cal-nav").forEach((b) =>
    b.addEventListener("click", () => {
      let ny = y, nm = m + Number(b.dataset.d);
      if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; }
      renderCal(el, ny, nm);
    })
  );
}
RENDERERS.kalendarz = (el) => {
  el.style.padding = "8px";
  const now = new Date();
  renderCal(el, now.getFullYear(), now.getMonth());
};

/* ================= Czat ================= */
RENDERERS.czat = (el) => {
  el.innerHTML = `
    <div id="chat-log" class="chat-log"></div>
    <div class="chat-bar"><input type="text" id="chat-in" placeholder="Wiadomość…"><button class="btn-primary" id="chat-send" style="width:auto;padding:10px 16px">➤</button></div>`;
  const log = el.querySelector("#chat-log");
  const msgs = [{ me: false, t: "Cześć! 👋 Jestem asystentem demo. O co chcesz zapytać?" }];
  const add = (m) => {
    const d = document.createElement("div");
    d.className = "chat-msg " + (m.me ? "me" : "bot");
    d.textContent = m.t;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };
  msgs.forEach(add);
  const REPLY = ["Interesujące pytanie! 🤔 A może zagrajmy w Refleks?", "Jestem tylko demo, ale słuchać umiem! 😄", "Sprawdź App Store — jest tam więcej aplikacji!", "Dobrze, że pytasz. Pogoda wydaje się ładna ☀️"];
  const send = () => {
    const inp = el.querySelector("#chat-in");
    const v = inp.value.trim();
    if (!v) return;
    msgs.push({ me: true, t: v }); add(msgs[msgs.length - 1]);
    inp.value = "";
    setTimeout(() => {
      const r = REPLY[Math.floor(Math.random() * REPLY.length)];
      msgs.push({ me: false, t: r }); add(msgs[msgs.length - 1]);
    }, 600);
  };
  el.querySelector("#chat-send").addEventListener("click", send);
  el.querySelector("#chat-in").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
};

/* ================= Mapy ================= */
RENDERERS.mapa = (el) => {
  el.innerHTML = `<div style="padding:8px 0 12px;opacity:.7;font-size:14px">Kliknij mapę, aby postawić pinezkę 📍</div><div id="map" class="map-area"></div><div id="pin-list" style="margin-top:12px;font-size:14px"></div>`;
  const map = el.querySelector("#map");
  const list = el.querySelector("#pin-list");
  const pins = JSON.parse(localStorage.getItem("p-ios-pins") || "[]");
  const rendPins = () => {
    list.innerHTML = pins.length ? `📍 Pinezki: ${pins.length}` : "";
  };
  const draw = () => {
    map.innerHTML = "";
    pins.forEach((p) => {
      const s = document.createElement("span");
      s.className = "map-pin";
      s.textContent = "📍";
      s.style.left = p.x + "%"; s.style.top = p.y + "%";
      s.title = "Kliknij, aby usunąć";
      s.addEventListener("click", (e) => {
        e.stopPropagation();
        pins.splice(pins.indexOf(p), 1);
        localStorage.setItem("p-ios-pins", JSON.stringify(pins));
        draw(); rendPins();
      });
      map.appendChild(s);
    });
  };
  map.addEventListener("click", (e) => {
    const r = map.getBoundingClientRect();
    pins.push({ x: ((e.clientX - r.left) / r.width * 100).toFixed(1) * 1, y: ((e.clientY - r.top) / r.height * 100).toFixed(1) * 1 });
    localStorage.setItem("p-ios-pins", JSON.stringify(pins));
    draw(); rendPins();
  });
  draw(); rendPins();
};

/* ================= Kamera ================= */
RENDERERS.kamera = (el) => {
  el.innerHTML = `<video id="cam" autoplay playsinline muted style="width:100%;border-radius:16px;display:none"></video><div id="cam-fallback" style="text-align:center;padding:60px 20px;opacity:.6">📷 Aby zobaczyć podgląd, zezwól przeglądarce na dostęp do kamery.<br><small style="opacity:.7">Jeśli odmówisz, nic się nie stanie — aplikacja pokaże ten komunikat.</small></div>`;
  if (!navigator.mediaDevices?.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      window.__camStream = stream;
      el.querySelector("#cam").srcObject = stream;
      el.querySelector("#cam").style.display = "block";
      el.querySelector("#cam-fallback").style.display = "none";
    })
    .catch(() => {});
};

/* ================= Gra Refleks ================= */
RENDERERS.gra = (el) => {
  el.innerHTML = `<div style="text-align:center;padding-top:10px"><div style="font-size:52px;font-weight:800" id="g-score">0</div><div style="opacity:.6;margin-bottom:14px" id="g-sub">Klikaj tarcze, jak się pojawią!</div><div id="g-area" style="position:relative;width:100%;max-width:320px;margin:0 auto;height:340px;border-radius:24px;background:rgba(120,120,128,.12);overflow:hidden;cursor:crosshair"></div></div>`;
  const area = el.querySelector("#g-area"), scoreEl = el.querySelector("#g-score"), sub = el.querySelector("#g-sub");
  let score = 0, timeouts = [];
  const spawn = () => {
    const t = document.createElement("div");
    t.className = "game-target";
    t.style.left = (Math.random() * 75 + 5) + "%";
    t.style.top = (Math.random() * 75 + 5) + "%";
    t.textContent = "🎯";
    t.addEventListener("click", (e) => {
      e.stopPropagation();
      score++; scoreEl.textContent = score; t.remove(); clearTimeout(timeouts[timeouts.length - 1]); spawn();
    });
    area.appendChild(t);
  };
  const start = () => {
    sub.textContent = "Start! masz 10 s";
    const end = Date.now() + 10000;
    const int = setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) { clearInterval(int); area.innerHTML = ""; timeouts.forEach(clearTimeout); timeouts = []; sub.textContent = `Koniec! Twój wynik: ${score}. Kliknij granie ponownie.`; el.querySelector("#g-score").dataset.done = "1"; }
      else sub.textContent = `Pozostało ${Math.ceil(left / 1000)} s`;
    }, 200);
    spawn();
  };
  el.querySelector("#g-area").addEventListener("click", () => {
    if (sub.textContent.includes("masz 10 s") || sub.textContent.includes("Koniec!")) { score = 0; scoreEl.textContent = "0"; scoreEl.style.color = ""; start(); }
  });
};

/* ================= Kostka ================= */
RENDERERS.kubek = (el) => {
  el.innerHTML = `<div class="music-card" style="padding-top:50px"><div style="font-size:96px" id="d-out">🎲</div><button class="btn-primary" id="d-roll" style="max-width:240px;margin:24px auto 12px">🎲 Rzuć kością</button><button class="btn-primary" id="d-coin" style="max-width:240px;margin:0 auto;background:#8e8e93">🪰 Rzuć monetą</button></div>`;
  el.querySelector("#d-coin").textContent = "🪙 Rzuć monetą";
  const out = el.querySelector("#d-out");
  el.querySelector("#d-roll").addEventListener("click", () => {
    let n = 20; const int = setInterval(() => { out.textContent = "⚀⚁⚂⚃⚄⚅"[Math.floor(Math.random() * 6)]; if (--n <= 0) clearInterval(int); }, 60);
  });
  el.querySelector("#d-coin").addEventListener("click", () => {
    let n = 20; const int = setInterval(() => { out.textContent = Math.random() < .5 ? "🪙" : "🪙"; if (--n <= 0) out.textContent = Math.random() < .5 ? "Orzeł 🦅" : "Reszka 💿"; }, 60);
  });
};

/* ================= Pełny ekran ================= */
function isFS() { return !!document.fullscreenElement; }
function toggleFS() {
  if (isFS()) document.exitFullscreen?.();
  else $("#phone").requestFullscreen?.().catch(() => {});
}
document.querySelectorAll(".cc-wide[data-k=fs]").forEach((b) => b.addEventListener("click", toggleFS));
document.addEventListener("dblclick", (e) => {
  if (e.target.closest("#app-view")) toggleFS();
});
