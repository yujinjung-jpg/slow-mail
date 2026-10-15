function playChime() {
  try {
    const ctx = new AudioContext();
    const bell = ctx.createGain();
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

    const mallet = (f, t, vol, len) => {
      const s = ctx.currentTime + t;
      [[1, 1, len], [2, 0.12, len * 0.45], [3.9, 0.06, len * 0.15]].forEach(([m, a, d], k) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
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
    };

    [[392, 0], [523.25, 0.11], [659.25, 0.22], [783.99, 0.33]].forEach(([f, t]) => mallet(f, t, 0.25, 0.8));
    mallet(1046.5, 0.5, 0.16, 1.4);
    mallet(261.63, 0.5, 0.18, 1.4);
    setTimeout(() => ctx.close(), 3000);
  } catch (e) {}
}