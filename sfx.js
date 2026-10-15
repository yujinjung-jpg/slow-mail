const SFX = (() => {
  let ctx = null;
  let master = null;
  let noiseBuf = null;
  let muted = localStorage.getItem('muted') === '1';
  const rnd = (a, b) => a + Math.random() * (b - a);
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];

  function ac() {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, t, dur, opt) {
    const o2 = Object.assign({ type: 'sine', vol: 0.2, to: 0, attack: 0.005 }, opt || {});
    const c = ac();
    const s = c.currentTime + t;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = o2.type;
    o.frequency.setValueAtTime(freq, s);
    if (o2.to) o.frequency.exponentialRampToValueAtTime(o2.to, s + dur);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(o2.vol, s + o2.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    o.connect(g);
    g.connect(master);
    o.start(s);
    o.stop(s + dur + 0.05);
  }

  function noise(t, dur, opt) {
    const o2 = Object.assign({ type: 'bandpass', freq: 2000, q: 1, vol: 0.2, attack: 0.002, to: 0 }, opt || {});
    const c = ac();
    const s = c.currentTime + t;
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    const f = c.createBiquadFilter();
    f.type = o2.type;
    f.Q.value = o2.q;
    f.frequency.setValueAtTime(o2.freq, s);
    if (o2.to) f.frequency.exponentialRampToValueAtTime(o2.to, s + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(o2.vol, s + o2.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start(s, rnd(0, 1.2));
    src.stop(s + dur + 0.05);
  }

  return {
    click() { tone(680, 0, 0.08, { type: 'triangle', vol: 0.12, to: 420 }); },
    pop() { tone(380, 0, 0.12, { vol: 0.22, to: 950 }); },
    plink(i) {
      const n = (typeof i === 'number' ? i : Math.floor(rnd(0, 8))) % 8;
      tone(SCALE[n], 0, 0.35, { type: 'triangle', vol: 0.16 });
      tone(SCALE[n] * 2, 0, 0.18, { vol: 0.04 });
    },
    jingle() {
      [0, 2, 4, 7].forEach((n, k) => tone(SCALE[n], k * 0.09, 0.45, { type: 'triangle', vol: 0.15 }));
    },
    chime() {
      [[1318.5, 0], [1760, 0.14], [2093, 0.28]].forEach(([f, t]) => tone(f, t, 1.2, { vol: 0.16, attack: 0.01 }));
    },
    pencil() { noise(0, rnd(0.03, 0.06), { freq: rnd(3000, 5000), q: 2, vol: 0.035 }); },
    paper() {
      for (let i = 0; i < 6; i++) noise(i * 0.04 + rnd(0, 0.02), rnd(0.05, 0.12), { freq: rnd(1500, 3500), q: 0.7, vol: 0.08 });
    },
    crinkle(dur) {
      const d = dur || 0.6;
      const n = Math.floor(d * 50);
      for (let i = 0; i < n; i++) noise(rnd(0, d), rnd(0.008, 0.03), { freq: rnd(2500, 8000), q: rnd(2, 6), vol: rnd(0.05, 0.18) });
    },
    candy() {
      const n = 5 + Math.floor(rnd(0, 4));
      for (let i = 0; i < n; i++) {
        const t = rnd(0, 0.35);
        tone(rnd(2200, 3800), t, rnd(0.04, 0.09), { vol: rnd(0.04, 0.1) });
        noise(t, 0.02, { freq: 5000, q: 4, vol: 0.05 });
      }
    },
    tape(dur) {
      const d = dur || 0.7;
      const n = Math.floor(d * 90);
      for (let i = 0; i < n; i++) {
        noise(i / 90 + rnd(0, 0.006), 0.018, { freq: 1200 + (i / n) * 2600 + rnd(-200, 200), q: 1.4, vol: rnd(0.08, 0.22) });
      }
      noise(0, d, { freq: 900, q: 0.6, vol: 0.07, attack: 0.03 });
    },
    thud() {
      tone(140, 0, 0.25, { vol: 0.35, to: 60 });
      noise(0, 0.08, { type: 'lowpass', freq: 800, vol: 0.15 });
    },
    box() {
      tone(110, 0, 0.3, { vol: 0.3, to: 55 });
      noise(0, 0.15, { type: 'lowpass', freq: 600, vol: 0.2 });
    },
    match() {
      noise(0, 0.18, { freq: 3000, q: 0.8, vol: 0.25, to: 1200 });
      noise(0.15, 0.5, { type: 'lowpass', freq: 900, vol: 0.12, attack: 0.02 });
    },
    crackle() {
      for (let i = 0; i < 4; i++) noise(rnd(0, 0.4), 0.01, { freq: rnd(1500, 4000), q: 3, vol: rnd(0.03, 0.08) });
    },
    drip() { tone(rnd(700, 1000), 0, 0.15, { vol: 0.12, to: 300 }); },
    blow() { noise(0, 0.6, { type: 'lowpass', freq: 700, vol: 0.18, attack: 0.1, to: 300 }); },
    hiss() { noise(0, 0.5, { type: 'highpass', freq: 4000, vol: 0.05, attack: 0.05 }); },
    crack() {
      noise(0, 0.05, { freq: 2500, q: 2, vol: 0.3 });
      tone(1800, 0.02, 0.06, { vol: 0.08 });
      noise(0.06, 0.04, { freq: 1800, q: 3, vol: 0.15 });
    },
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      localStorage.setItem('muted', m ? '1' : '0');
      if (master) master.gain.value = m ? 0 : 0.9;
    }
  };
})();