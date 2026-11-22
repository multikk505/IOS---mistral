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
  { id: "paint",     name: "Szkicownik",  glyph: "🎨", bg: "linear-gradient(180deg,#ff375f,#c1103c)" },
  { id: "minutnik",  name: "Minutnik",    glyph: "⏲️", bg: "linear-gradient(180deg,#64d2ff,#0071e3)" },
  { id: "about",    name: "iOS Web",     glyph: "", bg: "linear-gradient(180deg,#2c2c2e,#000)" },
];

const CATALOG = [
  { id: "kalendarz", name: "Kalendarz", desc: "Kalendarz miesięczny z bieżącym dnia", glyph: "📅", bg: "linear-gradient(180deg,#ffffff,#f2f2f7)", label: "#ff453a" },
  { id: "czat",      name: "Czat",       desc: "Rozmowa z asystentem demo", glyph: "💬", bg: "linear-gradient(180deg,#30d158,#248a3d)", label: "#fff" },
  { id: "mapa",      name: "Mapy",       desc: "Umieszczaj pinezki na mapie", glyph: "🗺️", bg: "linear-gradient(180deg,#64d2ff,#0a84ff)", label: "#fff" },
  { id: "kamera",    name: "Kamera",     desc: "Podgląd z kamery (wymaga zgody)", glyph: "📷", bg: "linear-gradient(180deg,#8e8e93,#48484a)", label: "#fff" },
  { id: "gra",       name: "Refleks",    desc: "Mini\u00a0gra na szybkość reakcji", glyph: "🎮", bg: "linear-gradient(180deg,#bf5af2,#8944ab)", label: "#fff" },
  { id: "kubek",     name: "Kostka",     desc: "Losowanie kością i monetą", glyph: "🎲", bg: "linear-gradient(180deg,#ff9f0a,#c76c00)", label: "#fff" },
  { id: "snake",     name: "Snake",      desc: "Klasyczny wąż — zbieraj punkty", glyph: "🐍", bg: "linear-gradient(180deg,#30d158,#1a6e33)", label: "#fff" },
  { id: "memoria",   name: "Memoria",    desc: "Gra pamięciowa — znajdź pary", glyph: "🧠", bg: "linear-gradient(180deg,#bf5af2,#d63faf)", label: "#fff" },
  { id: "piano",     name: "Piano",      desc: "Graj na klawiaturze dźwiękowej", glyph: "🎹", bg: "linear-gradient(180deg,#f2f2f7,#d1d1d6)", label: "#000" },
  { id: "zadania",   name: "Zadania",    desc: "Lista zadań do odhaczenia", glyph: "✅", bg: "linear-gradient(180deg,#0a84ff,#0053b3)", label: "#fff" },
  { id: "pomodoro",  name: "Pomodoro",   desc: "25 min pracy / 5 min przerwy", glyph: "🍅", bg: "linear-gradient(180deg,#ff6961,#d13830)", label: "#fff" },
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

/* ================= Szkicownik ================= */
RENDERERS.paint = (el) => {
  el.innerHTML = `
    <canvas id="cv" class="paint-canvas" width="360" height="480"></canvas>
    <div class="paint-bar">
      ${["#000000","#ffffff","#ff453a","#ff9f0a","#ffd60a","#30d158","#0a84ff","#bf5af2"].map((c, i) => `<button class="color-chip ${i === 0 ? "sel" : ""}" data-c="${c}" style="background:${c}"></button>`).join("")}
      <input type="range" id="brush" min="2" max="30" value="6" style="width:90px">
      <button class="store-btn remove" id="cv-clear">Wyczyść</button>
    </div>`;
  const cv = el.querySelector("#cv"), ctx = cv.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  let color = "#000000", down = false, last = null;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * cv.width / r.width, y: (t.clientY - r.top) * cv.height / r.height };
  };
  const line = (p) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = el.querySelector("#brush").value;
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
  };
  const start = (e) => { down = true; last = pos(e); };
  const move = (e) => { if (down) { e.preventDefault?.(); line(pos(e)); } };
  cv.addEventListener("mousedown", start); cv.addEventListener("mousemove", move);
  cv.addEventListener("touchstart", (e) => { start(e); }, { passive: true });
  cv.addEventListener("touchmove", move, { passive: false });
  document.addEventListener("mouseup", () => { down = false; });
  document.addEventListener("touchend", () => { down = false; });
  el.querySelectorAll(".color-chip").forEach((c) => c.addEventListener("click", () => {
    el.querySelectorAll(".color-chip").forEach((x) => x.classList.remove("sel"));
    c.classList.add("sel"); color = c.dataset.c;
  }));
  el.querySelector("#cv-clear").addEventListener("click", () => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); });
};

/* ================= Minutnik ================= */
RENDERERS.minutnik = (el) => {
  el.innerHTML = `<div class="music-card" style="padding-top:30px"><div class="timer-display" id="mn-disp">05:00</div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:18px">
      ${[1, 3, 5, 10].map((m) => `<button class="store-btn mn-preset" data-m="${m}">${m} min</button>`).join("")}
    </div>
    <div style="display:flex;gap:10px;justify-content:center">
      <button class="btn-primary" id="mn-start" style="width:auto;padding:12px 32px">Start</button>
      <button class="btn-primary" id="mn-reset" style="width:auto;padding:12px 32px;background:rgba(120,120,128,.3);color:inherit">Reset</button>
    </div></div>`;
  let total = 300, left = total, int = null;
  const disp = el.querySelector("#mn-disp");
  const upd = () => { disp.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`; };
  const beep = () => {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      [0, 400, 800].forEach((d) => {
        const o = a.createOscillator(), g = a.createGain();
        o.connect(g); g.connect(a.destination); o.frequency.value = 880;
        g.gain.setValueAtTime(.3, a.currentTime + d / 1000);
        g.gain.exponentialRampToValueAtTime(.001, a.currentTime + d / 1000 + .35);
        o.start(a.currentTime + d / 1000); o.stop(a.currentTime + d / 1000 + .4);
      });
    } catch (e) {}
  };
  const stop = (txt) => { clearInterval(int); int = null; el.querySelector("#mn-start").textContent = txt || "Start"; };
  el.querySelectorAll(".mn-preset").forEach((b) => b.addEventListener("click", () => {
    stop(); total = Number(b.dataset.m) * 60; left = total; upd();
  }));
  el.querySelector("#mn-start").addEventListener("click", () => {
    if (int) { stop("Wznów"); return; }
    if (left <= 0) left = total;
    int = setInterval(() => {
      left--; upd();
      if (left <= 0) { stop(); beep(); disp.textContent = "⏰ KONIEC!"; }
    }, 1000);
    el.querySelector("#mn-start").textContent = "Pauza";
  });
  el.querySelector("#mn-reset").addEventListener("click", () => { stop(); left = total; upd(); });
  upd();
};

/* ================= Snake ================= */
RENDERERS.snake = (el) => {
  const N = 17, S = 22;
  el.innerHTML = `<div style="text-align:center;padding-top:8px"><div style="font-weight:700;font-size:20px;margin-bottom:8px" id="sn-score">0</div><canvas id="sn-cv" width="${N * S}" height="${N * S}" class="sn-canvas"></canvas>
    <div class="dpad">
      <button data-d="u" style="grid-area:u">▲</button><button data-d="l" style="grid-area:l">◀</button><button data-d="r" style="grid-area:r">▶</button><button data-d="d" style="grid-area:d">▼</button>
    </div></div>`;
  const cv = el.querySelector("#sn-cv"), ctx = cv.getContext("2d");
  const scoreEl = el.querySelector("#sn-score");
  let snake, dir, food, score, int = null, dead = true;
  const spawnFood = () => {
    do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
    while (snake.some((s) => s.x === food.x && s.y === food.y));
  };
  const draw = () => {
    ctx.fillStyle = "#1c1c1e"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#ff453a";
    ctx.beginPath(); ctx.arc(food.x * S + S / 2, food.y * S + S / 2, S / 2 - 3, 0, 7); ctx.fill();
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#30d158" : `hsl(130, 60%, ${55 - i * 1.2}%)`;
      ctx.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
    });
  };
  const over = () => {
    dead = true; clearInterval(int); int = null;
    ctx.fillStyle = "rgba(0,0,0,.65)"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Koniec gry!", cv.width / 2, cv.height / 2 - 10);
    ctx.font = "14px sans-serif";
    ctx.fillText("Kliknij planszę, aby zagrać ponownie", cv.width / 2, cv.height / 2 + 18);
  };
  const step = () => {
    const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some((s) => s.x === h.x && s.y === h.y)) return over();
    snake.unshift(h);
    if (h.x === food.x && h.y === food.y) { score += 10; scoreEl.textContent = score; spawnFood(); }
    else snake.pop();
    draw();
  };
  const start = () => {
    snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    dir = { x: 1, y: 0 }; score = 0; scoreEl.textContent = "0"; dead = false;
    spawnFood(); draw();
    clearInterval(int); int = setInterval(step, 140);
  };
  const turn = (d) => {
    if (dead) { start(); return; }
    const nd = { u: { x: 0, y: -1 }, d: { x: 0, y: 1 }, l: { x: -1, y: 0 }, r: { x: 1, y: 0 } }[d];
    if (nd.x !== -dir.x || nd.y !== -dir.y) dir = nd;
  };
  el.querySelectorAll(".dpad button").forEach((b) => b.addEventListener("click", () => turn(b.dataset.d)));
  document.addEventListener("keydown", function h(e) {
    if (!dead && $("#app-view").classList.contains("open") && $("#app-title").textContent === "Snake") {
      if (e.key === "ArrowUp") { turn("u"); e.preventDefault(); }
      if (e.key === "ArrowDown") { turn("d"); e.preventDefault(); }
      if (e.key === "ArrowLeft") { turn("l"); e.preventDefault(); }
      if (e.key === "ArrowRight") { turn("r"); e.preventDefault(); }
    }
  });
  cv.addEventListener("click", () => { if (dead) start(); });
  start();
};

/* ================= Memoria ================= */
RENDERERS.memoria = (el) => {
  const EMO = ["🍎","🐝","🌈","🚀","🐙","🌵","🍄","🐬"];
  el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><b style="font-size:18px">Znajdź pary!</b><span id="mm-moves" style="opacity:.6;font-size:14px">Ruchy: 0</span></div><div class="mem-grid" id="mm-grid"></div>`;
  const grid = el.querySelector("#mm-grid"), movesEl = el.querySelector("#mm-moves");
  let deck = [...EMO, ...EMO].sort(() => Math.random() - .5).map((e) => ({ e, open: false, done: false }));
  let open = [], moves = 0, lock = false;
  const rend = () => {
    grid.innerHTML = "";
    deck.forEach((c, i) => {
      const d = document.createElement("button");
      d.className = "mem-card " + (c.done ? "done" : c.open ? "open" : "");
      d.textContent = c.open || c.done ? c.e : "?";
      d.addEventListener("click", () => {
        if (lock || c.open || c.done) return;
        c.open = true; open.push(i);
        if (open.length === 2) {
          moves++; movesEl.textContent = `Ruchy: ${moves}`;
          const [a, b] = open;
          if (deck[a].e === deck[b].e) {
            deck[a].done = deck[b].done = true; open = []; rend();
            if (deck.every((x) => x.done)) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;font-size:22px;font-weight:700">🎉 Wygrałeś w ${moves} ruchach!</div>`;
          } else {
            lock = true; rend();
            setTimeout(() => { deck[a].open = deck[b].open = false; open = []; lock = false; rend(); }, 700);
          }
        } else rend();
      });
      grid.appendChild(d);
    });
  };
  rend();
};

/* ================= Piano ================= */
RENDERERS.piano = (el) => {
  const KEYS = [
    { n: "C", f: 261.63 }, { n: "C♯", f: 277.18, b: 1 }, { n: "D", f: 293.66 }, { n: "D♯", f: 311.13, b: 1 }, { n: "E", f: 329.63 },
    { n: "F", f: 349.23 }, { n: "F♯", f: 369.99, b: 1 }, { n: "G", f: 392.00 }, { n: "G♯", f: 415.30, b: 1 }, { n: "A", f: 440.00 }, { n: "A♯", f: 466.16, b: 1 }, { n: "B", f: 493.88 },
    { n: "C₂", f: 523.25 },
  ];
  el.innerHTML = `<p style="text-align:center;opacity:.6;margin-bottom:14px;font-size:13px">Kliknij klawisze lub użyj klawiatury A S D F G H J K L</p><div class="piano" id="pn"></div>`;
  const pn = el.querySelector("#pn");
  let ac = null;
  const play = (f) => {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "triangle"; o.frequency.value = f;
      o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(.35, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .9);
      o.start(); o.stop(ac.currentTime + 1);
    } catch (e) {}
  };
  const whiteIdx = [];
  KEYS.forEach((k, i) => {
    const b = document.createElement("button");
    b.className = "pn-key" + (k.b ? " black" : "");
    b.textContent = k.n;
    b.addEventListener("click", () => { play(k.f); flash(b); });
    pn.appendChild(b);
    if (!k.b) whiteIdx.push({ k, i });
  });
  const flash = (b) => { b.classList.add("active"); setTimeout(() => b.classList.remove("active"), 150); };
  const map = "asdfghjkl";
  document.addEventListener("keydown", function h(e) {
    if (!$("#app-view").classList.contains("open") || $("#app-title").textContent !== "Piano") return;
    const idx = map.indexOf(e.key.toLowerCase());
    if (idx >= 0) { play(whiteIdx[Math.min(idx, whiteIdx.length - 1)].k.f); flash(pn.children[whiteIdx[Math.min(idx, whiteIdx.length - 1)].i]); }
  });
};

/* ================= Zadania ================= */
RENDERERS.zadania = (el) => {
  let tasks = JSON.parse(localStorage.getItem("p-ios-todo") || '["Dodać własne zadanie 👌"]');
  el.innerHTML = `
    <div class="chat-bar" style="padding-top:0"><input type="text" id="td-in" placeholder="Co masz zrobić?"><button class="btn-primary" id="td-add" style="width:auto;padding:10px 16px">➕</button></div>
    <div id="td-list" style="margin-top:14px"></div>`;
  const list = el.querySelector("#td-list");
  const save = () => localStorage.setItem("p-ios-todo", JSON.stringify(tasks));
  const rend = () => {
    list.innerHTML = "";
    tasks.forEach((t, i) => {
      const d = document.createElement("div");
      d.className = "todo-item" + (t.done ? " done" : "");
      d.innerHTML = `<button class="todo-check">${t.done ? "✓" : ""}</button><span style="flex:1">${t.txt.replace(/</g, "&lt;")}</span><button class="note-del">🗑</button>`;
      d.querySelector(".todo-check").addEventListener("click", () => { t.done = !t.done; save(); rend(); });
      d.querySelector(".note-del").addEventListener("click", () => { tasks.splice(i, 1); save(); rend(); });
      list.appendChild(d);
    });
  };
  const add = () => {
    const inp = el.querySelector("#td-in"), v = inp.value.trim();
    if (v) { tasks.unshift({ txt: v, done: false }); inp.value = ""; save(); rend(); }
  };
  el.querySelector("#td-add").addEventListener("click", add);
  el.querySelector("#td-in").addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
  rend();
};

/* ================= Pomodoro ================= */
RENDERERS.pomodoro = (el) => {
  el.innerHTML = `<div class="music-card" style="padding-top:26px"><div id="pm-phase" class="store-info" style="font-size:15px;opacity:.6;display:block;margin-bottom:6px">🍅 Czas pracy</div><div class="timer-display" id="pm-disp">25:00</div><p style="opacity:.55;font-size:13px;margin-bottom:18px">25 min pracy → 5 min przerwy</p>
  <div style="display:flex;gap:10px;justify-content:center">
    <button class="btn-primary" id="pm-start" style="width:auto;padding:12px 30px">Start</button>
    <button class="btn-primary" id="pm-reset" style="width:auto;padding:12px 30px;background:rgba(120,120,128,.3);color:inherit">Reset</button>
  </div><div id="pm-count" style="margin-top:16px;opacity:.6;font-size:14px">Dokończone sesje: 0</div></div>`;
  const WORK = 25 * 60, BREAK = 5 * 60;
  let mode = "work", left = WORK, int = null, sessions = Number(localStorage.getItem("p-ios-pomo") || 0);
  const disp = el.querySelector("#pm-disp"), phase = el.querySelector("#pm-phase"), cnt = el.querySelector("#pm-count");
  cnt.textContent = `Dokończone sesje: ${sessions}`;
  const upd = () => { disp.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`; };
  const beeps = () => {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const o = a.createOscillator(), g = a.createGain();
      o.connect(g); g.connect(a.destination); o.frequency.value = 660;
      g.gain.setValueAtTime(.3, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .6);
      o.start(); o.stop(a.currentTime + .7);
    } catch (e) {}
  };
  const setMode = (m) => {
    mode = m; left = m === "work" ? WORK : BREAK;
    phase.textContent = m === "work" ? "🍅 Czas pracy" : "☕️ Przerwa";
    upd();
  };
  const stop = (t) => { clearInterval(int); int = null; el.querySelector("#pm-start").textContent = t || "Start"; };
  el.querySelector("#pm-start").addEventListener("click", () => {
    if (int) { stop("Wznów"); return; }
    int = setInterval(() => {
      left--; upd();
      if (left <= 0) {
        beeps();
        if (mode === "work") { sessions++; localStorage.setItem("p-ios-pomo", sessions); cnt.textContent = `Dokończone sesje: ${sessions}`; setMode("break"); }
        else setMode("work");
      }
    }, 1000);
    el.querySelector("#pm-start").textContent = "Pauza";
  });
  el.querySelector("#pm-reset").addEventListener("click", () => { stop(); setMode(mode); });
  upd();
};
