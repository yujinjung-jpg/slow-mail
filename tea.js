(() => {
  const TEAS = [
    { id: 'earl', name: '얼그레이', color: '#8a4b2a', tag: '#3d5a8a', note: '베르가못 향이 은은해요' },
    { id: 'chamo', name: '캐모마일', color: '#d9a93a', tag: '#f2c94c', note: '마음이 포근해지는 꽃차' },
    { id: 'mint', name: '페퍼민트', color: '#9cbf6a', tag: '#4caf7a', note: '머리가 맑아지는 화한 맛' },
    { id: 'hibi', name: '히비스커스', color: '#b8283f', tag: '#e05a7a', note: '새콤하고 예쁜 루비색' },
    { id: 'barley', name: '보리차', color: '#a8692e', tag: '#c9a46a', note: '구수하고 편안한 맛' },
    { id: 'rooi', name: '루이보스', color: '#b5502a', tag: '#d9733a', note: '카페인 없이 달큰해요' }
  ];
  const CUPS = [
    { id: 'tea', name: '🍵 유리 찻잔', note: '투명하고 우아한 잔' },
    { id: 'mug', name: '🩷 핑크 머그', note: '두툼하고 포근한 머그' },
    { id: 'tumbler', name: '🥛 키 큰 유리컵', note: '아이스에 딱!' },
    { id: 'vintage', name: '🌸 빈티지 찻잔', note: '금테 두른 꽃무늬 잔' }
  ];
  const ADDS = [
    { id: 'honey', label: '🍯 꿀 한 스푼' },
    { id: 'lemon', label: '🍋 레몬 한 조각' },
    { id: 'sugar', label: '🧊 각설탕' }
  ];
  const STEPS = ['잔 고르기', '물 끓이기', '차 고르기', '물 붓기', '우리기', '마시기'];
  const COZY = ['후— 따뜻해 ☺️', '마음이 차분해졌어요', '이제 편지 쓸 기분이 나요 ✍️', '향이 참 좋다…', '한 모금의 여유 🍃'];
  const COLD = ['시원하다~ 🧊', '얼음이 달그락달그락', '머리까지 상쾌해요 ✨', '꿀꺽, 한 모금 더!'];
  const T = {};
  let timer = null;
  let whistle = null;
  let pourLoop = null;
  let pourTimer = null;
  const $id = id => document.getElementById(id);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const bump = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const NEXT = '<button class="btn primary big" id="tNext">다음 →</button>';

  const style = document.createElement('style');
  style.textContent = `
    .straw { display: none; position: absolute; left: 112px; bottom: 50px; width: 9px; height: 160px; border-radius: 4px; z-index: 3; transform: rotate(12deg); transform-origin: 50% 100%; background: repeating-linear-gradient(-45deg, #ff7fa0 0 6px, #fff 6px 12px); box-shadow: 1px 0 2px rgba(0,0,0,.2); }
    .cup-zone.iced.cz-tumbler .straw, .cup-zone.iced.cz-mug .straw { display: block; }
    .cz-mug .cup { left: 30px; width: 130px; height: 118px; border-radius: 8px 8px 24px 24px; border-color: rgba(255,200,215,.85); background: linear-gradient(90deg, rgba(255,190,210,.5), rgba(255,215,228,.18) 30%, rgba(255,215,228,.12) 70%, rgba(255,190,210,.45)); }
    .cz-mug .cup::before { content: '♥'; position: absolute; left: 50%; top: 34px; transform: translateX(-50%); font-size: 30px; color: rgba(255,110,150,.55); z-index: 3; }
    .cz-mug .rim { left: 30px; width: 130px; bottom: 136px; border-color: rgba(255,200,215,.9); }
    .cz-mug .cup-handle { left: 150px; bottom: 50px; width: 50px; height: 70px; border-width: 10px; border-color: rgba(255,200,215,.85); }
    .cz-mug .saucer, .cz-tumbler .saucer { left: 15px; width: 170px; height: 26px; bottom: 14px; background: radial-gradient(ellipse at 50% 40%, #e2c79c, #c49a63 70%, #a87d48); }
    .cz-tumbler .cup { left: 45px; width: 100px; height: 130px; border-radius: 4px 4px 16px 16px; background: linear-gradient(90deg, rgba(225,240,255,.45), rgba(255,255,255,.08) 30%, rgba(255,255,255,.05) 70%, rgba(225,240,255,.4)); }
    .cz-tumbler .rim { left: 45px; width: 100px; bottom: 148px; height: 18px; }
    .cz-tumbler .cup-handle { display: none; }
    .cz-vintage .cup { left: 5px; width: 180px; height: 84px; border-color: #d9b75a; border-radius: 6px 6px 90px 90px / 6px 6px 70px 70px; }
    .cz-vintage .cup::before { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(#d9b75a 0 4px, transparent 4px), radial-gradient(circle, rgba(240,130,165,.6) 3px, transparent 4px) 0 10px / 26px 22px, rgba(255,255,255,.38); }
    .cz-vintage .rim { left: 5px; width: 180px; bottom: 100px; height: 24px; border-color: #d9b75a; }
    .cz-vintage .cup-handle { left: 176px; bottom: 50px; width: 34px; height: 42px; border-width: 6px; border-color: #d9b75a; }
    .cup.cold::after { content: ''; position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: .85; background: radial-gradient(circle, rgba(255,255,255,.8) 1.3px, transparent 2px) 0 0 / 14px 17px, radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1.7px) 7px 9px / 14px 17px; }
    .ice-cube { position: absolute; width: 28px; height: 26px; border-radius: 6px; z-index: 2; background: linear-gradient(135deg, rgba(255,255,255,.8), rgba(215,238,255,.35) 60%, rgba(255,255,255,.55)); border: 1.5px solid rgba(255,255,255,.85); box-shadow: inset -3px -3px 6px rgba(150,195,230,.4); transform: rotate(var(--r)); animation: iceBob 3s ease-in-out infinite; }
    .ice-cube.drop { animation: iceDrop .5s cubic-bezier(.3,1.4,.5,1), iceBob 3s ease-in-out .5s infinite; }

    .desk-cup { left: 3%; top: 4%; touch-action: none; }
    .desk-cup.view-side { width: 170px; height: 170px; }
    .desk-cup.view-top { width: 168px; height: 168px; }
    .desk-cup.view-side .dc-top, .desk-cup.view-top .dc-side { display: none; }
    .desk-cup.dragging { filter: drop-shadow(0 14px 12px rgba(0,0,0,.4)); cursor: grabbing; }
    .dc-side { position: absolute; inset: 0; }
    .desk-cup .cup-zone { position: absolute; left: 0; top: 0; bottom: auto; transform: scale(.85); transform-origin: 0 0; }
    .desk-cup .cup-zone.sipping { animation: sipTiltDesk .6s; }
    .dc-top { position: absolute; left: 0; top: 0; width: 140px; height: 140px; transform: scale(1.2); transform-origin: 0 0; }
    .dc-top.sip { animation: tdSipTop .5s; }
    .td-saucer { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, #fff 0 52%, #efe6d6 53% 64%, #fff 65% 72%, #e3d6bf 100%); box-shadow: 0 8px 14px rgba(0,0,0,.35); }
    .td-mug .td-saucer, .td-tumbler .td-saucer { inset: 14px; background: radial-gradient(circle, #e2c79c, #c49a63 75%, #a87d48); }
    .td-vintage .td-saucer { background: radial-gradient(circle, rgba(240,130,165,.6) 2.5px, transparent 3.5px) 0 0 / 17px 17px, radial-gradient(circle, #fff 0 52%, #d9b75a 53% 55%, #fff 56% 72%, #e3d6bf 100%); }
    .desk-cup.iced .td-saucer::after { content: ''; position: absolute; inset: 20%; border-radius: 50%; border: 3px solid rgba(170,205,235,.45); }
    .td-handle { position: absolute; left: calc(50% + 38px); top: calc(50% - 11px); width: 34px; height: 22px; border-radius: 4px 12px 12px 4px; background: rgba(235,245,255,.92); box-shadow: 0 3px 4px rgba(0,0,0,.2); }
    .td-mug .td-handle { background: #f7b9c9; width: 38px; height: 26px; top: calc(50% - 13px); }
    .td-vintage .td-handle { background: #fffaf2; border: 2px solid #d9b75a; left: calc(50% + 44px); }
    .td-tumbler .td-handle { display: none; }
    .td-rim { position: absolute; left: 50%; top: 50%; width: 92px; height: 92px; transform: translate(-50%, -50%); border-radius: 50%; padding: 6px; background: rgba(235,245,255,.88); box-shadow: 0 4px 6px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.9); }
    .td-mug .td-rim { width: 88px; height: 88px; padding: 8px; background: #f7b9c9; }
    .td-tumbler .td-rim { width: 74px; height: 74px; padding: 4px; background: rgba(225,240,255,.88); }
    .td-vintage .td-rim { width: 104px; height: 104px; padding: 7px; background: radial-gradient(circle, #fffaf2 0 86%, #d9b75a 87% 92%, #fffaf2 93%); }
    .desk-cup.iced .td-rim::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 3px dotted rgba(225,242,255,.95); pointer-events: none; }
    .td-inner { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: radial-gradient(circle, rgba(255,255,255,.25), rgba(190,205,220,.55)); box-shadow: inset 0 4px 10px rgba(0,0,0,.25); }
    .td-mug .td-inner { background: radial-gradient(circle, #fff1f5, #f4c6d3); }
    .td-vintage .td-inner { background: radial-gradient(circle, #fffdf8, #efe4d0); }
    .td-liquid { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 50%; overflow: hidden; box-shadow: inset 0 0 10px rgba(0,0,0,.28); transition: width .4s, height .4s, background 1s; }
    .td-liquid::before { content: ''; position: absolute; left: 16%; top: 12%; width: 42%; height: 22%; border-radius: 50%; background: rgba(255,255,255,.35); transform: rotate(-25deg); filter: blur(1px); z-index: 2; }
    .td-liquid.ripple::after { content: ''; position: absolute; left: 40%; top: 40%; width: 20%; height: 20%; border-radius: 50%; border: 2px solid rgba(255,255,255,.65); animation: ripple .7s ease-out forwards; z-index: 3; }
    .td-extras { position: absolute; inset: 0; }
    .td-ice { position: absolute; width: 28%; height: 28%; border-radius: 18%; background: linear-gradient(135deg, rgba(255,255,255,.88), rgba(210,235,255,.4)); border: 1.5px solid rgba(255,255,255,.95); box-shadow: inset -2px -2px 4px rgba(150,190,220,.45), 0 1px 2px rgba(0,0,0,.15); }
    .td-lemon { position: absolute; left: 38%; top: 34%; width: 42%; height: 42%; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,.2); background: radial-gradient(circle, transparent 0 58%, #fff3b0 59% 66%, #f2c400 67%), repeating-conic-gradient(#ffe25a 0 26deg, #fffbd6 26deg 30deg); }
    .td-straw { position: absolute; left: 60%; top: 16%; width: 18%; height: 18%; border-radius: 50%; box-shadow: 0 2px 3px rgba(0,0,0,.3); background: radial-gradient(circle, #6b4a2e 0 35%, transparent 36%), repeating-conic-gradient(#ff7fa0 0 30deg, #fff 30deg 60deg); }
    .td-steam { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 1s; }
    .td-steam.on { opacity: 1; }
    .td-steam i { position: absolute; left: 50%; top: 50%; width: 44px; height: 44px; margin: -22px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.6), transparent 70%); animation: tdSteam 3s ease-out infinite; }
    .td-steam i:nth-child(2) { animation-delay: 1s; }
    .td-steam i:nth-child(3) { animation-delay: 2s; }
    @keyframes iceBob { 0%, 100% { transform: rotate(var(--r)) translateY(0); } 50% { transform: rotate(calc(var(--r) + 6deg)) translateY(3px); } }
    @keyframes iceDrop { from { transform: rotate(var(--r)) translateY(-130px); } to { transform: rotate(var(--r)) translateY(0); } }
    @keyframes sipTiltDesk { 0%, 100% { transform: scale(.85); } 50% { transform: scale(.85) rotate(-8deg) translateY(-10px); } }
    @keyframes tdSipTop { 0%, 100% { transform: scale(1.2); } 50% { transform: scale(1.2) rotate(-6deg); } }
    @keyframes tdSteam { 0% { transform: scale(.4); opacity: 0; } 30% { opacity: .85; } 100% { transform: scale(2.2) translate(8px, -18px); opacity: 0; } }
    @keyframes ripple { to { transform: scale(5); opacity: 0; } }
  `;
  document.head.append(style);

  const cupZone = (p, withBag) => `<div class="cup-zone cz-tea" id="${p}Zone">
      <div class="cup-handle"></div>
      <div class="saucer"></div>
      <div class="cup"><div class="tea-cloud"></div><div class="liquid" id="${p}Liquid"><div class="surface"></div></div></div>
      <div class="rim"></div>
      <div class="straw"></div>
      ${withBag ? '<div class="teabag away" id="tBag"><div class="string"></div><div class="string2"></div><div class="tag" id="tTag"></div><div class="bag"></div></div>' : ''}
      <div class="cup-steam" id="${p}Steam"><i></i><i></i><i></i></div>
    </div>`;

  const root = document.createElement('div');
  root.className = 'studio tea-room hidden';
  root.innerHTML = `<button class="close" id="tClose">✕</button>
    <div class="studio-stage">
      <div class="tea-scene">
        <div class="thermo"><div class="thermo-track"><i id="tBar"></i></div><span id="tText">20°C</span></div>
        <div class="stove"><div class="burner"><div class="gas" id="tGas"></div></div><div class="knob" id="tKnob"></div></div>
        <div class="kettle" id="tKettle">
          <div class="k-handle"></div><div class="k-lid"></div><div class="k-spout"></div>
          <div class="k-body"><div class="k-face" id="tFace">◡ ᴗ ◡</div></div>
          <div class="k-steam" id="tPuffs"></div>
        </div>
        <div class="stream" id="tStream"></div>
        ${cupZone('t', true)}
      </div>
    </div>
    <aside class="panel studio-panel">
      <div class="k-steps" id="tSteps"></div>
      <h2 id="tTitle"></h2>
      <p class="tip" id="tTip"></p>
      <div id="tControls"></div>
    </aside>`;
  document.body.append(root);

  const deskCup = document.createElement('div');
  deskCup.className = 'desk-cup view-side hidden';
  deskCup.title = '누르면 호로록, 끌면 옮기기';
  deskCup.innerHTML = `<div class="dc-side">${cupZone('d', false)}</div>
    <div class="dc-top" id="dTop"><div class="td-saucer"></div><div class="td-handle"></div>
      <div class="td-rim"><div class="td-inner"><div class="td-liquid" id="dTdLiquid"><div class="td-extras" id="dTdExtras"></div></div></div></div>
      <div class="td-steam" id="dTdSteam"><i></i><i></i><i></i></div>
    </div>`;
  const scene = $('#scene');
  scene.append(deskCup);
  try {
    const pos = JSON.parse(localStorage.getItem('cupPos') || 'null');
    if (pos) { deskCup.style.left = pos.x + '%'; deskCup.style.top = pos.y + '%'; }
  } catch (e) {}

  const teaBtn = document.createElement('button');
  teaBtn.className = 'mute';
  teaBtn.title = '티타임';
  teaBtn.textContent = '☕';
  $('#muteBtn').before(teaBtn);

  function reset() {
    Object.assign(T, { step: 1, cup: 'tea', iced: false, temp: 20, fire: false, boiled: false, tea: null, fill: 0, steep: 0, bagIn: false, adds: [], ices: [] });
  }
  const teaOf = id => TEAS.find(t => t.id === id);
  function teaColor(id, steep) {
    const t = teaOf(id);
    const p = Math.round(Math.min(100, steep) * 0.85);
    return t ? `color-mix(in srgb, ${t.color} ${p}%, rgba(215,235,255,.45))` : 'rgba(215,235,255,.45)';
  }
  function paintIce(liq, ices) {
    let have = liq.querySelectorAll('.ice-cube');
    let drop = true;
    if (have.length > ices.length) { have.forEach(e => e.remove()); have = []; drop = false; }
    for (let i = have.length; i < ices.length; i++) {
      const ic = ices[i];
      const el = document.createElement('div');
      el.className = 'ice-cube' + (drop ? ' drop' : '');
      el.style.left = ic.x + '%';
      el.style.top = (-14 + (i % 2) * 16) + 'px';
      el.style.setProperty('--r', ic.r + 'deg');
      liq.append(el);
    }
  }
  function paintCupInto(p, s) {
    const zone = $id(p + 'Zone');
    const liq = $id(p + 'Liquid');
    const ices = s.ices || [];
    const adds = s.adds || [];
    const cold = ices.length > 0;
    CUPS.forEach(c => zone.classList.toggle('cz-' + c.id, (s.cup || 'tea') === c.id));
    zone.classList.toggle('iced', cold);
    const cupEl = zone.querySelector('.cup');
    cupEl.classList.toggle('cold', cold);
    cupEl.classList.toggle('steeping', !!s.bagIn && s.fill > 0);
    liq.style.height = (s.fill * 0.9) + '%';
    liq.style.background = teaColor(s.tea, s.steep);
    const hasLemon = adds.includes('lemon');
    let lemon = liq.querySelector('.lemon');
    if (hasLemon && !lemon) { lemon = document.createElement('div'); lemon.className = 'lemon'; liq.append(lemon); }
    if (!hasLemon && lemon) lemon.remove();
    paintIce(liq, ices);
    const t = teaOf(s.tea);
    cupEl.style.setProperty('--teac', t ? t.color : 'transparent');
    $id(p + 'Steam').classList.toggle('on', s.fill > 0 && !cold && s.hot !== false);
  }

  function paint() {
    $id('tBar').style.width = ((T.temp - 20) / 80 * 100) + '%';
    $id('tText').textContent = Math.round(T.temp) + '°C';
    $id('tGas').classList.toggle('on', T.fire);
    $id('tKnob').classList.toggle('on', T.fire);
    const k = $id('tKettle');
    k.classList.toggle('shiver', T.fire && T.temp > 85);
    k.classList.toggle('boil', T.fire && T.boiled);
    $id('tFace').textContent = T.fire && T.boiled ? '> ᴗ <' : (T.fire ? '◕ ᴗ ◕' : '◡ ᴗ ◡');
    paintCupInto('t', T);
    $id('tBag').classList.toggle('away', !T.bagIn);
    const t = teaOf(T.tea);
    if (t) $id('tTag').style.background = t.tag;
    const st = $id('tState');
    if (st) st.textContent = T.boiled ? '물이 다 끓었어요! 불을 끄고 다음으로 가요' : (T.fire ? `물 데우는 중… ${Math.round(T.temp)}°C` : '불을 켜서 물을 끓여요');
    const fireBtn = $id('tFire');
    if (fireBtn) fireBtn.textContent = T.fire ? '🧯 불 끄기' : '🔥 불 켜기';
    const fb = $id('tFillBar');
    if (fb) fb.style.width = Math.min(100, T.fill / 95 * 100) + '%';
    const sx = $id('tSteepText');
    if (sx) {
      const lv = T.steep < 35 ? '연하게' : (T.steep < 75 ? '적당히' : '진하게');
      sx.textContent = T.bagIn ? `우린 지 ${(T.steep / 100 * 5).toFixed(1)}분 · ${lv}` : `티백을 꺼냈어요 · ${lv}`;
    }
    const nd = $id('tNeedle');
    if (nd) nd.style.left = `calc(${T.steep}% - 2px)`;
  }

  function puffKettle() {
    const p = document.createElement('div');
    p.className = 'puff';
    $id('tPuffs').append(p);
    setTimeout(() => p.remove(), 1500);
  }
  function tick() {
    if (T.fire) {
      T.temp = Math.min(100, T.temp + 1.2);
      if (T.temp > 55 && Math.random() < (T.temp - 55) / 60) KSFX.bubble((T.temp - 55) / 45);
      if (T.temp >= 100) {
        if (!T.boiled) { T.boiled = true; toast('삐익~ 물이 끓었어요! 불을 꺼주세요 🔥'); }
        if (!whistle) whistle = KSFX.whistle();
        if (Math.random() < 0.4) puffKettle();
      }
    }
    if (T.step === 5 && T.bagIn && T.fill > 0) T.steep = Math.min(100, T.steep + 0.45);
    paint();
  }

  function setFire(on) {
    if (on === T.fire) return;
    T.fire = on;
    if (on) {
      KSFX.tick();
      setTimeout(() => KSFX.tick(), 120);
      setTimeout(() => KSFX.fire(), 260);
    } else {
      KSFX.tick();
      if (whistle) { whistle.stop(); whistle = null; }
    }
    paint();
  }
  $id('tKnob').addEventListener('click', () => setFire(!T.fire));

  function stopPour() {
    clearInterval(pourTimer);
    clearTimeout(pourTimer);
    pourTimer = null;
    if (pourLoop) { pourLoop.stop(); pourLoop = null; }
    const k = $id('tKettle');
    k.classList.remove('tilt');
    $id('tStream').classList.remove('on');
    setTimeout(() => { if (!pourTimer) k.classList.remove('pour'); }, 250);
  }
  function takeBagOut() {
    T.bagIn = false;
    KSFX.dunk();
    setTimeout(() => SFX.drip(), 300);
    setTimeout(() => SFX.drip(), 600);
    paint();
  }
  function sip() {
    if (T.fill <= 0) return toast('다 마셨어요! 한 잔 더 끓여볼까요? 🫖');
    if (T.bagIn) takeBagOut();
    T.fill = Math.max(0, T.fill - 18);
    KSFX.sip();
    if (T.ices.length) setTimeout(() => KSFX.iceRattle(), 300);
    bump($id('tZone'), 'sipping');
    paint();
    if (T.fill <= 0) { setTimeout(() => SFX.jingle(), 500); toast('잘 마셨습니다 🍵'); }
    else {
      const lines = T.ices.length ? COLD : COZY;
      toast(lines[Math.floor(Math.random() * lines.length)]);
    }
  }
  function addEffect(id) {
    const liq = $id('tLiquid');
    if (id === 'honey') {
      const h = document.createElement('div');
      h.className = 'honey';
      liq.append(h);
      SFX.drip();
      setTimeout(() => SFX.drip(), 200);
      setTimeout(() => h.remove(), 3000);
      T.steep = Math.min(100, T.steep + 4);
    }
    if (id === 'lemon') KSFX.plop();
    if (id === 'sugar') {
      const s = document.createElement('div');
      s.className = 'sugar';
      liq.append(s);
      setTimeout(() => KSFX.plop(), 600);
      setTimeout(() => s.remove(), 2600);
    }
    paint();
  }

  function bindCup() {
    CUPS.forEach(c => {
      const b = document.createElement('button');
      b.className = 'tea-card' + (T.cup === c.id ? ' on' : '');
      b.innerHTML = `<b>${c.name}</b><small>${c.note}</small>`;
      b.addEventListener('click', () => {
        T.cup = c.id;
        KSFX.clink();
        $$('#tCups .tea-card').forEach(x => x.classList.toggle('on', x === b));
        paint();
      });
      $id('tCups').append(b);
    });
    [{ v: false, label: '☕ 따뜻하게' }, { v: true, label: '🧊 시원하게' }].forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (T.iced === o.v ? ' on' : '');
      b.textContent = o.label;
      b.addEventListener('click', () => {
        T.iced = o.v;
        SFX.plink(i ? 6 : 2);
        $$('#tTemp .chip').forEach(x => x.classList.toggle('on', x === b));
        if (o.v && T.cup === 'tea') toast('아이스는 키 큰 유리컵이나 머그가 잘 어울려요 🥛');
      });
      $id('tTemp').append(b);
    });
  }
  function bindBoil() { $id('tFire').addEventListener('click', () => setFire(!T.fire)); }
  function bindPick() {
    TEAS.forEach((t, i) => {
      const b = document.createElement('button');
      b.className = 'tea-card' + (T.tea === t.id ? ' on' : '');
      b.innerHTML = `<i style="background:${t.tag}"></i><b>${t.name}</b><small>${t.note}</small>`;
      b.addEventListener('click', () => {
        T.tea = t.id;
        T.bagIn = false;
        paint();
        setTimeout(() => { T.bagIn = true; paint(); setTimeout(() => KSFX.dunk(), 350); }, 200);
        SFX.plink(i);
        $$('#tCards .tea-card').forEach(x => x.classList.toggle('on', x === b));
      });
      $id('tCards').append(b);
    });
  }
  function bindPour() {
    const btn = $id('tPour');
    btn.addEventListener('pointerdown', e => {
      if (T.fill >= 95) return toast('잔이 가득 찼어요 ☕');
      btn.setPointerCapture(e.pointerId);
      const k = $id('tKettle');
      k.classList.add('pour');
      pourTimer = setTimeout(() => {
        k.classList.add('tilt');
        $id('tStream').classList.add('on');
        pourLoop = KSFX.pour();
        pourLoop.setLevel(T.fill / 95);
        pourTimer = setInterval(() => {
          T.fill = Math.min(95, T.fill + 1.3);
          if (T.tea) T.steep = Math.min(100, T.steep + 0.25);
          if (pourLoop) pourLoop.setLevel(T.fill / 95);
          paint();
          if (T.fill >= 95) { stopPour(); toast('가득 찼어요! ☕'); SFX.plink(5); }
        }, 60);
      }, 350);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => btn.addEventListener(ev, () => { if (pourTimer || pourLoop) stopPour(); }));
  }
  function bindSteep() {
    const t = teaOf(T.tea);
    $id('tMeter').style.background = `linear-gradient(90deg, rgba(215,235,255,.9), ${t.color})`;
    $id('tDunk').addEventListener('click', () => {
      if (!T.bagIn) return toast('티백을 이미 꺼냈어요');
      bump($id('tBag'), 'bob');
      setTimeout(() => KSFX.dunk(), 250);
      T.steep = Math.min(100, T.steep + 5);
      paint();
    });
    $id('tOut').addEventListener('click', () => {
      if (!T.bagIn) return toast('티백을 이미 꺼냈어요');
      takeBagOut();
    });
  }
  function bindDrink() {
    const iceBtn = document.createElement('button');
    iceBtn.className = 'btn' + (T.iced ? ' primary' : '');
    iceBtn.style.width = '100%';
    iceBtn.style.marginBottom = '10px';
    const label = () => { iceBtn.textContent = `🧊 얼음 넣기 (${T.ices.length}/5)`; };
    label();
    iceBtn.addEventListener('click', () => {
      if (T.fill <= 0) return toast('잔이 비었어요');
      if (T.ices.length >= 5) return toast('얼음이 가득해요!');
      T.ices.push({ x: rnd(6, 62), y: rnd(8, 58), r: rnd(-25, 25) });
      T.fill = Math.min(98, T.fill + 3);
      KSFX.ice();
      label();
      paint();
    });
    $id('tAdds').before(iceBtn);
    ADDS.forEach(a => {
      const b = document.createElement('button');
      b.className = 'chip' + (T.adds.includes(a.id) ? ' used' : '');
      b.textContent = a.label;
      b.addEventListener('click', () => {
        if (T.fill <= 0) return toast('잔이 비었어요');
        if (T.adds.includes(a.id)) return toast('이미 넣었어요!');
        T.adds.push(a.id);
        b.classList.add('used');
        addEffect(a.id);
      });
      $id('tAdds').append(b);
    });
    $id('tSip').addEventListener('click', sip);
    $id('tAgain').addEventListener('click', () => { reset(); SFX.paper(); render(); });
    $id('tDone').addEventListener('click', closeTea);
    if (T.iced && !T.ices.length) setTimeout(() => toast('🧊 얼음을 넣어 시원하게 만들어요!'), 400);
  }

  const DEFS = [
    { title: '🍵 잔 고르기', tip: '오늘은 어떤 잔에 마실까요?',
      html: () => '<div class="tea-cards" id="tCups"></div><p class="tip">온도</p><div class="row" id="tTemp"></div>' + NEXT,
      bind: bindCup, ok: () => true, no: '' },
    { title: '🔥 물 끓이기', tip: '주전자를 불에 올려요. 보글보글 끓으면 주전자가 삐익~ 울어요.',
      html: () => '<button class="btn primary" id="tFire" style="width:100%">🔥 불 켜기</button><p class="tip" id="tState" style="margin-top:10px"></p>' + NEXT,
      bind: bindBoil, ok: () => T.boiled, no: '물이 아직 안 끓었어요 🫖' },
    { title: '🍵 차 고르기', tip: '오늘 기분에 어울리는 티백을 골라요.',
      html: () => '<div class="tea-cards" id="tCards"></div>' + NEXT,
      bind: bindPick, ok: () => !!T.tea, no: '티백을 하나 골라주세요' },
    { title: '🫖 물 붓기', tip: '주전자를 기울여 잔에 물을 부어요. 차오를수록 소리가 높아져요.',
      html: () => '<button class="btn hold" id="tPour">꾹 누르고 있으면 쪼르륵 부어져요 🫖<span class="bar"><i id="tFillBar"></i></span></button>' + NEXT,
      bind: bindPour, ok: () => T.fill >= 50, no: '물을 조금 더 부어주세요' },
    { title: '⏳ 우리기', tip: '차가 우러나는 걸 기다려요. 티백을 콩콩 흔들면 더 빨리 우러나요.',
      html: () => '<p class="tip" id="tSteepText"></p><div class="done-meter" id="tMeter"><div class="needle" id="tNeedle"></div></div><div class="meter-labels"><span>연하게</span><span>적당히</span><span>진하게</span></div><button class="btn" id="tDunk" style="width:100%;margin-top:12px">🫖 티백 콩콩 흔들기</button><button class="btn" id="tOut" style="width:100%;margin-top:8px">티백 꺼내기</button>' + NEXT,
      bind: bindSteep, ok: () => true, no: '' },
    { title: '☕ 마시기', tip: '취향대로 넣고, 호로록 마셔요.',
      html: () => '<div class="row" id="tAdds"></div><button class="btn primary" id="tSip" style="width:100%">☕ 호로록 마시기</button><button class="btn" id="tAgain" style="width:100%;margin-top:8px">🫖 처음부터 다시</button><button class="btn primary big" id="tDone">책상으로 가져가기 →</button>',
      bind: bindDrink, ok: () => true, no: '' }
  ];

  function leaveStep() {
    if (T.step === 2) setFire(false);
    if (T.step === 4) stopPour();
    if (T.step === 5 && T.bagIn) takeBagOut();
  }
  function render() {
    $id('tSteps').innerHTML = STEPS.map((s, i) => `<span class="${i + 1 === T.step ? 'on' : (i + 1 < T.step ? 'done' : '')}">${s}</span>`).join('');
    const d = DEFS[T.step - 1];
    $id('tTitle').textContent = d.title;
    $id('tTip').textContent = d.tip;
    $id('tControls').innerHTML = d.html();
    d.bind();
    const nb = $id('tNext');
    if (nb) nb.addEventListener('click', () => {
      if (!d.ok()) return toast(d.no);
      leaveStep();
      T.step++;
      SFX.click();
      render();
    });
    paint();
  }

  function loadCup() {
    try { return JSON.parse(localStorage.getItem('teaCup') || 'null'); } catch (e) { return null; }
  }
  function saveCup(c) { localStorage.setItem('teaCup', JSON.stringify(c)); }
  function cupView() {
    try { return JSON.parse(localStorage.getItem('deskPrefs') || '{}').cupView || 'side'; } catch (e) { return 'side'; }
  }
  function paintDesk() {
    const c = loadCup();
    const show = !!(c && c.fill > 0);
    deskCup.classList.toggle('hidden', !show);
    if (!show) return;
    const view = cupView();
    deskCup.classList.toggle('view-side', view === 'side');
    deskCup.classList.toggle('view-top', view === 'top');
    const cupId = c.cup || 'tea';
    const ices = c.ices || [];
    const cold = ices.length > 0;
    const hot = Date.now() - c.at < 20 * 60 * 1000;
    deskCup.classList.toggle('iced', cold);
    paintCupInto('d', Object.assign({}, c, { cup: cupId, ices: ices, adds: c.adds || [], hot: hot, bagIn: false }));
    const top = $id('dTop');
    CUPS.forEach(k => top.classList.toggle('td-' + k.id, cupId === k.id));
    const liq = $id('dTdLiquid');
    const size = 52 + Math.min(c.fill, 98) / 98 * 44;
    liq.style.width = size + '%';
    liq.style.height = size + '%';
    liq.style.background = teaColor(c.tea, c.steep);
    let html = '';
    if (c.adds && c.adds.includes('lemon')) html += '<i class="td-lemon"></i>';
    ices.forEach(ic => { html += `<i class="td-ice" style="left:${ic.x}%;top:${ic.y}%;transform:rotate(${ic.r}deg)"></i>`; });
    if (cold && (cupId === 'tumbler' || cupId === 'mug')) html += '<i class="td-straw"></i>';
    $id('dTdExtras').innerHTML = html;
    $id('dTdSteam').classList.toggle('on', !cold && hot);
  }
  window.paintTeaDesk = paintDesk;

  function sipDesk() {
    const c = loadCup();
    if (!c) return;
    const cold = !!(c.ices && c.ices.length);
    c.fill = Math.max(0, c.fill - 15);
    KSFX.sip();
    if (cold) setTimeout(() => KSFX.iceRattle(), 300);
    if (cupView() === 'side') bump($id('dZone'), 'sipping');
    else { bump($id('dTop'), 'sip'); bump($id('dTdLiquid'), 'ripple'); }
    if (c.fill <= 0) {
      localStorage.removeItem('teaCup');
      toast('잔이 비었어요. 위의 ☕ 버튼으로 한 잔 더!');
      setTimeout(paintDesk, 600);
    } else {
      saveCup(c);
      const lines = cold ? COLD : COZY;
      toast(lines[Math.floor(Math.random() * lines.length)]);
      paintDesk();
    }
  }
  let ds = null;
  deskCup.addEventListener('pointerdown', e => {
    deskCup.setPointerCapture(e.pointerId);
    ds = { x: e.clientX, y: e.clientY, l: deskCup.offsetLeft, t: deskCup.offsetTop, moved: false };
  });
  deskCup.addEventListener('pointermove', e => {
    if (!ds) return;
    const dx = e.clientX - ds.x;
    const dy = e.clientY - ds.y;
    if (!ds.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
    ds.moved = true;
    deskCup.classList.add('dragging');
    const sw = scene.clientWidth;
    const sh = scene.clientHeight;
    const l = Math.max(0, Math.min(sw - deskCup.offsetWidth, ds.l + dx));
    const t = Math.max(0, Math.min(sh - deskCup.offsetHeight, ds.t + dy));
    deskCup.style.left = (l / sw * 100) + '%';
    deskCup.style.top = (t / sh * 100) + '%';
  });
  deskCup.addEventListener('pointerup', () => {
    if (!ds) return;
    deskCup.classList.remove('dragging');
    if (ds.moved) {
      localStorage.setItem('cupPos', JSON.stringify({ x: parseFloat(deskCup.style.left), y: parseFloat(deskCup.style.top) }));
      KSFX.clink();
    } else {
      sipDesk();
    }
    ds = null;
  });
  deskCup.addEventListener('pointercancel', () => { ds = null; deskCup.classList.remove('dragging'); });

  function openTea() {
    reset();
    root.classList.remove('hidden');
    SFX.click();
    KSFX.clink();
    if (!timer) timer = setInterval(tick, 100);
    render();
  }
  function closeTea() {
    stopPour();
    setFire(false);
    clearInterval(timer);
    timer = null;
    if (T.tea && T.fill > 0) {
      saveCup({ tea: T.tea, steep: T.steep, fill: T.fill, adds: T.adds, ices: T.ices, cup: T.cup, at: Date.now() });
      toast('잔을 책상에 올려뒀어요 ☕');
    }
    root.classList.add('hidden');
    paintDesk();
  }
  teaBtn.addEventListener('click', openTea);
  $id('tClose').addEventListener('click', closeTea);

  reset();
  paintDesk();
  console.log('✅ tea.js 준비 완료!');
})();