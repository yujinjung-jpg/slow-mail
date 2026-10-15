(() => {
  let ctx = null;
  let bell = null;
  let nbuf = null;
  const rnd = (a, b) => a + Math.random() * (b - a);

  function ac() {
    if (!ctx) {
      ctx = new AudioContext();
      bell = ctx.createGain();
      const warm = ctx.createBiquadFilter();
      warm.type = 'lowpass';
      warm.frequency.value = 3000;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.14;
      const fb = ctx.createGain();
      fb.gain.value = 0.25;
      const wet = ctx.createGain();
      wet.gain.value = 0.2;
      bell.connect(warm);
      warm.connect(ctx.destination);
      warm.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(ctx.destination);
      nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = nbuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // 둥글고 통통한 마림바 느낌의 음 하나
  function mallet(f, t, vol, len) {
    const c = ac();
    const s = c.currentTime + t;
    [[1, 1, len], [2, 0.12, len * 0.45], [3.9, 0.06, len * 0.15]].forEach(([m, a, d], k) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      if (k === 0) {
        o.frequency.setValueAtTime(f * 1.25, s);
        o.frequency.exponentialRampToValueAtTime(f, s + 0.025);
      } else {
        o.frequency.value = f * m;
      }
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(vol * a, s + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, s + d);
      o.connect(g);
      g.connect(bell);
      o.start(s);
      o.stop(s + d + 0.05);
    });
  }

  function nz(t, dur, o) {
    const c = ac();
    const s = c.currentTime + t;
    const src = c.createBufferSource();
    src.buffer = nbuf;
    const f = c.createBiquadFilter();
    f.type = o.type || 'bandpass';
    f.Q.value = o.q || 0.8;
    f.frequency.setValueAtTime(o.f1, s);
    if (o.f2) f.frequency.linearRampToValueAtTime(o.f2, s + dur * 0.45);
    if (o.f3) f.frequency.exponentialRampToValueAtTime(o.f3, s + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, s);
    g.gain.linearRampToValueAtTime(o.vol, s + dur * (o.peak || 0.1));
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start(s, rnd(0, 1.5));
    src.stop(s + dur + 0.05);
  }

  SFX.paper = () => {
    if (SFX.muted) return;
    // 휙 - 종이가 공기를 가르는 소리
    nz(0, 0.42, { f1: 600, f2: 2200, f3: 900, q: 0.7, vol: 0.12, peak: 0.4 });
    // 사각사각 - 종이 결이 스치는 소리
    for (let i = 0; i < 5; i++) {
      nz(rnd(0.04, 0.3), rnd(0.01, 0.025), { type: 'highpass', f1: rnd(3000, 5500), q: 1, vol: rnd(0.015, 0.04), peak: 0.2 });
    }
    // 착 - 종이가 내려앉는 소리
    nz(0.36, 0.09, { type: 'lowpass', f1: 500, vol: 0.09, peak: 0.15 });
  };

  SFX.chime = () => {
    if (SFX.muted) return;
    [[392, 0], [523.25, 0.11], [659.25, 0.22], [783.99, 0.33]].forEach(([f, t]) => mallet(f, t, 0.22, 0.8));
    mallet(1046.5, 0.5, 0.14, 1.4);
    mallet(261.63, 0.5, 0.16, 1.4);
  };

  SFX.jingle = () => {
    if (SFX.muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => mallet(f, k * 0.08, 0.16, 0.55));
  };

  console.log('✅ sound.js 준비 완료!');
})();