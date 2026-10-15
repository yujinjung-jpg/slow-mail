(() => {
    const $id = id => document.getElementById(id);
    const scene = $('#scene');
    const rnd = (a, b) => a + Math.random() * (b - a);
    const bump = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  
    const OPTS = {
      lamp: [['off', '끄기'], ['warm', '🕯 따뜻한 빛'], ['white', '💡 하얀 빛'], ['pink', '🌸 분홍 빛']],
      rain: [[false, '끄기'], [true, '🌧 켜기']],
      wood: [['walnut', '월넛'], ['oak', '오크'], ['white', '화이트'], ['cherry', '체리']],
      mat: [['none', '없음'], ['check', '체크 테이블보'], ['lace', '레이스 도일리'], ['felt', '펠트 매트']],
      cupView: [['side', '옆에서'], ['top', '위에서']]
    };
    const TITLES = { lamp: '스탠드 조명', rain: '빗소리', wood: '책상 나무', mat: '깔개', cupView: '찻잔 보기' };
    const DEF = { lamp: 'warm', rain: false, rainVol: 30, wood: 'walnut', mat: 'none', cupView: 'side' };
    let P;
    try { P = Object.assign({}, DEF, JSON.parse(localStorage.getItem('deskPrefs') || '{}')); } catch (e) { P = Object.assign({}, DEF); }
    const save = () => localStorage.setItem('deskPrefs', JSON.stringify(P));
  
    let ac = null;
    let out = null;
    let nbuf = null;
    function actx() {
      if (!ac) {
        ac = new AudioContext();
        out = ac.createGain();
        out.connect(ac.destination);
        nbuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
        const d = nbuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
      out.gain.value = SFX.muted ? 0 : 0.9;
      return ac;
    }
    function tone(f, t, dur, type, vol) {
      if (SFX.muted) return;
      const c = actx();
      const s = c.currentTime + t;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, s + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
      o.connect(g);
      g.connect(out);
      o.start(s);
      o.stop(s + dur + 0.05);
    }
  
    SFX.chime = () => {
      [[1046.5, 0], [1318.5, 0.09], [1568, 0.18], [2093, 0.3]].forEach(([f, t]) => {
        tone(f, t, 0.9, 'triangle', 0.14);
        tone(f * 2, t, 0.3, 'sine', 0.03);
      });
      [2637, 3136].forEach((f, i) => tone(f, 0.42 + i * 0.07, 0.5, 'sine', 0.05));
    };
    SFX.jingle = () => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => tone(f, k * 0.08, 0.45, 'triangle', 0.14));
    };
  
    let rain = null;
    const rainLevel = () => Math.max(0.02, P.rainVol / 100 * 0.6);
    function makeImpulse(c) {
      const len = Math.floor(c.sampleRate * 1.6);
      const buf = c.createBuffer(2, len, c.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      return buf;
    }
    function plip(c, bus, f, vol, len) {
      const t = c.currentTime;
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * rnd(1.3, 1.8), t + 0.04);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      const pan = c.createStereoPanner();
      pan.pan.value = rnd(-0.8, 0.8);
      o.connect(g);
      g.connect(pan);
      pan.connect(bus);
      o.start(t);
      o.stop(t + len + 0.05);
    }
    function rainStart() {
      if (rain || SFX.muted) return;
      const c = actx();
      const bus = c.createGain();
      bus.gain.setValueAtTime(0.0001, c.currentTime);
      bus.gain.exponentialRampToValueAtTime(rainLevel(), c.currentTime + 3);
      const verb = c.createConvolver();
      verb.buffer = makeImpulse(c);
      const wet = c.createGain();
      wet.gain.value = 0.35;
      bus.connect(out);
      bus.connect(verb);
      verb.connect(wet);
      wet.connect(out);
      const src = c.createBufferSource();
      src.buffer = nbuf;
      src.loop = true;
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      const hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 150;
      const bed = c.createGain();
      bed.gain.value = 0.22;
      src.connect(lp);
      lp.connect(hp);
      hp.connect(bed);
      bed.connect(bus);
      src.start();
      let alive = true;
      const drop = () => {
        if (!alive) return;
        plip(c, bus, rnd(1400, 3200), rnd(0.08, 0.22), rnd(0.04, 0.09));
        setTimeout(drop, rnd(110, 420));
      };
      const drip = () => {
        if (!alive) return;
        plip(c, bus, rnd(600, 900), rnd(0.15, 0.25), 0.12);
        setTimeout(drip, rnd(1200, 2600));
      };
      drop();
      drip();
      rain = {
        bus: bus,
        stop() {
          alive = false;
          bus.gain.setTargetAtTime(0.0001, c.currentTime, 0.5);
          setTimeout(() => { try { src.stop(); } catch (e) {} }, 2500);
        }
      };
    }
    function syncRain() {
      if (P.rain && !SFX.muted) rainStart();
      else if (rain) { rain.stop(); rain = null; }
    }
  
    const style = document.createElement('style');
    style.textContent = `
      body.wood-oak { background-color: #a77a4c; background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.3) 0 3px, rgba(255,255,255,.08) 3px 5px, transparent 5px 190px), var(--wood), linear-gradient(90deg, rgba(255,255,255,.06), rgba(0,0,0,.05) 50%, rgba(255,255,255,.05)), linear-gradient(180deg, #c49464, #9c7044); }
      body.wood-white { background-color: #e3dacb; background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 3px, rgba(255,255,255,.3) 3px 5px, transparent 5px 190px), var(--wood), linear-gradient(90deg, rgba(255,255,255,.1), rgba(0,0,0,.03) 50%, rgba(255,255,255,.1)), linear-gradient(180deg, #f0e9de, #d8cdbb); }
      body.wood-cherry { background-color: #8a4a3a; background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.35) 0 3px, rgba(255,255,255,.06) 3px 5px, transparent 5px 190px), var(--wood), linear-gradient(90deg, rgba(255,255,255,.05), rgba(0,0,0,.06) 50%, rgba(255,255,255,.04)), linear-gradient(180deg, #a65a48, #7a3a2c); }
  
      .desk-mat { position: absolute; left: 6%; top: 3%; width: 74%; height: 92%; z-index: 0; pointer-events: none; border-radius: 14px; box-shadow: 0 6px 14px rgba(0,0,0,.25); }
      .mat-check { background: repeating-linear-gradient(0deg, rgba(214,69,69,.32) 0 24px, transparent 24px 48px), repeating-linear-gradient(90deg, rgba(214,69,69,.32) 0 24px, transparent 24px 48px), #fff8ef; transform: rotate(-1.2deg); }
      .mat-lace { left: 14%; width: 58%; border-radius: 50%; background: radial-gradient(circle, transparent 2.5px, rgba(255,255,255,.9) 3.5px) 0 0 / 14px 14px, repeating-conic-gradient(rgba(255,255,255,.95) 0 6deg, rgba(255,255,255,.7) 6deg 12deg); border: 10px dotted rgba(255,255,255,.95); }
      .mat-felt { background: var(--grain), #4e6b5c; outline: 3px dashed rgba(255,255,255,.35); outline-offset: -14px; }
  
      .paper, .envelope { z-index: 6; }
      .lamp-pool { position: absolute; left: 42%; top: 48%; width: 780px; height: 700px; transform: translate(-50%, -50%); z-index: 1; pointer-events: none; border-radius: 50%; background: radial-gradient(ellipse at 50% 45%, var(--lampc, transparent) 0 30%, transparent 68%); opacity: 0; transition: opacity .8s; }
      .lamp-pool.on { opacity: 1; }
      .scene.lamp-warm { --lampc: rgba(255,214,150,.4); }
      .scene.lamp-white { --lampc: rgba(255,250,235,.34); }
      .scene.lamp-pink { --lampc: rgba(255,190,205,.36); }
      .scene.lamp-on .paper, .scene.lamp-on .envelope { box-shadow: 0 1px 1px rgba(0,0,0,.1), 0 0 70px 10px var(--lampc), 0 14px 30px rgba(0,0,0,.4); }
  
      .deco-drawer { position: fixed; left: 0; top: 0; bottom: 0; width: 330px; z-index: 12; padding: 20px; overflow-y: auto; background: var(--grain), #fffaf0; box-shadow: 6px 0 20px rgba(0,0,0,.35); transform: translateX(-105%); transition: transform .4s cubic-bezier(.3,1.2,.5,1); }
      .deco-drawer.open { transform: none; }
      .deco-drawer h2 { font-family: 'Gaegu'; font-size: 28px; margin: 0 0 4px; }
      .deco-drawer h3 { font-family: 'Gaegu'; font-size: 20px; margin: 14px 0 8px; color: #6b4a2e; }
      .deco-drawer .close, .arc-inner .close { position: absolute; top: 14px; right: 14px; }
      .rain-vol { width: 100%; accent-color: #ff9f7a; }
  
      .archive { position: fixed; inset: 0; z-index: 9; display: flex; align-items: center; justify-content: center; background: rgba(30,18,6,.6); }
      .arc-inner { position: relative; width: min(980px, 94vw); max-height: 90vh; overflow-y: auto; padding: 24px 28px; border-radius: 16px; background: var(--grain), #fffaf0; box-shadow: 0 20px 40px rgba(0,0,0,.45); }
      .arc-inner h2 { font-family: 'Gaegu'; font-size: 32px; margin: 0; }
      .arc-stats { color: #8a6a4c; margin: 4px 0 12px; font-size: 14px; }
      .arc-search { width: 100%; padding: 8px 12px; margin-bottom: 14px; border: 2px solid #e6d5b8; border-radius: 10px; font-family: 'Gowun Dodum'; font-size: 15px; background: #fff; }
      .arc-year { margin-bottom: 18px; }
      .arc-year h3 { font-family: 'Gaegu'; font-size: 22px; margin: 0 0 6px; color: #6b4a2e; }
      .arc-shelf { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; padding: 14px 14px 22px; border-radius: 6px; box-shadow: inset 0 6px 12px rgba(0,0,0,.25);
        background: linear-gradient(transparent calc(100% - 14px), #6f4526 calc(100% - 14px)), var(--wood) 0 0 / 400px 400px, linear-gradient(#c99560, #a8723b); }
      .arc-item { position: relative; width: 96px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; font-family: 'Gaegu'; font-size: 16px; color: #fff6e0; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
      .arc-item small { font-family: 'Gowun Dodum'; font-size: 11px; max-width: 96px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .arc-item.arrived .mini-box { animation: bounce 1s infinite; box-shadow: 0 0 16px 4px rgba(255,220,120,.85); }
      .arc-env { position: relative; display: block; width: 70px; height: 46px; border-radius: 4px; background: var(--grain), #f1ddb7; box-shadow: 0 3px 5px rgba(0,0,0,.3); }
      .arc-env::before { content: ''; position: absolute; inset: 0; background: #f6e6c6; clip-path: polygon(0 0, 100% 0, 50% 60%); }
      .arc-env i { position: absolute; left: 50%; top: 60%; width: 16px; height: 16px; margin: -8px; border-radius: 50%; background: var(--wax); box-shadow: inset 0 -2px 3px rgba(0,0,0,.3); }
      .arc-del { position: absolute; right: 2px; top: -8px; width: 22px; height: 22px; border-radius: 50%; border: none; background: #fffaf0; color: #a8506a; font-size: 12px; cursor: pointer; opacity: 0; transition: .2s; }
      .arc-item:hover .arc-del { opacity: 1; }
      .arc-empty { color: #8a6a4c; font-family: 'Gaegu'; font-size: 20px; padding: 20px; text-align: center; }
      .arc-ico { font-size: 34px; line-height: 44px; }
      .shelf-more { color: #fff6e0; font-family: 'Gaegu'; font-size: 18px; align-self: center; }
    `;
    document.head.append(style);
  
    const mat = document.createElement('div');
    mat.className = 'desk-mat hidden';
    scene.prepend(mat);
    const pool = document.createElement('div');
    pool.className = 'lamp-pool';
    mat.after(pool);
  
    const anchor = $('button[title="티타임"]') || $('#muteBtn');
    const decoBtn = document.createElement('button');
    decoBtn.className = 'mute';
    decoBtn.title = '책상 꾸미기';
    decoBtn.textContent = '🎨';
    anchor.before(decoBtn);
  
    const drawer = document.createElement('div');
    drawer.className = 'deco-drawer';
    drawer.innerHTML = '<button class="close" id="decoClose">✕</button><h2>🎨 책상 꾸미기</h2><p class="tip">찻잔은 책상 위에서 끌어서 옮길 수 있어요.</p>';
    document.body.append(drawer);
    decoBtn.addEventListener('click', () => { drawer.classList.add('open'); SFX.paper(); });
    $id('decoClose').addEventListener('click', () => { drawer.classList.remove('open'); SFX.click(); });
  
    Object.keys(OPTS).forEach(k => {
      const h = document.createElement('h3');
      h.textContent = TITLES[k];
      const row = document.createElement('div');
      row.className = 'row';
      drawer.append(h, row);
      OPTS[k].forEach(([v, label], i) => {
        const b = document.createElement('button');
        b.className = 'chip' + (P[k] === v ? ' on' : '');
        b.textContent = label;
        b.addEventListener('click', () => {
          P[k] = v;
          save();
          if (k === 'lamp') { tone(2200, 0, 0.03, 'square', 0.05); tone(1400, 0.04, 0.03, 'square', 0.04); }
          else SFX.plink(i);
          row.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
          apply();
        });
        row.append(b);
      });
      if (k === 'rain') {
        const vol = document.createElement('input');
        vol.type = 'range';
        vol.min = '5';
        vol.max = '100';
        vol.value = String(P.rainVol);
        vol.className = 'rain-vol';
        vol.title = '빗소리 크기';
        vol.addEventListener('input', () => {
          P.rainVol = Number(vol.value);
          save();
          if (rain) rain.bus.gain.setTargetAtTime(rainLevel(), ac.currentTime, 0.2);
        });
        drawer.append(vol);
      }
    });
  
    function apply() {
      ['walnut', 'oak', 'white', 'cherry'].forEach(w => document.body.classList.toggle('wood-' + w, P.wood === w));
      mat.className = 'desk-mat' + (P.mat === 'none' ? ' hidden' : ' mat-' + P.mat);
      ['warm', 'white', 'pink'].forEach(c => scene.classList.toggle('lamp-' + c, P.lamp === c));
      scene.classList.toggle('lamp-on', P.lamp !== 'off');
      pool.classList.toggle('on', P.lamp !== 'off');
      syncRain();
      if (window.paintTeaDesk) window.paintTeaDesk();
    }
  
    let arcTab = 'all';
    const archive = document.createElement('div');
    archive.className = 'archive hidden';
    archive.innerHTML = `<div class="arc-inner">
        <button class="close" id="arcClose">✕</button>
        <h2>📚 편지 보관함</h2>
        <p class="arc-stats" id="arcStats"></p>
        <div class="row" id="arcTabs"></div>
        <input class="arc-search" id="arcSearch" placeholder="열어본 편지 내용으로 찾기 🔍">
        <div id="arcShelves"></div>
      </div>`;
    document.body.append(archive);
    const openArchive = () => { archive.classList.remove('hidden'); SFX.paper(); renderArchive(); };
    const closeArchive = () => { archive.classList.add('hidden'); SFX.click(); };
    $id('arcClose').addEventListener('click', closeArchive);
    archive.addEventListener('click', e => { if (e.target === archive) closeArchive(); });
    $id('arcSearch').addEventListener('input', () => renderArchive());
    [['all', '전체'], ['sealed', '⏳ 기다리는 중'], ['arrived', '📬 도착'], ['opened', '💌 열어본 편지']].forEach(([k, label], i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (arcTab === k ? ' on' : '');
      b.textContent = label;
      b.addEventListener('click', () => {
        arcTab = k;
        SFX.plink(i);
        $$('#arcTabs .chip').forEach(x => x.classList.toggle('on', x === b));
        renderArchive();
      });
      $id('arcTabs').append(b);
    });
  
    function arcItem(L) {
      const it = document.createElement('div');
      const d = dday(L.deliverAt);
      it.className = 'arc-item ' + L.status;
      it.title = `${L.createdAt}에 보냄 · ${L.deliverAt} 도착`;
      if (L.status === 'opened') {
        it.innerHTML = `<span class="arc-env" style="--wax:${L.wax || '#b3262d'}"><i></i></span><b>${L.deliverAt.slice(5).replace('-', '/')}</b><small></small><button class="arc-del" title="지우기">✕</button>`;
        it.querySelector('small').textContent = (L.text || '').split('\n')[0].slice(0, 14);
        it.querySelector('.arc-del').addEventListener('click', async e => {
          e.stopPropagation();
          if (!confirm('이 편지를 보관함에서 지울까요? 되돌릴 수 없어요.')) return;
          const { letters = [] } = await chrome.storage.local.get('letters');
          await chrome.storage.local.set({ letters: letters.filter(x => x.id !== L.id) });
          SFX.paper();
        });
      } else {
        it.innerHTML = `<span class="mini-box bx-${L.box || 'kraft'}"></span><b>${L.status === 'sealed' ? 'D-' + d : '도착!'}</b><small>${L.deliverAt}</small>`;
      }
      it.addEventListener('click', () => {
        if (L.status === 'sealed') { bump(it, 'shake'); SFX.box(); toast(`아직 열 수 없어요 🔒 ${d}일 남았어요`); }
        else openBox(L);
      });
      return it;
    }
  
    async function renderArchive() {
      const { letters = [] } = await chrome.storage.local.get('letters');
      const cnt = s => letters.filter(L => L.status === s).length;
      $id('arcStats').textContent = `지금까지 보낸 편지 ${letters.length}통 · 기다리는 상자 ${cnt('sealed')}개 · 도착 ${cnt('arrived')}개 · 열어본 편지 ${cnt('opened')}통`;
      const q = $id('arcSearch').value.trim();
      let list = letters.filter(L => arcTab === 'all' || L.status === arcTab);
      if (q) list = list.filter(L => L.status === 'opened' && (L.text || '').includes(q));
      const wrap = $id('arcShelves');
      wrap.innerHTML = '';
      if (!list.length) {
        wrap.innerHTML = `<p class="arc-empty">${q ? '찾는 편지가 없어요. 아직 안 연 편지는 비밀이라 검색되지 않아요 🤫' : '여기는 아직 비어 있어요'}</p>`;
        return;
      }
      const years = {};
      list.forEach(L => { const y = L.deliverAt.slice(0, 4); (years[y] = years[y] || []).push(L); });
      Object.keys(years).sort().forEach(y => {
        const sec = document.createElement('div');
        sec.className = 'arc-year';
        const h = document.createElement('h3');
        h.textContent = `${y}년에 도착 (${years[y].length})`;
        const shelf = document.createElement('div');
        shelf.className = 'arc-shelf';
        years[y].sort((a, b) => a.deliverAt.localeCompare(b.deliverAt)).forEach(L => shelf.append(arcItem(L)));
        sec.append(h, shelf);
        wrap.append(sec);
      });
    }
  
    function miniBtn(L) {
      const d = dday(L.deliverAt);
      const b = document.createElement('button');
      b.className = `mini ${L.status}`;
      b.title = `${L.createdAt}에 보냄 · ${L.deliverAt} 도착`;
      b.innerHTML = `<span class="mini-box bx-${L.box || 'kraft'}"></span><span>${L.status === 'sealed' ? 'D-' + d : '도착!'}</span>`;
      b.addEventListener('click', () => {
        if (L.status === 'sealed') { bump(b, 'shake'); SFX.box(); toast(`아직 열 수 없어요 🔒 ${d}일 남았어요`); }
        else openBox(L);
      });
      return b;
    }
  
    renderShelf = async function () {
      const { letters = [] } = await chrome.storage.local.get('letters');
      const shelf = $('#shelf');
      shelf.innerHTML = '';
      const arrived = letters.filter(L => L.status === 'arrived');
      const sealed = letters.filter(L => L.status === 'sealed').sort((a, b) => a.deliverAt.localeCompare(b.deliverAt));
      arrived.concat(sealed.slice(0, 5)).forEach(L => shelf.append(miniBtn(L)));
      if (sealed.length > 5) {
        const more = document.createElement('span');
        more.className = 'shelf-more';
        more.textContent = `+${sealed.length - 5}`;
        shelf.append(more);
      }
      const ab = document.createElement('button');
      ab.className = 'mini';
      ab.innerHTML = `<span class="arc-ico">📚</span><span>보관함 ${letters.length}</span>`;
      ab.addEventListener('click', openArchive);
      shelf.append(ab);
      if (!archive.classList.contains('hidden')) renderArchive();
    };
  
    apply();
    renderShelf();
    document.addEventListener('pointerdown', syncRain);
    $('#muteBtn').addEventListener('click', () => setTimeout(syncRain, 0));
    console.log('✅ room.js 준비 완료!');
  })();