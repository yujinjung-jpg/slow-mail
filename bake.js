(() => {
  const FLAVORS = {
    plain: { name: '플레인', raw: '#f3dca8', baked: '#d29a4e' },
    cocoa: { name: '코코아', raw: '#9a6a48', baked: '#5e3a22' },
    matcha: { name: '말차', raw: '#c9dd9c', baked: '#93ad5e' },
    berry: { name: '딸기', raw: '#f7c3cc', baked: '#dc9a98' }
  };
  const SHAPES = [
    { id: 'bear', label: '🐻 곰' }, { id: 'bunny', label: '🐰 토끼' }, { id: 'cat', label: '🐱 고양이' },
    { id: 'heart', label: '♥ 하트' }, { id: 'star', label: '★ 별' }, { id: 'circle', label: '● 동글' }
  ];
  const INGREDIENTS = [
    { id: 'flour', icon: '🌾', name: '밀가루', color: '#fbf6ea', sound: 'puff' },
    { id: 'butter', icon: '🧈', name: '버터', color: '#ffe08a', sound: 'plop' },
    { id: 'egg', icon: '🥚', name: '달걀', color: '#ffc94a', sound: 'crack' },
    { id: 'sugar', icon: '🍯', name: '설탕', color: '#ffffff', sound: 'sprinkle' }
  ];
  const ING_HTML = {
    flour: '<div class="ingr ing-flour" data-id="flour"><div class="lbl">밀가루<small>FLOUR</small></div></div>',
    butter: '<div class="ingr ing-butter" data-id="butter"><div class="wrap">BUTTER</div></div>',
    egg: '<div class="ingr ing-egg" data-id="egg"></div>',
    sugar: '<div class="ingr ing-sugar" data-id="sugar"><div class="lid"></div><div class="lbl">설탕</div></div>'
  };
  const TOOLS = [
    { id: 'choco', label: '🍫 초코펜', color: '#3b2416', size: 4 },
    { id: 'berry', label: '🍓 딸기펜', color: 'rgba(255,120,150,.55)', size: 9 },
    { id: 'icing', label: '🤍 아이싱', color: '#fffdf6', size: 5 },
    { id: 'sprinkle', label: '🌈 스프링클', color: '', size: 0 }
  ];
  const STEPS = ['반죽', '밀기', '모양', '굽기', '꾸미기', '담기'];
  const W = 460;
  const H = 300;
  const R = 46;
  const MAXC = 6;
  const NEXT = '<button class="btn primary big" id="kNext">다음 →</button>';
  const K = {};
  let bakeTimer = null;
  let hum = null;
  let union = null;
  let lastSound = 0;
  let drawing = null;
  const $id = id => document.getElementById(id);
  const throttle = (ms, fn) => { const now = performance.now(); if (now - lastSound > ms) { lastSound = now; fn(); } };

  const style = document.createElement('style');
  style.textContent = `
    .gift-bag { width: 220px; height: 270px; }
    .gift-items { left: 18px; right: 18px; top: 58px; bottom: 12px; font-size: 30px; align-items: flex-end; }
    .gift-items span.is-cookie { margin: -10px -8px; }
    .cookie-img { width: 88px; height: 88px; }
    .ribbon { top: 22px; }
    .counter { width: 640px; }
    .ingr { position: absolute; cursor: pointer; z-index: 3; transform: var(--rot, none); filter: drop-shadow(0 10px 10px rgba(0,0,0,.3)); transition: filter .2s, opacity .3s; }
    .ingr:hover { filter: drop-shadow(0 14px 12px rgba(0,0,0,.35)) brightness(1.05); }
    .ingr.used { opacity: .45; pointer-events: none; }
    .ingr.used::after { content: '✓'; position: absolute; right: -6px; top: -12px; width: 28px; height: 28px; border-radius: 50%; background: #7cbf6b; color: #fff; font-size: 18px; display: grid; place-items: center; }
    .ingr.into { animation: intoBowl .6s ease-in forwards; pointer-events: none; z-index: 6; }
    .ing-flour { --rot: rotate(-6deg); left: 0; top: 30px; width: 124px; height: 156px; border-radius: 6px 6px 10px 10px; background: var(--grain), linear-gradient(90deg, #e6d6b6, #f3e7cf 40%, #dcc9a4); }
    .ing-flour::before { content: ''; position: absolute; left: 0; right: 0; top: -12px; height: 16px; background: linear-gradient(#efe2c6, #e2d0ac); clip-path: polygon(0 100%, 0 30%, 8% 0, 16% 30%, 24% 0, 32% 30%, 40% 0, 48% 30%, 56% 0, 64% 30%, 72% 0, 80% 30%, 88% 0, 96% 30%, 100% 10%, 100% 100%); }
    .ing-flour .lbl { position: absolute; left: 14px; right: 14px; top: 46px; padding: 8px 4px; background: #fffaf0; border: 2px solid #c9a46a; border-radius: 8px; text-align: center; font-family: 'Gaegu'; font-size: 20px; color: #6b4a2e; }
    .ing-flour .lbl small { display: block; font-family: 'Gowun Dodum'; font-size: 10px; letter-spacing: 2px; }
    .ing-butter { --rot: rotate(4deg); left: 6px; bottom: 30px; width: 136px; height: 60px; border-radius: 8px; background: linear-gradient(180deg, #fff6c2, #f7dd73 70%, #e8c454); box-shadow: inset 0 -8px 0 rgba(200,160,40,.35), inset 0 4px 0 rgba(255,255,255,.6); }
    .ing-butter .wrap { position: absolute; right: 0; top: -2px; bottom: -2px; width: 58%; border-radius: 0 8px 8px 0; background: repeating-linear-gradient(90deg, #f4f1ea 0 10px, #e9e4da 10px 12px); display: grid; place-items: center; font-weight: bold; font-size: 13px; letter-spacing: 2px; color: #3d5a8a; box-shadow: -3px 0 4px rgba(0,0,0,.08); }
    .ing-egg { --rot: rotate(-8deg); right: 50px; top: 50px; width: 64px; height: 82px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: radial-gradient(circle at 35% 28%, #fffdf6, #f5e6cb 55%, #e2c9a0); }
    .ing-sugar { --rot: rotate(3deg); right: 14px; bottom: 26px; width: 104px; height: 128px; border-radius: 14px 14px 18px 18px; border: 3px solid rgba(255,255,255,.8); background: linear-gradient(90deg, rgba(255,255,255,.4), rgba(255,255,255,.05) 40%, rgba(255,255,255,.35)), linear-gradient(transparent 0 32%, #fffdf8 32%); }
    .ing-sugar .lid { position: absolute; left: -6px; right: -6px; top: -20px; height: 20px; border-radius: 6px; background: linear-gradient(#c99560, #9c6a3e); }
    .ing-sugar .lbl { position: absolute; left: 12px; right: 12px; top: 58px; background: #fffaf0; border: 2px solid #e6a5b5; border-radius: 6px; text-align: center; font-family: 'Gaegu'; font-size: 18px; color: #a8506a; }
    .bowl-front { z-index: 2; }
    .spoon { position: absolute; left: 300px; top: 70px; width: 44px; height: 240px; pointer-events: none; z-index: 1; transform-origin: 50% 88%; transform: translate(-50%, -88%) rotate(22deg); }
    .spoon.rest { left: 300px; top: 78px; transform: translate(-50%, -88%) rotate(34deg); transition: left .3s, top .3s, transform .3s; }
    .spoon::before { content: ''; position: absolute; left: 16px; top: 0; width: 12px; height: 196px; border-radius: 6px; background: linear-gradient(90deg, #a8723b, #e2b47e 45%, #9a6534); }
    .spoon::after { content: ''; position: absolute; left: 0; bottom: 0; width: 44px; height: 58px; border-radius: 50%; background: radial-gradient(ellipse at 40% 35%, #f0c995, #c98f52 60%, #a8723b); box-shadow: inset 0 -4px 6px rgba(0,0,0,.2); }
    @keyframes intoBowl { to { transform: translate(var(--tx), var(--ty)) scale(.3) rotate(40deg); opacity: 0; } }
  `;
  document.head.append(style);

  const deco = document.createElement('canvas');
  deco.width = W;
  deco.height = H;
  deco.className = 'k-layer draw';
  const dctx = deco.getContext('2d');

  function reset() {
    Object.assign(K, { step: 1, added: [], blobs: [], flavor: 'plain', mix: 0, roll: 0, cutter: 'bear', cookies: [], done: 0, baking: false, baked: false, tool: 'choco' });
    dctx.clearRect(0, 0, W, H);
  }

  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mixRgb(A, B, t) { return A.map((v, i) => Math.round(v + (B[i] - v) * t)); }
  function bakedColor(d) {
    const f = FLAVORS[K.flavor];
    let c = mixRgb(hexToRgb(f.raw), hexToRgb(f.baked), Math.min(1, d));
    if (d > 1) c = mixRgb(c, [59, 36, 20], Math.min(0.6, (d - 1) * 1.8));
    return `rgb(${c.join(',')})`;
  }

  function cookiePath(shape, x, y) {
    const r = R;
    const p = new Path2D();
    const add = fn => { const q2 = new Path2D(); fn(q2); p.addPath(q2); };
    if (shape === 'circle') add(q2 => q2.arc(x, y, r, 0, Math.PI * 2));
    if (shape === 'heart') add(q2 => {
      q2.moveTo(x, y + r * 0.9);
      q2.bezierCurveTo(x - r * 1.5, y - r * 0.1, x - r * 0.8, y - r * 1.25, x, y - r * 0.45);
      q2.bezierCurveTo(x + r * 0.8, y - r * 1.25, x + r * 1.5, y - r * 0.1, x, y + r * 0.9);
      q2.closePath();
    });
    if (shape === 'star') add(q2 => {
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const rr = i % 2 ? r * 0.5 : r * 1.08;
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (i) q2.lineTo(px, py); else q2.moveTo(px, py);
      }
      q2.closePath();
    });
    if (shape === 'bear') {
      add(q2 => q2.arc(x, y + r * 0.12, r * 0.86, 0, Math.PI * 2));
      add(q2 => q2.arc(x - r * 0.62, y - r * 0.6, r * 0.32, 0, Math.PI * 2));
      add(q2 => q2.arc(x + r * 0.62, y - r * 0.6, r * 0.32, 0, Math.PI * 2));
    }
    if (shape === 'bunny') {
      add(q2 => q2.arc(x, y + r * 0.3, r * 0.76, 0, Math.PI * 2));
      add(q2 => q2.ellipse(x - r * 0.33, y - r * 0.55, r * 0.21, r * 0.52, -0.18, 0, Math.PI * 2));
      add(q2 => q2.ellipse(x + r * 0.33, y - r * 0.55, r * 0.21, r * 0.52, 0.18, 0, Math.PI * 2));
    }
    if (shape === 'cat') {
      add(q2 => q2.arc(x, y + r * 0.15, r * 0.84, 0, Math.PI * 2));
      add(q2 => { q2.moveTo(x - r * 0.78, y - r * 0.15); q2.lineTo(x - r * 0.62, y - r * 0.98); q2.lineTo(x - r * 0.12, y - r * 0.6); q2.closePath(); });
      add(q2 => { q2.moveTo(x + r * 0.78, y - r * 0.15); q2.lineTo(x + r * 0.12, y - r * 0.6); q2.lineTo(x + r * 0.62, y - r * 0.98); q2.closePath(); });
    }
    return p;
  }

  function drawCookie(ctx, c, d) {
    const path = cookiePath(c.shape, c.x, c.y);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = bakedColor(d);
    ctx.fill(path);
    ctx.restore();
    ctx.save();
    ctx.clip(path);
    const g = ctx.createRadialGradient(c.x - R * 0.3, c.y - R * 0.4, 2, c.x, c.y, R * 1.3);
    g.addColorStop(0, 'rgba(255,255,255,.28)');
    g.addColorStop(0.6, 'rgba(255,255,255,0)');
    g.addColorStop(1, `rgba(60,30,10,${0.12 + Math.min(d, 1.3) * 0.3})`);
    ctx.fillStyle = g;
    ctx.fillRect(c.x - R * 1.6, c.y - R * 1.6, R * 3.2, R * 3.2);
    let s = c.seed;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    ctx.fillStyle = 'rgba(90,50,20,.22)';
    for (let i = 0; i < 60; i++) ctx.fillRect(c.x + (rand() - 0.5) * R * 2.2, c.y + (rand() - 0.5) * R * 2.2, 1.6, 1.6);
    ctx.restore();
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(80,45,15,${0.2 + Math.min(d, 1.3) * 0.35})`;
    ctx.stroke(path);
    ctx.restore();
  }

  function drawSheet(ctx, ghost) {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = FLAVORS[K.flavor].raw;
    ctx.beginPath();
    ctx.roundRect(10, 10, W - 20, H - 20, 22);
    ctx.fill();
    ctx.restore();
    let s = 7;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = 0; i < 160; i++) ctx.fillRect(20 + rand() * (W - 40), 20 + rand() * (H - 40), 2, 2);
    K.cookies.forEach(c => {
      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(90,60,30,.25)';
      ctx.stroke(cookiePath(c.shape, c.x, c.y));
      ctx.restore();
      drawCookie(ctx, c, 0);
    });
    if (ghost) {
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(90,60,30,.7)';
      ctx.stroke(cookiePath(K.cutter, ghost.x, ghost.y));
      ctx.restore();
    }
  }

  function drawTray(ctx, withDeco, skipPacked) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#3e4046';
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.14)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(6, 6, W - 12, H - 12, 14);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    for (let x = 24; x < W - 10; x += 22) for (let y = 24; y < H - 10; y += 22) ctx.fillRect(x, y, 2, 2);
    K.cookies.forEach(c => {
      if (skipPacked && c.packed) return;
      drawCookie(ctx, c, K.done);
      if (withDeco) {
        ctx.save();
        ctx.clip(cookiePath(c.shape, c.x, c.y));
        ctx.drawImage(deco, 0, 0);
        ctx.restore();
      }
    });
  }

  function cookieImage(c) {
    const cv = document.createElement('canvas');
    cv.width = 180;
    cv.height = 180;
    const x = cv.getContext('2d');
    x.setTransform(1.5, 0, 0, 1.5, 90 - c.x * 1.5, 90 - c.y * 1.5);
    drawCookie(x, c, K.done);
    x.save();
    x.clip(cookiePath(c.shape, c.x, c.y));
    x.drawImage(deco, 0, 0);
    x.restore();
    return cv.toDataURL('image/png');
  }

  function ptr(e, canvas) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  }

  const root = document.createElement('div');
  root.className = 'studio hidden';
  root.innerHTML = `<button class="close" id="kClose">✕</button>
    <div class="studio-stage" id="kStage"></div>
    <aside class="panel studio-panel">
      <div class="k-steps" id="kSteps"></div>
      <h2 id="kTitle"></h2>
      <p class="tip" id="kTip"></p>
      <div id="kControls"></div>
    </aside>`;
  document.body.append(root);
  const stage = root.querySelector('#kStage');
  const controls = root.querySelector('#kControls');

  const openBtn = document.createElement('button');
  openBtn.className = 'btn';
  openBtn.style.width = '100%';
  openBtn.style.marginBottom = '12px';
  openBtn.textContent = '👩‍🍳 쿠키 직접 굽기';
  $('#snackGrid').after(openBtn);
  openBtn.addEventListener('click', () => { root.classList.remove('hidden'); SFX.click(); render(); });

  function close() {
    if (K.baking) takeOut(true);
    root.classList.add('hidden');
    SFX.click();
  }
  root.querySelector('#kClose').addEventListener('click', close);

  const DEFS = [
    { title: '🥣 반죽 만들기', tip: '탁자 위 재료를 눌러 그릇에 넣고, 반죽 맛을 골라요.', fn: stepDough, ok: () => K.mix >= 100, no: '반죽을 끝까지 섞어주세요 🥄' },
    { title: '🪵 밀대로 밀기', tip: '반죽을 넓~게 펴요.', fn: stepRoll, ok: () => K.roll >= 100, no: '반죽을 조금 더 밀어주세요' },
    { title: '🐻 모양 찍기', tip: '모양틀을 고르고 반죽 위를 콕콕 눌러 찍어요.', fn: stepCut, ok: () => K.cookies.length > 0, no: '쿠키를 하나 이상 찍어주세요' },
    { title: '🔥 오븐에 굽기', tip: '남은 반죽은 걷어내고 쿠키만 쟁반에 올렸어요.', fn: stepBake, ok: () => K.baked, no: '먼저 구워주세요 🔥' },
    { title: '🎨 꾸미기', tip: '초코펜으로 눈코입을 그리고, 볼터치랑 스프링클도 뿌려요.', fn: stepDeco, ok: () => true, no: '' },
    { title: '🎁 선물 봉지에 담기', tip: '', fn: stepPack, ok: () => true, no: '' }
  ];

  function render() {
    root.querySelector('#kSteps').innerHTML = STEPS.map((s, i) => `<span class="${i + 1 === K.step ? 'on' : (i + 1 < K.step ? 'done' : '')}">${s}</span>`).join('');
    const d = DEFS[K.step - 1];
    root.querySelector('#kTitle').textContent = d.title;
    root.querySelector('#kTip').textContent = d.tip;
    d.fn();
    const nb = $id('kNext');
    if (nb) nb.addEventListener('click', () => {
      if (!d.ok()) return toast(d.no);
      K.step++;
      SFX.click();
      if (K.step === 4) SFX.paper();
      render();
    });
  }

  function drawBlobs() {
    const sw = $id('swirl');
    if (!sw) return;
    sw.innerHTML = K.blobs.map(b => `<i class="blob" style="left:${b.x}%;top:${b.y}%;width:${b.s}px;height:${b.s * 0.7}px;background:${b.c}"></i>`).join('');
  }
  function addBlobs(color, n) {
    for (let i = 0; i < n; i++) K.blobs.push({ c: color, x: 30 + Math.random() * 40, y: 32 + Math.random() * 36, s: 20 + Math.random() * 18 });
    drawBlobs();
  }
  function paintMix() {
    const dm = $id('doughMix');
    if (!dm) return;
    dm.style.setProperty('--dough', FLAVORS[K.flavor].raw);
    dm.classList.toggle('filled', K.added.length > 0);
    const sw = $id('swirl');
    sw.style.opacity = String(1 - K.mix / 100);
    sw.style.transform = `rotate(${K.mix * 7}deg)`;
    const bar = $id('kMixBar');
    bar.style.width = K.mix + '%';
    bar.style.background = FLAVORS[K.flavor].baked;
  }
  function addIngredient(id) {
    const ing = INGREDIENTS.find(x => x.id === id);
    if (K.added.includes(id)) return toast('이미 넣었어요!');
    K.added.push(id);
    const el = stage.querySelector(`.ingr[data-id="${id}"]`);
    const counter = $id('counter');
    if (el && counter) {
      const clone = el.cloneNode(true);
      clone.style.setProperty('--tx', (counter.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)) + 'px');
      clone.style.setProperty('--ty', (160 - (el.offsetTop + el.offsetHeight / 2)) + 'px');
      clone.classList.add('into');
      counter.append(clone);
      setTimeout(() => clone.remove(), 650);
      el.classList.add('used');
    }
    $$('#kIng .chip').forEach(b => { if (b.dataset.id === id) b.classList.add('used'); });
    setTimeout(() => {
      KSFX[ing.sound]();
      addBlobs(ing.color, id === 'egg' ? 2 : 3);
      if (id === 'flour') {
        const cl = document.createElement('div');
        cl.className = 'cloud';
        $id('bowl').append(cl);
        setTimeout(() => cl.remove(), 1100);
      }
      paintMix();
    }, 450);
  }

  function stepDough() {
    stage.innerHTML = `<div class="counter" id="counter">${INGREDIENTS.map(i => ING_HTML[i.id]).join('')}
      <div class="bowl-wrap" id="bowl">
        <div class="bowl-back"></div>
        <div class="dough-mix" id="doughMix"><div class="swirl" id="swirl"></div></div>
        <div class="bowl-front"></div>
        <div class="spoon rest" id="spoon"></div>
      </div></div>`;
    controls.innerHTML = `<p class="tip">재료 (탁자 위를 눌러도 돼요)</p><div class="row" id="kIng"></div>
      <p class="tip">반죽 맛</p><div class="row" id="kFlavor"></div>
      <p class="tip">재료를 다 넣으면 그릇 안을 누른 채 빙글빙글 저어요 🥄</p>
      <span class="bar"><i id="kMixBar"></i></span>` + NEXT;
    stage.querySelectorAll('.ingr').forEach(el => {
      if (K.added.includes(el.dataset.id)) el.classList.add('used');
      el.addEventListener('click', () => addIngredient(el.dataset.id));
    });
    INGREDIENTS.forEach(ing => {
      const b = document.createElement('button');
      b.className = 'chip' + (K.added.includes(ing.id) ? ' used' : '');
      b.dataset.id = ing.id;
      b.textContent = `${ing.icon} ${ing.name}`;
      b.addEventListener('click', () => addIngredient(ing.id));
      $id('kIng').append(b);
    });
    Object.keys(FLAVORS).forEach((k, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (K.flavor === k ? ' on' : '');
      b.innerHTML = `<i class="dot" style="background:${FLAVORS[k].raw}"></i>${FLAVORS[k].name}`;
      b.addEventListener('click', () => {
        if (K.mix > 0) return toast('이미 섞기 시작했어요');
        K.flavor = k;
        SFX.plink(i);
        $$('#kFlavor .chip').forEach(x => x.classList.toggle('on', x === b));
        if (k !== 'plain') { KSFX.puff(); addBlobs(FLAVORS[k].baked, 3); }
        paintMix();
      });
      $id('kFlavor').append(b);
    });
    const bowl = $id('bowl');
    const spoon = $id('spoon');
    let last = null;
    bowl.addEventListener('pointerdown', e => {
      if (K.added.length < INGREDIENTS.length) return toast('재료를 먼저 다 넣어주세요 🧈🥚');
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
      if (K.mix >= 100) return;
      K.mix = Math.min(100, K.mix + dist / 35);
      throttle(90, () => KSFX.whisk());
      paintMix();
      if (K.mix >= 100) { SFX.jingle(); toast('반죽 완성! 말랑말랑 🍪'); }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => bowl.addEventListener(ev, () => {
      last = null;
      spoon.classList.add('rest');
      spoon.style.left = '';
      spoon.style.top = '';
    }));
    drawBlobs();
    paintMix();
  }

  function paintRoll() {
    const p = K.roll / 100;
    const sheet = $id('sheet');
    const w = 150 + (W - 150) * p;
    const h = 120 + (H - 120) * p;
    sheet.style.width = w + 'px';
    sheet.style.height = h + 'px';
    sheet.style.borderRadius = (Math.min(w, h) / 2 * (1 - p) + 22 * p) + 'px';
    sheet.style.setProperty('--dough', FLAVORS[K.flavor].raw);
    $id('kRollBar').style.width = K.roll + '%';
    $id('kRollBar').style.background = FLAVORS[K.flavor].baked;
  }
  function stepRoll() {
    stage.innerHTML = `<div class="board" id="board"><div class="dough-sheet" id="sheet"></div><div class="pin" id="pin"><i></i></div></div>`;
    controls.innerHTML = `<p class="tip">반죽 위를 누른 채로 위아래로 쓱쓱 밀어요</p><span class="bar"><i id="kRollBar"></i></span>` + NEXT;
    const board = $id('board');
    const pin = $id('pin');
    let lastY = null;
    board.addEventListener('pointerdown', e => { board.setPointerCapture(e.pointerId); lastY = e.clientY; });
    board.addEventListener('pointermove', e => {
      const r = board.getBoundingClientRect();
      pin.style.top = (e.clientY - r.top - 17) + 'px';
      if (lastY === null) return;
      const dy = Math.abs(e.clientY - lastY);
      lastY = e.clientY;
      if (K.roll >= 100 || dy < 1) return;
      K.roll = Math.min(100, K.roll + dy / 14);
      throttle(140, () => KSFX.roll());
      paintRoll();
      if (K.roll >= 100) { SFX.jingle(); toast('넓~게 잘 폈어요! 🪵'); }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => board.addEventListener(ev, () => { lastY = null; }));
    paintRoll();
  }

  function stepCut() {
    stage.innerHTML = `<div class="board"><canvas id="cutCv" class="cut-cv" width="${W}" height="${H}"></canvas></div>`;
    controls.innerHTML = `<p class="tip">모양틀</p><div class="row" id="kCutters"></div><p class="tip" id="kCount"></p><button class="btn" id="kUndo">↩ 하나 되돌리기</button>` + NEXT;
    const cv = $id('cutCv');
    const ctx = cv.getContext('2d');
    const count = () => { $id('kCount').textContent = `찍은 쿠키 ${K.cookies.length} / ${MAXC}개`; };
    SHAPES.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (K.cutter === s.id ? ' on' : '');
      b.textContent = s.label;
      b.addEventListener('click', () => {
        K.cutter = s.id;
        SFX.plink(i);
        $$('#kCutters .chip').forEach(x => x.classList.toggle('on', x === b));
      });
      $id('kCutters').append(b);
    });
    cv.addEventListener('pointermove', e => drawSheet(ctx, ptr(e, cv)));
    cv.addEventListener('pointerleave', () => drawSheet(ctx));
    cv.addEventListener('click', e => {
      const p = ptr(e, cv);
      if (K.cookies.length >= MAXC) return toast(`쟁반이 꽉 찼어요! (최대 ${MAXC}개)`);
      if (p.x < 10 + R || p.x > W - 10 - R || p.y < 10 + R * 1.1 || p.y > H - 10 - R) return toast('반죽 안쪽에 찍어주세요');
      if (K.cookies.some(c => Math.hypot(c.x - p.x, c.y - p.y) < R * 2.05)) return toast('너무 붙었어요! 조금 떨어뜨려 찍어요');
      K.cookies.push({ shape: K.cutter, x: p.x, y: p.y, seed: 1 + Math.floor(Math.random() * 2147483000), packed: false });
      KSFX.cut();
      drawSheet(ctx, p);
      count();
    });
    $id('kUndo').addEventListener('click', () => {
      if (!K.cookies.length) return;
      K.cookies.pop();
      SFX.pop();
      drawSheet(ctx);
      count();
    });
    drawSheet(ctx);
    count();
  }

  function paintNeedle() {
    const nd = $id('kNeedle');
    if (nd) nd.style.left = `calc(${Math.min(K.done, 1.3) / 1.3 * 100}% - 2px)`;
  }
  function takeOut(silent) {
    clearInterval(bakeTimer);
    bakeTimer = null;
    K.baking = false;
    K.baked = true;
    if (hum) { hum.stop(); hum = null; }
    const oven = $id('oven');
    if (oven) oven.classList.remove('on');
    if (silent) return;
    KSFX.door();
    const d = K.done;
    let msg = '앗, 조금 탔어요 😅 그래도 정성 가득!';
    if (d < 0.5) msg = '앗, 아직 말랑말랑해요… 그래도 귀여워요 😋';
    else if (d < 0.75) msg = '살짝 연한 쿠키가 됐어요 🍪';
    else if (d <= 1.05) msg = '완벽해요! 노릇노릇 🎉';
    const res = $id('kResult');
    if (res) res.textContent = msg;
    toast(msg);
    if (d >= 0.75 && d <= 1.05) SFX.jingle();
  }
  function stepBake() {
    stage.innerHTML = `<div class="oven" id="oven">
      <div class="oven-top"><div class="dial main"></div><div class="oven-lamp"></div><div class="dial"></div></div>
      <div class="oven-door"><div class="oven-window"><canvas id="ovenCv" width="${W}" height="${H}"></canvas><div class="oven-glow"></div></div><div class="oven-handle"></div></div>
    </div>`;
    controls.innerHTML = `<p class="tip">초록 점선 구간에서 꺼내면 딱 좋아요!</p>
      <div class="done-meter"><div class="zone"></div><div class="needle" id="kNeedle"></div></div>
      <div class="meter-labels"><span>말랑</span><span>노릇노릇</span><span>탐</span></div>
      <div class="row" style="margin-top:12px"><button class="btn primary" id="kBake">🔥 굽기 시작</button><button class="btn" id="kTake">🧤 꺼내기</button></div>
      <p class="tip" id="kResult"></p>` + NEXT;
    const oven = $id('oven');
    const ctx = $id('ovenCv').getContext('2d');
    drawTray(ctx, false, false);
    paintNeedle();
    if (K.baked) $id('kResult').textContent = '다 구웠어요! 다음 단계로 가요';
    $id('kBake').addEventListener('click', () => {
      if (K.baked) return toast('이미 구웠어요! 다음 단계로 가요');
      if (K.baking) return;
      K.baking = true;
      oven.classList.add('on');
      KSFX.door();
      hum = KSFX.hum();
      let n = 0;
      let dinged = false;
      bakeTimer = setInterval(() => {
        K.done += 0.012;
        n++;
        if (n % 5 === 0) KSFX.tick();
        if (!dinged && K.done >= 0.75) { dinged = true; KSFX.ding(); toast('띵! 지금이 딱 좋아요 🍪'); }
        drawTray(ctx, false, false);
        paintNeedle();
        if (K.done >= 1.3) takeOut();
      }, 100);
    });
    $id('kTake').addEventListener('click', () => {
      if (!K.baking) return toast(K.baked ? '이미 꺼냈어요' : '먼저 굽기를 시작해요');
      takeOut();
    });
  }

  function line(a, b, tool) {
    dctx.save();
    if (union) dctx.clip(union);
    if (tool.id === 'icing') { dctx.shadowColor = 'rgba(0,0,0,.25)'; dctx.shadowBlur = 1; dctx.shadowOffsetY = 1; }
    dctx.strokeStyle = tool.color;
    dctx.lineWidth = tool.size;
    dctx.lineCap = 'round';
    dctx.lineJoin = 'round';
    dctx.beginPath();
    dctx.moveTo(a.x, a.y);
    dctx.lineTo(b.x, b.y);
    dctx.stroke();
    dctx.restore();
  }
  function sprinkle(p) {
    const cols = ['#ff6b8a', '#ffd23f', '#5ec4ff', '#7ddc6f', '#b47cff', '#ffffff'];
    dctx.save();
    if (union) dctx.clip(union);
    for (let i = 0; i < 10; i++) {
      dctx.save();
      dctx.translate(p.x + (Math.random() - 0.5) * 26, p.y + (Math.random() - 0.5) * 26);
      dctx.rotate(Math.random() * Math.PI);
      dctx.fillStyle = cols[i % cols.length];
      dctx.beginPath();
      dctx.roundRect(-3, -1.2, 6, 2.4, 1.2);
      dctx.fill();
      dctx.restore();
    }
    dctx.restore();
  }
  deco.addEventListener('pointerdown', e => {
    if (K.step !== 5) return;
    deco.setPointerCapture(e.pointerId);
    const p = ptr(e, deco);
    const tool = TOOLS.find(t => t.id === K.tool);
    if (tool.id === 'sprinkle') { sprinkle(p); KSFX.sprinkle(); drawing = { sprinkle: true }; return; }
    drawing = p;
    line(p, { x: p.x + 0.1, y: p.y }, tool);
  });
  deco.addEventListener('pointermove', e => {
    if (!drawing || K.step !== 5) return;
    const p = ptr(e, deco);
    const tool = TOOLS.find(t => t.id === K.tool);
    if (drawing.sprinkle) { throttle(120, () => { sprinkle(p); KSFX.sprinkle(); }); return; }
    line(drawing, p, tool);
    drawing = p;
    throttle(90, () => KSFX.squeeze());
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => deco.addEventListener(ev, () => { drawing = null; }));

  function stepDeco() {
    stage.innerHTML = `<div class="deco-wrap" id="decoWrap"><canvas id="trayCv" class="k-layer" width="${W}" height="${H}"></canvas></div>`;
    $id('decoWrap').append(deco);
    drawTray($id('trayCv').getContext('2d'), false, false);
    union = new Path2D();
    K.cookies.forEach(c => union.addPath(cookiePath(c.shape, c.x, c.y)));
    controls.innerHTML = `<div class="row" id="kTools"></div><button class="btn" id="kClearDeco">🧽 다 지우기</button>` + NEXT;
    TOOLS.forEach((t, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (K.tool === t.id ? ' on' : '');
      b.textContent = t.label;
      b.addEventListener('click', () => {
        K.tool = t.id;
        SFX.plink(i + 2);
        $$('#kTools .chip').forEach(x => x.classList.toggle('on', x === b));
      });
      $id('kTools').append(b);
    });
    $id('kClearDeco').addEventListener('click', () => { dctx.clearRect(0, 0, W, H); SFX.paper(); });
  }

  function stepPack() {
    stage.innerHTML = `<div class="deco-wrap"><canvas id="packCv" class="k-layer" width="${W}" height="${H}"></canvas></div>`;
    controls.innerHTML = `<p class="tip">선물 봉지에 넣을 쿠키를 콕 눌러요. 봉지에는 간식까지 합쳐 최대 6개가 들어가요.</p>
      <p class="tip" id="kLeft"></p>
      <button class="btn" id="kAgain" style="width:100%">🔄 새로 굽기</button>
      <button class="btn primary big" id="kFinish">다 됐어요! 책상으로 →</button>`;
    const cv = $id('packCv');
    const ctx = cv.getContext('2d');
    const left = () => {
      const n = K.cookies.filter(c => !c.packed).length;
      $id('kLeft').textContent = `쟁반에 남은 쿠키 ${n}개 · 봉지 ${S.gifts.length}/6`;
    };
    const hit = p => K.cookies.find(c => !c.packed && ctx.isPointInPath(cookiePath(c.shape, c.x, c.y), p.x, p.y));
    cv.addEventListener('pointermove', e => { cv.style.cursor = hit(ptr(e, cv)) ? 'pointer' : 'default'; });
    cv.addEventListener('click', e => {
      const c = hit(ptr(e, cv));
      if (!c) return;
      if (S.wrapped) return toast('봉지 포장을 먼저 풀어주세요 🎀');
      if (S.gifts.length >= 6) return toast('봉지가 꽉 찼어요!');
      S.gifts.push('img:' + cookieImage(c));
      c.packed = true;
      renderGift(S.gifts.length - 1);
      KSFX.plop();
      SFX.plink(Math.floor(Math.random() * 8));
      toast('봉지에 쏙! 🍪');
      drawTray(ctx, true, true);
      left();
    });
    $id('kAgain').addEventListener('click', () => { reset(); SFX.paper(); render(); });
    $id('kFinish').addEventListener('click', close);
    drawTray(ctx, true, true);
    left();
  }

  function giftNode(g) {
    const sp = document.createElement('span');
    if (g.startsWith('img:')) {
      const im = document.createElement('img');
      im.className = 'cookie-img';
      im.src = g.slice(4);
      im.alt = '쿠키';
      sp.className = 'is-cookie';
      sp.append(im);
    } else {
      sp.textContent = g;
    }
    return sp;
  }

  renderGift = function (newIndex) {
    bag.classList.toggle('hidden', !S.gifts.length);
    bag.classList.toggle('wrapped', S.wrapped);
    bag.style.setProperty('--ribbon', S.ribbon);
    const items = $('#giftItems');
    items.innerHTML = '';
    S.gifts.forEach((g, i) => {
      const sp = giftNode(g);
      if (i === newIndex) sp.classList.add('new');
      sp.addEventListener('click', e => {
        if (S.wrapped) return;
        e.stopPropagation();
        S.gifts.splice(i, 1);
        SFX.pop();
        renderGift();
      });
      items.append(sp);
    });
    $('#wrapBtn').textContent = S.wrapped ? '포장 풀기' : '비닐로 포장하기 🎀';
  };

  stageLetter = function (L) {
    const st = $('#openStage');
    const paperColor = PAPERS[L.paper] || PAPERS.cream;
    st.innerHTML = `<p class="hint">${L.createdAt}의 내가 보낸 편지 💌</p>` +
      `<div class="open-layout">` +
      `<div class="paper read" style="--paper:${paperColor}">` +
      `<div class="paper-head">To. 미래의 나</div>` +
      `<div class="read-text"></div>` +
      `<div class="paper-foot">From. ${L.createdAt}의 나</div>` +
      `</div><div class="open-side"></div></div>`;
    st.querySelector('.read-text').textContent = L.text;
    const side = st.querySelector('.open-side');
    if (L.image) {
      side.insertAdjacentHTML('beforeend', `<div class="polaroid static"><div class="tape"></div><img src="${L.image}"></div>`);
    }
    if (L.gifts && L.gifts.length) {
      const g = document.createElement('div');
      g.className = 'gift-bag static wrapped';
      g.title = '눌러서 포장 풀기';
      g.style.setProperty('--ribbon', L.ribbon);
      g.innerHTML = `<div class="gift-items"></div><div class="vinyl"></div><div class="ribbon"></div>`;
      const gi = g.querySelector('.gift-items');
      L.gifts.forEach(x => gi.append(giftNode(x)));
      g.addEventListener('click', () => {
        g.classList.remove('wrapped');
        g.classList.add('unwrapped');
        SFX.crinkle(0.9);
        setTimeout(() => SFX.candy(), 350);
        setTimeout(() => SFX.jingle(), 700);
        toast('과거의 내가 준 선물이에요 🎁');
      }, { once: true });
      side.append(g);
    }
  };

  reset();
  const PLATE_MAX = 8;
  const LINES = ['바삭! 🍪', '음~ 고소해', '차랑 찰떡궁합 ☕', '하나만 더…?'];
  const loadPlate = () => { try { return JSON.parse(localStorage.getItem('plate') || '[]'); } catch (e) { return []; } };
  const savePlate = p => { try { localStorage.setItem('plate', JSON.stringify(p)); return true; } catch (e) { toast('접시에 더 못 담아요'); return false; } };
  let packTo = 'bag';

  const plateCss = document.createElement('style');
  plateCss.textContent = `
    .cookie-plate { position: absolute; left: 3%; top: 36%; width: 220px; height: 130px; z-index: 3; cursor: grab; touch-action: none; user-select: none; }
    .cookie-plate.dragging { cursor: grabbing; }
    .plate-dish { position: absolute; left: 0; right: 0; bottom: 0; height: 74px; border-radius: 50%; background: radial-gradient(ellipse at 50% 45%, #fff 0 48%, #eef3f8 49% 56%, #fff 57% 64%, #dfe7ef 100%); box-shadow: 0 10px 16px rgba(0,0,0,.35), inset 0 -4px 8px rgba(0,0,0,.08); }
    .plate-dish::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; border: 2px dotted rgba(122,156,196,.6); }
    .plate-cookie { position: absolute; width: 74px; height: 74px; cursor: pointer; filter: drop-shadow(0 3px 2px rgba(0,0,0,.3)); transition: transform .15s; }
    .plate-cookie:hover { transform: rotate(var(--r)) translateY(-5px) !important; }
    .plate-cookie.bite1 { -webkit-mask-image: radial-gradient(circle at 88% 18%, transparent 0 22%, #000 23%); mask-image: radial-gradient(circle at 88% 18%, transparent 0 22%, #000 23%); }
    .plate-cookie.bite2 { -webkit-mask-image: radial-gradient(circle at 88% 18%, transparent 0 22%, #000 23%), radial-gradient(circle at 14% 82%, transparent 0 22%, #000 23%); -webkit-mask-composite: source-in; mask-image: radial-gradient(circle at 88% 18%, transparent 0 22%, #000 23%), radial-gradient(circle at 14% 82%, transparent 0 22%, #000 23%); mask-composite: intersect; }
    .crumb { position: absolute; width: 5px; height: 4px; border-radius: 2px; background: #c98f52; z-index: 3; pointer-events: none; animation: crumb .6s ease-in forwards; }
    @keyframes crumb { to { transform: translate(var(--dx), 28px); opacity: 0; } }
  `;
  document.head.append(plateCss);

  const plate = document.createElement('div');
  plate.className = 'cookie-plate hidden';
  plate.title = '쿠키를 누르면 냠, 접시를 끌면 옮기기';
  plate.innerHTML = '<div class="plate-dish"></div><div class="plate-cookies"></div>';
  $('#scene').append(plate);
  try {
    const pp = JSON.parse(localStorage.getItem('platePos') || 'null');
    if (pp) { plate.style.left = pp.x + '%'; plate.style.top = pp.y + '%'; }
  } catch (e) {}

  function renderPlate() {
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
  function toPlate(cs) {
    const items = loadPlate();
    if (items.length >= PLATE_MAX) { toast('접시가 꽉 찼어요!'); return false; }
    cs.forEach(c => {
      if (items.length >= PLATE_MAX) return;
      items.push({ src: cookieImage(c), bites: 0, r: Math.round(Math.random() * 40 - 20) });
      c.packed = true;
    });
    if (!savePlate(items)) return false;
    renderPlate();
    return true;
  }
  function moveLeftovers() {
    if (K.step !== 6) return;
    const rest = K.cookies.filter(c => !c.packed);
    if (rest.length && toPlate(rest)) toast('남은 쿠키는 접시에 담아뒀어요 🍪');
  }
  function eat(i, el) {
    const items = loadPlate();
    const it = items[i];
    if (!it) return;
    it.bites = (it.bites || 0) + 1;
    KSFX.crack();
    setTimeout(() => KSFX.sprinkle(), 90);
    for (let n = 0; n < 6; n++) {
      const cr = document.createElement('i');
      cr.className = 'crumb';
      cr.style.left = (el.offsetLeft + 30 + Math.random() * 20) + 'px';
      cr.style.top = (el.offsetTop + 30 + Math.random() * 20) + 'px';
      cr.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
      plate.append(cr);
      setTimeout(() => cr.remove(), 650);
    }
    if (it.bites >= 3) { items.splice(i, 1); toast('냠, 다 먹었다! 😋'); }
    else toast(LINES[Math.floor(Math.random() * LINES.length)]);
    savePlate(items);
    setTimeout(renderPlate, 120);
  }

  let ps = null;
  plate.addEventListener('pointerdown', e => {
    plate.setPointerCapture(e.pointerId);
    ps = { x: e.clientX, y: e.clientY, l: plate.offsetLeft, t: plate.offsetTop, moved: false, target: e.target };
  });
  plate.addEventListener('pointermove', e => {
    if (!ps) return;
    const dx = e.clientX - ps.x;
    const dy = e.clientY - ps.y;
    if (!ps.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
    ps.moved = true;
    plate.classList.add('dragging');
    const sc = $('#scene');
    plate.style.left = (Math.max(0, Math.min(sc.clientWidth - plate.offsetWidth, ps.l + dx)) / sc.clientWidth * 100) + '%';
    plate.style.top = (Math.max(0, Math.min(sc.clientHeight - plate.offsetHeight, ps.t + dy)) / sc.clientHeight * 100) + '%';
  });
  plate.addEventListener('pointerup', () => {
    if (!ps) return;
    plate.classList.remove('dragging');
    if (ps.moved) {
      localStorage.setItem('platePos', JSON.stringify({ x: parseFloat(plate.style.left), y: parseFloat(plate.style.top) }));
      KSFX.clink();
    } else if (ps.target.classList.contains('plate-cookie')) {
      eat(Number(ps.target.dataset.i), ps.target);
    }
    ps = null;
  });
  plate.addEventListener('pointercancel', () => { ps = null; plate.classList.remove('dragging'); });

  const baseStepPack = stepPack;
  stepPack = function () {
    baseStepPack();
    const cv = document.getElementById('packCv');
    const ctx = cv.getContext('2d');
    const row = document.createElement('div');
    row.className = 'row';
    [['bag', '🎁 봉지'], ['plate', '🍽 접시']].forEach(([v, label]) => {
      const b = document.createElement('button');
      b.className = 'chip' + (packTo === v ? ' on' : '');
      b.textContent = label;
      b.addEventListener('click', () => {
        packTo = v;
        SFX.plink(v === 'bag' ? 2 : 5);
        row.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
      });
      row.append(b);
    });
    controls.prepend(row);
    cv.addEventListener('click', e => {
      if (packTo !== 'plate') return;
      e.stopImmediatePropagation();
      const p = ptr(e, cv);
      const c = K.cookies.find(x => !x.packed && ctx.isPointInPath(cookiePath(x.shape, x.x, x.y), p.x, p.y));
      if (!c || !toPlate([c])) return;
      drawTray(ctx, true, true);
      const left = document.getElementById('kLeft');
      if (left) left.textContent = `쟁반에 남은 쿠키 ${K.cookies.filter(x => !x.packed).length}개`;
      KSFX.plop();
      toast('접시에 쏙! 🍽');
    }, true);
    
  };
  DEFS[5].fn = stepPack;
  
  window.renderPlate = renderPlate;
  
  renderPlate();
  console.log('✅ bake.js 준비 완료!');
})();