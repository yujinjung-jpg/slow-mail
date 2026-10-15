(() => {
    const $id = id => document.getElementById(id);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const W = 460;
    const H = 300;
    const BY = 250;
    const Z = 1.75;
    const FLAV = {
      vanilla: { name: '바닐라', raw: '#f6e2a8', baked: '#e3a958' },
      choco: { name: '초코', raw: '#8a5a3b', baked: '#5a3520' },
      berry: { name: '딸기', raw: '#f7c3cc', baked: '#e59aa2' },
      matcha: { name: '말차', raw: '#cfe0a0', baked: '#9fbf6a' }
    };
    const CREAMS = ['#fffaf0', '#ffc4d6', '#7a4a2e', '#bfeedd', '#cfc6f2'];
    const PENS = ['#fffdf6', '#3b2416', '#ff7fa0', '#ffe066', '#8fe3bf', '#8cc8ff'];
    const LINERS = [
      { id: 'pink', a: '#f6a5bd', b: '#fff0f4' },
      { id: 'mint', a: '#8fd8bd', b: '#f0fff8' },
      { id: 'kraft', a: '#b07a40', b: '#e2bd8c' },
      { id: 'gold', a: '#d9b75a', b: '#fff4cf' }
    ];
    const CANDLES = ['#ff8fb1', '#8cc8ff', '#ffe28a', '#a8e6cf'];
    const SPR = ['#ff6b8a', '#ffd23f', '#5ec4ff', '#7ddc6f', '#b47cff', '#ffffff'];
    const EAT = ['냠! 🍰', '음~ 달콤해', '차랑 찰떡궁합 ☕', '한 입만 더…'];
    const ING = [
      { id: 'flour', color: '#fbf6ea', snd: 'puff' },
      { id: 'butter', color: '#ffe08a', snd: 'plop' },
      { id: 'egg', color: '#ffc94a', snd: 'crack' },
      { id: 'sugar', color: '#ffffff', snd: 'sprinkle' },
      { id: 'milk', color: '#f4f8ff', snd: 'plop' }
    ];
    const ING_HTML = {
      flour: '<div class="ingr ing-flour" data-id="flour"><div class="lbl">밀가루<small>FLOUR</small></div></div>',
      butter: '<div class="ingr ing-butter" data-id="butter"><div class="wrap">BUTTER</div></div>',
      egg: '<div class="ingr ing-egg" data-id="egg"></div>',
      sugar: '<div class="ingr ing-sugar" data-id="sugar"><div class="lid"></div><div class="lbl">설탕</div></div>',
      milk: '<div class="ingr ing-milk" data-id="milk"><div class="cap"></div><div class="lbl">우유</div></div>'
    };
    const RECIPES = [
      { id: 'cookie', name: '곰돌이 쿠키', icon: '🍪', level: 1, ings: ['밀가루', '버터', '달걀', '설탕'], steps: ['반죽', '밀기', '모양 찍기', '굽기', '꾸미기'] },
      { id: 'cupcake', name: '컵케이크', icon: '🧁', level: 2, ings: ['밀가루', '버터', '달걀', '설탕', '우유'], steps: ['반죽', '컵에 붓기', '굽기', '크림 짜기', '꾸미기'] },
      { id: 'cake', name: '케이크', icon: '🎂', level: 3, ings: ['밀가루', '버터', '달걀', '설탕', '우유'], steps: ['반죽', '틀에 붓기', '굽기', '크림 바르기', '꾸미기'] }
    ];
  
    const style = document.createElement('style');
    style.textContent = `
      .rb-overlay { position: fixed; inset: 0; z-index: 16; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(30,18,6,.6); }
      .rb-book { position: relative; display: flex; width: min(820px, 92vw); height: min(520px, 74vh); padding: 14px; border-radius: 12px; background: var(--grain), #b8503a; box-shadow: 0 20px 40px rgba(0,0,0,.5); }
      .rb-book.flip { animation: rbFlip .4s ease; }
      .rb-page { position: relative; flex: 1; display: flex; flex-direction: column; padding: 26px 30px; background: var(--grain), repeating-linear-gradient(transparent 0 31px, rgba(200,150,110,.25) 31px 32px), #fffaf0; }
      .rb-page.left { align-items: center; justify-content: center; border-radius: 6px 0 0 6px; box-shadow: inset -18px 0 24px -12px rgba(0,0,0,.2); }
      .rb-page.right { border-radius: 0 6px 6px 0; box-shadow: inset 18px 0 24px -12px rgba(0,0,0,.2); }
      .rb-spine { position: absolute; left: 50%; top: 14px; bottom: 14px; width: 2px; background: rgba(0,0,0,.15); }
      .rb-photo { position: relative; width: 200px; height: 220px; padding: 12px 12px 40px; display: grid; place-items: center; background: #fff; transform: rotate(-4deg); box-shadow: 0 6px 14px rgba(0,0,0,.25); }
      .rb-photo span { font-size: 116px; line-height: 1; }
      .rb-tape { position: absolute; top: -12px; left: 50%; width: 80px; height: 24px; margin-left: -40px; background: rgba(255,214,150,.75); transform: rotate(3deg); }
      .rb-page h2 { font-family: 'Gaegu'; font-size: 34px; margin: 22px 0 4px; color: #3b2a1c; }
      .rb-stars { color: #f2b134; font-size: 22px; letter-spacing: 3px; }
      .rb-page h3 { font-family: 'Gaegu'; font-size: 22px; margin: 0 0 8px; color: #b8503a; }
      .rb-ings { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
      .rb-ings span { font-family: 'Gaegu'; font-size: 18px; padding: 2px 10px; border-radius: 10px; background: #ffe9b0; }
      .rb-steps { flex: 1; margin: 0; padding-left: 26px; font-family: 'Gaegu'; font-size: 21px; line-height: 32px; color: #3b2a1c; }
      .rb-arrow { position: absolute; top: 50%; z-index: 3; width: 46px; height: 84px; margin-top: -42px; padding: 0; font-size: 30px; border-radius: 12px; }
      #rbPrev { left: -24px; }
      #rbNext { right: -24px; }
      .rb-pos { position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 3; font-family: 'Gaegu'; font-size: 16px; color: #a08a6c; }
      .ing-milk { --rot: rotate(5deg); right: 8px; top: 30px; width: 70px; height: 110px; border-radius: 3px; background: linear-gradient(90deg, #ffffff, #e9f0f7); }
      .ing-milk::before { content: ''; position: absolute; left: 0; right: 0; top: -24px; height: 26px; background: linear-gradient(#f4f8fc, #d6e2ee); clip-path: polygon(0 100%, 50% 0, 100% 100%); }
      .ing-milk .cap { position: absolute; left: 26px; top: -18px; width: 18px; height: 10px; border-radius: 3px; background: #4a7bd0; }
      .ing-milk .lbl { position: absolute; left: 0; right: 0; top: 34px; padding: 4px 0; background: #8cc8ff; color: #fff; text-align: center; font-family: 'Gaegu'; font-size: 18px; }
      .dz-counter .ing-egg { right: 96px; top: 34px; }
      .dz-wrap { width: min(760px, 100%); }
      .dz-wrap canvas { cursor: crosshair; touch-action: none; }
      .cookie-plate { transform: scale(1.3); transform-origin: 0 0; }
      .desk-cake { position: absolute; left: 66%; top: 6%; width: 260px; height: 260px; z-index: 3; cursor: grab; touch-action: none; user-select: none; }
      .desk-cake .stand { position: absolute; inset: -12px; border-radius: 50%; background: radial-gradient(circle, #fff 0 60%, #eef3f8 61% 66%, #fff 67% 70%, #dfe7ef 100%); box-shadow: 0 12px 18px rgba(0,0,0,.35); }
      .desk-cake canvas, .desk-cake .flames { position: absolute; inset: 0; width: 100%; height: 100%; }
      .desk-cake .flames { pointer-events: none; }
      .desk-cake .flame { position: absolute; width: 9px; height: 15px; margin: -15px 0 0 -4.5px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: radial-gradient(ellipse at 50% 80%, #fff 0 20%, #ffd56a 45%, #ff8a2a 75%, transparent 80%); box-shadow: 0 0 10px 4px rgba(255,180,80,.45); transform-origin: 50% 90%; animation: flicker .14s infinite alternate; }
      .desk-cake.dragging { cursor: grabbing; }
      .desk-cake.chomp canvas { animation: chomp .3s; }
      @keyframes chomp { 50% { transform: scale(.97) rotate(-2deg); } }
      @keyframes rbFlip { 40% { transform: scaleX(.96); opacity: .7; } }
    `;
    document.head.append(style);
  
    let ac = null;
    let nbuf = null;
    function actx() {
      if (!ac) {
        ac = new AudioContext();
        nbuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        const d = nbuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    }
    function tn(f, t, dur, o) {
      if (SFX.muted) return;
      const c = actx();
      const s = c.currentTime + t;
      const os = c.createOscillator();
      const g = c.createGain();
      os.type = o.type || 'sine';
      os.frequency.setValueAtTime(f, s);
      if (o.to) os.frequency.exponentialRampToValueAtTime(o.to, s + dur);
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(o.v, s + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
      os.connect(g);
      g.connect(c.destination);
      os.start(s);
      os.stop(s + dur + 0.05);
    }
    function nz(t, dur, o) {
      if (SFX.muted) return;
      const c = actx();
      const s = c.currentTime + t;
      const src = c.createBufferSource();
      src.buffer = nbuf;
      const f = c.createBiquadFilter();
      f.type = o.type;
      f.Q.value = o.q || 1;
      f.frequency.setValueAtTime(o.f, s);
      if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, s + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(o.v, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
      src.connect(f);
      f.connect(g);
      g.connect(c.destination);
      src.start(s, Math.random() * 0.5);
      src.stop(s + dur + 0.05);
    }
    const AU = {
      spread() { nz(0, 0.09, { type: 'lowpass', f: 650, q: 2, v: 0.14 }); tn(230, 0, 0.09, { to: 380, v: 0.05 }); },
      pipe() { nz(0, 0.14, { type: 'bandpass', f: 450, to: 900, q: 1.5, v: 0.12 }); tn(170, 0, 0.14, { to: 260, v: 0.05, type: 'triangle' }); },
      pen() { tn(rnd(650, 800), 0, 0.05, { to: 950, v: 0.025 }); nz(0, 0.04, { type: 'bandpass', f: 1800, q: 3, v: 0.03 }); },
      pearl() { tn(rnd(1600, 2100), 0, 0.12, { v: 0.08, type: 'triangle' }); tn(3200, 0, 0.05, { v: 0.02 }); },
      plop() { tn(320, 0, 0.14, { to: 140, v: 0.15 }); }
    };
  
    function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    function mixC(a, b, t) { const A = hexRgb(a); const B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
    const shade = (h, amt) => mixC(h, amt < 0 ? '#000000' : '#ffffff', Math.abs(amt));
    const D = {};
    function batterCol(d) {
      const f = FLAV[D.flavor];
      if (d <= 1) return mixC(f.raw, f.baked, Math.max(0, d));
      return mixC(f.baked, '#3b2414', Math.min(0.6, (d - 1) * 1.8));
    }
    let lastSnd = 0;
    const snd = (ms, fn) => { const n = performance.now(); if (n - lastSnd > ms) { lastSnd = n; fn(); } };
    const bump = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
    const CX = i => 230 + (i - (D.count - 1) / 2) * 66;
  
    const frostCv = document.createElement('canvas');
    frostCv.width = W * 2;
    frostCv.height = H * 2;
    const fctx = frostCv.getContext('2d');
    fctx.setTransform(2, 0, 0, 2, 0, 0);
    const cakeDeco = document.createElement('canvas');
    cakeDeco.width = W * 2;
    cakeDeco.height = H * 2;
    cakeDeco.getContext('2d').setTransform(2, 0, 0, 2, 0, 0);
    function makeDeco() {
      const c = document.createElement('canvas');
      c.width = 360;
      c.height = 480;
      c.getContext('2d').setTransform(3, 0, 0, 3, 180, 450);
      return c;
    }
    const cupDecos = [makeDeco(), makeDeco(), makeDeco(), makeDeco(), makeDeco(), makeDeco()];
    function wipe(c) {
      const x = c.getContext('2d');
      x.save();
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.clearRect(0, 0, c.width, c.height);
      x.restore();
    }
    const SAMPLES = [];
    for (let x = 120; x <= 340; x += 12) for (let y = 40; y <= 260; y += 12) if (Math.hypot(x - 230, y - 150) < 112) SAMPLES.push([x, y]);
    const cakeClip = new Path2D();
    cakeClip.arc(230, 150, 128, 0, Math.PI * 2);
  
    function setCount(n) {
      D.count = n;
      D.fills = Array(n).fill(0);
      D.frosted = Array(n).fill(null);
      D.packed = Array(n).fill(false);
      D.sel = 0;
      cupDecos.forEach(wipe);
    }
    function reset(kind) {
      Object.assign(D, {
        kind: kind, step: 1, added: [], blobs: [], flavor: 'vanilla', mix: 0, liner: 'pink',
        done: 0, baking: false, baked: false, cream: CREAMS[0], cream2: CREAMS[1], frostDone: false, borderN: 0,
        tool: 'pen', pen: PENS[0], size: 1.8, hist: [], plaques: [], candles: [], packTo: 'bag', sent: false
      });
      setCount(kind === 'cake' ? 1 : 6);
      fctx.clearRect(0, 0, W, H);
      wipe(cakeDeco);
    }
  
    function cloth(ctx) {
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff8ef';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(214,69,69,.12)';
      for (let x = 0; x < W; x += 40) ctx.fillRect(x, 0, 20, H);
      for (let y = 0; y < H; y += 40) ctx.fillRect(0, y, W, 20);
    }
    function tray(ctx) {
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.fillStyle = '#3e4046';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.06)';
      for (let x = 14; x < W; x += 22) for (let y = 14; y < H; y += 22) ctx.fillRect(x, y, 2, 2);
    }
  
    const cupRise = i => Math.min(1, D.done) * Math.min(1.2, D.fills[i] / 0.7);
    const TIERS = [[34, 13, 0], [27, 12, -12], [19, 10, -22], [10, 8, -30]];
    function drawCup(ctx, cx, by, o) {
      const L = LINERS.find(l => l.id === D.liner) || LINERS[0];
      const tw = 30;
      const bw = 23;
      const top = by - 50;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.15)';
      ctx.beginPath();
      ctx.ellipse(cx, by + 3, bw + 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shade(L.b, -0.12);
      ctx.beginPath();
      ctx.ellipse(cx, top, tw, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      if (o.fill > 0 && !o.rise) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, top, tw - 1, 6.5, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = batterCol(0);
        ctx.beginPath();
        ctx.ellipse(cx, top + 2 + (1 - Math.min(1, o.fill)) * 12, tw - 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      let crown = top;
      if (o.rise) {
        const dh = 7 + 22 * o.rise;
        crown = top - dh;
        ctx.fillStyle = batterCol(o.done);
        ctx.beginPath();
        ctx.ellipse(cx, top, tw + 3, dh, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        ctx.beginPath();
        ctx.ellipse(cx - 9, top - dh * 0.6, 9, dh * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(cx - tw, top);
      ctx.ellipse(cx, top, tw, 7, 0, Math.PI, 0, true);
      ctx.lineTo(cx + bw, by);
      ctx.lineTo(cx - bw, by);
      ctx.closePath();
      ctx.fillStyle = L.b;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = L.a;
      ctx.lineWidth = 3.2;
      for (let k = -4; k <= 4; k++) {
        ctx.beginPath();
        ctx.moveTo(cx + k * tw / 4.5, top);
        ctx.lineTo(cx + k * bw / 4.5, by);
        ctx.stroke();
      }
      const g = ctx.createLinearGradient(cx - tw, 0, cx + tw, 0);
      g.addColorStop(0, 'rgba(0,0,0,.16)');
      g.addColorStop(0.4, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,.18)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - tw, top - 8, tw * 2, 60);
      ctx.restore();
      if (o.cream) {
        const base = crown + 10;
        const n = Math.ceil(TIERS.length * (o.frostP === undefined ? 1 : o.frostP));
        for (let t = 0; t < n; t++) {
          const [w, hh, dy] = TIERS[t];
          ctx.fillStyle = o.cream;
          ctx.beginPath();
          ctx.ellipse(cx, base + dy, w, hh, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = shade(o.cream, -0.14);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(cx, base + dy + 1, w - 2, hh - 3, 0, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.35)';
          ctx.beginPath();
          ctx.ellipse(cx - w * 0.4, base + dy - hh * 0.35, w * 0.25, hh * 0.22, -0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        if (n === 4) {
          ctx.fillStyle = o.cream;
          ctx.beginPath();
          ctx.moveTo(cx - 5, base - 34);
          ctx.quadraticCurveTo(cx, base - 48, cx + 5, base - 34);
          ctx.fill();
        }
      }
      if (o.deco) ctx.drawImage(o.deco, cx - 60, by - 150, 120, 160);
      ctx.restore();
    }
    const cupOpts = (i, fp) => ({ fill: D.fills[i], rise: cupRise(i), done: D.done, cream: D.frosted[i], frostP: fp, deco: cupDecos[i] });
    function cupClip(i) {
      const dh = 7 + 22 * cupRise(i);
      const crown = -50 - dh;
      const p = new Path2D();
      if (D.frosted[i]) {
        const base = crown + 10;
        TIERS.forEach(([w, hh, dy]) => { const q = new Path2D(); q.ellipse(0, base + dy, w + 1, hh + 1, 0, 0, Math.PI * 2); p.addPath(q); });
        const t = new Path2D();
        t.moveTo(-6, base - 33);
        t.quadraticCurveTo(0, base - 50, 6, base - 33);
        t.closePath();
        p.addPath(t);
      } else {
        const q = new Path2D();
        q.ellipse(0, -50, 34, dh + 1, 0, Math.PI, 0);
        q.closePath();
        p.addPath(q);
      }
      return p;
    }
  
    function drawPan(ctx, level, done) {
      const cx = 230;
      const rimY = 120;
      const rx = 150;
      const ry = 42;
      const depth = 90;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.15)';
      ctx.beginPath();
      ctx.ellipse(cx + 4, rimY + depth + 8, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9aa3ad';
      ctx.beginPath();
      ctx.ellipse(cx, rimY, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      if (level > 0) {
        const sy = rimY + depth - level * depth;
        ctx.fillStyle = batterCol(done);
        if (sy < rimY) {
          ctx.fillRect(cx - rx + 3, sy, rx * 2 - 6, rimY - sy);
        } else {
          ctx.beginPath();
          ctx.ellipse(cx, rimY, rx - 1, ry - 1, 0, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.beginPath();
        ctx.ellipse(cx, sy, rx - 3, ry - 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.16)';
        ctx.beginPath();
        ctx.ellipse(cx - 50, sy - 10, 50, 10, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(cx - rx, rimY);
      ctx.ellipse(cx, rimY, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(cx + rx, rimY + depth);
      ctx.ellipse(cx, rimY + depth, rx, ry, 0, 0, Math.PI, false);
      ctx.closePath();
      const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
      g.addColorStop(0, '#8a939c');
      g.addColorStop(0.35, '#dfe5ea');
      g.addColorStop(1, '#7d868f');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, rimY, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
    }
    function gauge(ctx, x, y, v, w) {
      const ww = w || 46;
      ctx.fillStyle = 'rgba(0,0,0,.12)';
      ctx.fillRect(x - ww / 2, y, ww, 6);
      ctx.fillStyle = 'rgba(124,191,107,.55)';
      ctx.fillRect(x - ww / 2 + ww * 0.55, y - 2, ww * 0.25, 10);
      ctx.fillStyle = v > 0.85 ? '#e05a5a' : '#ff9f7a';
      ctx.fillRect(x - ww / 2, y, ww * Math.min(1, v), 6);
    }
    function ladle(ctx, x, col) {
      ctx.fillStyle = col;
      ctx.fillRect(x - 3, 120, 6, BY - 170);
      ctx.fillStyle = '#b9c2ca';
      ctx.beginPath();
      ctx.ellipse(x + 8, 114, 20, 12, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8a939c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 24, 106);
      ctx.lineTo(x + 70, 60);
      ctx.stroke();
    }
    function drawCandle(ctx, x, y, c, flame) {
      ctx.fillStyle = c;
      ctx.fillRect(x - 3, y - 24, 6, 24);
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 18 + k * 8);
        ctx.lineTo(x + 3, y - 22 + k * 8);
        ctx.stroke();
      }
      ctx.fillStyle = '#3b2a1c';
      ctx.fillRect(x - 0.6, y - 28, 1.2, 4);
      if (flame) {
        const g = ctx.createRadialGradient(x, y - 31, 0, x, y - 33, 7);
        g.addColorStop(0, '#fff');
        g.addColorStop(0.4, '#ffd56a');
        g.addColorStop(1, 'rgba(255,138,42,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(x, y - 33, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function drawCakeTop(ctx, flames) {
      const cx = 230;
      const cy = 150;
      ctx.fillStyle = 'rgba(0,0,0,.15)';
      ctx.beginPath();
      ctx.arc(cx + 4, cy + 8, 136, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 136, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#dfe7ef';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 128, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = batterCol(D.done);
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,45,15,.35)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 118, 0, Math.PI * 2);
      ctx.stroke();
      ctx.drawImage(frostCv, 0, 0, W, H);
      for (let k = 0; k < D.borderN; k++) {
        const a = k / 28 * Math.PI * 2;
        const x = cx + Math.cos(a) * 111;
        const y = cy + Math.sin(a) * 111;
        ctx.fillStyle = D.cream2;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.45)';
        ctx.beginPath();
        ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      D.plaques.forEach(p => {
        ctx.fillStyle = '#5a3520';
        ctx.beginPath();
        ctx.roundRect(p.x - 52, p.y - 20, 104, 40, 9);
        ctx.fill();
        ctx.strokeStyle = '#8a5a3b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(p.x - 48, p.y - 16, 96, 32, 7);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.12)';
        ctx.fillRect(p.x - 44, p.y - 14, 88, 5);
      });
      ctx.drawImage(cakeDeco, 0, 0, W, H);
      D.candles.forEach(c => drawCandle(ctx, c.x, c.y, c.c, flames));
    }
  
    function withClip(x, clip, fn) { x.save(); x.clip(clip); fn(); x.restore(); }
    function line(x, a, b) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    function icing(x, clip, a, b, U) {
      withClip(x, clip, () => {
        x.lineCap = 'round';
        x.lineJoin = 'round';
        if (D.tool === 'erase') {
          x.globalCompositeOperation = 'destination-out';
          x.lineWidth = 4 * D.size * U;
          line(x, a, b);
          return;
        }
        const w = 1.4 * D.size * U;
        const o = w * 0.25;
        x.strokeStyle = 'rgba(0,0,0,.18)';
        x.lineWidth = w;
        line(x, { x: a.x + o, y: a.y + o }, { x: b.x + o, y: b.y + o });
        x.strokeStyle = D.pen;
        line(x, a, b);
        x.strokeStyle = 'rgba(255,255,255,.55)';
        x.lineWidth = w * 0.3;
        line(x, { x: a.x - o, y: a.y - o }, { x: b.x - o, y: b.y - o });
      });
    }
    function spray(x, clip, p, U) {
      withClip(x, clip, () => {
        for (let k = 0; k < 8; k++) {
          x.save();
          x.translate(p.x + rnd(-5, 5) * U, p.y + rnd(-5, 5) * U);
          x.rotate(rnd(0, Math.PI));
          x.fillStyle = SPR[k % SPR.length];
          x.fillRect(-1.3 * U, -0.5 * U, 2.6 * U, 1 * U);
          x.restore();
        }
      });
    }
    function pearl(x, clip, p, U) {
      const r = 1.6 * U * Math.sqrt(D.size);
      withClip(x, clip, () => {
        const g = x.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, 0, p.x, p.y, r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.35, D.pen);
        g.addColorStop(1, shade(D.pen, -0.3));
        x.fillStyle = g;
        x.beginPath();
        x.arc(p.x, p.y, r, 0, Math.PI * 2);
        x.fill();
      });
    }
    function berry(x, p, U) {
      const s = 6 * U;
      x.save();
      x.translate(p.x, p.y);
      x.rotate(rnd(-0.4, 0.4));
      const g = x.createLinearGradient(0, -s, 0, s * 1.2);
      g.addColorStop(0, '#ff5a6e');
      g.addColorStop(1, '#c81e3a');
      x.fillStyle = g;
      x.beginPath();
      x.moveTo(0, s * 1.3);
      x.bezierCurveTo(-s * 1.3, s * 0.2, -s * 1.1, -s, 0, -s * 0.9);
      x.bezierCurveTo(s * 1.1, -s, s * 1.3, s * 0.2, 0, s * 1.3);
      x.fill();
      x.fillStyle = '#ffe28a';
      for (let k = 0; k < 8; k++) {
        x.beginPath();
        x.ellipse(rnd(-0.6, 0.6) * s, rnd(-0.4, 0.9) * s, 0.1 * s, 0.17 * s, 0, 0, Math.PI * 2);
        x.fill();
      }
      x.fillStyle = 'rgba(255,255,255,.35)';
      x.beginPath();
      x.ellipse(-0.45 * s, -0.2 * s, 0.18 * s, 0.35 * s, 0.4, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#4caf50';
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k - 2) * 0.62;
        x.beginPath();
        x.ellipse(Math.cos(a) * 0.38 * s, -0.95 * s + Math.sin(a) * 0.3 * s, 0.38 * s, 0.14 * s, a, 0, Math.PI * 2);
        x.fill();
      }
      x.restore();
    }
  
    const loadPlate = () => { try { return JSON.parse(localStorage.getItem('plate') || '[]'); } catch (e) { return []; } };
    function drawPlate() {
      if (window.renderPlate) return window.renderPlate();
      const plate = document.querySelector('.cookie-plate');
      if (!plate) return;
      const items = loadPlate();
      plate.classList.toggle('hidden', !items.length);
      const box = plate.querySelector('.plate-cookies');
      box.innerHTML = '';
      items.forEach((it, i) => {
        const back = i >= 4;
        const rowN = back ? items.length - 4 : Math.min(4, items.length);
        const j = back ? i - 4 : i;
        const im = document.createElement('img');
        im.src = it.src;
        im.className = 'plate-cookie' + (it.bites ? ' bite' + it.bites : '');
        im.dataset.i = i;
        im.style.left = ((220 - ((rowN - 1) * 48 + 74)) / 2 + j * 48) + 'px';
        im.style.bottom = (back ? 44 : 20) + 'px';
        im.style.zIndex = back ? 1 : 2;
        im.style.setProperty('--r', it.r + 'deg');
        im.style.transform = `rotate(${it.r}deg)`;
        box.append(im);
      });
    }
    function toPlate(src) {
      const items = loadPlate();
      if (items.length >= 8) { toast('접시가 꽉 찼어요!'); return false; }
      items.push({ src: src, bites: 0, r: Math.round(rnd(-15, 15)) });
      try { localStorage.setItem('plate', JSON.stringify(items)); } catch (e) { toast('접시에 더 못 담아요'); return false; }
      drawPlate();
      return true;
    }
    function cupImage(i) {
      const c = document.createElement('canvas');
      c.width = 200;
      c.height = 200;
      const x = c.getContext('2d');
      const s = 1.25;
      x.setTransform(s, 0, 0, s, 100 - CX(i) * s, 192 - BY * s);
      drawCup(x, CX(i), BY, cupOpts(i, 1));
      return c.toDataURL('image/png');
    }
  
    const deskCake = document.createElement('div');
    deskCake.className = 'desk-cake hidden';
    deskCake.title = '누르면 냠, 끌면 옮기기';
    deskCake.innerHTML = '<div class="stand"></div><canvas width="420" height="420"></canvas><div class="flames"></div>';
    $('#scene').append(deskCake);
    try {
      const cp = JSON.parse(localStorage.getItem('cakePos') || 'null');
      if (cp) { deskCake.style.left = cp.x + '%'; deskCake.style.top = cp.y + '%'; }
    } catch (e) {}
    const loadCake = () => { try { return JSON.parse(localStorage.getItem('cake') || 'null'); } catch (e) { return null; } };
    function renderDeskCake() {
      const data = loadCake();
      deskCake.classList.toggle('hidden', !data);
      if (!data) return;
      const x = deskCake.querySelector('canvas').getContext('2d');
      const img = new Image();
      img.onload = () => {
        x.clearRect(0, 0, 420, 420);
        x.drawImage(img, 0, 0);
        x.save();
        x.globalCompositeOperation = 'destination-out';
        for (let k = 0; k < data.cut; k++) {
          const a0 = -Math.PI / 2 + k * Math.PI / 4;
          x.beginPath();
          x.moveTo(210, 210);
          x.arc(210, 210, 183, a0, a0 + Math.PI / 4);
          x.closePath();
          x.fill();
        }
        x.restore();
      };
      img.src = data.src;
      const fl = deskCake.querySelector('.flames');
      fl.innerHTML = '';
      if (data.lit) data.flames.forEach(f => {
        const s = document.createElement('i');
        s.className = 'flame';
        s.style.left = (f.x * 100) + '%';
        s.style.top = (f.y * 100) + '%';
        fl.append(s);
      });
    }
    function cakeClick() {
      const data = loadCake();
      if (!data) return;
      if (data.lit) {
        data.lit = false;
        SFX.blow();
        toast('🎉 후~ 소원 빌었어요?');
      } else {
        data.cut++;
        KSFX.cut();
        setTimeout(() => SFX.paper(), 80);
        bump(deskCake, 'chomp');
        toast(data.cut >= 8 ? '케이크 다 먹었다! 🎂' : EAT[Math.floor(Math.random() * EAT.length)]);
      }
      if (data.cut >= 8) localStorage.removeItem('cake');
      else localStorage.setItem('cake', JSON.stringify(data));
      renderDeskCake();
    }
    let cs = null;
    deskCake.addEventListener('pointerdown', e => {
      deskCake.setPointerCapture(e.pointerId);
      cs = { x: e.clientX, y: e.clientY, l: deskCake.offsetLeft, t: deskCake.offsetTop, moved: false };
    });
    deskCake.addEventListener('pointermove', e => {
      if (!cs) return;
      const dx = e.clientX - cs.x;
      const dy = e.clientY - cs.y;
      if (!cs.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      cs.moved = true;
      deskCake.classList.add('dragging');
      const sc = $('#scene');
      deskCake.style.left = (Math.max(0, Math.min(sc.clientWidth - deskCake.offsetWidth, cs.l + dx)) / sc.clientWidth * 100) + '%';
      deskCake.style.top = (Math.max(0, Math.min(sc.clientHeight - deskCake.offsetHeight, cs.t + dy)) / sc.clientHeight * 100) + '%';
    });
    deskCake.addEventListener('pointerup', () => {
      if (!cs) return;
      deskCake.classList.remove('dragging');
      if (cs.moved) {
        localStorage.setItem('cakePos', JSON.stringify({ x: parseFloat(deskCake.style.left), y: parseFloat(deskCake.style.top) }));
        KSFX.clink();
      } else {
        cakeClick();
      }
      cs = null;
    });
    deskCake.addEventListener('pointercancel', () => { cs = null; deskCake.classList.remove('dragging'); });
    function placeCake() {
      const c = document.createElement('canvas');
      c.width = 420;
      c.height = 420;
      const x = c.getContext('2d');
      x.setTransform(1.5, 0, 0, 1.5, -135, -15);
      drawCakeTop(x, false);
      const flames = D.candles.map(t => ({ x: (t.x - 90) / 280, y: (t.y - 10 - 31) / 280 }));
      const data = { src: c.toDataURL('image/png'), cut: 0, flames: flames, lit: flames.length > 0 };
      try { localStorage.setItem('cake', JSON.stringify(data)); } catch (e) { toast('케이크를 못 올렸어요'); return; }
      D.sent = true;
      renderDeskCake();
      SFX.jingle();
      toast('🎂 책상에 올려뒀어요');
    }
  
    const rb = document.createElement('div');
    rb.className = 'rb-overlay hidden';
    rb.innerHTML = `<button class="close" id="rbClose">✕</button>
      <div class="rb-book" id="rbBook">
        <div class="rb-page left"><div class="rb-photo"><i class="rb-tape"></i><span id="rbIcon"></span></div><h2 id="rbName"></h2><div class="rb-stars" id="rbStars"></div></div>
        <div class="rb-page right"><h3>재료</h3><div class="rb-ings" id="rbIngs"></div><h3>순서</h3><ol class="rb-steps" id="rbSteps"></ol><button class="btn primary big" id="rbGo">이거 만들래요!</button></div>
        <div class="rb-spine"></div>
        <button class="btn rb-arrow" id="rbPrev">‹</button><button class="btn rb-arrow" id="rbNext">›</button><span class="rb-pos" id="rbPos"></span>
      </div>`;
    document.body.append(rb);
    let rIdx = 0;
    function paintRecipe() {
      const r = RECIPES[rIdx];
      $id('rbIcon').textContent = r.icon;
      $id('rbName').textContent = r.name;
      $id('rbStars').textContent = '★'.repeat(r.level) + '☆'.repeat(3 - r.level);
      $id('rbIngs').innerHTML = r.ings.map(x => `<span>${x}</span>`).join('');
      $id('rbSteps').innerHTML = r.steps.map(s => `<li>${s}</li>`).join('');
      $id('rbPos').textContent = `${rIdx + 1} / ${RECIPES.length}`;
    }
    const flipTo = d => { rIdx = (rIdx + d + RECIPES.length) % RECIPES.length; bump($id('rbBook'), 'flip'); SFX.paper(); setTimeout(paintRecipe, 150); };
    $id('rbPrev').addEventListener('click', () => flipTo(-1));
    $id('rbNext').addEventListener('click', () => flipTo(1));
    const closeRb = () => { rb.classList.add('hidden'); SFX.click(); };
    $id('rbClose').addEventListener('click', closeRb);
    document.addEventListener('keydown', e => {
      if (rb.classList.contains('hidden')) return;
      if (e.key === 'ArrowLeft') flipTo(-1);
      if (e.key === 'ArrowRight') flipTo(1);
      if (e.key === 'Escape') closeRb();
    });
  
    const bakeBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('쿠키 직접 굽기'));
    let pass = false;
    if (bakeBtn) {
      bakeBtn.innerHTML = '📖 베이킹 레시피북<span hidden>쿠키 직접 굽기</span>';
      bakeBtn.addEventListener('click', e => {
        if (pass) return;
        e.stopImmediatePropagation();
        paintRecipe();
        rb.classList.remove('hidden');
        SFX.paper();
      }, true);
    }
  
    const root = document.createElement('div');
    root.className = 'studio hidden';
    root.innerHTML = `<button class="close" id="dzClose">✕</button>
      <div class="studio-stage" id="dzStage"></div>
      <aside class="panel studio-panel"><div class="k-steps" id="dzSteps"></div><h2 id="dzTitle"></h2><div id="dzControls"></div></aside>`;
    document.body.append(root);
    const stage = $id('dzStage');
    const controls = $id('dzControls');
    const NEXT = '<button class="btn primary big" id="dzNext">다음 →</button>';
    let bakeTimer = null;
    let hum = null;
  
    $id('rbGo').addEventListener('click', () => {
      const r = RECIPES[rIdx];
      rb.classList.add('hidden');
      SFX.jingle();
      if (r.id === 'cookie') { pass = true; bakeBtn.click(); pass = false; return; }
      reset(r.id);
      root.classList.remove('hidden');
      render();
    });
  
    function defs() {
      const cup = D.kind === 'cupcake';
      return [
        { t: '🥣 반죽', fn: stepMix, ok: () => D.mix >= 100, no: '끝까지 섞어주세요 🥄' },
        { t: cup ? '🧁 붓기' : '🎂 붓기', fn: stepPour, ok: () => D.fills.every(f => f >= 0.4), no: '조금 더 부어주세요' },
        { t: '🔥 굽기', fn: stepBake, ok: () => D.baked, no: '먼저 구워주세요' },
        { t: '🍦 크림', fn: stepCream, ok: () => (cup ? D.frosted.some(Boolean) : D.frostDone), no: '크림을 발라주세요' },
        { t: '🎨 꾸미기', fn: stepDeco, ok: () => true, no: '' },
        { t: cup ? '🎁 담기' : '✨ 완성', fn: stepFinish, ok: () => true, no: '' }
      ];
    }
    function render() {
      const list = defs();
      $id('dzSteps').innerHTML = list.map((d, i) => `<span class="${i + 1 === D.step ? 'on' : (i + 1 < D.step ? 'done' : '')}">${d.t.split(' ')[1]}</span>`).join('');
      const d = list[D.step - 1];
      $id('dzTitle').textContent = d.t;
      d.fn();
      const nb = $id('dzNext');
      if (nb) nb.addEventListener('click', () => {
        if (!d.ok()) return toast(d.no);
        D.step++;
        SFX.click();
        render();
      });
    }
    function canvasStage() {
      stage.innerHTML = `<div class="deco-wrap dz-wrap"><canvas id="dzCv" class="k-layer" width="${W * 2}" height="${H * 2}"></canvas></div>`;
      const cv = $id('dzCv');
      return { cv: cv, ctx: cv.getContext('2d') };
    }
    function pt(e, cv) {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
    }
    const cupAt = p => D.fills.findIndex((_, k) => Math.abs(p.x - CX(k)) < 33 && p.y > BY - 140 && p.y < BY + 8);
    function chipRow(el, items, get, set) {
      items.forEach(([v, label], i) => {
        const b = document.createElement('button');
        b.className = 'chip' + (get() === v ? ' on' : '');
        b.textContent = label;
        b.addEventListener('click', () => {
          set(v);
          SFX.plink(i);
          el.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
        });
        el.append(b);
      });
    }
    function swatches(el, list, get, set) {
      list.forEach((c, i) => {
        const b = document.createElement('button');
        b.className = 'swatch' + (get() === c ? ' on' : '');
        b.style.background = c;
        b.addEventListener('click', () => {
          set(c);
          SFX.plink(i);
          el.querySelectorAll('.swatch').forEach(x => x.classList.toggle('on', x === b));
        });
        el.append(b);
      });
    }
  
    function stepMix() {
      stage.innerHTML = `<div class="counter dz-counter" id="dzCounter">${ING.map(i => ING_HTML[i.id]).join('')}
        <div class="bowl-wrap" id="dzBowl"><div class="bowl-back"></div><div class="dough-mix" id="dzMix"><div class="swirl" id="dzSwirl"></div></div><div class="bowl-front"></div><div class="spoon rest" id="dzSpoon"></div></div></div>`;
      controls.innerHTML = '<div class="row" id="dzFlavor"></div><span class="bar"><i id="dzBar"></i></span>' + NEXT;
      const counter = $id('dzCounter');
      const bowl = $id('dzBowl');
      const drawBlobs = () => {
        $id('dzSwirl').innerHTML = D.blobs.map(b => `<i class="blob" style="left:${b.x}%;top:${b.y}%;width:${b.s}px;height:${b.s * 0.7}px;background:${b.c}"></i>`).join('');
      };
      const paint = () => {
        const m = $id('dzMix');
        m.style.setProperty('--dough', FLAV[D.flavor].raw);
        m.classList.toggle('filled', D.added.length > 0);
        $id('dzSwirl').style.opacity = String(1 - D.mix / 100);
        $id('dzSwirl').style.transform = `rotate(${D.mix * 7}deg)`;
        $id('dzBar').style.width = D.mix + '%';
        $id('dzBar').style.background = FLAV[D.flavor].baked;
      };
      const addBlobs = (c, n) => { for (let k = 0; k < n; k++) D.blobs.push({ c: c, x: rnd(30, 70), y: rnd(32, 68), s: rnd(20, 38) }); drawBlobs(); };
      stage.querySelectorAll('.ingr').forEach(el => {
        if (D.added.includes(el.dataset.id)) el.classList.add('used');
        el.addEventListener('click', () => {
          const ing = ING.find(x => x.id === el.dataset.id);
          if (D.added.includes(ing.id)) return;
          D.added.push(ing.id);
          const clone = el.cloneNode(true);
          clone.style.setProperty('--tx', (counter.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)) + 'px');
          clone.style.setProperty('--ty', (160 - (el.offsetTop + el.offsetHeight / 2)) + 'px');
          clone.classList.add('into');
          counter.append(clone);
          setTimeout(() => clone.remove(), 650);
          el.classList.add('used');
          setTimeout(() => {
            KSFX[ing.snd]();
            addBlobs(ing.color, 3);
            if (ing.id === 'flour') {
              const cl = document.createElement('div');
              cl.className = 'cloud';
              bowl.append(cl);
              setTimeout(() => cl.remove(), 1100);
            }
            paint();
          }, 450);
        });
      });
      Object.keys(FLAV).forEach((k, i) => {
        const b = document.createElement('button');
        b.className = 'chip' + (D.flavor === k ? ' on' : '');
        b.innerHTML = `<i class="dot" style="background:${FLAV[k].raw}"></i>${FLAV[k].name}`;
        b.addEventListener('click', () => {
          if (D.mix > 0) return;
          D.flavor = k;
          SFX.plink(i);
          $id('dzFlavor').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
          if (k !== 'vanilla') { KSFX.puff(); addBlobs(FLAV[k].baked, 3); }
          paint();
        });
        $id('dzFlavor').append(b);
      });
      const spoon = $id('dzSpoon');
      let last = null;
      bowl.addEventListener('pointerdown', e => {
        if (D.added.length < ING.length) return toast('재료를 먼저 다 넣어주세요');
        bowl.setPointerCapture(e.pointerId);
        last = { x: e.clientX, y: e.clientY };
        spoon.classList.remove('rest');
      });
      bowl.addEventListener('pointermove', e => {
        if (!last) return;
        const r = bowl.getBoundingClientRect();
        spoon.style.left = Math.max(70, Math.min(270, e.clientX - r.left)) + 'px';
        spoon.style.top = Math.max(60, Math.min(110, e.clientY - r.top)) + 'px';
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        last = { x: e.clientX, y: e.clientY };
        if (D.mix >= 100) return;
        D.mix = Math.min(100, D.mix + dist / 35);
        snd(90, () => KSFX.whisk());
        paint();
        if (D.mix >= 100) { SFX.jingle(); toast('반죽 완성! 🥣'); }
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => bowl.addEventListener(ev, () => {
        last = null;
        spoon.classList.add('rest');
        spoon.style.left = '';
        spoon.style.top = '';
      }));
      drawBlobs();
      paint();
    }
  
    function stepPour() {
      const { cv, ctx } = canvasStage();
      const cup = D.kind === 'cupcake';
      controls.innerHTML = (cup ? '<div class="row" id="dzCount"></div><div class="row" id="dzLiners"></div>' : '') + NEXT;
      let target = -1;
      let timer = null;
      let loop = null;
      const draw = () => {
        cloth(ctx);
        const col = batterCol(0);
        if (cup) {
          D.fills.forEach((f, i) => { drawCup(ctx, CX(i), BY, { fill: f }); gauge(ctx, CX(i), BY + 16, f); });
          if (target >= 0) ladle(ctx, CX(target), col);
        } else {
          drawPan(ctx, D.fills[0], 0);
          gauge(ctx, 230, 270, D.fills[0], 140);
          if (target === 0) { ctx.fillStyle = col; ctx.fillRect(227, 30, 6, 100); }
        }
      };
      if (cup) {
        chipRow($id('dzCount'), [1, 2, 3, 4, 5, 6].map(n => [n, n + '개']), () => D.count, n => { setCount(n); draw(); });
        LINERS.forEach((L, i) => {
          const b = document.createElement('button');
          b.className = 'swatch' + (D.liner === L.id ? ' on' : '');
          b.style.background = `repeating-linear-gradient(90deg, ${L.a} 0 4px, ${L.b} 4px 8px)`;
          b.addEventListener('click', () => {
            D.liner = L.id;
            SFX.plink(i);
            $id('dzLiners').querySelectorAll('.swatch').forEach(x => x.classList.toggle('on', x === b));
            draw();
          });
          $id('dzLiners').append(b);
        });
      }
      const stop = () => {
        clearInterval(timer);
        timer = null;
        if (loop) { loop.stop(); loop = null; }
        target = -1;
        draw();
      };
      cv.addEventListener('pointerdown', e => {
        const p = pt(e, cv);
        const i = cup ? D.fills.findIndex((_, k) => Math.abs(p.x - CX(k)) < 33) : 0;
        if (i < 0) return;
        if (D.fills[i] >= 1) return toast('가득 찼어요!');
        cv.setPointerCapture(e.pointerId);
        target = i;
        loop = KSFX.pour();
        timer = setInterval(() => {
          D.fills[i] = Math.min(1, D.fills[i] + (cup ? 0.03 : 0.012));
          if (loop) loop.setLevel(D.fills[i]);
          draw();
          if (D.fills[i] >= 1) { stop(); toast('넘칠 것 같아요!'); }
        }, 60);
        draw();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cv.addEventListener(ev, () => { if (timer || loop) stop(); }));
      draw();
    }
  
    function takeOut(silent) {
      clearInterval(bakeTimer);
      bakeTimer = null;
      D.baking = false;
      D.baked = true;
      if (hum) { hum.stop(); hum = null; }
      const oven = $id('dzOven');
      if (oven) oven.classList.remove('on');
      if (silent) return;
      KSFX.door();
      const d = D.done;
      let msg = '살짝 탔어요 😅';
      if (d < 0.5) msg = '덜 익었어요… 그래도 귀여워 😋';
      else if (d < 0.75) msg = '조금 연하게 구워졌어요';
      else if (d <= 1.05) msg = '완벽해요! 🎉';
      toast(msg);
      if (d >= 0.75 && d <= 1.05) SFX.jingle();
    }
    function stepBake() {
      stage.innerHTML = `<div class="oven" id="dzOven">
        <div class="oven-top"><div class="dial main"></div><div class="oven-lamp"></div><div class="dial"></div></div>
        <div class="oven-door"><div class="oven-window"><canvas id="dzOvenCv" width="${W * 2}" height="${H * 2}"></canvas><div class="oven-glow"></div></div><div class="oven-handle"></div></div>
      </div>`;
      controls.innerHTML = `<div class="done-meter"><div class="zone"></div><div class="needle" id="dzNeedle"></div></div>
        <div class="row" style="margin-top:14px"><button class="btn primary" id="dzBake">🔥 굽기</button><button class="btn" id="dzTake">🧤 꺼내기</button></div>` + NEXT;
      const ctx = $id('dzOvenCv').getContext('2d');
      const draw = () => {
        tray(ctx);
        if (D.kind === 'cupcake') D.fills.forEach((f, i) => drawCup(ctx, CX(i), BY, { fill: f, rise: cupRise(i), done: D.done }));
        else drawPan(ctx, D.fills[0] * (1 + 0.35 * Math.min(1, D.done)), D.done);
        $id('dzNeedle').style.left = `calc(${Math.min(D.done, 1.3) / 1.3 * 100}% - 2px)`;
      };
      $id('dzBake').addEventListener('click', () => {
        if (D.baked) return toast('이미 구웠어요!');
        if (D.baking) return;
        D.baking = true;
        $id('dzOven').classList.add('on');
        KSFX.door();
        hum = KSFX.hum();
        let n = 0;
        let dinged = false;
        bakeTimer = setInterval(() => {
          D.done += 0.012;
          n++;
          if (n % 5 === 0) KSFX.tick();
          if (!dinged && D.done >= 0.75) { dinged = true; KSFX.ding(); toast('띵! 지금이 딱 좋아요'); }
          draw();
          if (D.done >= 1.3) takeOut();
        }, 100);
      });
      $id('dzTake').addEventListener('click', () => { if (D.baking) takeOut(); });
      draw();
    }
  
    function stepCream() {
      const { cv, ctx } = canvasStage();
      if (D.kind === 'cupcake') {
        controls.innerHTML = '<div class="row" id="dzCreams"></div>' + NEXT;
        swatches($id('dzCreams'), CREAMS, () => D.cream, c => { D.cream = c; });
        const draw = anim => {
          cloth(ctx);
          D.fills.forEach((_, i) => drawCup(ctx, CX(i), BY, cupOpts(i, anim && anim.i === i ? anim.p : 1)));
        };
        cv.addEventListener('click', e => {
          const i = cupAt(pt(e, cv));
          if (i < 0) return;
          D.frosted[i] = D.cream;
          let p = 0;
          let k = 0;
          const iv = setInterval(() => {
            p = Math.min(1, p + 0.1);
            k++;
            draw({ i: i, p: p });
            if (k % 3 === 1) AU.pipe();
            if (p >= 1) { clearInterval(iv); SFX.plink(5); }
          }, 50);
        });
        draw();
        return;
      }
      controls.innerHTML = `<div class="row" id="dzCreams"></div><span class="bar"><i id="dzBar"></i></span>
        <div class="row" id="dzCreams2" style="margin-top:14px"></div><button class="btn" id="dzBorder" style="width:100%">🌀 테두리</button>` + NEXT;
      const draw = () => { cloth(ctx); drawCakeTop(ctx, true); };
      const bar = v => { $id('dzBar').style.width = (v * 100) + '%'; $id('dzBar').style.background = D.cream; };
      swatches($id('dzCreams'), CREAMS, () => D.cream, c => {
        if (D.cream === c) return;
        D.cream = c;
        fctx.clearRect(0, 0, W, H);
        D.frostDone = false;
        bar(0);
        draw();
      });
      swatches($id('dzCreams2'), CREAMS, () => D.cream2, c => { D.cream2 = c; draw(); });
      const coverage = () => {
        const d = fctx.getImageData(0, 0, W * 2, H * 2).data;
        let n = 0;
        SAMPLES.forEach(([x, y]) => { if (d[(y * 2 * W * 2 + x * 2) * 4 + 3] > 0) n++; });
        return n / SAMPLES.length;
      };
      const finish = () => {
        D.frostDone = true;
        fctx.save();
        fctx.fillStyle = D.cream;
        fctx.beginPath();
        fctx.arc(230, 150, 120, 0, Math.PI * 2);
        fctx.fill();
        fctx.strokeStyle = shade(D.cream, -0.07);
        fctx.lineWidth = 2;
        fctx.globalAlpha = 0.6;
        for (let r = 20; r < 115; r += 18) {
          fctx.beginPath();
          fctx.arc(230, 150, r, rnd(0, 3), rnd(3.5, 6));
          fctx.stroke();
        }
        fctx.restore();
        bar(1);
        SFX.jingle();
        toast('매끈하게 발랐어요 ✨');
        draw();
      };
      const spreadAt = p => {
        if (Math.hypot(p.x - 230, p.y - 150) > 135) return;
        fctx.save();
        fctx.beginPath();
        fctx.arc(230, 150, 120, 0, Math.PI * 2);
        fctx.clip();
        fctx.fillStyle = D.cream;
        fctx.beginPath();
        fctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        fctx.fill();
        fctx.restore();
      };
      let down = false;
      let lastCheck = 0;
      cv.addEventListener('pointerdown', e => { if (D.frostDone) return; down = true; cv.setPointerCapture(e.pointerId); spreadAt(pt(e, cv)); AU.spread(); draw(); });
      cv.addEventListener('pointermove', e => {
        if (!down || D.frostDone) return;
        spreadAt(pt(e, cv));
        snd(120, AU.spread);
        draw();
        const now = performance.now();
        if (now - lastCheck > 300) {
          lastCheck = now;
          const c = coverage();
          bar(c);
          if (c >= 0.9) { down = false; finish(); }
        }
      });
      ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => { down = false; }));
      $id('dzBorder').addEventListener('click', () => {
        if (!D.frostDone) return toast('크림을 먼저 다 발라요');
        D.borderN = 0;
        const iv = setInterval(() => {
          D.borderN++;
          if (D.borderN % 2) AU.pipe();
          draw();
          if (D.borderN >= 28) { clearInterval(iv); SFX.plink(6); }
        }, 45);
      });
      if (D.frostDone) bar(1);
      draw();
    }
  
    function stepDeco() {
      const { cv, ctx } = canvasStage();
      const cake = D.kind === 'cake';
      const U = cake ? 1.7 : 1;
      controls.innerHTML = (cake ? '' : '<div class="row" id="dzPick"></div>') + '<div class="row" id="dzPens"></div><div class="row" id="dzSizes"></div><div class="row" id="dzTools"></div>' + NEXT;
      const draw = () => {
        cloth(ctx);
        if (cake) { drawCakeTop(ctx, true); return; }
        ctx.setTransform(2 * Z, 0, 0, 2 * Z, 460, 570);
        drawCup(ctx, 0, 0, cupOpts(D.sel, 1));
      };
      const target = () => (cake ? cakeDeco : cupDecos[D.sel]);
      const clip = () => (cake ? cakeClip : cupClip(D.sel));
      const toLocal = p => (cake ? p : { x: (p.x - 230) / Z, y: (p.y - 285) / Z });
      if (!cake) chipRow($id('dzPick'), D.fills.map((_, i) => [i, '🧁' + (i + 1)]), () => D.sel, i => { D.sel = i; draw(); });
      swatches($id('dzPens'), PENS, () => D.pen, c => { D.pen = c; if (D.tool === 'erase') setTool('pen'); });
      chipRow($id('dzSizes'), [[1, '얇게'], [1.8, '보통'], [2.8, '굵게']], () => D.size, v => { D.size = v; });
      const TOOLS = [['pen', '✏️'], ['spray', '🌈'], ['pearl', '⚪'], ['berry', '🍓']].concat(cake ? [['plaque', '🍫'], ['candle', '🕯']] : []).concat([['erase', '🧽']]);
      const toolBtns = [];
      const setTool = t => { D.tool = t; toolBtns.forEach(([v, b]) => b.classList.toggle('on', v === t)); };
      TOOLS.forEach(([v, label]) => {
        const b = document.createElement('button');
        b.className = 'stk-btn' + (D.tool === v ? ' on' : '');
        b.textContent = label;
        b.addEventListener('click', () => { setTool(v); SFX.pop(); });
        toolBtns.push([v, b]);
        $id('dzTools').append(b);
      });
      const undo = document.createElement('button');
      undo.className = 'stk-btn';
      undo.textContent = '↩';
      undo.addEventListener('click', () => {
        const h = D.hist.pop();
        if (!h) return;
        if (h.t === 'deco') h.c.getContext('2d').putImageData(h.data, 0, 0);
        if (h.t === 'plaque') D.plaques.pop();
        if (h.t === 'candle') D.candles.pop();
        SFX.paper();
        draw();
      });
      $id('dzTools').append(undo);
      const snap = c => {
        D.hist.push({ t: 'deco', c: c, data: c.getContext('2d').getImageData(0, 0, c.width, c.height) });
        if (D.hist.length > 12) D.hist.shift();
      };
      let last = null;
      cv.addEventListener('pointerdown', e => {
        const lp = toLocal(pt(e, cv));
        const x = target().getContext('2d');
        if (cake && (D.tool === 'plaque' || D.tool === 'candle')) {
          if (Math.hypot(lp.x - 230, lp.y - 150) > 112) return;
          if (D.tool === 'plaque') {
            if (D.plaques.length >= 2) return toast('초코판은 2개까지!');
            D.plaques.push({ x: lp.x, y: lp.y });
            D.hist.push({ t: 'plaque' });
            AU.plop();
          } else {
            if (D.candles.length >= 12) return toast('초는 12개까지!');
            D.candles.push({ x: lp.x, y: lp.y + 12, c: CANDLES[D.candles.length % CANDLES.length] });
            D.hist.push({ t: 'candle' });
            SFX.plink();
          }
          draw();
          return;
        }
        snap(target());
        if (D.tool === 'pearl') { pearl(x, clip(), lp, U); AU.pearl(); draw(); return; }
        if (D.tool === 'berry') { berry(x, lp, U); SFX.pop(); draw(); return; }
        cv.setPointerCapture(e.pointerId);
        last = lp;
        if (D.tool === 'spray') { spray(x, clip(), lp, U); KSFX.sprinkle(); }
        else { icing(x, clip(), lp, { x: lp.x + 0.1, y: lp.y }, U); AU.pen(); }
        draw();
      });
      cv.addEventListener('pointermove', e => {
        if (!last) return;
        const lp = toLocal(pt(e, cv));
        const x = target().getContext('2d');
        if (D.tool === 'spray') snd(100, () => { spray(x, clip(), lp, U); KSFX.sprinkle(); });
        else { icing(x, clip(), last, lp, U); snd(80, AU.pen); }
        last = lp;
        draw();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cv.addEventListener(ev, () => { last = null; }));
      draw();
    }
  
    function stepFinish() {
      if (D.kind === 'cake') {
        const { ctx } = canvasStage();
        cloth(ctx);
        drawCakeTop(ctx, true);
        controls.innerHTML = '<button class="btn primary big" id="dzPlace">🎂 책상에 올리기</button><button class="btn" id="dzAgain" style="width:100%;margin-top:10px">🔄 새로 만들기</button>';
        $id('dzPlace').addEventListener('click', () => { if (!D.sent) placeCake(); close(); });
        $id('dzAgain').addEventListener('click', () => { reset('cake'); SFX.paper(); render(); });
        return;
      }
      const { cv, ctx } = canvasStage();
      controls.innerHTML = '<div class="row" id="dzTo"></div><button class="btn" id="dzAgain" style="width:100%">🔄 새로 만들기</button><button class="btn primary big" id="dzDone">다 됐어요 →</button>';
      const draw = () => { cloth(ctx); D.fills.forEach((_, i) => { if (!D.packed[i]) drawCup(ctx, CX(i), BY, cupOpts(i, 1)); }); };
      chipRow($id('dzTo'), [['bag', '🎁 봉지'], ['plate', '🍽 접시']], () => D.packTo, v => { D.packTo = v; });
      cv.addEventListener('click', e => {
        const i = cupAt(pt(e, cv));
        if (i < 0 || D.packed[i]) return;
        const src = cupImage(i);
        if (D.packTo === 'bag') {
          if (S.wrapped) return toast('봉지 포장을 먼저 풀어주세요 🎀');
          if (S.gifts.length >= 6) return toast('봉지가 꽉 찼어요!');
          S.gifts.push('img:' + src);
          renderGift(S.gifts.length - 1);
          toast('봉지에 쏙! 🎁');
        } else {
          if (!toPlate(src)) return;
          toast('접시에 쏙! 🍽');
        }
        D.packed[i] = true;
        KSFX.plop();
        draw();
      });
      $id('dzAgain').addEventListener('click', () => { reset('cupcake'); SFX.paper(); render(); });
      let warned = false;
      $id('dzDone').addEventListener('click', () => {
        if (!D.packed.some(Boolean) && !warned) { warned = true; return toast('컵케이크를 콕 눌러서 담아요 🧁'); }
        close();
      });
      setTimeout(() => toast('담을 컵케이크를 콕 눌러요 🧁'), 300);
      draw();
    }
  
    function close() {
      if (D.baking) takeOut(true);
      root.classList.add('hidden');
      SFX.click();
    }
    $id('dzClose').addEventListener('click', close);
  
    renderDeskCake();
    const foldCss = document.createElement('style');
    foldCss.textContent = `
      .desk > .panel { transition: margin-right .35s cubic-bezier(.3,1.1,.5,1), opacity .25s; }
      body.panel-folded .desk > .panel { margin-right: -380px; opacity: 0; pointer-events: none; }
      .panel-tab { position: fixed; top: 50%; right: 356px; z-index: 6; width: 26px; height: 74px; margin-top: -37px; padding: 0; border: none; border-radius: 10px 0 0 10px; cursor: pointer; font-size: 20px; color: #6b4a2e; background: var(--grain), #f3e3c3; box-shadow: -3px 3px 8px rgba(0,0,0,.3); transition: right .35s cubic-bezier(.3,1.1,.5,1); }
      .panel-tab:hover { background: var(--grain), #ffe9b0; }
      body.panel-folded .panel-tab { right: 0; }
      .dw-pull { transition: transform .2s, right .35s; }
      body.panel-folded .dw-pull { right: 28px; }
    `;
    document.head.append(foldCss);
    const tab = document.createElement('button');
    tab.className = 'panel-tab';
    document.body.append(tab);
    const setFold = on => {
      document.body.classList.toggle('panel-folded', on);
      tab.textContent = on ? '‹' : '›';
      tab.title = on ? '펼치기' : '접기';
      localStorage.setItem('panelFolded', on ? '1' : '0');
      setTimeout(() => window.dispatchEvent(new Event('resize')), 380);
    };
    tab.addEventListener('click', () => { setFold(!document.body.classList.contains('panel-folded')); SFX.paper(); });
    setFold(localStorage.getItem('panelFolded') === '1');
  
    const kitchenBtn = document.createElement('button');
    kitchenBtn.className = 'mute';
    kitchenBtn.title = '부엌';
    kitchenBtn.textContent = '🍳';
    ($('button[title="티타임"]') || $('#muteBtn')).before(kitchenBtn);
    kitchenBtn.addEventListener('click', () => {
      paintRecipe();
      rb.classList.remove('hidden');
      SFX.paper();
    });
    console.log('✅ dessert.js 준비 완료!');
  })();