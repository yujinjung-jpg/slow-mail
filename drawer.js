(() => {
    const $id = id => document.getElementById(id);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const PT = [
      { id: 'cream', name: '크림 줄노트', color: '#fdf6e3' },
      { id: 'pink', name: '핑크 줄노트', color: '#fde4ec' },
      { id: 'sky', name: '하늘 모눈', color: '#eef5fd' },
      { id: 'mint', name: '민트 도트', color: '#e9f7ec' },
      { id: 'kraft', name: '크라프트 무지', color: '#dcc39a' },
      { id: 'floral', name: '꽃무늬 편지지', color: '#fff6ef' },
      { id: 'airmail', name: '에어메일', color: '#f7f3ea' },
      { id: 'night', name: '밤하늘', color: '#26325e' }
    ];
    const COVERS = ['#e8a3b5', '#7f9cc4', '#7cbf6b', '#f2b134', '#9b6bd0', '#c98f52', '#3d5a8a', '#d64545'];
    const NB_STYLES = [['lined', '줄'], ['grid', '모눈'], ['dot', '도트'], ['plain', '무지'], ['diary', '🖍 그림일기']];
    const STICKERS = ['⭐', '💖', '🌷', '🍀', '🐻', '🐰', '🌈', '☁️', '🍓', '🎀', '✨', '🌙', '🧸', '🐣', '🍰', '🎵', '💌', '👍'];
    const HL = ['#ffe94d', '#ff9ec0', '#8fe3bf', '#8cc8ff'];
    const CRAYON = ['#3b2a1c', '#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#f48fb1', '#8d6e63'];
    const WEATHER = ['☀️', '⛅', '☁️', '☔', '⛄'];
    const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
    const MODES = [['write', '✏️ 쓰기'], ['hl', '🖍 형광펜'], ['sticker', '⭐ 스티커'], ['draw', '🎨 그림']];
    const PW = 466;
    const PH = 572;
    const COLS = 10;
    const ROWS = 6;
    PT.forEach(p => { PAPERS[p.id] = p.color; });
  
    const style = document.createElement('style');
    style.textContent = `
      .pt-cream, .pt-pink { --rule: linear-gradient(90deg, transparent 0 18px, rgba(240,120,140,.4) 18px 19px, transparent 19px), repeating-linear-gradient(transparent 0 31px, rgba(140,100,60,.28) 31px 32px); }
      .pt-sky { --rule: linear-gradient(90deg, rgba(90,140,200,.22) 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(rgba(90,140,200,.22) 1px, transparent 1px) 0 0 / 16px 16px; }
      .pt-mint { --rule: radial-gradient(circle, rgba(60,120,90,.4) 1.3px, transparent 1.9px) 0 0 / 16px 16px; }
      .pt-kraft { --rule: none; }
      .pt-floral { --rule: radial-gradient(circle, rgba(240,130,165,.3) 2.5px, transparent 3.5px) 0 0 / 34px 34px, radial-gradient(circle, rgba(242,201,76,.32) 2px, transparent 3px) 17px 17px / 34px 34px; }
      .pt-airmail { --rule: repeating-linear-gradient(transparent 0 31px, rgba(61,90,138,.22) 31px 32px); }
      .pt-night { --rule: radial-gradient(circle, rgba(255,240,190,.7) 1px, transparent 1.6px) 0 0 / 46px 38px, radial-gradient(circle, rgba(255,255,255,.5) .8px, transparent 1.4px) 23px 19px / 46px 38px, repeating-linear-gradient(transparent 0 31px, rgba(255,226,138,.22) 31px 32px); }
      .paper[class*="pt-"] textarea, .paper[class*="pt-"] .read-text { background: var(--rule); background-attachment: local; }
      .paper.pt-airmail { border: 12px solid transparent; border-image: repeating-linear-gradient(45deg, #d64545 0 10px, #fff 10px 20px, #3d5a8a 20px 30px, #fff 30px 40px) 12; }
      .paper.pt-floral { outline: 2px dotted rgba(232,130,160,.75); outline-offset: -12px; }
      .paper.pt-night, .paper.pt-night textarea, .paper.pt-night .read-text { color: #fff3cf; }
      .paper.pt-night textarea::placeholder { color: rgba(255,243,207,.5); }
      .sheet[class*="pt-"], .paper-pick i[class*="pt-"] { background: var(--rule), var(--pc); }
      .sheet.pt-airmail { border: 5px solid transparent; border-image: repeating-linear-gradient(45deg, #d64545 0 6px, #fff 6px 12px, #3d5a8a 12px 18px, #fff 18px 24px) 5; }
      .paper-pick { width: 100%; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; text-align: left; }
      .paper-pick i { display: block; width: 26px; height: 32px; border-radius: 3px; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,.25); }
  
      .fold-wrap { position: absolute; z-index: 8; pointer-events: none; transform: var(--base); }
      .fold-wrap.into { animation: intoEnv .45s ease-in forwards; }
      .fold-part { position: absolute !important; margin: 0; }
      .fp-top { clip-path: inset(0 0 66.6% 0); transform-origin: 50% 33.3%; }
      .fp-mid { clip-path: inset(33.3% 0 33.3% 0); }
      .fp-bot { clip-path: inset(66.6% 0 0 0); transform-origin: 50% 66.6%; }
      .fp-top.go, .fp-bot.go { animation: foldAway .28s ease-in forwards; }
      .fold-back { position: absolute; left: 0; right: 0; top: 33.3%; height: 33.4%; transform: scaleY(0); background: var(--soft-grain, none), var(--paper); box-shadow: 0 2px 6px rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.04); }
      .fb-b { transform-origin: 50% 100%; }
      .fb-t { transform-origin: 50% 0; }
      .fold-back.go { animation: foldIn .28s ease-out forwards; }
  
      .dw-pull { position: fixed; left: 28px; right: 388px; bottom: 0; height: 20px; z-index: 3; cursor: pointer; border-radius: 6px 6px 0 0; background: var(--wood) 0 0 / 400px 400px, linear-gradient(#7a5233, #5a3a22); box-shadow: 0 -3px 8px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.12); transition: transform .2s; }
      .dw-pull:hover { transform: translateY(-4px); }
      .dw-pull::after { content: ''; position: absolute; left: 50%; top: -6px; width: 56px; height: 14px; margin-left: -28px; border-radius: 7px; background: linear-gradient(#f0d27a, #b8922c); box-shadow: 0 3px 4px rgba(0,0,0,.35); }
      .dw-pull span { position: absolute; left: calc(50% + 40px); top: 1px; font-family: 'Gaegu'; font-size: 14px; color: #f3e2c3; }
      .dw-overlay { position: fixed; inset: 0; z-index: 11; display: flex; align-items: flex-end; justify-content: center; background: rgba(30,18,6,.55); }
      .dw-overlay .close { z-index: 12; }
      .dw-box { position: relative; display: flex; flex-direction: column; width: min(1040px, 94vw); height: min(560px, 82vh); padding: 22px 22px 0; border-radius: 14px 14px 0 0; background: var(--wood) 0 0 / 400px 400px, linear-gradient(#8a5a33, #6a4224); box-shadow: 0 -10px 30px rgba(0,0,0,.45); animation: dwIn .5s cubic-bezier(.3,1.15,.5,1); }
      .dw-box.out { animation: dwOut .35s ease-in forwards; }
      .dw-inside { flex: 1; display: flex; gap: 16px; padding: 16px; min-height: 0; overflow: hidden; border-radius: 8px; background: var(--grain), linear-gradient(#5a3a22, #4a2f1b); box-shadow: inset 0 10px 24px rgba(0,0,0,.55), inset 0 0 0 4px rgba(0,0,0,.2); }
      .dw-comp { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
      .dw-comp.papers { flex: 1.3; }
      .dw-comp.books { flex: 1; border-left: 10px solid #6f4526; padding-left: 16px; }
      .dw-comp h3 { font-family: 'Gaegu'; font-size: 22px; color: #fff3d6; margin: 0 0 10px; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
      .dw-sheets { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 12px; overflow-y: auto; padding: 12px 4px 16px; }
      .dw-front { height: 54px; margin: 14px -22px 0; display: grid; place-items: center; background: var(--wood) 0 0 / 400px 400px, linear-gradient(#9c6a3e, #7a5233); box-shadow: inset 0 3px 0 rgba(255,255,255,.12); }
      .dw-front i { width: 90px; height: 18px; border-radius: 9px; background: linear-gradient(#f0d27a, #b8922c); box-shadow: 0 3px 5px rgba(0,0,0,.4); }
      .stack { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; background: none; border: none; font-family: 'Gaegu'; font-size: 16px; color: #fff3d6; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
      .stack .pile { position: relative; width: 92px; height: 118px; }
      .stack .sheet { position: absolute; inset: 0; border-radius: 2px; box-shadow: 0 2px 4px rgba(0,0,0,.35); }
      .stack .sheet.b2 { transform: rotate(-4deg) translate(-3px, 3px); }
      .stack .sheet.b1 { transform: rotate(3deg) translate(3px, 2px); }
      .stack .sheet.front { transition: transform .25s; }
      .stack:hover .sheet.front { transform: translateY(-10px) rotate(-1deg); }
      .stack.on .pile { outline: 3px solid #ffd86b; outline-offset: 6px; border-radius: 4px; }
      .stack.pick .sheet.front { animation: pickSheet .5s ease-in forwards; }
      .dw-books { display: grid; grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 18px; overflow-y: auto; padding: 12px 4px 16px; align-content: start; }
      .nb-cover { position: relative; width: 100px; height: 136px; padding: 0; border: none; cursor: pointer; border-radius: 4px 8px 8px 4px; background: var(--grain), var(--cover); box-shadow: inset 8px 0 0 rgba(0,0,0,.18), 0 4px 8px rgba(0,0,0,.45); transition: transform .2s; }
      .nb-cover:hover { transform: translateY(-6px) rotate(-2deg); }
      .nb-cover::after { content: ''; position: absolute; right: 14px; top: 0; bottom: 0; width: 6px; background: rgba(0,0,0,.35); }
      .nb-cover .lbl, .desk-nb .lbl { position: absolute; left: 16px; right: 26px; top: 26px; max-height: 58px; overflow: hidden; padding: 6px 4px; border-radius: 3px; background: #fffaf0; font-family: 'Gaegu'; font-size: 15px; color: #3b2a1c; text-align: center; word-break: keep-all; }
      .nb-cover small { position: absolute; left: 16px; right: 22px; bottom: 8px; font-size: 11px; color: rgba(255,255,255,.92); text-align: left; }
      .nb-new { width: 100px; height: 136px; display: grid; place-items: center; align-content: center; gap: 4px; cursor: pointer; border-radius: 8px; border: 3px dashed rgba(255,243,214,.6); background: rgba(255,255,255,.05); color: #fff3d6; font-family: 'Gaegu'; font-size: 16px; }
      .nb-new b { font-size: 34px; line-height: 1; }
      .tail { position: absolute; bottom: -22px; left: 54px; width: 10px; height: 28px; background: #c0283f; clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%); }
  
      .desk-nb { position: absolute; width: 130px; height: 170px; z-index: 3; cursor: grab; touch-action: none; user-select: none; border-radius: 4px 10px 10px 4px; transform: rotate(-6deg); background: var(--grain), var(--cover); box-shadow: inset 10px 0 0 rgba(0,0,0,.18), 0 10px 16px rgba(0,0,0,.4); }
      .desk-nb::before { content: ''; position: absolute; right: -5px; top: 5px; bottom: 5px; width: 6px; border-radius: 0 3px 3px 0; background: repeating-linear-gradient(#fffaf0 0 1px, #e8dcc3 1px 2px); }
      .desk-nb::after { content: ''; position: absolute; right: 18px; top: 0; bottom: 0; width: 7px; background: rgba(0,0,0,.35); }
      .desk-nb .lbl { left: 20px; right: 32px; top: 34px; font-size: 16px; }
      .desk-nb .tail { left: 70px; }
      .desk-nb.dragging { cursor: grabbing; box-shadow: inset 10px 0 0 rgba(0,0,0,.18), 0 20px 24px rgba(0,0,0,.45); }
  
      body.nb-mode .steps { display: none; }
      body.nb-mode .desk > .panel:not(.nb-panel) { display: none; }
      body.nb-mode #paper, body.nb-mode #envelope, body.nb-mode #polaroid, body.nb-mode #giftBag, body.nb-mode #sealKit, body.nb-mode .desk-nb { visibility: hidden; }
      .nb-panel .nb-title { width: 100%; font-family: 'Gaegu'; font-size: 24px; color: #3b2a1c; background: transparent; border: none; border-bottom: 2px dashed #d8c4a4; outline: none; margin-bottom: 4px; }
      .nbp-h { font-family: 'Gaegu'; font-size: 18px; margin: 12px 0 6px; color: #6b4a2e; }
      .nb-panel .row { margin-bottom: 8px; gap: 6px; }
      .nb-panel .swatch { width: 26px; height: 26px; }
      .nbp-nav span { min-width: 64px; text-align: center; font-family: 'Gaegu'; font-size: 18px; }
      .nb-panel .btn:disabled { opacity: .4; cursor: default; }
      .stk-btn { width: 38px; height: 38px; padding: 0; font-size: 24px; cursor: pointer; border-radius: 10px; border: 2px solid transparent; background: #fff3dc; }
      .stk-btn.on { border-color: #6b4a2e; background: #ffe9b0; }
  
      .nb-desk { position: absolute; left: 50%; top: 50%; z-index: 8; transform: translate(-50%, -50%) rotate(-.6deg); }
      .nb-desk.show { animation: nbIn .45s cubic-bezier(.3,1.2,.5,1); }
      .nb-book { position: relative; display: flex; width: 960px; height: 600px; padding: 14px; border-radius: 12px; transform-origin: 0 0; background: var(--grain), var(--cover); box-shadow: 0 24px 40px rgba(0,0,0,.5); perspective: 1600px; }
      .nbs-lined { --nbrule: repeating-linear-gradient(transparent 0 31px, rgba(90,140,200,.3) 31px 32px); }
      .nbs-grid { --nbrule: linear-gradient(90deg, rgba(90,140,200,.2) 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(rgba(90,140,200,.2) 1px, transparent 1px) 0 0 / 16px 16px; }
      .nbs-dot { --nbrule: radial-gradient(circle, rgba(90,110,140,.4) 1.3px, transparent 1.9px) 0 0 / 16px 16px; }
      .nbs-plain, .nbs-diary { --nbrule: none; }
      .nb-page { position: relative; width: 466px; height: 572px; display: flex; flex-direction: column; padding: 22px 28px 8px; overflow: hidden; background: var(--grain), #fffdf6; }
      .nb-page.left { border-radius: 6px 0 0 6px; box-shadow: inset -18px 0 24px -12px rgba(0,0,0,.2), inset 0 0 30px rgba(160,120,60,.12); }
      .nb-page.right { border-radius: 0 6px 6px 0; box-shadow: inset 18px 0 24px -12px rgba(0,0,0,.2), inset 0 0 30px rgba(160,120,60,.12); }
      .nb-spine { position: absolute; left: 50%; top: 14px; bottom: 14px; width: 2px; margin-left: -1px; background: rgba(0,0,0,.15); }
      .pg-body { position: relative; flex: 1; display: flex; flex-direction: column; min-height: 0; }
      .nb-date { font-size: 12px; color: #a08a6c; margin-bottom: 6px; min-height: 16px; }
      .nb-page textarea { flex: 1; width: 100%; padding: 0; border: none; outline: none; resize: none; overflow: hidden; font-family: 'Gaegu'; font-size: 21px; line-height: 32px; color: #3b2a1c; background: var(--nbrule); background-attachment: local; }
      .nb-foot { position: relative; z-index: 5; display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-family: 'Gaegu'; color: #a08a6c; }
      .nb-copy { background: none; border: none; cursor: pointer; font-family: 'Gaegu'; font-size: 15px; color: #b06a80; }
      .nb-copy:hover { text-decoration: underline; }
      .pg-hl { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; opacity: .45; mix-blend-mode: multiply; }
      .pg-stk { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
      .stk { position: absolute; font-size: 44px; line-height: 1; user-select: none; transform: translate(-50%, -50%) rotate(var(--r)); filter: drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(0 3px 3px rgba(0,0,0,.25)); }
      .stk.pop { animation: stkPop .35s cubic-bezier(.3,1.6,.5,1); }
      .nb-book.mode-hl .pg-hl { pointer-events: auto; cursor: crosshair; }
      .nb-book.mode-sticker .pg-stk { pointer-events: auto; cursor: copy; }
      .nb-book.mode-sticker .stk { cursor: pointer; }
      .nb-book.mode-draw .dy-draw { pointer-events: auto; cursor: crosshair; }
      .nb-book:not(.mode-write) .pg-body textarea, .nb-book:not(.mode-write) .dy-title input { pointer-events: none; }
      .nb-ribbon { position: absolute; top: -10px; left: 530px; width: 16px; height: 210px; z-index: 6; pointer-events: none; background: linear-gradient(90deg, #a8233a, #e05a7a 50%, #a8233a); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 90%, 0 100%); }
      .nb-turn { position: absolute; top: 14px; width: 466px; height: 572px; z-index: 7; background: var(--grain), #fffdf6; box-shadow: 0 0 20px rgba(0,0,0,.25); }
      .nb-turn.next { left: 480px; border-radius: 0 6px 6px 0; transform-origin: 0 50%; animation: turnNext .55s ease-in-out forwards; }
      .nb-turn.prev { left: 14px; border-radius: 6px 0 0 6px; transform-origin: 100% 50%; animation: turnPrev .55s ease-in-out forwards; }
  
      .dy-head { display: flex; justify-content: space-between; align-items: center; height: 34px; font-family: 'Gaegu'; font-size: 18px; color: #3b2a1c; }
      .dy-weather { display: flex; align-items: center; gap: 2px; }
      .dy-weather button { width: 30px; height: 30px; padding: 0; font-size: 17px; cursor: pointer; background: none; border-radius: 50%; border: 2px solid transparent; }
      .dy-weather button.on { border-color: #e05a7a; transform: rotate(-8deg); }
      .dy-title { display: flex; align-items: center; gap: 6px; height: 30px; margin-bottom: 6px; font-family: 'Gaegu'; font-size: 18px; color: #3b2a1c; border-bottom: 2px solid #c9b08a; }
      .dy-title input { flex: 1; border: none; outline: none; background: transparent; font-family: 'Gaegu'; font-size: 20px; color: #3b2a1c; }
      .dy-draw { display: block; width: 410px; height: 196px; border: 2px solid #c9b08a; border-radius: 6px; background: #fff; pointer-events: none; }
      .dy-gridwrap { position: relative; width: 402px; height: 242px; margin-top: 8px; }
      .dy-grid { display: grid; grid-template-columns: repeat(10, 40px); grid-template-rows: repeat(6, 40px); border-top: 1.5px solid #e09a9a; border-left: 1.5px solid #e09a9a; }
      .dy-grid i { position: relative; display: grid; place-items: center; font-style: normal; font-family: 'Gaegu'; font-size: 26px; color: #3b2a1c; border-right: 1.5px solid #e09a9a; border-bottom: 1.5px solid #e09a9a; }
      .dy-grid i.caret::after { content: ''; position: absolute; left: 4px; top: 8px; bottom: 8px; width: 2px; background: #3b2a1c; animation: blink 1s steps(1) infinite; }
      .dy-gridwrap textarea { position: absolute; inset: 0; opacity: 0; background: none; font-size: 26px; line-height: 40px; caret-color: transparent; }
  
      @keyframes dwIn { from { transform: translateY(100%); } to { transform: none; } }
      @keyframes dwOut { to { transform: translateY(100%); } }
      @keyframes pickSheet { to { transform: translateY(-180px) rotate(-8deg) scale(1.2); opacity: 0; } }
      @keyframes turnNext { to { transform: rotateY(-180deg); } }
      @keyframes turnPrev { to { transform: rotateY(180deg); } }
      @keyframes stkPop { from { transform: translate(-50%, -50%) rotate(var(--r)) scale(1.7); opacity: 0; } to { transform: translate(-50%, -50%) rotate(var(--r)) scale(1); opacity: 1; } }
      @keyframes blink { 50% { opacity: 0; } }
      @keyframes nbIn { from { opacity: 0; transform: translate(-50%, -40%) rotate(-4deg) scale(.92); } }
      @keyframes foldAway { to { transform: scaleY(0); filter: brightness(.8); } }
      @keyframes foldIn { from { transform: scaleY(0); filter: brightness(.85); } to { transform: scaleY(1); filter: none; } }
      @keyframes intoEnv { to { transform: var(--base) translateY(40px) scale(.55); opacity: 0; } }
    `;
    document.head.append(style);
  
    let fac = null;
    let fbuf = null;
    function foldSound() {
      if (SFX.muted) return;
      if (!fac) {
        fac = new AudioContext();
        fbuf = fac.createBuffer(1, fac.sampleRate, fac.sampleRate);
        const d = fbuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (fac.state === 'suspended') fac.resume();
      const t = fac.currentTime;
      const play = (start, dur, type, f1, f2, vol) => {
        const src = fac.createBufferSource();
        src.buffer = fbuf;
        const f = fac.createBiquadFilter();
        f.type = type;
        f.Q.value = 1.2;
        f.frequency.setValueAtTime(f1, t + start);
        f.frequency.exponentialRampToValueAtTime(f2, t + start + dur);
        const g = fac.createGain();
        g.gain.setValueAtTime(0.0001, t + start);
        g.gain.exponentialRampToValueAtTime(vol, t + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
        src.connect(f);
        f.connect(g);
        g.connect(fac.destination);
        src.start(t + start, Math.random() * 0.5);
        src.stop(t + start + dur + 0.05);
      };
      play(0, 0.24, 'bandpass', 3200, 900, 0.3);
      play(0.22, 0.04, 'highpass', 2500, 2500, 0.35);
    }
  
    const sw = $('#paperSwatches');
    sw.style.display = 'none';
    const pickBtn = document.createElement('button');
    pickBtn.className = 'btn paper-pick';
    pickBtn.innerHTML = '<i></i><span></span>';
    sw.after(pickBtn);
    function paintPaperType() {
      const el = $('#paper');
      PT.forEach(p => el.classList.toggle('pt-' + p.id, S.paper === p.id));
      const t = PT.find(p => p.id === S.paper) || PT[0];
      const i = pickBtn.querySelector('i');
      i.className = 'pt-' + t.id;
      i.style.setProperty('--pc', t.color);
      pickBtn.querySelector('span').textContent = `🗄 서랍에서 고르기 `;
    }
    const prevApply = applyPaper;
    applyPaper = function () { prevApply(); paintPaperType(); };
    const prevStage = stageLetter;
    stageLetter = function (L) {
      prevStage(L);
      const p = document.querySelector('#openStage .paper.read');
      if (p && L.paper) p.classList.add('pt-' + L.paper);
    };
  
    const scene = $('#scene');
    async function playFold() {
      const paper = $('#paper');
      const W = paper.offsetWidth;
      const H = paper.offsetHeight;
      const wrap = document.createElement('div');
      wrap.className = 'fold-wrap';
      wrap.style.left = paper.offsetLeft + 'px';
      wrap.style.top = paper.offsetTop + 'px';
      wrap.style.width = W + 'px';
      wrap.style.height = H + 'px';
      wrap.style.setProperty('--base', getComputedStyle(paper).transform);
      wrap.style.setProperty('--paper', PAPERS[S.paper] || '#fdf6e3');
      const mk = cls => {
        const c = paper.cloneNode(true);
        c.removeAttribute('id');
        c.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
        const t = c.querySelector('textarea');
        if (t) t.value = letter.value;
        c.classList.add('fold-part', cls);
        c.style.left = '0';
        c.style.top = '0';
        c.style.transform = 'none';
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        return c;
      };
      const top = mk('fp-top');
      const mid = mk('fp-mid');
      const bot = mk('fp-bot');
      const backB = document.createElement('div');
      backB.className = 'fold-back fb-b';
      const backT = document.createElement('div');
      backT.className = 'fold-back fb-t';
      wrap.append(top, mid, bot, backB, backT);
      paper.style.visibility = 'hidden';
      scene.append(wrap);
      await wait(80);
      foldSound();
      bot.classList.add('go');
      await wait(270);
      backB.classList.add('go');
      await wait(360);
      foldSound();
      top.classList.add('go');
      await wait(270);
      backT.classList.add('go');
      await wait(420);
      SFX.paper();
      wrap.classList.add('into');
      await wait(450);
      wrap.remove();
      paper.style.visibility = '';
    }
    const prevGo = goStep;
    let folding = false;
    goStep = function (n) {
      const num = Number(n);
      if (folding) return;
      if (num >= 4 && !S.folded && letter.value.trim() && !document.body.classList.contains('nb-mode')) {
        folding = true;
        playFold().then(() => { folding = false; prevGo(num); });
        return;
      }
      prevGo(num);
    };
  
    const pull = document.createElement('div');
    pull.className = 'dw-pull';
    pull.title = '서랍 열기';
    pull.innerHTML = '<span>서랍</span>';
    document.body.append(pull);
    const headBtn = document.createElement('button');
    headBtn.className = 'mute';
    headBtn.title = '서랍';
    headBtn.textContent = '🗄';
    ($('button[title="책상 꾸미기"]') || $('#muteBtn')).before(headBtn);
  
    const overlay = document.createElement('div');
    overlay.className = 'dw-overlay hidden';
    overlay.innerHTML = `<button class="close" id="dwClose">✕</button>
      <div class="dw-box" id="dwBox">
        <div class="dw-inside">
          <div class="dw-comp papers"><h3>✉️ 편지지</h3><div class="dw-sheets" id="dwSheets"></div></div>
          <div class="dw-comp books"><h3>📒 공책</h3><div class="dw-books" id="dwBooks"></div></div>
        </div>
        <div class="dw-front"><i></i></div>
      </div>`;
    document.body.append(overlay);
    const box = $id('dwBox');
    function openDrawer() {
      box.classList.remove('out');
      overlay.classList.remove('hidden');
      KSFX.roll();
      setTimeout(() => KSFX.roll(), 140);
      renderSheets();
      renderBooks();
    }
    function closeDrawer() {
      box.classList.add('out');
      KSFX.roll();
      setTimeout(() => { overlay.classList.add('hidden'); SFX.box(); }, 340);
    }
    pull.addEventListener('click', openDrawer);
    headBtn.addEventListener('click', openDrawer);
    pickBtn.addEventListener('click', openDrawer);
    $id('dwClose').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeDrawer(); });
  
    function renderSheets() {
      const wrap = $id('dwSheets');
      wrap.innerHTML = '';
      PT.forEach((p, i) => {
        const b = document.createElement('button');
        b.className = 'stack' + (S.paper === p.id ? ' on' : '');
        const sheet = cls => `<div class="sheet ${cls} pt-${p.id}" style="--pc:${p.color}"></div>`;
        b.innerHTML = `<div class="pile">${sheet('b2')}${sheet('b1')}${sheet('front')}</div><span>${p.name}${S.paper === p.id ? ' ✓' : ''}</span>`;
        b.addEventListener('click', () => {
          if (S.sealed) return toast('이미 봉인한 편지예요. 실링 단계에서 "다시 하기"를 먼저 눌러주세요');
          b.classList.add('pick');
          SFX.paper();
          SFX.plink(i);
          setTimeout(() => {
            S.paper = p.id;
            applyPaper();
            closeDrawer();
            if (document.body.classList.contains('nb-mode')) closeBook();
            if (cur !== 1) goStep(1);
            toast(`✉️ 새 편지지: ${p.name}`);
          }, 450);
        });
        wrap.append(b);
      });
    }
  
    let books = [];
    let saveT = null;
    const saveNow = () => { clearTimeout(saveT); return chrome.storage.local.set({ notebooks: books }); };
    const saveSoon = () => { clearTimeout(saveT); saveT = setTimeout(saveNow, 400); };
    const newPage = () => ({ text: '', at: fmt(new Date()) });
    const hasMark = b => typeof b.bookmark === 'number';
  
    function renderBooks() {
      const wrap = $id('dwBooks');
      wrap.innerHTML = '';
      books.forEach(b => {
        const el = document.createElement('button');
        el.className = 'nb-cover';
        el.style.setProperty('--cover', b.cover);
        el.innerHTML = `<div class="lbl"></div><small></small>${hasMark(b) ? '<i class="tail"></i>' : ''}`;
        el.querySelector('.lbl').textContent = b.title;
        el.querySelector('small').textContent = b.onDesk ? '📌 책상 위' : `${b.pages.filter(p => p.text.trim() || p.draw).length}쪽 씀`;
        el.addEventListener('click', () => { closeDrawer(); setTimeout(() => openBook(b.id), 200); });
        wrap.append(el);
      });
      const add = document.createElement('button');
      add.className = 'nb-new';
      add.innerHTML = '<b>＋</b>새 공책';
      add.addEventListener('click', () => {
        const b = { id: crypto.randomUUID(), title: `새 공책 ${books.length + 1}`, cover: COVERS[books.length % COVERS.length], style: 'lined', pages: [newPage(), newPage()] };
        books.push(b);
        saveNow();
        SFX.plink(4);
        closeDrawer();
        setTimeout(() => openBook(b.id), 200);
      });
      wrap.append(add);
    }
  
    function renderDeskBooks() {
      $$('.desk-nb').forEach(e => e.remove());
      books.filter(b => b.onDesk).forEach(b => {
        b.deskPos = b.deskPos || { x: 64, y: 40 };
        const el = document.createElement('div');
        el.className = 'desk-nb';
        el.title = `${b.title} · 누르면 펼치기, 끌면 옮기기`;
        el.style.setProperty('--cover', b.cover);
        el.style.left = b.deskPos.x + '%';
        el.style.top = b.deskPos.y + '%';
        el.innerHTML = `<div class="lbl"></div>${hasMark(b) ? '<i class="tail"></i>' : ''}`;
        el.querySelector('.lbl').textContent = b.title;
        let st = null;
        el.addEventListener('pointerdown', e => {
          el.setPointerCapture(e.pointerId);
          st = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop, moved: false };
        });
        el.addEventListener('pointermove', e => {
          if (!st) return;
          const dx = e.clientX - st.x;
          const dy = e.clientY - st.y;
          if (!st.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
          st.moved = true;
          el.classList.add('dragging');
          const w = scene.clientWidth;
          const h = scene.clientHeight;
          el.style.left = (Math.max(0, Math.min(w - el.offsetWidth, st.l + dx)) / w * 100) + '%';
          el.style.top = (Math.max(0, Math.min(h - el.offsetHeight, st.t + dy)) / h * 100) + '%';
        });
        el.addEventListener('pointerup', () => {
          if (!st) return;
          el.classList.remove('dragging');
          if (st.moved) {
            b.deskPos = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) };
            saveSoon();
            SFX.paper();
          } else {
            openBook(b.id);
          }
          st = null;
        });
        el.addEventListener('pointercancel', () => { st = null; el.classList.remove('dragging'); });
        scene.append(el);
      });
    }
  
    const pageHTML = side => `<div class="nb-page ${side === 'L' ? 'left' : 'right'}" id="pg${side}">
        <div class="pg-body"></div>
        <div class="nb-foot"><span class="pg-num"></span><button class="nb-copy">✉️ 편지로 옮기기</button></div>
        <canvas class="pg-hl" width="${PW}" height="${PH}"></canvas>
        <div class="pg-stk"></div>
      </div>`;
    const deskWrap = document.createElement('div');
    deskWrap.className = 'nb-desk hidden';
    deskWrap.innerHTML = `<div class="nb-book" id="nbBook">${pageHTML('L')}${pageHTML('R')}<div class="nb-spine"></div><div class="nb-ribbon hidden" id="nbRibbon"></div></div>`;
    scene.append(deskWrap);
    const nbPanel = document.createElement('aside');
    nbPanel.className = 'panel nb-panel hidden';
    nbPanel.innerHTML = `<h2>📒 공책</h2>
      <input class="nb-title" id="nbTitle" maxlength="20">
      <h3 class="nbp-h">표지</h3><div class="row" id="nbCovers"></div>
      <h3 class="nbp-h">속지</h3><div class="row" id="nbStyles"></div>
      <h3 class="nbp-h">도구</h3><div class="row" id="nbModes"></div><div class="row" id="nbSub"></div>
      <h3 class="nbp-h">넘기기</h3>
      <div class="row nbp-nav"><button class="btn" id="nbPrev">‹ 이전</button><span id="nbPos"></span><button class="btn" id="nbNext">다음 ›</button></div>
      <div class="row"><button class="btn" id="nbMark"></button><button class="btn" id="nbGo">🔖 책갈피로</button></div>
      <div class="row"><button class="btn" id="nbDesk"></button><button class="btn" id="nbDel" title="공책 버리기">🗑</button></div>
      <button class="btn primary big" id="nbClose">📕 공책 덮기</button>`;
    $('.desk').append(nbPanel);
    const bookEl = $id('nbBook');
    let nb = null;
    let spread = 0;
    const tool = { mode: 'write', hl: HL[0], hlErase: false, sticker: STICKERS[0], crayon: CRAYON[0], drawErase: false };
    let lastSnd = 0;
    const snd = (ms, fn) => { const n = performance.now(); if (n - lastSnd > ms) { lastSnd = n; fn(); } };
    const curPage = k => nb.pages[spread * 2 + k];
    function touch(pg) { pg.at = fmt(new Date()); if (!pg.day) pg.day = pg.at; }
    function cpos(e, el, w, h) {
      const r = el.getBoundingClientRect();
      return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height };
    }
    function drawUrl(canvas, url) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.dataset.tok = url ? String(Math.random()) : '';
      if (!url) return;
      const tok = canvas.dataset.tok;
      const img = new Image();
      img.onload = () => { if (canvas.dataset.tok === tok) ctx.drawImage(img, 0, 0); };
      img.src = url;
    }
    function chip(label, on, fn) {
      const b = document.createElement('button');
      b.className = 'chip' + (on ? ' on' : '');
      b.textContent = label;
      b.addEventListener('click', fn);
      return b;
    }
    function swatchBtn(c, on, fn) {
      const b = document.createElement('button');
      b.className = 'swatch' + (on ? ' on' : '');
      b.style.background = c;
      b.addEventListener('click', () => { SFX.plink(); fn(); });
      return b;
    }
  
    function layout(text) {
      const cells = [];
      const map = [];
      let i = 0;
      for (const ch of text) {
        map[i] = cells.length;
        if (ch === '\n') {
          const r = cells.length % COLS;
          const padN = r === 0 ? COLS : COLS - r;
          for (let p = 0; p < padN; p++) cells.push('');
        } else {
          cells.push(ch);
        }
        i += ch.length;
      }
      map[i] = cells.length;
      return { cells, map };
    }
    function paintGrid(grid, ta, focused) {
      const { cells, map } = layout(ta.value);
      const c = map[ta.selectionStart];
      const caret = c === undefined ? cells.length : c;
      let html = '';
      for (let k = 0; k < COLS * ROWS; k++) {
        const ch = (cells[k] || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
        html += `<i class="${focused && k === caret ? 'caret' : ''}">${ch}</i>`;
      }
      grid.innerHTML = html;
    }
    function crayon(ctx, a, b) {
      ctx.save();
      ctx.lineCap = 'round';
      if (tool.drawErase) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      } else {
        ctx.strokeStyle = tool.crayon;
        for (let i = 0; i < 4; i++) {
          ctx.globalAlpha = rnd(0.35, 0.75);
          ctx.lineWidth = rnd(1.5, 3.5);
          ctx.beginPath();
          ctx.moveTo(a.x + rnd(-2.2, 2.2), a.y + rnd(-2.2, 2.2));
          ctx.lineTo(b.x + rnd(-2.2, 2.2), b.y + rnd(-2.2, 2.2));
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    function mark(ctx, a, b) {
      ctx.save();
      ctx.globalCompositeOperation = tool.hlErase ? 'destination-out' : 'source-over';
      ctx.strokeStyle = tool.hl;
      ctx.lineWidth = tool.hlErase ? 26 : 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }
  
    function buildLined(body, pg) {
      const date = document.createElement('div');
      date.className = 'nb-date';
      date.textContent = pg.text.trim() ? `적은 날 ${pg.at}` : '';
      const ta = document.createElement('textarea');
      ta.placeholder = '여기에 메모해요...';
      ta.value = pg.text;
      let prev = pg.text;
      ta.addEventListener('input', () => {
        if (ta.scrollHeight > ta.clientHeight + 1) {
          const pos = Math.max(0, ta.selectionStart - (ta.value.length - prev.length));
          ta.value = prev;
          ta.setSelectionRange(pos, pos);
          return toast('이 페이지가 꽉 찼어요. 다음 장에 이어서 써요 📄');
        }
        prev = ta.value;
        pg.text = ta.value;
        touch(pg);
        date.textContent = `적은 날 ${pg.at}`;
        snd(50, () => SFX.pencil());
        saveSoon();
      });
      body.append(date, ta);
    }
  
    function buildDiary(body, pg) {
      const day = new Date((pg.day || fmt(new Date())) + 'T00:00');
      body.innerHTML = `<div class="dy-head"><span>${day.getFullYear()}년 ${day.getMonth() + 1}월 ${day.getDate()}일 ${DAYS[day.getDay()]}요일</span><span class="dy-weather">날씨 ${WEATHER.map(w => `<button>${w}</button>`).join('')}</span></div>
        <div class="dy-title"><span>제목:</span><input maxlength="16"></div>
        <canvas class="dy-draw" width="410" height="196"></canvas>
        <div class="dy-gridwrap"><div class="dy-grid"></div><textarea spellcheck="false"></textarea></div>`;
      const wbtns = [...body.querySelectorAll('.dy-weather button')];
      const paintW = () => wbtns.forEach((b, i) => b.classList.toggle('on', pg.weather === WEATHER[i]));
      wbtns.forEach((b, i) => b.addEventListener('click', () => {
        pg.weather = WEATHER[i];
        touch(pg);
        SFX.plink(i);
        paintW();
        saveSoon();
      }));
      paintW();
      const ti = body.querySelector('.dy-title input');
      ti.value = pg.title || '';
      ti.addEventListener('input', () => { pg.title = ti.value; touch(pg); snd(50, () => SFX.pencil()); saveSoon(); });
  
      const cv = body.querySelector('.dy-draw');
      const cctx = cv.getContext('2d');
      drawUrl(cv, pg.draw);
      let last = null;
      cv.addEventListener('pointerdown', e => {
        if (tool.mode !== 'draw') return;
        cv.setPointerCapture(e.pointerId);
        last = cpos(e, cv, 410, 196);
        crayon(cctx, last, { x: last.x + 0.5, y: last.y + 0.5 });
      });
      cv.addEventListener('pointermove', e => {
        if (!last) return;
        const p = cpos(e, cv, 410, 196);
        crayon(cctx, last, p);
        last = p;
        snd(70, () => SFX.pencil());
      });
      const endDraw = () => {
        if (!last) return;
        last = null;
        pg.draw = cv.toDataURL();
        touch(pg);
        saveSoon();
      };
      cv.addEventListener('pointerup', endDraw);
      cv.addEventListener('pointercancel', endDraw);
  
      const grid = body.querySelector('.dy-grid');
      const ta = body.querySelector('.dy-gridwrap textarea');
      ta.value = pg.text;
      let prev = pg.text;
      const paint = () => paintGrid(grid, ta, document.activeElement === ta);
      ta.addEventListener('input', () => {
        if (layout(ta.value).cells.length > COLS * ROWS) {
          const pos = Math.max(0, ta.selectionStart - (ta.value.length - prev.length));
          ta.value = prev;
          ta.setSelectionRange(pos, pos);
          paint();
          return toast('칸이 다 찼어요! 다음 장에 이어서 써요 📄');
        }
        prev = ta.value;
        pg.text = ta.value;
        touch(pg);
        snd(50, () => SFX.pencil());
        saveSoon();
        paint();
      });
      ['keyup', 'focus', 'blur', 'select'].forEach(ev => ta.addEventListener(ev, paint));
      ta.addEventListener('pointerup', e => setTimeout(() => {
        const r = ta.getBoundingClientRect();
        const col = Math.min(COLS - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * COLS)));
        const row = Math.min(ROWS - 1, Math.max(0, Math.floor((e.clientY - r.top) / r.height * ROWS)));
        const target = row * COLS + col;
        const { map } = layout(ta.value);
        let best = ta.value.length;
        for (let idx = 0; idx <= ta.value.length; idx++) {
          if (map[idx] !== undefined && map[idx] >= target) { best = idx; break; }
        }
        ta.setSelectionRange(best, best);
        paint();
      }, 0));
      paint();
    }
  
    function paintStickers(layer, pg, popLast) {
      layer.innerHTML = '';
      const list = pg.stickers || [];
      list.forEach((s, i) => {
        const el = document.createElement('span');
        el.className = 'stk' + (popLast && i === list.length - 1 ? ' pop' : '');
        el.dataset.i = i;
        el.textContent = s.e;
        el.style.left = s.x + 'px';
        el.style.top = s.y + 'px';
        el.style.setProperty('--r', s.r + 'deg');
        layer.append(el);
      });
    }
  
    ['L', 'R'].forEach((side, k) => {
      const page = $id('pg' + side);
      const hl = page.querySelector('.pg-hl');
      const hctx = hl.getContext('2d');
      let last = null;
      hl.addEventListener('pointerdown', e => {
        if (tool.mode !== 'hl') return;
        hl.setPointerCapture(e.pointerId);
        last = cpos(e, hl, PW, PH);
        mark(hctx, last, { x: last.x + 0.5, y: last.y });
      });
      hl.addEventListener('pointermove', e => {
        if (!last) return;
        const p = cpos(e, hl, PW, PH);
        mark(hctx, last, p);
        last = p;
        snd(90, () => KSFX.squeeze());
      });
      const endHl = () => {
        if (!last) return;
        last = null;
        curPage(k).ink = hl.toDataURL();
        saveSoon();
      };
      hl.addEventListener('pointerup', endHl);
      hl.addEventListener('pointercancel', endHl);
  
      const layer = page.querySelector('.pg-stk');
      layer.addEventListener('pointerdown', e => {
        if (tool.mode !== 'sticker') return;
        const pg = curPage(k);
        pg.stickers = pg.stickers || [];
        const hit = e.target.closest('.stk');
        if (hit) {
          pg.stickers.splice(Number(hit.dataset.i), 1);
          SFX.tape(0.15);
        } else {
          const p = cpos(e, layer, PW, PH);
          pg.stickers.push({ e: tool.sticker, x: Math.round(p.x), y: Math.round(p.y), r: Math.round(rnd(-18, 18)) });
          SFX.pop();
        }
        paintStickers(layer, pg, !hit);
        saveSoon();
      });
  
      page.querySelector('.nb-copy').addEventListener('click', () => {
        const pg = curPage(k);
        const text = ((pg.title ? pg.title + '\n' : '') + pg.text).trim();
        if (!text) return toast('빈 페이지예요');
        if (S.sealed) return toast('이미 봉인한 편지예요');
        letter.value = (letter.value.trim() ? letter.value.trimEnd() + '\n\n' : '') + text;
        localStorage.setItem('draft', letter.value);
        SFX.paper();
        toast('편지에 옮겨 적었어요 ✍️ (공책을 덮으면 보여요)');
      });
    });
  
    function paintPages() {
      while (nb.pages.length < spread * 2 + 2) nb.pages.push(newPage());
      ['L', 'R'].forEach((side, k) => {
        const pg = curPage(k);
        const page = $id('pg' + side);
        const body = page.querySelector('.pg-body');
        body.innerHTML = '';
        if (nb.style === 'diary') buildDiary(body, pg);
        else buildLined(body, pg);
        drawUrl(page.querySelector('.pg-hl'), pg.ink);
        paintStickers(page.querySelector('.pg-stk'), pg, false);
        page.querySelector('.pg-num').textContent = spread * 2 + k + 1;
      });
      const total = Math.ceil(nb.pages.length / 2);
      $id('nbPos').textContent = `${spread + 1} / ${total}`;
      $id('nbNext').textContent = spread + 1 >= total ? '＋ 새 장' : '다음 ›';
      $id('nbPrev').disabled = spread === 0;
      $id('nbRibbon').classList.toggle('hidden', nb.bookmark !== spread);
      $id('nbMark').textContent = nb.bookmark === spread ? '🔖 책갈피 빼기' : '🔖 여기 꽂기';
    }
  
    function paintTools() {
      const modes = $id('nbModes');
      modes.innerHTML = '';
      if (tool.mode === 'draw' && nb.style !== 'diary') tool.mode = 'write';
      MODES.forEach(([m, label], i) => {
        if (m === 'draw' && nb.style !== 'diary') return;
        modes.append(chip(label, tool.mode === m, () => { tool.mode = m; SFX.plink(i); paintTools(); }));
      });
      MODES.forEach(([m]) => bookEl.classList.toggle('mode-' + m, tool.mode === m));
      const sub = $id('nbSub');
      sub.innerHTML = '';
      if (tool.mode === 'write') sub.innerHTML = '<span class="tip" style="margin:0">자유롭게 적어요 ✍️</span>';
      if (tool.mode === 'hl') {
        HL.forEach(c => sub.append(swatchBtn(c, !tool.hlErase && tool.hl === c, () => { tool.hl = c; tool.hlErase = false; paintTools(); })));
        sub.append(chip('🧽 지우개', tool.hlErase, () => { tool.hlErase = true; paintTools(); }));
      }
      if (tool.mode === 'sticker') {
        STICKERS.forEach(s => {
          const b = document.createElement('button');
          b.className = 'stk-btn' + (tool.sticker === s ? ' on' : '');
          b.textContent = s;
          b.addEventListener('click', () => { tool.sticker = s; SFX.pop(); paintTools(); });
          sub.append(b);
        });
      }
      if (tool.mode === 'draw') {
        CRAYON.forEach(c => sub.append(swatchBtn(c, !tool.drawErase && tool.crayon === c, () => { tool.crayon = c; tool.drawErase = false; paintTools(); })));
        sub.append(chip('🧽 지우개', tool.drawErase, () => { tool.drawErase = true; paintTools(); }));
      }
    }
  
    COVERS.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'swatch';
      b.style.background = c;
      b.addEventListener('click', () => { nb.cover = c; SFX.plink(i); saveSoon(); paintChrome(); });
      $id('nbCovers').append(b);
    });
    NB_STYLES.forEach(([s, label], i) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.dataset.s = s;
      b.textContent = label;
      b.addEventListener('click', () => {
        if (nb.style === s) return;
        nb.style = s;
        SFX.plink(i + 2);
        saveSoon();
        paintChrome();
        paintTools();
        paintPages();
      });
      $id('nbStyles').append(b);
    });
    function paintChrome() {
      bookEl.style.setProperty('--cover', nb.cover);
      NB_STYLES.forEach(([s]) => bookEl.classList.toggle('nbs-' + s, nb.style === s));
      $$('#nbCovers .swatch').forEach((b, i) => b.classList.toggle('on', COVERS[i] === nb.cover));
      $$('#nbStyles .chip').forEach(b => b.classList.toggle('on', b.dataset.s === nb.style));
      $id('nbDesk').textContent = nb.onDesk ? '📥 덮으면 서랍에' : '📌 덮으면 책상 위에';
    }
    function fit() {
      const s = Math.min(1, (scene.clientWidth - 30) / 960, (scene.clientHeight - 20) / 600);
      deskWrap.style.width = (960 * s) + 'px';
      deskWrap.style.height = (600 * s) + 'px';
      bookEl.style.transform = `scale(${s})`;
    }
    window.addEventListener('resize', () => { if (document.body.classList.contains('nb-mode')) fit(); });
  
    function openBook(id) {
      nb = books.find(b => b.id === id);
      if (!nb) return;
      spread = hasMark(nb) ? nb.bookmark : 0;
      tool.mode = 'write';
      $id('nbTitle').value = nb.title;
      document.body.classList.add('nb-mode');
      nbPanel.classList.remove('hidden');
      deskWrap.classList.remove('hidden');
      deskWrap.classList.remove('show');
      void deskWrap.offsetWidth;
      deskWrap.classList.add('show');
      SFX.paper();
      fit();
      paintChrome();
      paintTools();
      paintPages();
    }
    function closeBook() {
      saveNow();
      document.body.classList.remove('nb-mode');
      nbPanel.classList.add('hidden');
      deskWrap.classList.add('hidden');
      SFX.paper();
      renderDeskBooks();
      if (!overlay.classList.contains('hidden')) renderBooks();
    }
    function turn(dir) {
      const t = document.createElement('div');
      t.className = 'nb-turn ' + dir;
      bookEl.append(t);
      SFX.paper();
      setTimeout(paintPages, 260);
      setTimeout(() => t.remove(), 560);
    }
  
    $id('nbTitle').addEventListener('input', e => { nb.title = e.target.value.trim() || '이름 없는 공책'; saveSoon(); });
    $id('nbNext').addEventListener('click', () => {
      const total = Math.ceil(nb.pages.length / 2);
      if (spread + 1 >= total) { nb.pages.push(newPage(), newPage()); saveSoon(); toast('새 장을 펼쳤어요 📄'); }
      spread++;
      turn('next');
    });
    $id('nbPrev').addEventListener('click', () => {
      if (spread === 0) return;
      spread--;
      turn('prev');
    });
    $id('nbMark').addEventListener('click', () => {
      nb.bookmark = nb.bookmark === spread ? null : spread;
      saveSoon();
      SFX.plink(5);
      paintPages();
      toast(hasMark(nb) ? '🔖 책갈피를 꽂았어요' : '책갈피를 뺐어요');
    });
    $id('nbGo').addEventListener('click', () => {
      if (!hasMark(nb)) return toast('아직 책갈피가 없어요');
      if (nb.bookmark === spread) return toast('여기가 책갈피 자리예요 🔖');
      const dir = nb.bookmark > spread ? 'next' : 'prev';
      spread = nb.bookmark;
      turn(dir);
    });
    $id('nbDesk').addEventListener('click', () => {
      nb.onDesk = !nb.onDesk;
      if (nb.onDesk && !nb.deskPos) nb.deskPos = { x: 62 + rnd(-4, 4), y: 38 + rnd(-6, 6) };
      saveSoon();
      SFX.plink(3);
      paintChrome();
      toast(nb.onDesk ? '덮으면 책상 위에 둘게요 📌' : '덮으면 서랍에 넣을게요 🗄');
    });
    $id('nbDel').addEventListener('click', () => {
      if (!confirm(`"${nb.title}" 공책을 버릴까요? 안에 적은 내용도 모두 사라져요.`)) return;
      books = books.filter(b => b.id !== nb.id);
      saveNow();
      SFX.crinkle(0.5);
      closeBook();
    });
    $id('nbClose').addEventListener('click', closeBook);
    const hist = [];
    const snap = pgs => {
      hist.push(pgs.map(pg => ({ pg: pg, data: JSON.stringify(pg) })));
      if (hist.length > 30) hist.shift();
    };
    function undo() {
      const group = hist.pop();
      if (!group) return toast('되돌릴 게 없어요');
      group.forEach(h => {
        Object.keys(h.pg).forEach(key => delete h.pg[key]);
        Object.assign(h.pg, JSON.parse(h.data));
      });
      saveSoon();
      if (nb) paintPages();
      SFX.paper();
      toast('↩ 되돌렸어요');
    }
    function clearBoth(field, name) {
      const pages = [curPage(0), curPage(1)].filter(pg => (field === 'stickers' ? (pg.stickers || []).length : pg[field]));
      if (!pages.length) return toast('지울 게 없어요');
      snap(pages);
      pages.forEach(pg => { delete pg[field]; });
      saveSoon();
      paintPages();
      SFX.crinkle(0.3);
      toast(`🗑 ${name} 정리 완료! (↩ 되돌리기 가능)`);
    }
  
    bookEl.addEventListener('pointerdown', e => {
      const page = e.target.closest('.nb-page');
      if (!page) return;
      const pg = curPage(page.id === 'pgR' ? 1 : 0);
      const t = e.target;
      if ((tool.mode === 'draw' && t.classList.contains('dy-draw')) ||
          (tool.mode === 'hl' && t.classList.contains('pg-hl')) ||
          (tool.mode === 'sticker' && t.closest('.pg-stk'))) snap([pg]);
    }, true);
  
    document.addEventListener('keydown', e => {
      if (!document.body.classList.contains('nb-mode')) return;
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      const a = document.activeElement;
      if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT')) return;
      e.preventDefault();
      undo();
    });
  
    const baseTools = paintTools;
    paintTools = function () {
      baseTools();
      const sub = $id('nbSub');
      if (tool.mode === 'hl') sub.append(chip('🗑 형광펜 다 지우기', false, () => clearBoth('ink', '형광펜')));
      if (tool.mode === 'sticker') sub.append(chip('🗑 스티커 다 떼기', false, () => clearBoth('stickers', '스티커')));
      sub.append(chip('↩ 되돌리기', false, undo));
    };
  
    const baseDiary = buildDiary;
    buildDiary = function (body, pg) {
      baseDiary(body, pg);
      const b = document.createElement('button');
      b.className = 'dy-clear';
      b.textContent = '🗑 그림 지우기';
      b.addEventListener('click', () => {
        if (!pg.draw) return toast('지울 그림이 없어요');
        snap([pg]);
        delete pg.draw;
        drawUrl(body.querySelector('.dy-draw'), null);
        saveSoon();
        SFX.crinkle(0.3);
        toast('그림을 지웠어요 (↩ 되돌리기 가능)');
      });
      body.append(b);
    };
  
    ['L', 'R'].forEach((side, k) => {
      const foot = $id('pg' + side).querySelector('.nb-foot');
      const b = document.createElement('button');
      b.className = 'nb-copy';
      b.textContent = '🧹 페이지 비우기';
      b.addEventListener('click', () => {
        if (!confirm('이 페이지를 깨끗하게 비울까요? (↩ 되돌리기로 살릴 수 있어요)')) return;
        const pg = curPage(k);
        snap([pg]);
        ['title', 'draw', 'ink', 'stickers', 'weather', 'day'].forEach(f => { delete pg[f]; });
        pg.text = '';
        pg.at = fmt(new Date());
        saveSoon();
        paintPages();
        SFX.crinkle(0.4);
        toast('페이지를 비웠어요');
      });
      foot.querySelector('.nb-copy').before(b);
    });
  
    const eraseStyle = document.createElement('style');
    eraseStyle.textContent = `
      .dy-clear { display: none; position: absolute; right: 8px; top: 78px; z-index: 2; padding: 3px 8px; border: none; border-radius: 8px; cursor: pointer; font-family: 'Gaegu'; font-size: 14px; color: #a8506a; background: rgba(255,250,240,.92); box-shadow: 0 1px 3px rgba(0,0,0,.2); }
      .nb-book.mode-draw .dy-clear { display: block; }
    `;
    document.head.append(eraseStyle);
    scene.addEventListener('pointermove', e => {
        const el = e.target.closest && e.target.closest('.desk-nb.dragging');
        pull.classList.toggle('drop-here', !!el && e.clientY > window.innerHeight - 90);
      });
      scene.addEventListener('pointerup', e => {
        const el = e.target.closest && e.target.closest('.desk-nb');
        pull.classList.remove('drop-here');
        if (!el || e.clientY < window.innerHeight - 90) return;
        const title = el.querySelector('.lbl').textContent;
        const b = books.find(x => x.onDesk && x.title === title);
        if (!b) return;
        setTimeout(() => {
          b.onDesk = false;
          saveNow();
          renderDeskBooks();
          KSFX.roll();
          setTimeout(() => SFX.box(), 150);
          toast(`📒 "${b.title}"를 서랍에 넣었어요`);
        }, 0);
      });
      const dropStyle = document.createElement('style');
      dropStyle.textContent = `.dw-pull.drop-here { transform: translateY(-10px); box-shadow: 0 -4px 18px 6px rgba(255,216,107,.7); }`;
      document.head.append(dropStyle);
      $('header h1').after($('.steps'));
  const stepStyle = document.createElement('style');
  stepStyle.textContent = `
    header .steps { flex-shrink: 0; padding: 0; gap: 6px; }
    header .step { font-size: 17px; padding: 5px 12px; box-shadow: 0 2px 0 rgba(0,0,0,.3); }
    header .step.active { transform: translateY(-2px); }
  `;
  document.head.append(stepStyle);  
    chrome.storage.local.get('notebooks').then(r => {
      books = r.notebooks || [];
      renderDeskBooks();
    });
    paintPaperType();
    console.log('✅ drawer.js 준비 완료!');
  })();