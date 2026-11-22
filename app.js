/* ================= Pseudo iOS — logika ================= */
"use strict";

const $ = (s) => document.querySelector(s);
const state = {
  unlocked: false,
  dark: localStorage.getItem("p-ios-dark") === "1",
  wallpaper: localStorage.getItem("p-ios-wall") || "default",
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
  { id: "about",    name: "iOS Web",     glyph: "", bg: "linear-gradient(180deg,#2c2c2e,#000)" },
];
const DOCK = [
  { id: "safari",  glyph: "🧭", bg: "linear-gradient(180deg,#2ab5ff,#0074db)" },
  { id: "music",   glyph: "🎵", bg: "linear-gradient(180deg,#fc3c44,#c71d25)" },
  { id: "notes",   glyph: "📝", bg: "linear-gradient(180deg,#ffd60a,#f5b000)" },
  { id: "settings",glyph: "⚙️", bg: "linear-gradient(180deg,#a7adb8,#6c7178)" },
];

function renderHome() {
  const grid = $("#apps-grid");
  grid.innerHTML = "";
  APPS.forEach((a, i) => {
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
  $("#app-title").textContent = APPS.find((a) => a.id === id)?.name || "iOS Web";
  $("#app-body").innerHTML = "";
  (RENDERERS[id] || RENDERERS.about)($("#app-body"), id);
  $("#app-view").classList.add("open");
}
function closeApp() { $("#app-view").classList.remove("open"); }
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
