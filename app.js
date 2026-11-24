(() => {
  'use strict';
  const C = window.CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- names ---------- */
  $$('.her').forEach(e => (e.textContent = C.herName));
  $$('.me').forEach(e => (e.textContent = C.yourName));
  $('#ecgName').textContent = C.herName;
  document.title = `For ${C.herName} 💖`;

  /* ---------- photos ---------- */
  const photoSrc = i => {
    const list = C.photos || [];
    return list.length ? list[(i - 1) % list.length] : '';
  };
  function fillPhoto(el) {
    const i = +el.dataset.photo;
    el.classList.add('ph');
    el.innerHTML = `<img alt=""><span>📸<br>Photo ${i}</span>`;
    const img = el.querySelector('img');
    const src = photoSrc(i);
    if (!src) return el.classList.add('missing');
    img.onload = () => el.classList.add('loaded');
    img.onerror = () => el.classList.add('missing');
    img.src = src;
  }
  $$('[data-photo]').forEach(fillPhoto);

  /* ---------- sound + vibration ---------- */
  let actx = null;
  function unlockAudio() {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
    } catch (e) { /* no audio, no problem */ }
  }
  function beep(freq = 880, dur = 0.09, vol = 0.12, type = 'sine') {
    if (!actx) return;
    const t = actx.currentTime;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.3, 0.1, 'triangle'), i * 130));
  const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

  /* ---------- reveal helper ---------- */
  async function reveal(els, gap = 420, start = 0) {
    await wait(start);
    for (const el of els) { el.classList.add('show'); await wait(gap); }
  }

  /* ---------- scene navigation ---------- */
  const scenes = $$('.scene');
  const backBtn = $('#backBtn');
  const fill = $('#progressFill');
  const entered = new Set();
  const trail = [];
  const enter = {};
  let cur = 0;

  function activate(i) {
    const s = scenes[i];
    s.classList.add('active');
    s.scrollTop = 0;
    fill.style.width = (i / (scenes.length - 1)) * 100 + '%';
    backBtn.classList.toggle('show', i > 0);
    const name = s.dataset.scene;
    if (!entered.has(name)) {
      entered.add(name);
      (enter[name] || defaultEnter)(s);
    }
  }
  const defaultEnter = s => reveal($$('.reveal', s), 380, 250);
  function go(i, push = true) {
    if (i < 0 || i >= scenes.length || i === cur) return;
    scenes[cur].classList.remove('active');
    if (push) trail.push(cur);
    cur = i;
    activate(i);
  }
  const goTo = name => go(scenes.findIndex(s => s.dataset.scene === name));

  document.addEventListener('click', e => {
    if (e.target.closest('[data-next]')) { unlockAudio(); go(cur + 1); }
  });
  backBtn.addEventListener('click', () => { if (trail.length) go(trail.pop(), false); });

  /* ---------- bottom sheet ---------- */
  const sheet = $('#sheet');
  const sBody = $('#sheetBody');
  const sClose = $('#sheetClose');
  let onSheetClose = null;
  function openSheet(html, closeText = 'Close', cb = null) {
    sBody.innerHTML = html;
    $$('[data-photo]', sBody).forEach(fillPhoto);
    sClose.textContent = closeText;
    onSheetClose = cb;
    sheet.querySelector('.sheet-panel').scrollTop = 0;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
  }
  function closeSheet() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    const cb = onSheetClose;
    onSheetClose = null;
    if (cb) cb();
  }
  sClose.addEventListener('click', closeSheet);
  $('.sheet-backdrop').addEventListener('click', closeSheet);
  sBody.addEventListener('click', e => {
    const a = e.target.closest('[data-action]');
    if (!a) return;
    closeSheet();
    if (a.dataset.action === 'yes') sayYes();
    if (a.dataset.action === 'credits') goTo('credits');
  });

  /* ---------- FX: holi colours + petals ---------- */
  const fx = $('#fx');
  const ctx = fx.getContext('2d');
  const COLORS = ['#ff4f8b', '#f5c451', '#3ddc84', '#3d8bff', '#a24dff', '#ff8a3d', '#ff9cbc'];
  let parts = [];
  let raf = null;
  function sizeFx() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = innerWidth * d;
    fx.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  sizeFx();
  addEventListener('resize', sizeFx);
  function burst(n = 120) {
    const cx = innerWidth / 2, cy = innerHeight * 0.42;
    for (let i = 0; i < n; i++) {
      const kind = Math.random();
      parts.push({
        x: cx + rand(-30, 30), y: cy + rand(-30, 30),
        vx: rand(-7, 7), vy: rand(-13, -3),
        r: rand(3, 7), c: pick(COLORS), life: 1,
        petal: kind < 0.22, cloud: kind > 0.9,
        rot: rand(0, 6), vr: rand(-0.2, 0.2)
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += p.petal ? 0.12 : 0.24;
      p.vx *= 0.985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      p.life -= p.cloud ? 0.012 : 0.007;
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.petal) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.font = '20px serif'; ctx.fillText('🌸', -10, 8); ctx.restore();
      } else if (p.cloud) {
        p.r += 1.6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, p.c + '88'); g.addColorStop(1, p.c + '00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 60);
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- 1 · ECG ---------- */
  enter.ecg = async s => {
    const path = $('#ecgPath'), name = $('#ecgName'), bpm = $('#bpm'), heart = $('.heart', s);
    const steps = $$('.step', s);
    const L = path.getTotalLength(), DUR = 4200;
    const spikes = [];
    let lastX = -100;
    for (let l = 0; l < L; l += 2) {
      const p = path.getPointAtLength(l);
      if (p.y < 30 && p.x - lastX > 30) { spikes.push((l / L) * DUR); lastX = p.x; }
    }
    const thump = () => {
      beep(880, 0.08, 0.12); buzz(25);
      heart.classList.remove('beat'); void heart.offsetWidth; heart.classList.add('beat');
    };
    path.style.strokeDasharray = L;
    path.style.strokeDashoffset = L;
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${DUR}ms linear, opacity 1s`;
    path.style.strokeDashoffset = 0;
    spikes.forEach(t => setTimeout(thump, t));
    setTimeout(() => steps[0].classList.add('show'), 700);
    await wait(DUR + 300);
    s.classList.add('ecg-done');
    name.classList.add('draw');
    let b = 72;
    const iv = setInterval(() => {
      b += 3;
      if (b >= 143) { b = 143; clearInterval(iv); }
      bpm.textContent = b;
      if (b % 9 === 0 || b === 143) thump();
    }, 70);
    await wait(2000);
    reveal(steps.slice(1), 800);
  };

  /* ---------- 2 · Diagnosis: all is well ---------- */
  $('#allIsWell').addEventListener('click', () => {
    unlockAudio(); beep(660, 0.2, 0.08, 'triangle');
    openSheet(`<div class="center-text"><div class="emoji">🤚</div><h3>All is well.</h3>
      <p>Rancho ne kaha tha, dil bada darpok hota hai, use bewakoof bana ke rakho.</p>
      <p>Tough shifts aate jaate rahenge, but you, Dr. ${C.herName}, are doing amazing. Sach mein. 💛</p></div>`, 'Thank you 🥹');
  });

  /* ---------- 4 · Multiverse ---------- */
  const UNIVERSES = [
    { n: 'Universe #616', t: 'You’re a doctor. I’m in love. ✔', p: 3 },
    { n: 'Universe #838', t: 'You’re a superhero. Still in love. ✔', p: 4 },
    { n: 'Universe #1995', t: 'You’re Simran, I’m Raj. Obviously in love. ✔', p: 5 },
    { n: 'Universe #14,000,605', t: 'This one. Our one. 💖', p: 6 }
  ];
  const portal = $('#portal');
  UNIVERSES.forEach(u => {
    const d = document.createElement('div');
    d.className = 'uni';
    d.dataset.photo = u.p;
    portal.appendChild(d);
    fillPhoto(d);
  });
  enter.multiverse = async s => {
    const el = $('#counter'), target = 14000605, D = 3600;
    const steps = $$('.step', s);
    const t0 = performance.now();
    let lastTick = 0;
    await new Promise(res => {
      const f = now => {
        const k = Math.min(1, (now - t0) / D);
        const e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.floor(target * e).toLocaleString('en-US');
        if (k < 1 && now - lastTick > 90) { beep(1400, 0.02, 0.025); lastTick = now; }
        if (k < 1) requestAnimationFrame(f);
        else { el.textContent = target.toLocaleString('en-US'); res(); }
      };
      requestAnimationFrame(f);
    });
    el.classList.add('done'); buzz(40); beep(523, 0.3, 0.1, 'triangle');
    reveal(steps, 1500, 500);
    const unis = $$('.uni', portal);
    for (let i = 0; i < UNIVERSES.length; i++) {
      unis.forEach((u, j) => u.classList.toggle('on', j === i));
      $('#uniName').textContent = UNIVERSES[i].n;
      $('#uniText').textContent = UNIVERSES[i].t;
      beep(300 + i * 120, 0.25, 0.05, 'triangle');
      await wait(1900);
    }
  };

  /* ---------- 5 · Infinity stones ---------- */
  const stonesEl = $('#stones');
  const got = new Set();
  const reasons = C.reasons || [];
  reasons.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'stone';
    b.style.setProperty('--c', r.color);
    b.innerHTML = `<span class="gem"></span><span class="sname">${r.stone.replace(' Stone', '')}</span>`;
    b.addEventListener('click', () => openStone(r, i, b));
    stonesEl.appendChild(b);
  });
  function openStone(r, i, b) {
    unlockAudio();
    [523, 659, 784].forEach((f, k) => setTimeout(() => beep(f, 0.18, 0.08), k * 90));
    buzz(30);
    openSheet(
      `<div class="sheet-stone" style="--c:${r.color}">
         <span class="gem big"></span>
         <p class="eyebrow">${r.stone}</p>
         <h3>${r.title}</h3>
         <div class="sheet-photo" data-photo="${r.photo}"></div>
         <p>${r.text}</p>
       </div>`,
      got.has(i) ? 'Close' : 'Collect stone ✨',
      () => {
        if (got.has(i)) return;
        got.add(i);
        b.classList.add('got');
        $('#stoneCount').textContent = got.size;
        if (got.size === reasons.length) snap();
      }
    );
  }
  async function snap() {
    await wait(450);
    const f = $('#flash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    beep(180, 0.5, 0.15, 'triangle'); buzz([60, 40, 120]);
    burst(80);
    await reveal([$('#snapLine'), $('#stonesNext')], 700, 300);
    $('#snapLine').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- 7 · Tap game ---------- */
  const tapBtn = $('#tapBtn'), meter = $('#meter'), mFill = $('#meterFill'), mPct = $('#meterPct'), gMsg = $('#gameMsg');
  const MSGS = {
    6: 'Thoda aur… thoda aur… 😤',
    18: 'Doctor sahiba, BP check karo, itna fast? 🩺',
    30: 'Utha le re baba! 😩',
    42: 'Ruko… ye bar thak gaya, main nahi 😏',
    55: 'Error 404: Limit not found 🤖'
  };
  let val = 0, taps = 0, started = 0, over = false, decayIv = null;
  const GAME_MS = 15000, GAME_TAPS = 70;
  const renderMeter = () => { mFill.style.width = val + '%'; mPct.textContent = Math.floor(val) + '%'; };
  function endGame() {
    if (over) return;
    over = true;
    clearInterval(decayIv);
    tapBtn.disabled = true;
    meter.classList.add('broken');
    mPct.textContent = '∞';
    gMsg.textContent = 'Bar hi toot gaya 💥';
    buzz([60, 40, 60, 40, 150]); fanfare();
    reveal([$('#gameEnd'), $('#gameNext')], 700, 500);
  }
  tapBtn.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (over) return;
    unlockAudio();
    if (!started) {
      started = Date.now();
      decayIv = setInterval(() => {
        if (over) return;
        val = Math.max(0, val - 0.7);
        renderMeter();
        if (Date.now() - started > GAME_MS) endGame();
      }, 100);
    }
    taps++;
    const gain = val < 60 ? 5 : val < 85 ? 2.4 : val < 95 ? 0.8 : 0.25;
    val = Math.min(99, val + gain);
    if (val >= 95 && Math.random() < 0.18) {
      val -= 14;
      gMsg.textContent = 'Arre! Mera pyaar aur badh gaya… bar peeche chala gaya 😂';
      meter.classList.remove('shake'); void meter.offsetWidth; meter.classList.add('shake');
    } else if (MSGS[taps]) {
      gMsg.textContent = MSGS[taps];
    }
    renderMeter();
    beep(300 + val * 6, 0.04, 0.05, 'square');
    buzz(8);
    tapBtn.classList.remove('pop'); void tapBtn.offsetWidth; tapBtn.classList.add('pop');
    if (taps >= GAME_TAPS || Date.now() - started > GAME_MS) endGame();
  });

  /* ---------- 8 · Palat + proposal ---------- */
  const flip = $('#flip');
  flip.addEventListener('click', () => {
    if (flip.classList.contains('flipped')) return;
    unlockAudio();
    flip.classList.add('flipped');
    beep(660, 0.15, 0.1); setTimeout(() => beep(990, 0.3, 0.1), 160);
    buzz(40);
  });
  function sayYes() { goTo('yes'); }
  $('#yesBtn').addEventListener('click', e => { e.stopPropagation(); sayYes(); });
  $('#thinkBtn').addEventListener('click', e => {
    e.stopPropagation();
    openSheet(`<div class="center-text"><div class="emoji">🙂</div><h3>Koi jaldi nahi.</h3>
      <p>Take all the time you need. No pressure at all. Ye website kahin nahi ja rahi, aur main bhi nahi.</p>
      <button class="btn primary" data-action="yes">Actually… haan 💖</button>
      <button class="btn ghost" data-action="credits">Roll the credits anyway 🎞️</button></div>`, 'Okay 🙂');
  });

  /* ---------- 9 · Yes ---------- */
  enter.yes = async s => {
    burst(200); buzz([80, 50, 80, 50, 200]); fanfare();
    reveal($$('.reveal', s), 420, 300);
    await wait(1300); burst(140);
    await wait(1500); burst(100);
  };

  /* ---------- 10 · Credits ---------- */
  enter.credits = async s => {
    $('#roll').classList.add('run');
    await wait(9000);
    $('#postBtn').classList.add('show');
  };

  /* ---------- 11 · Post-credits song ---------- */
  const song = $('#song'), playBtn = $('#playBtn'), vinyl = $('#vinyl'), note = $('#songNote'), aFill = $('#audioFill');
  const missingSong = () => { note.textContent = 'Song abhi recording studio mein hai 🎙️ (add audio/song.mp3)'; };
  playBtn.addEventListener('click', async () => {
    if (!song.getAttribute('src')) song.src = C.song;
    if (song.paused) {
      try { await song.play(); note.textContent = ''; } catch (err) { missingSong(); }
    } else song.pause();
  });
  song.addEventListener('play', () => { vinyl.classList.add('spin'); playBtn.textContent = '❚❚ Pause'; });
  song.addEventListener('pause', () => { vinyl.classList.remove('spin'); playBtn.textContent = '▶ Play my song'; });
  song.addEventListener('timeupdate', () => { if (song.duration) aFill.style.width = (song.currentTime / song.duration) * 100 + '%'; });
  song.addEventListener('ended', () => { burst(140); $('#finalLine').classList.add('glow'); buzz([60, 40, 60]); });
  song.addEventListener('error', missingSong);
  $('#replay').addEventListener('click', () => location.reload());

  /* ---------- start ---------- */
  activate(0);
})();
