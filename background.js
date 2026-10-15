const pad = n => String(n).padStart(2, '0');
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const deskUrl = () => chrome.runtime.getURL('desk.html');

function setup() {
  chrome.alarms.create('check', { periodInMinutes: 30 });
  checkLetters();
}
chrome.runtime.onInstalled.addListener(setup);
chrome.runtime.onStartup.addListener(setup);
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'check') checkLetters(); });
chrome.runtime.onMessage.addListener(m => { if (m && m.type === 'check') checkLetters(); });
chrome.action.onClicked.addListener(() => chrome.tabs.create({ url: deskUrl() }));
chrome.notifications.onClicked.addListener(id => {
  chrome.tabs.create({ url: deskUrl() });
  chrome.notifications.clear(id);
});

let busy = false;
async function checkLetters() {
  if (busy) return;
  busy = true;
  try {
    const { letters = [], lang } = await chrome.storage.local.get(['letters', 'lang']);
    const t = today();
    const arrived = letters.filter(L => L.status === 'sealed' && L.deliverAt <= t);
    if (!arrived.length) return;
    arrived.forEach(L => { L.status = 'arrived'; });
    await chrome.storage.local.set({ letters });
    const en = lang === 'en';
    const many = arrived.length > 1;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: await makeIcon(),
      title: en ? 'Ding~ A letter has arrived 💌' : '띠링~ 편지가 도착했어요 💌',
      message: en
        ? (many ? `${arrived.length} boxes from past you have arrived!` : `A box from you on ${arrived[0].createdAt} has arrived!`)
        : (many ? `과거의 내가 보낸 상자 ${arrived.length}개가 도착했어요!` : `${arrived[0].createdAt}의 내가 보낸 상자가 도착했어요!`),
      priority: 2,
      requireInteraction: true
    });
    await ring();
  } finally {
    busy = false;
  }
}

async function ring() {
  try {
    if (!(await chrome.offscreen.hasDocument())) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Letter arrival chime'
      });
    }
    chrome.runtime.sendMessage({ type: 'chime' }).catch(() => {});
  } catch (e) {}
}

async function makeIcon() {
  const c = new OffscreenCanvas(128, 128);
  const x = c.getContext('2d');
  x.fillStyle = '#f6e3bd'; x.fillRect(10, 30, 108, 72);
  x.strokeStyle = '#b08a5a'; x.lineWidth = 4; x.strokeRect(10, 30, 108, 72);
  x.beginPath(); x.moveTo(10, 30); x.lineTo(64, 74); x.lineTo(118, 30); x.stroke();
  x.fillStyle = '#b3262d'; x.beginPath(); x.arc(64, 74, 15, 0, Math.PI * 2); x.fill();
  const buf = new Uint8Array(await (await c.convertToBlob()).arrayBuffer());
  let s = '';
  for (const b of buf) s += String.fromCharCode(b);
  return 'data:image/png;base64,' + btoa(s);
}