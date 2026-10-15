const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dday = s => Math.round((new Date(s + 'T00:00') - new Date(fmt(new Date()) + 'T00:00')) / 86400000);
const wait = ms => new Promise(r => setTimeout(r, ms));

const PAPERS = { cream: '#fdf6e3', pink: '#fde4ec', sky: '#e3f0fd', mint: '#e6f7e9' };
const SNACKS = ['🍪', '🍬', '🍫', '🧁', '🍩', '🍭', '🍓', '🌸', '🍀', '⭐'];
const HARD = ['🍬', '🍫', '🍭', '⭐'];
const RIBBONS = ['#e75480', '#d64545', '#4a7bd0', '#f2b134', '#7cbf6b', '#9b6bd0'];
const WAX = ['#b3262d', '#e8a3b5', '#2c3e75', '#7f9cc4', '#2f6b3a', '#c9a227', '#9aa3ad', '#5a3a2a'];
const SYMBOLS = ['♥', '★', '✿', '☾', '♪', '✉', '❀', '☀', '✦'];
const PENS = ['#4a3423', '#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6', '#ff8fb1', '#ffffff'];
const BOXES = [
  { id: 'kraft', name: '크라프트' },
  { id: 'pink', name: '핑크 도트' },
  { id: 'gingham', name: '체크 피크닉' },
  { id: 'mint', name: '민트 도트' },
  { id: 'night', name: '별밤' }
];

const DEFAULT = () => ({
  paper: 'cream', image: null, gifts: [], ribbon: RIBBONS[0], wrapped: false,
  wax: WAX[0], symbol: SYMBOLS[0], initial: '', folded: false, lit: false, melt: 0, sealed: false, box: 'kraft'
});
const S = DEFAULT();
let cur = 1;

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

function choices(el, list, paint, get, set) {
  const btns = list.map((v, i) => {
    const b = document.createElement('button');
    paint(b, v);
    b.addEventListener('click', () => { SFX.plink(i); set(v); mark(); });
    el.append(b);
    return b;
  });
  const mark = () => btns.forEach((b, i) => b.classList.toggle('on', list[i] === get()));
  mark();
  return mark;
}
const color = cls => (b, v) => { b.className = cls; b.style.background = v; };

const muteBtn = $('#muteBtn');
const showMute = () => { muteBtn.textContent = SFX.muted ? '🔇' : '🔊'; };
muteBtn.addEventListener('click', () => { SFX.setMuted(!SFX.muted); showMute(); if (!SFX.muted) SFX.plink(4); });
showMute();

function sealMark() {
  return S.initial ? { text: S.initial, script: true } : { text: S.symbol, script: false };
}
function paintSeal(el, mark, wax) {
  el.style.setProperty('--wax', wax);
  el.innerHTML = '';
  const sp = document.createElement('span');
  sp.textContent = mark.text;
  if (mark.script) sp.className = 'script';
  el.append(sp);
}

function renderScene() {
  const scene = $('#scene');
  scene.style.setProperty('--wax', S.wax);
  $('#paper').classList.toggle('hidden', S.folded);
  $('#envelope').classList.toggle('hidden', !S.folded);
  $('#sealKit').classList.toggle('hidden', cur !== 4);
  $('#flame').classList.toggle('hidden', !S.lit);
  scene.classList.toggle('lit', S.lit);
  const puddle = $('#puddle');
  puddle.classList.toggle('hidden', S.sealed || S.melt === 0);
  puddle.style.transform = `scale(${S.melt / 100}) rotate(${S.melt * 0.6}deg)`;
  const seal = $('#envSeal');
  seal.classList.toggle('hidden', !S.sealed);
  paintSeal(seal, sealMark(), S.wax);
  $('#meltBar').style.width = S.melt + '%';
  $('#meltBar').style.background = S.wax;
  $('#r1').classList.toggle('done', S.lit || S.sealed);
  $('#r2').classList.toggle('done', S.melt >= 100);
  $('#r3').classList.toggle('done', S.sealed);
}

const letter = $('#letterText');

function goStep(n) {
  n = Number(n);
  if ((n === 4 || n === 5) && !letter.value.trim()) {
    toast('편지를 먼저 써주세요 ✍️');
    n = 1;
  }
  if (n >= 4 && !S.folded) { S.folded = true; SFX.paper(); }
  if (n === 1 && S.folded) {
    if (S.sealed) toast('이미 봉인했어요. 고치려면 실링 단계에서 "다시 하기"를 눌러요');
    else { S.folded = false; SFX.paper(); }
  }
  if (n !== cur) SFX.click();
  cur = n;
  $$('.step').forEach(b => b.classList.toggle('active', Number(b.dataset.step) === n));
  $$('.panel-page').forEach(p => p.classList.toggle('hidden', Number(p.dataset.page) !== n));
  renderScene();
}
$$('.step').forEach(b => b.addEventListener('click', () => goStep(b.dataset.step)));
$$('.next').forEach(b => b.addEventListener('click', () => goStep(b.dataset.go)));

function applyPaper() { $('#paper').style.setProperty('--paper', PAPERS[S.paper]); }
const markPaper = choices($('#paperSwatches'), Object.keys(PAPERS),
  (b, k) => { b.className = 'swatch'; b.style.background = PAPERS[k]; },
  () => S.paper, k => { S.paper = k; applyPaper(); SFX.paper(); });
letter.value = localStorage.getItem('draft') || '';
let lastPencil = 0;
letter.addEventListener('input', () => {
  localStorage.setItem('draft', letter.value);
  const now = performance.now();
  if (now - lastPencil > 50) { SFX.pencil(); lastPencil = now; }
});

function compress(src, max = 720) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * r;
      c.height = img.height * r;
      const x = c.getContext('2d');
      x.fillStyle = '#fff';
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.82));
    };
    img.src = src;
  });
}
function renderPolaroid() {
  $('#polaroid').classList.toggle('hidden', !S.image);
  if (S.image) $('#polaroidImg').src = S.image;
}
$('#photoInput').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = async () => { S.image = await compress(r.result); renderPolaroid(); SFX.pop(); toast('폴라로이드를 붙였어요 📷'); };
  r.readAsDataURL(f);
  e.target.value = '';
});
$('#removePhoto').addEventListener('click', () => { S.image = null; renderPolaroid(); SFX.paper(); });

const cv = $('#drawCanvas');
const cx = cv.getContext('2d');
const pen = { color: PENS[0], size: 8, down: false };
let lastStroke = 0;
function clearCanvas() { cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); }
clearCanvas();
const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
function stroke() { cx.strokeStyle = pen.color; cx.lineWidth = pen.size; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.stroke(); }
cv.addEventListener('pointerdown', e => {
  pen.down = true;
  cv.setPointerCapture(e.pointerId);
  const p = pos(e);
  cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x + 0.1, p.y); stroke();
});
cv.addEventListener('pointermove', e => {
  if (!pen.down) return;
  const p = pos(e);
  cx.lineTo(p.x, p.y);
  stroke();
  const now = performance.now();
  if (now - lastStroke > 70) { SFX.pencil(); lastStroke = now; }
});
cv.addEventListener('pointerup', () => { pen.down = false; });
choices($('#penColors'), PENS, color('swatch pen'), () => pen.color, c => { pen.color = c; });
$('#penSize').addEventListener('input', e => { pen.size = Number(e.target.value); });
$('#clearDraw').addEventListener('click', () => { clearCanvas(); SFX.paper(); });
$('#useDraw').addEventListener('click', () => { S.image = cv.toDataURL('image/jpeg', 0.85); renderPolaroid(); SFX.pop(); toast('그림을 붙였어요 🎨'); });

const bag = $('#giftBag');
function renderGift(newIndex) {
  bag.classList.toggle('hidden', !S.gifts.length);
  bag.classList.toggle('wrapped', S.wrapped);
  bag.style.setProperty('--ribbon', S.ribbon);
  const items = $('#giftItems');
  items.innerHTML = '';
  S.gifts.forEach((g, i) => {
    const sp = document.createElement('span');
    sp.textContent = g;
    if (i === newIndex) sp.className = 'new';
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
}
function shakeBag(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  SFX.candy();
  SFX.crinkle(0.4);
}
let lastCrinkle = 0;
bag.addEventListener('mouseenter', () => {
  if (!S.wrapped) return;
  const now = performance.now();
  if (now - lastCrinkle < 400) return;
  lastCrinkle = now;
  SFX.crinkle(0.3);
  bag.classList.remove('squish');
  void bag.offsetWidth;
  bag.classList.add('squish');
});
bag.addEventListener('click', () => { if (S.wrapped) shakeBag(bag); });

SNACKS.forEach(s => {
  const b = document.createElement('button');
  b.className = 'snack';
  b.textContent = s;
  b.addEventListener('click', () => {
    if (S.wrapped) return toast('포장을 풀어야 더 넣을 수 있어요 🎀');
    if (S.gifts.length >= 6) return toast('봉지가 꽉 찼어요!');
    S.gifts.push(s);
    renderGift(S.gifts.length - 1);
    setTimeout(() => { if (HARD.includes(s)) SFX.candy(); else SFX.pop(); }, 300);
  });
  $('#snackGrid').append(b);
});
const markRibbon = choices($('#ribbonSwatches'), RIBBONS, color('swatch'), () => S.ribbon, c => { S.ribbon = c; renderGift(); });
$('#wrapBtn').addEventListener('click', async () => {
  if (!S.gifts.length) return toast('먼저 선물을 골라주세요 🍪');
  if (S.wrapped) { S.wrapped = false; SFX.crinkle(0.5); renderGift(); return; }
  S.wrapped = true;
  renderGift();
  SFX.crinkle(0.8);
  await wait(650);
  SFX.plink(5);
  SFX.plink(7);
  toast('바스락… 포장 완료! 🎀');
});

const markWax = choices($('#waxSwatches'), WAX, color('swatch'), () => S.wax, c => { S.wax = c; renderScene(); });
const markSym = choices($('#symbolBtns'), SYMBOLS, (b, v) => { b.className = 'sym'; b.textContent = v; }, () => S.symbol, v => {
  S.symbol = v;
  S.initial = '';
  $('#initialInput').value = '';
  renderScene();
});
$('#initialInput').addEventListener('input', e => { S.initial = e.target.value.trim(); renderScene(); });

$('#lightBtn').addEventListener('click', async () => {
  if (!S.folded) return toast('편지를 먼저 써주세요 ✍️');
  if (S.lit) return toast('이미 촛불이 켜져 있어요 🕯️');
  const m = document.createElement('div');
  m.className = 'match';
  $('#sealKit').append(m);
  SFX.match();
  await wait(250);
  m.classList.add('burning');
  await wait(600);
  S.lit = true;
  renderScene();
  SFX.crackle();
  await wait(300);
  m.classList.add('fade');
  await wait(500);
  m.remove();
});

function blowOut() {
  if (!S.lit) return toast('촛불이 이미 꺼져 있어요');
  S.lit = false;
  renderScene();
  SFX.blow();
  for (let i = 0; i < 3; i++) {
    const sm = document.createElement('div');
    sm.className = 'smoke';
    sm.style.animationDelay = (i * 0.2) + 's';
    $('#candle').append(sm);
    setTimeout(() => sm.remove(), 2600);
  }
}
$('#blowBtn').addEventListener('click', blowOut);
$('#flame').addEventListener('click', blowOut);

let meltTimer = null;
let meltTick = 0;
const meltBtn = $('#meltBtn');
function spawnDrop() {
  const d = document.createElement('div');
  d.className = 'drop';
  $('#envelope').append(d);
  setTimeout(() => { SFX.drip(); d.remove(); }, 340);
}
function stopMelt() {
  clearInterval(meltTimer);
  meltTimer = null;
  meltTick = 0;
  $('#meltStick').classList.add('hidden');
}
meltBtn.addEventListener('pointerdown', e => {
  if (!S.folded) return toast('편지를 먼저 써주세요 ✍️');
  if (S.sealed) return toast('이미 도장을 찍었어요. "다시 하기"로 새로 할 수 있어요');
  if (!S.lit) return toast('먼저 촛불을 켜주세요 🔥');
  if (S.melt >= 100) return toast('충분히 녹았어요! 도장을 찍어요 🔏');
  meltBtn.setPointerCapture(e.pointerId);
  $('#meltStick').classList.remove('hidden');
  SFX.hiss();
  meltTimer = setInterval(() => {
    meltTick++;
    if (meltTick > 6) S.melt = Math.min(100, S.melt + 1.8);
    if (meltTick > 6 && meltTick % 5 === 0) spawnDrop();
    renderScene();
    if (S.melt >= 100) {
      stopMelt();
      SFX.plink(4);
      SFX.plink(6);
      toast('왁스가 충분히 녹았어요! 이제 도장을 찍어요 🔏');
    }
  }, 60);
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => meltBtn.addEventListener(ev, () => { if (meltTimer) stopMelt(); }));

function puff(parent, n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'steam';
    p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    p.style.animationDelay = (i * 0.08) + 's';
    parent.append(p);
    setTimeout(() => p.remove(), 1600);
  }
}
$('#stampBtn').addEventListener('click', async () => {
  if (S.sealed) return toast('이미 찍었어요! 💮');
  if (S.melt < 100) return toast('왁스를 먼저 충분히 녹여주세요 🫗');
  const press = $('#stampPress');
  const mark = sealMark();
  const face = $('#stampFace');
  face.textContent = mark.text;
  face.className = mark.script ? 'script' : '';
  press.className = 'stamp-press';
  void press.offsetWidth;
  press.classList.add('down');
  await wait(350);
  SFX.thud();
  await wait(150);
  SFX.hiss();
  puff($('#envelope'), 5);
  await wait(700);
  S.sealed = true;
  renderScene();
  const seal = $('#envSeal');
  seal.classList.remove('stamp');
  void seal.offsetWidth;
  seal.classList.add('stamp');
  press.classList.remove('down');
  press.classList.add('up');
  SFX.jingle();
  toast('꾹! 예쁘게 찍혔어요 💌');
  await wait(600);
  press.className = 'stamp-press hidden';
});
$('#redoSealBtn').addEventListener('click', () => {
  S.sealed = false;
  S.melt = 0;
  SFX.pop();
  renderScene();
});

const markBox = choices($('#boxChoices'), BOXES.map(b => b.id), (b, id) => {
  b.className = 'box-choice';
  const info = BOXES.find(x => x.id === id);
  b.innerHTML = `<span class="mini-box bx-${id}"></span><span>${info.name}</span>`;
}, () => S.box, id => { S.box = id; SFX.box(); });

$('#deliverDate').min = fmt(new Date());
$$('[data-add]').forEach(b => b.addEventListener('click', () => {
  const d = new Date();
  const [n, u] = b.dataset.add.split(':');
  if (u === 'd') d.setDate(d.getDate() + Number(n));
  if (u === 'm') d.setMonth(d.getMonth() + Number(n));
  if (u === 'y') d.setFullYear(d.getFullYear() + Number(n));
  $('#deliverDate').value = fmt(d);
  SFX.click();
}));

async function packAnimation(date) {
  const st = $('#boxStage');
  const box = st.querySelector('.box');
  const msg = $('#boxMsg');
  box.className = `box bx-${S.box}`;
  $('#boxLabel').textContent = `${date} 개봉`;
  msg.textContent = '상자에 차곡차곡 담는 중...';
  st.classList.remove('hidden');
  $('#scene').classList.add('packing');
  SFX.paper();
  await wait(500);
  if (S.gifts.length) SFX.candy();
  await wait(400);
  box.classList.add('closed');
  SFX.box();
  msg.textContent = '뚜껑 닫고...';
  await wait(700);
  box.classList.add('taped');
  if (S.box === 'gingham') { SFX.jingle(); msg.textContent = '리본으로 꼭꼭 묶기 🎀'; }
  else { SFX.tape(0.7); msg.textContent = '찌이익— 테이프로 밀봉!'; }
  await wait(900);
  SFX.chime();
  msg.textContent = `📦 ${date}에 도착할 거예요. 그때 만나요!`;
  await wait(1600);
  st.classList.add('hidden');
  $('#scene').classList.remove('packing');
}

$('#boxBtn').addEventListener('click', async () => {
  const text = letter.value.trim();
  const date = $('#deliverDate').value;
  if (!text) { goStep(1); return toast('편지를 먼저 써주세요 ✍️'); }
  if (!S.sealed) { goStep(4); return toast('실링 왁스를 먼저 찍어주세요 🕯️'); }
  if (!date) return toast('도착할 날짜를 골라주세요 📅');
  if (date < fmt(new Date())) return toast('과거로는 보낼 수 없어요 😅');
  if (S.gifts.length && !S.wrapped) { S.wrapped = true; renderGift(); SFX.crinkle(0.5); }
  const mark = sealMark();
  const item = {
    id: crypto.randomUUID(), createdAt: fmt(new Date()), deliverAt: date, text: text,
    paper: S.paper, image: S.image, gifts: [...S.gifts], ribbon: S.ribbon,
    wax: S.wax, mark: mark.text, script: mark.script, box: S.box, status: 'sealed'
  };
  const { letters = [] } = await chrome.storage.local.get('letters');
  letters.push(item);
  await chrome.storage.local.set({ letters });
  localStorage.removeItem('draft');
  await packAnimation(date);
  resetDesk();
  chrome.runtime.sendMessage({ type: 'check' }).catch(() => {});
});

function resetDesk() {
  Object.assign(S, DEFAULT());
  letter.value = '';
  $('#initialInput').value = '';
  $('#deliverDate').value = '';
  clearCanvas();
  applyPaper();
  renderPolaroid();
  renderGift();
  [markPaper, markRibbon, markWax, markSym, markBox].forEach(f => f());
  goStep(1);
}

async function renderShelf() {
  const { letters = [] } = await chrome.storage.local.get('letters');
  const shelf = $('#shelf');
  shelf.innerHTML = '';
  if (!letters.length) { shelf.innerHTML = '<p class="shelf-empty">보관함이 비어 있어요</p>'; return; }
  const sorted = [...letters].sort((a, b) => a.deliverAt.localeCompare(b.deliverAt));
  sorted.forEach(L => {
    const d = dday(L.deliverAt);
    const label = L.status === 'sealed' ? `D-${d}` : (L.status === 'arrived' ? '도착!' : '열어봄');
    const b = document.createElement('button');
    b.className = `mini ${L.status}`;
    b.title = `${L.createdAt}에 보냄 · ${L.deliverAt} 도착`;
    b.innerHTML = `<span class="mini-box bx-${L.box || 'kraft'}"></span><span>${label}</span>`;
    b.addEventListener('click', () => {
      if (L.status === 'sealed') {
        b.classList.remove('shake');
        void b.offsetWidth;
        b.classList.add('shake');
        SFX.box();
        toast(`아직 열 수 없어요 🔒 ${d}일 남았어요`);
      } else {
        openBox(L);
      }
    });
    shelf.append(b);
  });
}

function openBox(L) {
  $('#opener').classList.remove('hidden');
  SFX.chime();
  if (L.status === 'arrived') stageBox(L);
  else stageLetter(L);
}
$('#closeOpener').addEventListener('click', () => { $('#opener').classList.add('hidden'); SFX.click(); });

function stageBox(L) {
  const st = $('#openStage');
  st.innerHTML = `<p class="hint">${L.createdAt}의 내가 보낸 상자예요.<br>테이프를 뜯어볼까요?</p>` +
    `<div class="box bx-${L.box || 'kraft'} closed taped big"><div class="box-lid"></div>` +
    `<div class="box-body"><div class="box-label">${L.deliverAt} 개봉</div></div><div class="box-tape"></div></div>`;
  const box = st.querySelector('.box');
  box.addEventListener('click', () => {
    if (L.box === 'gingham') SFX.jingle();
    else SFX.tape(0.6);
    box.classList.remove('taped');
    setTimeout(() => { box.classList.add('lid-off'); SFX.pop(); }, 600);
    setTimeout(() => stageEnvelope(L), 1400);
  }, { once: true });
}

function stageEnvelope(L) {
  const st = $('#openStage');
  st.innerHTML = `<p class="hint">실링을 톡 눌러서 열어보세요</p>` +
    `<div class="envelope big"><div class="env-flap"></div><div class="wax seal-spot"></div></div>`;
  const w = st.querySelector('.wax');
  paintSeal(w, { text: L.mark || L.symbol || '♥', script: !!L.script }, L.wax);
  w.addEventListener('click', () => {
    w.classList.add('crack');
    SFX.crack();
    setTimeout(() => { SFX.paper(); stageLetter(L); }, 700);
    markOpened(L);
  }, { once: true });
}

function stageLetter(L) {
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
    g.innerHTML = `<div class="gift-items">${L.gifts.map(x => `<span>${x}</span>`).join('')}</div><div class="vinyl"></div><div class="ribbon"></div>`;
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
}

async function markOpened(L) {
  const { letters = [] } = await chrome.storage.local.get('letters');
  const x = letters.find(v => v.id === L.id);
  if (x) { x.status = 'opened'; await chrome.storage.local.set({ letters }); }
  L.status = 'opened';
}

function selfCheck() {
  const missing = [];
  const probe = document.createElement('div');
  probe.className = 'seal-kit';
  document.body.append(probe);
  if (getComputedStyle(probe).position !== 'absolute') missing.push('desk.css가 옛날 버전이에요 (이번 걸로 통째로 교체)');
  probe.className = 'studio';
  if (getComputedStyle(probe).position !== 'fixed') missing.push('desk.css에 부엌·티타임 부분이 없어요 (이번 걸로 통째로 교체)');
  probe.remove();
  if (typeof KSFX === 'undefined') missing.push('ksfx.js 파일이 없거나 이름이 달라요');
  if (!$$('button').some(b => b.textContent.includes('쿠키 직접 굽기'))) missing.push('bake.js 파일이 없거나 이름이 달라요');
  if (!$('button[title="티타임"]')) missing.push('tea.js 파일이 없거나 이름이 달라요');
  if (!missing.length) return;
  const box = document.createElement('div');
  box.className = 'diag';
  box.innerHTML = '<b>⚠️ 아직 적용 안 된 파일이 있어요</b>' + missing.map(m => '· ' + m).join('<br>') +
    '<br><br>고친 뒤 chrome://extensions 에서 ↻ 새로고침하고, 이 탭도 새로고침해 주세요. (이 알림은 누르면 닫혀요)';
  box.style.cursor = 'pointer';
  box.addEventListener('click', () => box.remove());
  document.body.append(box);
}

chrome.storage.onChanged.addListener((c, area) => { if (area === 'local' && c.letters) renderShelf(); });
setInterval(() => { if (S.lit && cur === 4 && !SFX.muted) SFX.crackle(); }, 1500);
$('#todayLabel').textContent = fmt(new Date());
applyPaper();
renderPolaroid();
renderGift();
renderShelf();
goStep(1);
window.addEventListener('load', () => setTimeout(selfCheck, 300));
chrome.runtime.sendMessage({ type: 'check' }).catch(() => {});
console.log('✅ desk.js 준비 완료!');