/* ================= App Store: silniki + 89 nowych aplikacji ================= */
"use strict";
(function () {
  const $s = (root, sel) => root.querySelector(sel);
  const $$s = (root, sel) => root.querySelectorAll(sel);
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const PALETTE = [
    "linear-gradient(180deg,#2ab5ff,#0060df)", "linear-gradient(180deg,#30d158,#1e8a3c)",
    "linear-gradient(180deg,#bf5af2,#8923ab)", "linear-gradient(180deg,#ff9f0a,#c76c00)",
    "linear-gradient(180deg,#ff375f,#c1103c)", "linear-gradient(180deg,#64d2ff,#0071e3)",
    "linear-gradient(180deg,#a2845e,#6b5340)", "linear-gradient(180deg,#5e5ce6,#3634a3)",
    "linear-gradient(180deg,#0a84ff,#0053b3)", "linear-gradient(180deg,#32ade6,#1a7bb8)",
    "linear-gradient(180deg,#ff6482,#d61e4d)", "linear-gradient(180deg,#40c8e0,#2078b0)",
  ];
  let pc = 0;
  const nextBg = () => PALETTE[pc++ % PALETTE.length];

  function app(id, name, desc, glyph, fn, bg, label) {
    if (CATALOG.some((a) => a.id === id)) return;
    CATALOG.push({ id, name, desc, glyph, bg: bg || nextBg(), label: label || "#fff" });
    RENDERERS[id] = fn;
  }
  const ls = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  };
  const NN = (n) => Array.from({ length: n }, (_, i) => i);

  /* ---------- QUIZ ---------- */
  function quiz(id, name, glyph, qs) {
    app(id, name, "Quiz — " + qs.length + " pytań", glyph, function (el) {
      const bestK = "p-ios-qb-" + id;
      let i = 0, pts = 0;
      function render() {
        if (i >= qs.length) {
          const best = Math.max(pts, Number(localStorage.getItem(bestK) || 0));
          localStorage.setItem(bestK, best);
          el.innerHTML = '<div class="music-card" style="padding-top:44px"><div style="font-size:64px">' + (pts === qs.length ? "🏆" : pts >= qs.length / 2 ? "🎉" : "💪") + "</div>" +
            '<div class="timer-display">' + pts + "/" + qs.length + "</div>" +
            '<p style="opacity:.6;margin-bottom:18px">Twój rekord: ' + best + " pkt</p>" +
            '<button class="btn-primary" id="q-retry" style="max-width:240px;margin:0 auto">Zagraj ponownie</button></div>';
          $s(el, "#q-retry").addEventListener("click", () => { i = 0; pts = 0; render(); });
          return;
        }
        const q = qs[i];
        el.innerHTML = '<div style="text-align:center;padding-top:10px"><span style="opacity:.5;font-size:13px">Pytanie ' + (i + 1) + "/" + qs.length + " · <b>" + pts + ' pkt</b></span>' +
          '<h3 style="margin:16px 8px;line-height:1.4">' + esc(q.q) + "</h3>" +
          '<div id="q-opts" style="display:flex;flex-direction:column;gap:10px;max-width:330px;margin:0 auto"></div>' +
          '<div id="q-note" style="min-height:40px;margin-top:12px;font-size:14px;opacity:.8"></div></div>';
        const box = $s(el, "#q-opts");
        q.a.forEach(function (opt, oi) {
          const b = document.createElement("button");
          b.className = "note-item";
          b.style.justifyContent = "center";
          b.style.fontWeight = "600";
          b.textContent = opt;
          b.addEventListener("click", function () {
            const note = $s(el, "#q-note");
            if (oi === q.c) { pts++; b.style.outline = "3px solid #30d158"; note.textContent = "✅ Dobrze!"; }
            else { b.style.outline = "3px solid #ff453a"; note.textContent = "❌ Prawidłowo: " + q.a[q.c]; }
            box.querySelectorAll(".note-item").forEach(function (x) { x.disabled = true; });
            const nx = document.createElement("button");
            nx.className = "btn-primary";
            nx.style.marginTop = "10px";
            nx.textContent = "Dalej →";
            nx.addEventListener("click", function () { i++; render(); });
            el.appendChild(nx);
          });
          box.appendChild(b);
        });
      }
      render();
    });
  }
  const Q = (q, a, c) => ({ q, a, c });

  /* ---------- MEMORIA ---------- */
  function memory(id, name, glyph, emos) {
    app(id, name, "Gra pamięciowa — " + emos.length + " par", glyph, function (el) {
      el.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><b style="font-size:18px">Znajdź pary!</b><span id="mm-moves" style="opacity:.6;font-size:14px">Ruchy: 0</span></div><div class="mem-grid" id="mm-grid"></div>';
      const grid = $s(el, "#mm-grid"), movesEl = $s(el, "#mm-moves");
      const deck = emos.concat(emos).sort(() => Math.random() - .5).map((e) => ({ e, open: false, done: false }));
      let open = [], moves = 0, lock = false;
      function rend() {
        grid.innerHTML = "";
        deck.forEach(function (c, i) {
          const d = document.createElement("button");
          d.className = "mem-card " + (c.done ? "done" : c.open ? "open" : "");
          d.textContent = c.open || c.done ? c.e : "?";
          d.addEventListener("click", function () {
            if (lock || c.open || c.done) return;
            c.open = true; open.push(i);
            if (open.length === 2) {
              moves++; movesEl.textContent = "Ruchy: " + moves;
              const a = open[0], b = open[1];
              if (deck[a].e === deck[b].e) {
                deck[a].done = deck[b].done = true; open = []; rend();
                if (deck.every((x) => x.done)) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;font-size:22px;font-weight:700">🎉 Wygrana w ' + moves + " ruchach!</div>";
              } else { lock = true; rend(); setTimeout(function () { deck[a].open = deck[b].open = false; open = []; lock = false; rend(); }, 700); }
            } else rend();
          });
          grid.appendChild(d);
        });
      }
      rend();
    });
  }

  /* ---------- KONWERTER ---------- */
  function converter(id, name, glyph, units, temp) {
    app(id, name, "Przelicznik — " + units.map((u) => u.n).join(", "), glyph, function (el) {
      const opts = units.map((u, i) => '<option value="' + i + '">' + u.n + "</option>").join("");
      el.innerHTML = '<div style="text-align:center;padding-top:10px">' +
        '<div style="display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:wrap">' +
        '<input type="number" id="cv-v" value="1" step="any" style="width:90px;padding:12px;border-radius:14px;border:1px solid rgba(120,120,128,.35);background:rgba(120,120,128,.1);color:inherit;font-size:16px;font-family:inherit">' +
        '<select id="cv-f" style="padding:12px;border-radius:14px;border:1px solid rgba(120,120,128,.35);background:rgba(120,120,128,.1);color:inherit;font-family:inherit">' + opts + "</select>" +
        "<b>→</b>" +
        '<select id="cv-t" style="padding:12px;border-radius:14px;border:1px solid rgba(120,120,128,.35);background:rgba(120,120,128,.1);color:inherit;font-family:inherit">' + opts + "</select></div>" +
        '<div id="cv-out" class="timer-display"></div>' +
        '<p style="opacity:.5;font-size:13px">' + units.map((u) => u.n).join(" · ") + "</p></div>";
      const selT = $s(el, "#cv-t");
      if (selT.options.length > 1) selT.selectedIndex = 1;
      function upd() {
        const v = parseFloat($s(el, "#cv-v").value) || 0;
        const f = units[$s(el, "#cv-f").value], t = units[selT.value];
        const out = temp ? t.r(f.r(v)) : (v * f.r) / t.r;
        $s(el, "#cv-out").textContent = Number(Number(out).toPrecision(8)).toLocaleString("pl-PL");
      }
      ["#cv-v", "#cv-f", "#cv-t"].forEach((s) => $s(el, s).addEventListener("input", upd));
      upd();
    });
  }

  /* ---------- FISZKI ---------- */
  function flashcards(id, name, glyph, deck) {
    app(id, name, "Fiszki — " + deck.length + " haseł", glyph, function (el) {
      let cards = deck.slice(), i = 0, flipped = false;
      function rend() {
        const idx = ((i % cards.length) + cards.length) % cards.length;
        const c = cards[idx];
        el.innerHTML = '<div style="text-align:center;padding-top:14px"><span style="opacity:.5;font-size:13px">' + (idx + 1) + "/" + cards.length + "</span>" +
          '<div id="fc-card" class="note-item" style="flex-direction:column;align-items:center;justify-content:center;padding:34px 16px;min-height:130px"><b style="font-size:22px;text-align:center;line-height:1.4">' + (flipped ? esc(c.b) : esc(c.a)) + '</b><small style="opacity:.5;margin-top:8px">kliknij, aby odwrócić</small></div>' +
          '<div style="display:flex;gap:10px;margin-top:14px">' +
          '<button class="btn-primary" id="fc-prev" style="width:auto;padding:12px 20px;background:rgba(120,120,128,.3);color:inherit">←</button>' +
          '<button class="btn-primary" id="fc-flip" style="width:auto;padding:12px 20px;background:#0a84ff">Odwróć</button>' +
          '<button class="btn-primary" id="fc-next" style="width:auto;padding:12px 20px;background:rgba(120,120,128,.3);color:inherit">→</button></div>' +
          '<button id="fc-shuf" style="background:none;border:none;color:#0a84ff;cursor:pointer;margin-top:14px;font-family:inherit">🔀 Potasuj talię</button></div>';
        $s(el, "#fc-card").addEventListener("click", function () { flipped = !flipped; rend(); });
        $s(el, "#fc-prev").addEventListener("click", function () { i--; flipped = false; rend(); });
        $s(el, "#fc-next").addEventListener("click", function () { i++; flipped = false; rend(); });
        $s(el, "#fc-shuf").addEventListener("click", function () { cards.sort(() => Math.random() - .5); i = 0; flipped = false; rend(); });
      }
      rend();
    });
  }

  /* ---------- LISTA ---------- */
  function checklist(id, name, glyph, title, seed) {
    app(id, name, "Lista z odhaczykami", glyph, function (el) {
      const K = "p-ios-list-" + id;
      let items = ls.get(K, seed.map((t) => ({ t, done: false })));
      el.innerHTML = '<div style="text-align:center;margin-bottom:14px;font-weight:800;font-size:19px">' + esc(title) + "</div>" +
        '<div class="chat-bar" style="padding-top:0"><input type="text" id="li-in" placeholder="Dodaj element…"><button class="btn-primary" id="li-add" style="width:auto;padding:10px 16px">➕</button></div>' +
        '<div id="li-list" style="margin-top:14px"></div>' +
        '<button id="li-clear" style="background:none;border:none;color:#ff453a;cursor:pointer;margin-top:10px;font-family:inherit">Usuń ukończone</button>';
      const save = () => ls.set(K, items);
      function rend() {
        const list = $s(el, "#li-list");
        list.innerHTML = "";
        items.forEach(function (t, i) {
          const d = document.createElement("div");
          d.className = "todo-item" + (t.done ? " done" : "");
          d.innerHTML = '<button class="todo-check">' + (t.done ? "✓" : "") + '</button><span style="flex:1">' + esc(t.t) + '</span><button class="note-del">🗑</button>';
          $s(d, ".todo-check").addEventListener("click", function () { t.done = !t.done; save(); rend(); });
          $s(d, ".note-del").addEventListener("click", function () { items.splice(i, 1); save(); rend(); });
          list.appendChild(d);
        });
      }
      function add() {
        const inp = $s(el, "#li-in"), v = inp.value.trim();
        if (v) { items.unshift({ t: v, done: false }); inp.value = ""; save(); rend(); }
      }
      $s(el, "#li-add").addEventListener("click", add);
      $s(el, "#li-in").addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
      $s(el, "#li-clear").addEventListener("click", function () { items = items.filter((t) => !t.done); save(); rend(); });
      rend();
    });
  }

  /* ---------- LICZNIK ---------- */
  function counter(id, name, glyph, emoji, goal, unit) {
    app(id, name, goal ? "Licznik — cel: " + goal + " " + unit + "/dzień" : "Licznik dzienny", glyph, function (el) {
      const K = "p-ios-count-" + id;
      const today = new Date().toDateString();
      let data = ls.get(K, { day: today, n: 0 });
      if (data.day !== today) data = { day: today, n: 0 };
      const save = () => ls.set(K, data);
      function rend() {
        const pct = goal ? Math.min(100, Math.round((data.n / goal) * 100)) : 0;
        el.innerHTML = '<div class="music-card" style="padding-top:30px"><div style="font-size:80px">' + emoji + "</div>" +
          '<div class="timer-display">' + data.n + '<span style="font-size:20px;opacity:.5"> ' + esc(unit) + "</span></div>" +
          (goal ? '<div style="height:12px;border-radius:6px;background:rgba(120,120,128,.2);max-width:280px;margin:0 auto 8px"><div style="height:100%;width:' + pct + '%;border-radius:6px;background:#30d158;transition:width .3s"></div></div><p style="opacity:.55;font-size:13px;margin-bottom:16px">' + (data.n >= goal ? "🎉 Cel osiągnięty!" : pct + "% celu — dziś " + goal + " " + unit) + "</p>"
            : '<p style="opacity:.55;font-size:13px;margin-bottom:20px">Licznik dzienny — reset każdego dnia</p>') +
          '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button class="btn-primary" id="c-plus" style="width:auto;padding:14px 30px">＋1</button>' +
          '<button class="btn-primary" id="c-plus5" style="width:auto;padding:14px 22px;background:rgba(120,120,128,.3);color:inherit">＋5</button>' +
          '<button class="btn-primary" id="c-minus" style="width:auto;padding:14px 22px;background:rgba(120,120,128,.3);color:inherit">−1</button></div></div>';
        $s(el, "#c-plus").addEventListener("click", function () { data.n++; save(); rend(); });
        $s(el, "#c-plus5").addEventListener("click", function () { data.n += 5; save(); rend(); });
        $s(el, "#c-minus").addEventListener("click", function () { data.n = Math.max(0, data.n - 1); save(); rend(); });
      }
      rend();
    });
  }

  /* ---------- GENERATOR ---------- */
  function generator(id, name, glyph, emoji, make, btnText) {
    app(id, name, "Generator losowy", glyph, function (el) {
      el.innerHTML = '<div class="music-card" style="padding-top:44px"><div style="font-size:64px">' + emoji + "</div>" +
        '<div id="g-out" style="font-size:26px;font-weight:800;min-height:70px;display:flex;align-items:center;justify-content:center;padding:10px;line-height:1.4">?</div>' +
        '<button class="btn-primary" id="g-go" style="max-width:260px;margin:14px auto 0">' + esc(btnText || "Generuj!") + "</button></div>";
      const out = $s(el, "#g-out");
      out.textContent = make();
      $s(el, "#g-go").addEventListener("click", function () {
        out.style.opacity = 0;
        setTimeout(function () { out.textContent = make(); out.style.opacity = 1; }, 110);
      });
    });
  }

  /* ---------- ENCYKLOPEDIA ---------- */
  function reference(id, name, glyph, emoji, items) {
    app(id, name, "Encyklopedia — " + items.length + " wpisów", glyph, function (el) {
      el.innerHTML = '<div style="text-align:center;font-size:44px;margin-bottom:6px">' + emoji + "</div>" +
        '<input type="text" class="note-input" id="rf-q" placeholder="🔍 Szukaj…">' +
        '<div id="rf-list"></div>';
      function rent(q) {
        const list = $s(el, "#rf-list");
        list.innerHTML = "";
        items.filter(function (it) { return !q || (it.t + " " + it.d).toLowerCase().indexOf(q.toLowerCase()) >= 0; }).forEach(function (it) {
          const d = document.createElement("div");
          d.className = "note-item";
          d.style.flexDirection = "column";
          d.style.alignItems = "flex-start";
          d.innerHTML = "<b>" + esc(it.t) + '</b><span style="opacity:.65;font-size:14px;line-height:1.5">' + esc(it.d) + "</span>";
          list.appendChild(d);
        });
        if (!list.children.length) list.innerHTML = '<p style="text-align:center;opacity:.5;padding:20px">Brak wyników 🤷</p>';
      }
      $s(el, "#rf-q").addEventListener("input", function (e) { rent(e.target.value); });
      rent("");
    });
  }

  /* ---------- TIMER Z PRESETEM ---------- */
  function presetTimer(id, name, glyph, emoji, minutes, label) {
    app(id, name, "Timer — " + minutes + " min (" + label + ")", glyph, function (el) {
      let left = minutes * 60, int = null;
      function beep() {
        try {
          const a = new AudioContext();
          const o = a.createOscillator(), g = a.createGain();
          o.connect(g); g.connect(a.destination); o.frequency.value = 880;
          g.gain.setValueAtTime(.3, a.currentTime);
          g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .6);
          o.start(); o.stop(a.currentTime + .7);
        } catch (e) {}
      }
      function rend() {
        const m = String(Math.floor(left / 60)).padStart(2, "0"), sec = String(left % 60).padStart(2, "0");
        el.innerHTML = '<div class="music-card" style="padding-top:36px"><div style="font-size:70px">' + emoji + "</div>" +
          '<div class="timer-display">' + m + ":" + sec + "</div>" +
          '<p style="opacity:.55;font-size:13px;margin-bottom:16px">' + esc(label) + " — " + minutes + " min</p>" +
          '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button class="btn-primary" id="t-go" style="width:auto;padding:12px 30px">' + (int ? "Pauza" : "Start") + "</button>" +
          '<button class="btn-primary" id="t-rst" style="width:auto;padding:12px 30px;background:rgba(120,120,128,.3);color:inherit">Reset</button></div></div>';
        $s(el, "#t-go").addEventListener("click", function () {
          if (int) { clearInterval(int); int = null; rend(); return; }
          int = setInterval(function () {
            left--;
            if (left <= 0) { clearInterval(int); int = null; beep(); left = minutes * 60; }
            rend();
          }, 1000);
          rend();
        });
        $s(el, "#t-rst").addEventListener("click", function () { clearInterval(int); int = null; left = minutes * 60; rend(); });
      }
      rend();
    });
  }

  /* =================== GRY =================== */

  app("g-2048", "2048", "Łącz kafelki i zdobądź 2048", "🔢", function (el) {
    let board, score, over = false;
    let best = Number(localStorage.getItem("p-ios-2048") || 0);
    function draw() {
      el.innerHTML = '<div style="text-align:center"><div style="display:flex;justify-content:center;gap:16px;margin-bottom:10px;opacity:.8;font-size:14px"><span>Punkty: <b>' + score + '</b></span><span>Rekord: <b>' + best + "</b></span>" + (over ? ' <b style="color:#ff453a">KONIEC</b>' : "") + "</div>" +
        '<div class="g2048-grid">' + board.map(function (row) { return row.map(function (v) { return '<div class="g2048-tile" data-v="' + v + '">' + (v || "") + "</div>"; }).join(""); }).join("") + "</div>" +
        '<p style="opacity:.55;font-size:13px;margin:10px 0 4px">Strzałki (klawiatura) lub przyciski</p>' +
        '<div class="dpad" style="margin-top:2px"><button data-m="U" style="grid-area:u">▲</button><button data-m="L" style="grid-area:l">◀</button><button data-m="R" style="grid-area:r">▶</button><button data-m="D" style="grid-area:d">▼</button></div>' +
        '<button id="t-new" style="background:none;border:none;color:#0a84ff;cursor:pointer;margin-top:10px;font-family:inherit">🔁 Nowa gra</button></div>';
      $s(el, "#t-new").addEventListener("click", function () { newGame(); });
      $s(el, ".dpad").addEventListener("click", function (e) { const b = e.target.closest("button"); if (b) move(b.dataset.m); });
    }
    function slide(row) {
      const c = row.filter(function (v) { return v; });
      const out = [];
      let moved = row.some(function (v, i) { return v !== (c[i] || 0); });
      for (let i = 0; i < c.length; i++) {
        if (c[i] === c[i + 1]) { out.push(c[i] * 2); score += c[i] * 2; i++; }
        else out.push(c[i]);
      }
      while (out.length < 4) out.push(0);
      if (!moved) moved = out.some(function (v, i) { return v !== row[i]; });
      return { row: out, moved: moved };
    }
    function shift(dir) {
      let moved = false;
      for (let k = 0; k < 4; k++) {
        if (dir === "L" || dir === "R") {
          let src = board[k].slice();
          if (dir === "R") src.reverse();
          const r = slide(src);
          if (dir === "R") r.row.reverse();
          board[k] = r.row;
          moved = moved || r.moved;
        } else {
          let src = [board[0][k], board[1][k], board[2][k], board[3][k]];
          if (dir === "D") src.reverse();
          const r = slide(src);
          if (dir === "D") r.row.reverse();
          for (let i = 0; i < 4; i++) board[i][k] = r.row[i];
          moved = moved || r.moved;
        }
      }
      return moved;
    }
    function addTile() {
      const free = [];
      board.forEach(function (row, r) { row.forEach(function (v, c) { if (!v) free.push([r, c]); }); });
      if (free.length) { const p = free[Math.floor(Math.random() * free.length)]; board[p[0]][p[1]] = Math.random() < .9 ? 2 : 4; }
    }
    function checkOver() {
      over = !board.some(function (row, r) {
        return row.some(function (v, c) { return !v || (c < 3 && v === row[c + 1]) || (r < 3 && v === board[r + 1][c]); });
      });
    }
    function move(dir) {
      if (over) return;
      if (shift(dir)) {
        addTile(); checkOver();
        best = Math.max(best, score);
        localStorage.setItem("p-ios-2048", String(best));
        draw();
      }
    }
    function newGame() { board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; score = 0; over = false; addTile(); addTile(); draw(); }
    document.addEventListener("keydown", function on2048(e) {
      if (!$("#app-view").classList.contains("open") || $("#app-title").textContent !== "2048") return;
      const m = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" }[e.key];
      if (m) { e.preventDefault(); move(m); }
    });
    newGame();
  }, "linear-gradient(180deg,#ffc94d,#b8860b)", "#000");

  app("g-tictac", "Kółko i Krzyżyk", "Zagraj z prostym AI", "❌", function (el) {
    let b, done;
    function winner(g) {
      const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (let i = 0; i < L.length; i++) if (g[L[i][0]] && g[L[i][0]] === g[L[i][1]] && g[L[i][0]] === g[L[i][2]]) return g[L[i][0]];
      return g.every(function (v) { return v; }) ? "-" : null;
    }
    function aiMove() {
      const free = b.map(function (v, i) { return v ? null : i; }).filter(function (v) { return v !== null; });
      for (let k = 0; k < free.length; k++) { const t = b.slice(); t[free[k]] = "O"; if (winner(t) === "O") return free[k]; }
      for (let k = 0; k < free.length; k++) { const t = b.slice(); t[free[k]] = "X"; if (winner(t) === "X") return free[k]; }
      return [4, 0, 2, 6, 8, 1, 3, 5, 7].find(function (i) { return !b[i]; });
    }
    function init() { b = ["", "", "", "", "", "", "", "", ""]; done = null; rend(); }
    function rend() {
      const w = winner(b);
      el.innerHTML = '<div style="text-align:center;padding-top:10px"><div style="font-weight:700;font-size:19px;min-height:28px;margin-bottom:10px">' +
        (w === "-" ? "🤝 Remis!" : w === "X" ? "🎉 Wygrałeś!" : w === "O" ? "🤖 Wygrało AI!" : "Twój ruch — jesteś ❌") + "</div>" +
        '<div class="tt-grid">' + b.map(function (v, i) { return '<button data-i="' + i + '" class="tt-cell">' + (v === "X" ? "❌" : v === "O" ? "⭕" : "") + "</button>"; }).join("") + "</div>" +
        '<button class="btn-primary" id="tt-new" style="max-width:200px;margin-top:16px">Nowa rozgrywka</button></div>';
      $s(el, "#tt-new").addEventListener("click", init);
      el.querySelectorAll(".tt-cell").forEach(function (c) {
        c.addEventListener("click", function () {
          if (done || b[+c.dataset.i]) return;
          b[+c.dataset.i] = "X";
          if (!winner(b)) b[aiMove()] = "O";
          done = winner(b);
          rend();
        });
      });
    }
    init();
  }, "linear-gradient(180deg,#5e5ce6,#2c2c7a)");

  app("g-wisielec", "Wisielec", "Zgaduj polskie słowa", "🪢", function (el) {
    const WORDS = ["KOMPUTER", "PINGWIN", "DŽDŽOWNICA", "JABŁKO", "POMARAŃCZA", "HELIKOPTER", "SZKOŁA", "PRZYJAŹŃ", "MORZE", "GÓRA", "KSIĄŻKA", "WIOSNA", "CZEKOLADA", "TRUSKAWKA", "PRZYGODA", "WARSZAWA", "PREZENT", "BIBLIOTEKA", "SŁOŃCE", "PODRÓŻ"];
    const ABC = ["AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŻŹ".split(""), ["nope"]];
    let word, lives, used, win;
    function init() {
      word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
      lives = 6; used = {}; win = false;
      rend();
    }
    function rend() {
      const masked = word.split("").map(function (ch) { return used[ch] ? ch : "_"; }).join(" ");
      el.innerHTML = '<div style="text-align:center;padding-top:10px"><div style="font-size:50px">' + (["💀💀💀💀💀💀", "🙂", "😐", "😟", "😫", "🥶", "💀"][6 - lives] || "💀") + "</div>" +
        '<div style="font-weight:700;font-size:26px;letter-spacing:4px;margin:14px 0;font-variant-numeric:tabular-nums">' + (win ? word : lives <= 0 ? esc(word) : masked) + "</div>" +
        '<p style="opacity:.6;margin-bottom:10px">' + (win ? "🎉 Wygrana!" : lives <= 0 ? "💀 Przegrana!" : "Życia: " + "❤️".repeat(lives)) + "</p>" +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:340px;margin:0 auto">' +
        "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŻŹ".split("").map(function (ch) {
          return '<button class="store-btn wl-key" data-c="' + ch + '" style="width:40px;padding:9px 0;' + (used[ch] ? "opacity:.25" : "") + '">' + ch + "</button>";
        }).join("") + "</div>" +
        '<button class="btn-primary" id="w-new" style="max-width:200px;margin-top:16px;background:rgba(120,120,128,.3);color:inherit">Nowe słowo</button></div>';
      $s(el, "#w-new").addEventListener("click", init);
      el.querySelectorAll(".wl-key").forEach(function (b) {
        b.addEventListener("click", function () {
          if (win || lives <= 0) return;
          const c = b.dataset.c;
          used[c] = true;
          if (word.indexOf(c) < 0) lives--;
          win = word.split("").every(function (ch) { return used[ch]; });
          rend();
        });
      });
    }
    init();
  }, "linear-gradient(180deg,#a2845e,#5c4634)");

  app("g-saper", "Saper", "Znajdź 10 min na polu 9×9", "💣", function (el) {
    const N = 9, M = 10;
    let mines, open, flags, dead, flagMode, done;
    function init() {
      mines = NN(N * N).map(function () { return false; });
      flags = NN(N * N).map(function () { return false; });
      open = NN(N * N).map(function () { return false; });
      dead = false; flagMode = false; done = false;
      let placed = 0;
      while (placed < M) { const r = Math.floor(Math.random() * N * N); if (!mines[r]) { mines[r] = true; placed++; } }
      rend();
    }
    function nb(r) {
      const x = r % N, y = Math.floor(r / N), out = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < N && ny < N) out.push(ny * N + nx);
      }
      return out;
    }
    function cnt(r) { return nb(r).filter(function (n) { return mines[n]; }).length; }
    function reveal(r) {
      if (open[r] || flags[r]) return;
      open[r] = true;
      if (mines[r]) { dead = true; return; }
      if (cnt(r) === 0) nb(r).forEach(reveal);
    }
    const COL = ["", "#4aa3ff", "#30d158", "#ff9f0a", "#5e5ce6", "#ff375f", "#64d2ff", "#bf5af2", "#8e8e93"];
    function rend() {
      const cleared = open.filter(function (o, r) { return o && !mines[r]; }).length;
      done = cleared === N * N - M;
      el.innerHTML = '<div style="text-align:center"><div style="display:flex;justify-content:center;gap:14px;margin-bottom:10px;font-size:14px"><span>💣 ' + (M - flags.filter(Boolean).length) + '</span><span>✅ ' + cleared + "/" + (N * N - M) + "</span>" + (dead ? ' <b style="color:#ff453a">BUM!</b>' : done ? " 🎉 Wygrana!" : "") + "</div>" +
        '<button id="sp-mode" class="store-btn' + (flagMode ? " remove" : "") + '" style="margin-bottom:10px">' + (flagMode ? "🚩 Flagi (aktywne)" : "⛏ Kopanie") + "</button>" +
        '<div class="sp-grid">' + mines.map(function (m, r) {
          const uncovered = open[r] || ((dead || done) && m);
          const n = cnt(r);
          return '<button class="sp-cell' + (uncovered ? " open" : "") + '" data-r="' + r + '" style="color:' + (uncovered && !m ? (COL[n] || "#333") : "inherit") + '">' +
            (open[r] ? (m ? "💥" : n || "") : (dead || done) && m ? "💣" : flags[r] ? "🚩" : "") + "</button>";
        }).join("") + "</div>" +
        '<button id="sp-new" style="background:none;border:none;color:#0a84ff;cursor:pointer;margin-top:10px;font-family:inherit">🔁 Nowa tura</button></div>';
      $s(el, "#sp-mode").addEventListener("click", function () { flagMode = !flagMode; rend(); });
      $s(el, "#sp-new").addEventListener("click", init);
      el.querySelectorAll(".sp-cell").forEach(function (c) {
        const r = +c.dataset.r;
        c.addEventListener("click", function () {
          if (dead || done) { init(); return; }
          if (flagMode) { flags[r] = !flags[r]; rend(); return; }
          if (flags[r]) return;
          reveal(r);
          rend();
        });
        c.addEventListener("contextmenu", function (e) { e.preventDefault(); flags[r] = !flags[r]; rend(); });
      });
    }
    init();
  }, "linear-gradient(180deg,#8e8e93,#3a3a3c)");

  /* =================== NARZĘDZIA =================== */

  app("t-zegar-swiat", "Zegar Świat", "Godziny w 8 miastach", "🌍", function (el) {
    const CITIES = [["Warszawa", "Europe/Warsaw"], ["Londyn", "Europe/London"], ["Nowy Jork", "America/New_York"], ["Los Angeles", "America/Los_Angeles"], ["Tokio", "Asia/Tokyo"], ["Doha", "Asia/Qatar"], ["Sydney", "Australia/Sydney"], ["Rio", "America/Sao_Paulo"]];
    function rend() {
      el.innerHTML = '<h3 style="text-align:center;margin-bottom:14px">🌍 Godziny na świecie</h3><div id="wc-list"></div>';
      const list = $s(el, "#wc-list");
      CITIES.forEach(function (c) {
        const t = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: c[1] }).format(new Date());
        const d = document.createElement("div");
        d.className = "note-item";
        d.innerHTML = '<b style="width:40%">' + c[0] + '</b><span style="font-size:24px;font-weight:300;font-variant-numeric:tabular-nums">' + t + "</span>";
        list.appendChild(d);
      });
    }
    rend();
    const iv = setInterval(function () { if (!$("#app-view").classList.contains("open")) { clearInterval(iv); return; } rend(); }, 10000);
  }, "linear-gradient(180deg,#40c8e0,#1070a0)");

  app("t-bmi", "Kalkulator BMI", "Sprawdź swoją masę ciała", "⚖️", function (el) {
    el.innerHTML = '<div style="max-width:320px;margin:16px auto 0"><input type="number" id="bmi-h" class="note-input" placeholder="Wzrost (cm)" value="175"><input type="number" id="bmi-w" class="note-input" placeholder="Masa (kg)" value="70"><div id="bmi-out" style="text-align:center"></div></div>';
    function upd() {
      const h = ($s(el, "#bmi-h").value || 0) / 100, w = $s(el, "#bmi-w").value || 0;
      const out = $s(el, "#bmi-out");
      if (h <= 0 || w <= 0) { out.innerHTML = ""; return; }
      const bmi = w / (h * h);
      const cat = bmi < 18.5 ? ["Niedowaga", "#64d2ff"] : bmi < 25 ? ["Norma 🎉", "#30d158"] : bmi < 30 ? ["Nadwaga", "#ff9f0a"] : ["Otyłość", "#ff453a"];
      out.innerHTML = '<div class="timer-display">' + bmi.toFixed(1) + '</div><b style="color:' + cat[1] + '">' + cat[0] + '</b><p style="opacity:.55;font-size:13px;margin-top:6px">Nie jest to porada medyczna</p>';
    }
    ["#bmi-h", "#bmi-w"].forEach(function (s) { $s(el, s).addEventListener("input", upd); });
    upd();
  }, "linear-gradient(180deg,#30d158,#7ed957)", "#000");

  app("t-napiwek", "Napiwek", "Ile dać w restauracji?", "🍽️", function (el) {
    el.innerHTML = '<div style="max-width:320px;margin:16px auto 0"><input type="number" id="tp-b" class="note-input" placeholder="Rachunek (zł)" value="100">' +
      '<div class="set-group"><div class="set-row"><span>Napiwek</span><input type="range" id="tp-p" min="0" max="30" value="10" style="width:40%"><b id="tp-pv">10%</b></div>' +
      '<div class="set-row"><span>Osób</span><input type="range" id="tp-n" min="1" max="12" value="2" style="width:40%"><b id="tp-nv">2</b></div></div>' +
      '<div id="tp-out" style="text-align:center"></div></div>';
    function upd() {
      const b = $s(el, "#tp-b").value || 0, p = $s(el, "#tp-p").value, n = $s(el, "#tp-n").value;
      $s(el, "#tp-pv").textContent = p + "%";
      $s(el, "#tp-nv").textContent = n;
      const tip = Math.round((b * p) / 100);
      const all = Number(b) + tip;
      $s(el, "#tp-out").innerHTML = '<div class="timer-display">' + all.toLocaleString("pl-PL") + ' zł</div><p style="opacity:.6">napiwek ' + tip + " zł · po osobie ~" + Math.ceil(all / n).toLocaleString("pl-PL") + " zł</p>";
    }
    ["#tp-b", "#tp-p", "#tp-n"].forEach(function (s) { $s(el, s).addEventListener("input", upd); });
    upd();
  }, "linear-gradient(180deg,#a2845e,#6b5340)");

  app("t-vat", "Kalkulator VAT", "Netto / brutto / podatek", "🧾", function (el) {
    el.innerHTML = '<div style="max-width:320px;margin:16px auto 0"><input type="number" id="vt-b" class="note-input" placeholder="Kwota (zł)" value="100">' +
      '<div class="set-group"><div class="set-row"><span>Kierunek</span><select id="vt-d" style="background:none;border:none;color:inherit;font-family:inherit"><option value="g">＋ dodaj VAT</option><option value="n">− wylicz z brutto</option></select></div>' +
      '<div class="set-row"><span>Stawka</span><select id="vt-s" style="background:none;border:none;color:inherit;font-family:inherit"><option value="0.23">23%</option><option value="0.08">8%</option><option value="0.05">5%</option><option value="0">0%</option></select></div></div>' +
      '<div id="vt-out" style="text-align:center"></div></div>';
    function upd() {
      const v = $s(el, "#vt-b").value || 0, d = $s(el, "#vt-d").value, s = $s(el, "#vt-s").value;
      let netto, brutto;
      if (d === "g") { netto = v; brutto = v * (1 + Number(s)); } else { brutto = v; netto = v / (1 + Number(s)); }
      $s(el, "#vt-out").innerHTML = '<div class="timer-display">' + brutto.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) + ' zł</div><p style="opacity:.6">netto ' + netto.toLocaleString("pl-PL", { maximumFractionDigits: 2 }) + " zł · VAT " + (brutto - netto).toLocaleString("pl-PL", { maximumFractionDigits: 2 }) + " zł</p>";
    }
    ["#vt-b", "#vt-d", "#vt-s"].forEach(function (s) { $s(el, s).addEventListener("input", upd); });
    upd();
  }, "linear-gradient(180deg,#0a84ff,#0053b3)");

  app("t-oddech", "Oddech 4-7-8", "Relaksacja i uspokojenie", "🧘", function (el) {
    const PH = [["Wdech", 4], ["Zatrzymaj", 7], ["Wydech", 8]];
    el.innerHTML = '<div style="text-align:center;padding-top:24px"><div id="br-circle" style="width:170px;height:170px;border-radius:50%;margin:0 auto;background:radial-gradient(circle,rgba(100,210,255,.3),rgba(100,210,255,.08));display:flex;align-items:center;justify-content:center;transition:transform 1s"><b id="br-phase" style="font-size:20px">Wdech</b></div>' +
      '<p id="br-t" class="timer-display" style="font-size:52px">4</p><p style="opacity:.55;font-size:13px">Ćwicz 1–3 minuty, śledź animację koła</p></div>';
    let ph = 0, s = PH[0][1];
    const circ = $s(el, "#br-circle"), lab = $s(el, "#br-phase"), tEl = $s(el, "#br-t");
    const AC = ["scale(1.15)", "scale(1.3)", "scale(0.85)"];
    function setPhase() { s = PH[ph][1]; lab.textContent = PH[ph][0]; tEl.textContent = s; circ.style.transform = AC[ph]; }
    setPhase();
    const iv = setInterval(function () {
      if (!$("#app-view").classList.contains("open")) { clearInterval(iv); return; }
      s--;
      if (s <= 0) { ph = (ph + 1) % 3; setPhase(); } else tEl.textContent = s;
    }, 1000);
  }, "linear-gradient(180deg,#64d2ff,#0060df)");

  app("t-nastroj", "Dziennik Nastroju", "Jak masz się dzisiaj?", "🎭", function (el) {
    const MOODS = [["😄", "Świetnie"], ["🙂", "Dobrze"], ["😐", "Tak sobie"], ["😟", "Kiepsko"], ["😡", "Fatalnie"]];
    function rend() {
      const hist = ls.get("p-ios-mood", []);
      const dKey = new Date().toISOString().slice(0, 10);
      const nowMood = hist.find(function (e) { return e.d === dKey; });
      el.innerHTML = '<h3 style="text-align:center;margin-bottom:14px">Jak masz się dzisiaj?</h3>' +
        '<div id="md-btns" style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:18px">' +
        MOODS.map(function (m, i) { return '<button class="store-btn md-pick" data-i="' + i + '" style="font-size:22px;' + (nowMood && nowMood.m === i ? "outline:3px solid #0a84ff" : "") + '">' + m[0] + "</button>"; }).join("") + "</div>" +
        '<div id="md-hist"></div>';
      el.querySelectorAll(".md-pick").forEach(function (b) {
        b.addEventListener("click", function () {
          const h = ls.get("p-ios-mood", []);
          const d = dKey;
          const i = h.findIndex(function (e) { return e.d === d; });
          if (i >= 0) h[i] = { d: d, m: +b.dataset.i }; else h.push({ d: d, m: +b.dataset.i });
          ls.set("p-ios-mood", h);
          rend();
        });
      });
      const h = $s(el, "#md-hist");
      hist.slice(-14).reverse().forEach(function (e) {
        const d = document.createElement("div");
        d.className = "note-item";
        d.innerHTML = "<span>" + MOODS[e.m][0] + " " + MOODS[e.m][1] + '</span><small style="opacity:.5">' + e.d + "</small>";
        h.appendChild(d);
      });
    }
    rend();
  }, "linear-gradient(180deg,#ff6482,#d61e4d)");

  /* =================== REJESTRACJA PACZEK =================== */

  /* QUIZY (15) */
  quiz("q-historia", "Quiz: Historia", "🏛️", [
    Q("W którym roku wybuchła II wojna światowa?", ["1939", "1914", "1945", "1918"], 0),
    Q("Kto był pierwszym królem Polski?", ["Bolesław Chrobry", "Mieszko I", "Kazimierz Wielki", "Władysław Jagiełło"], 0),
    Q("Upadek muru berlińskiego nastąpił w roku:", ["1989", "1991", "1979", "1995"], 0),
    Q("Który pokój zakończył I wojnę światową?", ["wersalski", "kioto", "delaware", "wiedeński"], 0),
    Q("Pierwszą baterię elektryczną skonstruował:", ["Volta", "Edison", "Tesla", "Faraday"], 0),
    Q("Wojna stuletnia trwała lat:", ["116", "100", "50", "30"], 0),
    Q("Pierwszy człowiek w kosmosie:", ["Jurij Gagarin", "Neil Armstrong", "Alan Shepard"], 0),
    Q("Konstytucja 3 Maja ustanowiona w:", ["1791", "1789", "1795", "1793"], 0),
  ]);
  quiz("q-geografia", "Quiz: Geografia", "🗺️", [
    Q("Stolica Australii?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2),
    Q("Najdłuższa rzeka świata:", ["Amazonka", "Nil", "Jangcy", "Missisipi"], 1),
    Q("Najwyższy szczyt świata:", ["K2", "Everest", "Annapurna", "Lhotse"], 1),
    Q("Największa pustynia świata:", ["Sahara", "Antarktyda", "Gobi", "Atakama"], 1),
    Q("Które państwo ma najwięcej wysp?", ["Szwecja", "Indonezja", "Filipiny", "Japonia"], 0),
    Q("Najgłębszy punkt oceania:", ["Mariański", "Tonga", "Jamajka", "Sunda"], 0),
    Q("Ile kontynentów na Ziemi?", ["5", "6", "7", "8"], 2),
    Q("Największe państwo świata:", ["Chiny", "Kanada", "Rosja", "USA"], 2),
  ]);
  quiz("q-kino", "Quiz: Kino", "🎬", [
    Q("Kto wyreżyserował „Incepcję”?", ["Christopher Nolan", "Tarantino", "Cameron", "Spielberg"], 0),
    Q("Aktor grajackiego Jacka w „Titanic”:", ["Leonardo DiCaprio", "Brad Pitt", "Matt Damon"], 0),
    Q("Dom Harry'ego Pottera:", ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"], 0),
    Q("Najbardziej dochodowy film wszech czasów:", ["Avatar", "Avengers", "Titanic", "Star Wars"], 0),
    Q("„Jestem ojcem” — kto grał Vito Corleone?", ["Marlon Brando", "Al Pacino", "Robert De Niro"], 0),
  ]);
  quiz("q-muzyka", "Quiz: Muzyka", "🎧", [
    Q("Ile strun ma klasyczna gitara?", ["5", "6", "7", "12"], 1),
    Q("Która nuta ma częstotliwość 440 Hz?", ["A", "C", "G", "F"], 0),
    Q("„Bohemian Rhapsody” nagrał:", ["Queen", "Led Zeppelin", "Pink Floyd"], 0),
    Q("Ile miar ma takt w metrum 4/4?", ["4", "2", "3", "5"], 0),
    Q("Instrument z 88 klawiszami:", ["fortepian", "organy", "akordeon"], 0),
  ]);
  quiz("q-sport", "Quiz: Sport", "⚽️", [
    Q("Które państwo wygrało najwięcej Mundialów?", ["Brazylia", "Niemcy", "Włochy", "Argentyna"], 0),
    Q("Rekord 100 m należy do:", ["Usaina Bolta", "Tyzuja", "Carl Lewisa"], 0),
    Q("100 m pływci nurkują w stylu:", ["kraulem", "żabką", "motylkiem"], 0),
    Q("Co się gra w „Wimbledon”?", ["tenis", "Łuk", "badminton"], 0),
    Q("Ile graczy w drużynie siatkarskiej na placze?", ["6", "5", "7", "4"], 0),
  ]);
  quiz("q-it", "Quiz: Informatyka", "💻", [
    Q("Binarnie: 10 + 11 = ?", ["101", "110", "1001", "111"], 0),
    Q("Twórca systemu Android:", ["Google", "Apple", "Microsoft"], 0),
    Q("Port HTTPS:", ["443", "80", "8080", "21"], 0),
    Q("#FF0000 to barwa:", ["czerwień", "zieleń", "błękit"], 0),
    Q("Indeksy tablic zaczynają się od:", ["0", "1", "−1"], 0),
    Q("Procesory M1/M2/M3 produkuje:", ["Apple", "Intel", "AMD"], 0),
    Q("CSS — skrót:", ["Cascading Style Sheets", "Computer Style System", "Creative Styles"], 0),
  ].filter(Boolean));
  quiz("q-biologia", "Quiz: Biologia", "🧬", [
    Q("Największy organ człowieka:", ["skóra", "wątroba", "płuca"], 0),
    Q("Chloroplast odpowiada za:", ["fotosyntezę", "oddychanie", "podział"], 0),
    Q("Ile komórek ma organizm ludzki (ok.)?", ["37 bilionów", "37 mln", "37 tys."], 0),
    Q("Czerwone krwinki transportują:", ["tlen", "pokarm", "szkodniki"], 0),
    Q("DNA składa się z:", ["nukleotydów", "aminokwasów", "glukozy"], 0),
  ]);
  quiz("q-kosmos", "Quiz: Kosmos", "🪐", [
    Q("Największa planeta Układu Słonecznego:", ["Jowisz", "Saturn", "Neptun", "Mars"], 0),
    Q("Ile księżycowych naturalnych ma Ziemia?", ["1", "2", "8"], 0),
    Q("Planeta „czerwona planeta”:", ["Mars", "Wenus", "Merkury"], 0),
    Q("Świeca 正 — rok świetlny to odległość:", ["9,46 bln km", "1 mln km", "300 tys. km"], 0),
    Q("Teleskop Hubble krąży około:", ["Ziemi", "Marsa", "Księżyca"], 0),
  ]);
  quiz("q-matma", "Quiz: Liczby i liczby", "➗", [
    Q("15% z 200:", ["30", "25", "35", "20"], 0),
    Q("Pierwiastek z 81:", ["8", "9", "7", "6"], 1),
    Q("2 + 2 × 3 = ?", ["8", "10", "12", "6"], 0),
    Q("Ile liczb pierwszych jest mniejszych od 10?", ["4", "3", "5", "2"], 0),
    Q("Σ z 1 do 10:", ["55", "50", "45", "60"], 0),
  ]);
  quiz("q-angielski", "Quiz: English", "🇬🇧", [
    Q("„Jedzenie” po angielsku:", ["food", "eat", "mealtime"], 0),
    Q("Past Simple of „go”:", ["went", "goed", "gone"], 0),
    Q("„Drogi” (cena):", ["expensive", "cheep", "costly cheap"], 0),
    Q("Colour of the sky:", ["blue", "green", "red"], 0),
    Q("How many days in a week?", ["7", "5", "10"], 0),
  ]);
  quiz("q-tradycje", "Quiz: Tradycje PL", "🕯️", [
    Q("Ile potraw na wigilijnym stole zwyczajowo?", ["12", "7", "10"], 0),
    Q("Tłusty czwartek to dzień:", ["pączków", "śledzia", "kurczaka"], 0),
    Q("Śmigus-dyngus należy do świąt:", ["Wielkanocy", "Bożego Narodzenia"], 0),
    Q("Ile osób zasiada przy wigilijnym stole zwyczajowo (paradoks)?", ["parzysta liczba", "7", "dowolna"], 0),
    Q("Andrzejki obchodzimy w:", ["listopadzie", "kwietniu"], 0),
  ]);
  quiz("q-gry", "Quiz: Gry wideo", "🕹️", [
    Q("Mario jest…", ["hydraulikiem", "kucharzem", "strażakiem"], 0),
    Q("Twórcą Minecrafta jest:", ["Notch", "Gabe Newell", "Hideo Kojima"], 0),
    Q("Konsola „Switch” należy do:", ["Nintendo", "Sony", "Microsoft"], 0),
    Q("W Pac-Manie nastręcza się:", ["kropki", "monety", "gwiazdki"], 0),
    Q("Tetris wymyślony w:", ["ZSRR", "USA", "Japonii"], 0),
  ]);
  quiz("q-samochody", "Quiz: Motoryzacja", "🚗", [
    Q("Logo z okrągłym „VW” należy do:", ["Volkswagen", "Volvo", "Veteran"], 0),
    Q("Ile kół ma bolid F1?", ["4", "3", "5"], 0),
    Q("Tesla produkuje samochody:", ["elektryczne", "spalinowe", "hybrydowe"], 0),
    Q("Która strona wynika ze skrótu ABS?", ["system antyblokujący hamulce", "tryb auta", "typ silnika"], 0),
    Q("Silnik Wankla jest silnikiem:", ["rotacyjnym", "tłokowym"], 0),
  ]);
  quiz("q-zwierzeta-quiz", "Quiz: Zwierzęta", "🦁", [
    Q("Największe ssak świata:", ["płetwal błękitny", "słoń afrykański", "żyrafa"], 0),
    Q("Ile kwiatów odwiedza pszczoła dziennie?", ["setki", "kilka", "miliony"], 0),
    Q("Ośmiornica ma serca:", ["3", "1", "2"], 0),
    Q("Które zwierzę buduje tamy?", ["bóbr", "wilk", "lis"], 0),
    Q("Kameleon zmienia kolor głównie dla:", ["komunikacji i temperatury", "maskowania śmieci"], 0),
  ]);
  quiz("q-zagadki", "Quiz: Zagadki", "🧩", [
    Q("Has keys but opens no locks. What is it?", ["A piano", "A car", "A map"], 0),
    Q("Co rośnie, gdy zmienna się lekka i ciemna?", [" Cień", "Bulwa", "Podatek"], 0),
    Q("Co należy „musi mieć dziurki, ale zawsze zamyka”?", ["rękawiczka", "szczur", "klucz"], 0),
  ].filter(function (q) { return q; }));

  /* MEMORY (10) */
  memory("m-jedzenie", "Memoria: Jedzenie", "🍕", ["🍕", "🍔", "🍟", "🌮", "🍩", "🍓", "🥑", "🍇"]);
  memory("m-zwierzeta-mem", "Memoria: Zwierzęta", "🐶", ["🐶", "🐱", "🦊", "🐻", "🐼", "🦁", "🐨", "🐸"]);
  memory("m-transport", "Memoria: Pojazdy", "🚗", ["🚗", "🚚", "🚀", "✈️", "🚲", "🛵", "🚂", "🛸"]);
  memory("m-rosliny", "Memoria: Rośliny", "🌿", ["🌵", "🌻", "🍀", "🌴", "🌸", "🍁", "🌿", "🌾"]);
  memory("m-kosmos", "Memoria: Kosmos", "🪐", ["🌙", "⭐️", "☄️", "🪐", "🌍", "🌞", "🚀", "🛸"]);
  memory("m-pogoda", "Memoria: Pogoda", "🌦️", ["☀️", "🌧", "⛈", "🌈", "❄️", "🌪", "🌫", "⚡️"]);
  memory("m-sport-mem", "Memoria: Sport", "🏅", ["⚽️", "🏀", "🏈", "🎾", "🏐", "🏓", "🥊", "⛳️"]);
  memory("m-muzyka-mem", "Memoria: Muzyka", "🎼", ["🎸", "🎺", "🎻", "🥁", "🎹", "🎤", "🎧", "📻"]);
  memory("m-symbole", "Memoria: Symbole", "💜", ["❤️", "💙", "💚", "💜", "🖤", "🧡", "💛", "🤍"]);
  memory("m-postacie", "Memoria: Fantastyka", "🦄", ["🦸", "🧙", "🧚", "🦄", "🐲", "🧛", "🕵️", "🤖"]);

  /* KONWERTERY (10) */
  converter("c-dlugosc", "Długość", "📏", [{ n: "km", r: 1000 }, { n: "m", r: 1 }, { n: "cm", r: 0.01 }, { n: "mm", r: 0.001 }, { n: "mila", r: 1609.344 }, { n: "cal", r: 0.0254 }]);
  converter("c-masa", "Masa", "🏋️", [{ n: "t", r: 1000 }, { n: "kg", r: 1 }, { n: "g", r: 0.001 }, { n: "funty", r: 0.45359237 }, { n: "uncje", r: 0.0283495 }]);
  converter("c-temp", "Temperatura", "🌡️", [
    { n: "°C", r: function (c) { return c; } },
    { n: "°F", r: function (c) { return (c * 9) / 5 + 32; } },
    { n: "K", r: function (c) { return c + 273.15; } },
  ], true);
  converter("c-czas", "Czas", "⏳", [{ n: "tydz.", r: 604800 }, { n: "doba", r: 86400 }, { n: "h", r: 3600 }, { n: "min", r: 60 }, { n: "s", r: 1 }]);
  converter("c-objetosc", "Objętość", "🧴", [{ n: "l", r: 1 }, { n: "ml", r: 0.001 }, { n: "gal(US)", r: 3.785412 }, { n: "kubek", r: 0.24 }]);
  converter("c-dane", "Dane", "💾", [{ n: "TB", r: 1099511627776 }, { n: "GB", r: 1073741824 }, { n: "MB", r: 1048576 }, { n: "KB", r: 1024 }, { n: "B", r: 1 }]);
  converter("c-energia", "Energia", "⚡️", [{ n: "kWh", r: 3600000 }, { n: "kJ", r: 1000 }, { n: "kcal", r: 4184 }, { n: "cal", r: 4.184 }]);
  converter("c-predkosc", "Prędkość", "🏎", [{ n: "km/h", r: 1 }, { n: "m/s", r: 3.6 }, { n: "mph", r: 1.609344 }, { n: "węzeł", r: 1.852 }]);
  converter("c-kat", "Kąty", "📐", [{ n: "°", r: 1 }, { n: "rad", r: 57.29578 }, { n: "obrót", r: 360 }]);
  converter("c-waluta", "Waluta (demo)", "💱", [{ n: "PLN", r: 1 }, { n: "EUR", r: 4.3 }, { n: "USD", r: 4.0 }, { n: "GBP", r: 5.0 }]);

  /* FISZKI (10) */
  flashcards("f-ang", "Angielski — podstawy", "🇬🇧", [
    { a: "Hello", b: "Cześć" }, { a: "Good morning", b: "Dzień dobry (rano)" }, { a: "Thank you", b: "Dziękuję" }, { a: "Sorry", b: "Przepraszam" }, { a: "Expensive", b: "Drogi" }, { a: "Cheap", b: "Tani" }, { a: "Let's go", b: "Chodźmy" }, { a: "Maybe", b: "Może" }, { a: "Always", b: "Zawsze" }, { a: "Never", b: "Nigdy" },
  ]);
  flashcards("f-hisz", "Hiszpański", "🇪🇸", [
    { a: "Hola", b: "Cześć" }, { a: "Gracias", b: "Dziękuję" }, { a: "Adiós", b: "Do widzenia" }, { a: "Perdón", b: "Przepraszam" }, { a: "Comida", b: "Jedzenie" }, { a: "Agua", b: "Woda" }, { a: "Vamos", b: "Idziemy" }, { a: "Mañana", b: "Jutro / rano" },
  ]);
  flashcards("f-niem", "Niemiecki", "🇩🇪", [
    { a: "Guten Tag", b: "Dzień dobry" }, { a: "Danke", b: "Dziękuję" }, { a: "Tschüss", b: "Cześć (na pa)" }, { a: "Entschuldigung", b: "Przepraszam" }, { a: "Wasser", b: "Woda" }, { a: "Brot", b: "Chleb" }, { a: "Freund", b: "Przyjaciel" },
  ]);
  flashcards("f-franc", "Francuski", "🇫🇷", [
    { a: "Bonjour", b: "Dzień dobry" }, { a: "Merci", b: "Dziękuję" }, { a: "Au revoir", b: "Do widzenia" }, { a: "Pardon", b: "Przepraszam" }, { a: "Eau", b: "Woda" }, { a: "Pain", b: "Chleb" }, { a: "Oui", b: "Tak" }, { a: "Non", b: "Nie" },
  ]);
  flashcards("f-stolice", "Stolice świata", "🏛️", [
    { a: "Japonia", b: "Tokio" }, { a: "Kanada", b: "Ottawa" }, { a: "Australia", b: "Canberra" }, { a: "Turcja", b: "Ankara" }, { a: "Brazylia", b: "Brasília" }, { a: "Szwajcaria", b: "Berno" }, { a: "Nowa Zelandia", b: "Wellington" }, { a: "Maroko", b: "Rabat" },
  ]);
  flashcards("f-flagi", "Flagi świata", "🚩", [
    { a: "🇯🇵", b: "Japonia" }, { a: "🇧🇷", b: "Brazylia" }, { a: "🇨🇦", b: "Kanada" }, { a: "🇰🇷", b: "Korea Płd." }, { a: "🇮🇹", b: "Włochy" }, { a: "🇿🇦", b: "RPA" }, { a: "🇸🇪", b: "Szwecja" }, { a: "🇲🇽", b: "Meksyk" },
  ]);
  flashcards("f-it", "IT — pojęcia", "💻", [
    { a: "API", b: "Interfejs komunikacji między programami" }, { a: "RAM", b: "Pamięć operacyjna — ulotna, szybka" }, { a: "SSD", b: "Dysk półprzewodnikowy (bez talerzy)" }, { a: "DNS", b: "Tłumaczy nazwy domen na adresy IP" }, { a: "Git", b: "System kontroli wersji kodu" }, { a: "HTTP 404", b: "Nie znaleziono zasobu" }, { a: "Docker", b: "Konteneryzacja aplikacji" },
  ]);
  flashcards("f-chemia", "Chemia — pierwiastki", "⚗️", [
    { a: "H", b: "Wodór" }, { a: "O", b: "Tlen" }, { a: "Fe", b: "Żelazo" }, { a: "Au", b: "Złoto" }, { a: "Ag", b: "Srebro" }, { a: "Na", b: "Sód" }, { a: "K", b: "Potas" }, { a: "Ca", b: "Wapń" }, { a: "C", b: "Węgiel" }, { a: "He", b: "Hel" },
  ]);
  flashcards("f-anatomia", "Anatomia", "🦴", [
    { a: "Serce", b: "Pompuje krew — ok. 100 tys. uderzeń na dobę" }, { a: "Wątroba", b: "Filtruje toksyny, produkuje żółć" }, { a: "Nerka", b: "Filtruje krew, produkuje mocz" }, { a: "Płuca", b: "Wymiana gazów — tlen i dwutlenek węgla" }, { a: "Mózg", b: "Ośrodek nerwowy — 86 mld neuronów" }, { a: "Mięsień największy", b: "Pośladkowy wielki (gluteus maximus)" },
  ]);
  flashcards("f-idiomy", "Polskie idiomy", "🗣", [
    { a: "Rzucać grochem o ścianę", b: "Mówić do kogoś, kto nie słucha" }, { a: "Bułka z masłem", b: "Coś bardzo prostego" }, { a: "Noce i dnie", b: "Cały czas, nieustannie" }, { a: "Wielkie kopciuszki", b: "Mówić nieprawdę o cudzych zamiarach" }, { a: "Dzić się nie trzeba", b: "Nie ma co panikować" },
  ]);

  /* LISTY (7) */
  checklist("l-zakupy", "Lista Zakupów", "🛒", "🛒 Zakupy", ["Chleb", "Mleko", "Jajka"]);
  checklist("l-walizka", "Przed wyjazdem", "🧳", "🧳 Walizka", ["Paszport", "Ładowarka", "Klucze"]);
  checklist("l-ksiazki", "Lista lektur", "📚", "📚 Książki do przeczytania", ["Sapiens", "Solaris"]);
  checklist("l-filmy", "Filmy do obejrzenia", "🍿", "🍿 Watchlista", ["Incepcja"]);
  checklist("l-wishlist", "Lista marzeń", "✨", "✨ Wishlist", []);
  checklist("l-cele", "Cele tygodnia", "🎯", "🎯 Cele na tydzień", []);
  checklist("l-przepisy", "Przepisy do spróbowania", "🍳", "👩‍🍳 Do ugotowania", ["Pierogi"]);

  /* LICZNIKI (7) */
  counter("n-woda", "Woda", "💧", "💧", 8, "szklanek");
  counter("n-kawa", "Kawa", "☕️", "☕️", 3, "filiżanek");
  counter("n-kroki", "Kroki", "👟", "👟", 10000, "kroków");
  counter("n-trening", "Treningi", "💪", "💪", 3, "treningów");
  counter("n-nonpale", "Nie palę", "🚭", "🚭", null, "papierosów uniknięto");
  counter("n-ksiazki-n", "Przeczytane strony", "📖", "📖", 30, "stron");
  counter("n-nauka", "Godziny nauki", "🧠", "🧠", 2, "godzin");

  /* GENERATORY (6) */
  const NICK1 = ["Turbo", "Mega", "Cyber", "Neon", "Pixel", "Laser", "Astro", "Retro"];
  const NICK2 = ["Wilk", "Sokół", "Smok", "Borsuk", "Kot", "Ryś", "Żuk", "Żmija"];
  generator("g-haslo", "Generator haseł", "🔑", "🔐", function () {
    const abc = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let pass = "";
    for (let i = 0; i < 14; i++) pass += abc[Math.floor(Math.random() * abc.length)];
    return pass;
  }, "🎲 Nowe hasło (14 znaków)");
  generator("g-nick", "Generator nicków", "🕹", "🎮", function () {
    return NICK1[Math.floor(Math.random() * NICK1.length)] + NICK2[Math.floor(Math.random() * NICK2.length)] + Math.floor(Math.random() * 100);
  }, "🎲 Wylosuj nick");
  generator("g-lotto", "Lotto", "🎟", "🍀", function () {
    const n = [];
    while (n.length < 6) { const v = 1 + Math.floor(Math.random() * 49); if (n.indexOf(v) < 0) n.push(v); }
    return n.sort(function (a, b) { return a - b; }).join(" · ");
  }, "🎲 Wylosuj 6 z 49");
  generator("g-kolor", "Losowy kolor", "🎨", "🎨", function () {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase();
  }, "🎲 Losuj kolor HEX");
  generator("g-wybieram", "Wybierz za mnie", "🤔", "🎱", function () {
    const o = ["Tak!", "Nie.", "Zdecydowanie tak!", "Raczej nie", "Zapytaj jutro", "Podejmij ryzyko", "Na pewno", "Odważnie — TAK"];
    return o[Math.floor(Math.random() * o.length)];
  }, "🎲 Co mam zrobić?");
  generator("g-moneta2", "Orzeł czy reszka", "🪙", "🪙", function () {
    return Math.random() < .5 ? "ORZEŁ" : "RESZKA";
  }, "🪙 Rzuć monetą");

  /* ENCYKLOPEDIE (10) */
  reference("r-pierwiastki", "Pierwiastki", "🔬", "⚗️", [
    { t: "Wodór (H)", d: "Najlżejszy i najczęstszy pierwiastek we Wszechświecie." },
    { t: "Tlen (O)", d: "Niezbędny do oddychania; 21% atmosfery Ziemi." },
    { t: "Węgiel (C)", d: "Podstawa życia — miliony związków organicznych." },
    { t: "Złoto (Au)", d: "Metal szlachetny, nie utlenia się w powietrzu." },
    { t: "Żelazo (Fe)", d: "Najczęstszy pierwiastek w jądrze Ziemi; składnik krwi." },
    { t: "Srebro (Ag)", d: "Najlepszy przewodnik elektryczny wśród metali." },
    { t: "Hel (He)", d: "Gaz szlachetny, lżejszy od powietrza; balony!" },
    { t: "Sód (Na)", d: "Reaktywny metal alkaliczny; składnik soli kuchennej." },
  ]);
  reference("r-fakty", "Ciekawostki", "🤓", "🤯", [
    { t: "Ośmiornice", d: "Mają 3 serca i niebieską krew." },
    { t: "Miód", d: "Nie psuje się — znaleziono jadalny po 3000 latach." },
    { t: "Zebry", d: "Paski jak odciski palców — każda zebra inna." },
    { t: "Ziemia", d: "Na równiku obraca się ok. 1670 km/h." },
    { t: "Banan", d: "Botanicznie to jagoda. Truskawka — nie!" },
    { t: "Drzewa", d: "Komunikują się przez sieci grzybni pod ziemią." },
    { t: "Zegar", d: "Pierwszy mechaniczny zegar powstał ok. 1300 r." },
  ]);
  reference("r-przepisy", "Szybkie przepisy", "🍝", "🍳", [
    { t: "Owsianka błyskawica", d: "Płatki + mleko + banan + cynamon. 3 min." },
    { t: "Makaron aglio e olio", d: "Czosnek na oliwie + chili + makaron + parmezan. 10 min." },
    { t: "Tosty z serem", d: "Chleb tostowy + ser + grill 5 min." },
    { t: "Tortilla z serem", d: "Tortilla + ser + patelnia 4 min z każdej strony." },
    { t: "Kanapka hawajska", d: "Chleb, ser, ananas, szynka — piekarnik 8 min." },
  ]);
  reference("r-cwiczenia", "Ćwiczenia domowe", "🏃", "💪", [
    { t: "Pompki", d: "3 × 12. Klatka + triceps. Plecy prosto." },
    { t: "Przysiady", d: "3 × 15. Nogi + pośladki. Kolana w linii stóp." },
    { t: "Plank", d: "3 × 30 s. Core. Ciało w jednej linii." },
    { t: "Wykroki", d: "3 × 12 na nogę. Równowaga + nogi." },
    { t: "Burpees", d: "3 × 10. Całe ciało + cardio." },
  ]);
  reference("r-pomoc", "Pierwsza pomoc", "🚑", "🩺", [
    { t: "Alarm", d: "PL: 112 (ogólne), 999 (pogotowie)." },
    { t: "Zadławienie", d: "5 uderzeń między łopatki, potem 5 ucisków nadbrzusza (Heimlich)." },
    { t: "Omdlenie", d: "Ułóż poszkodowanego, unieś nogi, zapewn dopływ powietrza." },
    { t: "Krwotok", d: "Uciśnij ranę czystym materiałem, unieś kończynę." },
    { t: "Oparzenie", d: "Chłodź bieżącą zimną wodą 10–20 min. Nie przykladaj lodu." },
    { t: "RKO", d: "30 ucisków klatki (5–6 cm głębokości) na 2 oddechy." },
  ]);
  reference("r-idiomy-ref", "Idiomy świata", "🌍", "🗣", [
    { t: "EN: It's raining cats and dogs.", d: "Leje jak z cebra." },
    { t: "DE: Das ist mein Bier.", d: "To moja sprawa (dosł. moje piwo)." },
    { t: "ES: No hay mal que por bien no venga.", d: "Nie ma złego, co by na dobre nie wyszło." },
    { t: "FR: Coûter les yeux de la tête.", d: "Kosztować krocie." },
    { t: "IT: In bocca al lupo!", d: "Powodzenia! (dosł. wilku w pysk)" },
  ]);
  reference("r-przyslowia", "Przysłowia polskie", "📜", "📖", [
    { t: "Kto rano wstaje", d: "temu Pan Bóg daje." },
    { t: "Bez pracy", d: "nie ma kołaczy." },
    { t: "Gdzie kucharek sześć", d: "tam nie ma co jeść." },
    { t: "Nie chwal dnia", d: "przed zachodem słońca." },
    { t: "Lepszy wróbel w garści", d: "niż gołąb na dachu." },
    { t: "Jak sobie pościelesz", d: "tak się wyśpisz." },
  ]);
  reference("r-swieta", "Polskie święta", "🎄", "🎉", [
    { t: "1 stycznia", d: "Nowy Rok." },
    { t: "6 stycznia", d: "Trzech Króli." },
    { t: "Zmienna data (wiosną)", d: "Wielkanoc + Poniedziałek Wielkanocny." },
    { t: "1 maja", d: "Święto Pracy." },
    { t: "3 maja", d: "Święto Konstytucji 3 Maja." },
    { t: "15 sierpnia", d: "Święto Wojska Polskiego." },
    { t: "1 listopada", d: "Wszystkich Świętych." },
    { t: "11 listopada", d: "Święto Niepodległości." },
    { t: "25–26 grudnia", d: "Boże Narodzenie (Wigilia 24.12)." },
  ]);
  reference("r-si", "Jednostki SI", "📐", "📏", [
    { t: "Metr (m)", d: "Długość — definiowany przez prędkość światła." },
    { t: "Kilogram (kg)", d: "Masa — od 2019 r. przez stałą Plancka." },
    { t: "Sekunda (s)", d: "Czas — 9 192 631 770 okresów cezu-133." },
    { t: "Amper (A)", d: "Natężenie prądu elektrycznego." },
    { t: "Kelvin (K)", d: "Temperatura — 0 K = −273,15 °C." },
    { t: "Mol (mol)", d: "Liczność materii — 6,022 × 10²³ cząstek." },
    { t: "Kandela (cd)", d: "Światłość źródła światła." },
  ]);
  reference("r-zodiak", "Znaki zodiaku", "♌️", "✨", [
    { t: "Baran ♈", d: "21.03 – 19.04 — energia i odwaga." },
    { t: "Byk ♉", d: "20.04 – 20.05 — cierpliwość i wytrwałość." },
    { t: "Bliźnięta ♊", d: "21.05 – 20.06 — ciekawość i komunikatywność." },
    { t: "Rak ♋", d: "21.06 – 22.07 — wrażliwość i troska." },
    { t: "Lew ♌", d: "23.07 – 22.08 — charyzma i kreatywność." },
    { t: "Panna ♍", d: "23.08 – 22.09 — pragmatyzm i dopracowanie." },
    { t: "Waga ♎", d: "23.09 – 22.10 — harmonia i dyplomacja." },
    { t: "Skorpion ♏", d: "23.10 – 21.11 — intensywność i pasja." },
    { t: "Strzelec ♐", d: "22.11 – 21.12 — optymizm i przygoda." },
    { t: "Koziorożec ♑", d: "22.12 – 19.01 — ambicja i dyscyplina." },
    { t: "Wodnik ♒", d: "20.01 – 18.02 — innowacja i niezależność." },
    { t: "Ryby ♓", d: "19.02 – 20.03 — wyobraźnia i empatia." },
  ]);
  reference("r-jedzenie", "Wartości odżywcze", "🥗", "🍎", [
    { t: "Awokado", d: "Zdrowe tłuszcze, potas, błonnik. OK. 160 kcal/100 g." },
    { t: "Łosoś", d: "Omega-3, białko, witamina D. OK. 208 kcal/100 g." },
    { t: "Szpinak", d: "Żelazo, magnez, witaminy K i A. Tylko 23 kcal/100 g." },
    { t: "Jajka", d: "Pełny profil aminokwasów. OK. 78 kcal/szt." },
    { t: "Orzechy włoskie", d: "Omega-3 roślinne, magnez. OK. 654 kcal/100 g — garść!" },
    { t: "Twaróg", d: "Białko wolnotrawiące, wapń. OK. 98 kcal/100 g." },
  ]);

  /* TIMERY (4) */
  presetTimer("t-jajko-miekkie", "Jajka na miękko", "🥚", "🥚", 4, "jajka na miękko");
  presetTimer("t-jajko-twarde", "Jajka na twardo", "🍳", "🍳", 8, "jajka na twardo");
  presetTimer("t-herbata", "Parzenie herbaty", "🍵", "🍵", 3, "czarna herbata");
  presetTimer("t-makaron", "Makaron al dente", "🍝", "🍝", 8, "makaron");

  console.info("App Store: " + CATALOG.length + " aplikacji w katalogu");
})();
