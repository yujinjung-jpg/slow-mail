const KSFX = (() => {
  let ctx = null;
  let out = null;
  let noiseBuf = null;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const muted = () => typeof SFX !== 'undefined' && SFX.muted;
  const silent = { stop() {}, setLevel() {} };

  function ac() {
    if (!ctx) {
      ctx = new AudioContext();
      out = ctx.createGain();
      out.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    out.gain.value = muted() ? 0 : 0.9;
    return ctx;
  }

  function tone(freq, t, dur, opt) {
    if (muted()) return;
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
    g.connect(out);
    o.start(s);
    o.stop(s + dur + 0.05);
  }

  function noise(t, dur, opt) {
    if (muted()) return;
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
    g.connect(out);
    src.start(s, rnd(0, 1.2));
    src.stop(s + dur + 0.05);
  }

  function loopBase() {
    const c = ac();
    const m = c.createGain();
    m.gain.setValueAtTime(0.0001, c.currentTime);
    m.connect(out);
    return { c, m };
  }
  function loopNoise(c) {
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    return src;
  }
  function stopper(c, m, nodes) {
    return {
      stop() {
        const t = c.currentTime;
        m.gain.cancelScheduledValues(t);
        m.gain.setValueAtTime(Math.max(m.gain.value, 0.0001), t);
        m.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        nodes.forEach(n => { try { n.stop(t + 0.35); } catch (e) {} });
      }
    };
  }

  return {
    plop() { tone(320, 0, 0.18, { vol: 0.25, to: 110 }); noise(0, 0.1, { type: 'lowpass', freq: 700, vol: 0.15 }); },
    crack() {
      noise(0, 0.04, { freq: 3000, q: 2, vol: 0.3 });
      noise(0.07, 0.05, { freq: 2200, q: 2, vol: 0.25 });
      tone(500, 0.12, 0.15, { vol: 0.12, to: 200 });
    },
    puff() { noise(0, 0.45, { type: 'lowpass', freq: 1200, vol: 0.18, attack: 0.05, to: 300 }); },
    sprinkle() {
      for (let i = 0; i < 6; i++) tone(rnd(2500, 4500), rnd(0, 0.15), 0.04, { vol: rnd(0.03, 0.07) });
    },
    whisk() {
      noise(0, 0.08, { type: 'lowpass', freq: rnd(500, 800), vol: 0.14 });
      noise(0.02, 0.05, { freq: rnd(1200, 2000), q: 2, vol: 0.06 });
    },
    roll() {
      noise(0, 0.16, { type: 'lowpass', freq: 420, vol: 0.25, attack: 0.03 });
      tone(70, 0, 0.16, { vol: 0.08 });
    },
    cut() {
      tone(950, 0, 0.09, { type: 'triangle', vol: 0.2, to: 380 });
      noise(0, 0.03, { freq: 4000, q: 3, vol: 0.12 });
    },
    door() {
      tone(180, 0, 0.35, { type: 'sawtooth', vol: 0.04, to: 130 });
      noise(0.3, 0.1, { type: 'lowpass', freq: 500, vol: 0.25 });
      tone(90, 0.3, 0.2, { vol: 0.2, to: 50 });
    },
    tick() { noise(0, 0.012, { type: 'highpass', freq: 4000, vol: 0.15 }); },
    ding() {
      tone(1568, 0, 1.6, { vol: 0.2 });
      tone(3136, 0, 0.9, { vol: 0.06 });
      tone(2093, 0.02, 1.2, { vol: 0.08 });
    },
    squeeze() { noise(0, 0.05, { type: 'lowpass', freq: 900, vol: 0.05 }); },
    bubble(intensity) {
      const n = 1 + Math.floor(intensity * 4);
      for (let i = 0; i < n; i++) tone(rnd(250, 600) * (1 + intensity * 0.5), rnd(0, 0.3), 0.08, { vol: 0.06 + 0.08 * intensity, to: rnd(600, 1200) });
    },
    clink() {
      tone(2650, 0, 0.5, { vol: 0.12 });
      tone(3970, 0, 0.3, { vol: 0.05 });
      tone(1320, 0, 0.4, { vol: 0.04 });
    },
    ice() {
      tone(rnd(3200, 4200), 0, 0.12, { vol: 0.1 });
      tone(rnd(2400, 3000), 0.04, 0.1, { vol: 0.06 });
      noise(0.05, 0.08, { type: 'lowpass', freq: 900, vol: 0.12 });
      tone(380, 0.05, 0.12, { vol: 0.08, to: 160 });
    },
    iceRattle() {
      for (let i = 0; i < 4; i++) tone(rnd(2600, 4200), rnd(0, 0.25), 0.06, { vol: rnd(0.03, 0.07) });
    },
    dunk() {
      tone(rnd(400, 600), 0, 0.12, { vol: 0.12, to: 200 });
      noise(0, 0.08, { type: 'lowpass', freq: 900, vol: 0.1 });
    },
    sip() {
      for (let i = 0; i < 3; i++) noise(i * 0.16, 0.13, { freq: 2600, q: 1.5, vol: 0.12, to: 1500, attack: 0.03 });
      tone(220, 0.55, 0.25, { vol: 0.05, to: 180 });
    },
    fire() {
      noise(0, 0.4, { type: 'lowpass', freq: 500, vol: 0.18, attack: 0.08 });
      tone(140, 0, 0.3, { vol: 0.05, to: 90 });
    },
    hum() {
      if (muted()) return silent;
      const { c, m } = loopBase();
      const o = c.createOscillator();
      o.frequency.value = 68;
      o.connect(m);
      const src = loopNoise(c);
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 350;
      const g = c.createGain();
      g.gain.value = 0.8;
      src.connect(f);
      f.connect(g);
      g.connect(m);
      m.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 0.5);
      o.start();
      src.start();
      return stopper(c, m, [o, src]);
    },
    whistle() {
      if (muted()) return silent;
      const { c, m } = loopBase();
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(1700, c.currentTime);
      o.frequency.linearRampToValueAtTime(2050, c.currentTime + 1.5);
      const lfo = c.createOscillator();
      lfo.frequency.value = 7;
      const lg = c.createGain();
      lg.gain.value = 30;
      lfo.connect(lg);
      lg.connect(o.frequency);
      const src = loopNoise(c);
      const f = c.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 3000;
      const g = c.createGain();
      g.gain.value = 0.4;
      o.connect(m);
      src.connect(f);
      f.connect(g);
      g.connect(m);
      m.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 1.2);
      o.start();
      lfo.start();
      src.start();
      return stopper(c, m, [o, lfo, src]);
    },
    pour() {
      if (muted()) return silent;
      const { c, m } = loopBase();
      const src = loopNoise(c);
      const res = c.createBiquadFilter();
      res.type = 'bandpass';
      res.Q.value = 6;
      res.frequency.value = 420;
      const resG = c.createGain();
      resG.gain.value = 1.1;
      const body = c.createBiquadFilter();
      body.type = 'lowpass';
      body.frequency.value = 700;
      const bodyG = c.createGain();
      bodyG.gain.value = 0.35;
      const hiss = c.createBiquadFilter();
      hiss.type = 'highpass';
      hiss.frequency.value = 3500;
      const hissG = c.createGain();
      hissG.gain.value = 0.12;
      const flutter = c.createGain();
      flutter.gain.value = 0.8;
      src.connect(res); res.connect(resG); resG.connect(flutter);
      src.connect(body); body.connect(bodyG); bodyG.connect(flutter);
      src.connect(hiss); hiss.connect(hissG); hissG.connect(flutter);
      flutter.connect(m);
      m.gain.exponentialRampToValueAtTime(0.32, c.currentTime + 0.08);
      src.start();
      noise(0, 0.06, { type: 'lowpass', freq: 1500, vol: 0.25 });
      let level = 0;
      const iv = setInterval(() => {
        const t = c.currentTime;
        flutter.gain.setTargetAtTime(0.55 + Math.random() * 0.5, t, 0.015);
        res.frequency.setTargetAtTime(420 + level * 1500 + rnd(-40, 40), t, 0.03);
        if (Math.random() < 0.35) tone(rnd(500, 1100) * (1 + level * 0.8), 0, rnd(0.03, 0.06), { vol: rnd(0.02, 0.05), to: rnd(1200, 1800) * (1 + level * 0.5) });
      }, 40);
      const s = stopper(c, m, [src]);
      return {
        stop() {
          clearInterval(iv);
          s.stop();
          tone(rnd(700, 900), 0.15, 0.08, { vol: 0.05, to: 400 });
          tone(rnd(700, 900), 0.4, 0.08, { vol: 0.03, to: 400 });
        },
        setLevel(v) { level = Math.max(0, Math.min(1, v)); }
      };
    }
  };
})();