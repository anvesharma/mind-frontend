import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function NebulaOrb({ id, size, colors, pulseColor }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2;
    let animId;
    const blobs = colors.map(() => ({
      ox: cx * (0.7 + Math.random() * 0.6),
      oy: cy * (0.7 + Math.random() * 0.6),
      rx: size * (0.28 + Math.random() * 0.18),
      ry: size * (0.2 + Math.random() * 0.15),
      a: Math.random() * Math.PI * 2,
      da: (Math.random() - 0.5) * 0.003,
      pox: 0, poy: 0,
      dpx: (Math.random() - 0.5) * 0.25,
      dpy: (Math.random() - 0.5) * 0.25,
    }));
    let pulse = 1, dp = 0.0012;
    function draw() {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r - 1, 0, Math.PI * 2); ctx.clip();
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      bg.addColorStop(0, colors[0] + '22'); bg.addColorStop(1, '#050810');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
      blobs.forEach((b, i) => {
        b.pox += b.dpx; b.poy += b.dpy;
        if (Math.abs(b.pox) > size * 0.1) b.dpx *= -1;
        if (Math.abs(b.poy) > size * 0.1) b.dpy *= -1;
        b.a += b.da;
        ctx.save();
        ctx.translate(b.ox + b.pox, b.oy + b.poy); ctx.rotate(b.a);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, b.rx);
        g.addColorStop(0, colors[i % colors.length] + 'bb');
        g.addColorStop(0.45, colors[i % colors.length] + '55');
        g.addColorStop(1, colors[i % colors.length] + '00');
        ctx.fillStyle = g;
        ctx.scale(1, b.ry / b.rx);
        ctx.beginPath(); ctx.arc(0, 0, b.rx, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      pulse += dp; if (pulse > 1.09 || pulse < 0.93) dp *= -1;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.35 * pulse);
      cg.addColorStop(0, colors[0] + 'ff');
      cg.addColorStop(0.3, colors[0] + '99');
      cg.addColorStop(1, colors[0] + '00');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, r * 0.35 * pulse, 0, Math.PI * 2); ctx.fill();
      const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
      rim.addColorStop(0, colors[0] + '00');
      rim.addColorStop(1, colors[0] + '33');
      ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [size, colors]);
  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '50%', display: 'block' }} />;
}

export default function Landing() {
  const navigate = useNavigate();
  const starsRef = useRef(null);

  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, stars = [], animId;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 150; i++) stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      op: Math.random(), dop: (Math.random() - 0.5) * 0.006,
      vx: (Math.random() - 0.5) * 0.00006, vy: (Math.random() - 0.5) * 0.00006,
      col: Math.random() < 0.12 ? '#ef9f27' : Math.random() < 0.12 ? '#1db88a' : 'white'
    });
    function tick() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1; if (s.y > 1) s.y = 0;
        s.op += s.dop; if (s.op > 1 || s.op < 0.05) s.dop *= -1;
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.col; ctx.globalAlpha = s.op; ctx.fill();
      });
      ctx.globalAlpha = 1; animId = requestAnimationFrame(tick);
    }
    tick();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [size, colors]);

  return (
    <div className="landing-bg">
      <canvas ref={starsRef} className="landing-stars" />
      <div className="landing-content">
        <div className="landing-eyebrow">✦ Discover Mind</div>
        <h1 className="landing-headline">Who are you, really?</h1>
        <p className="landing-sub">Two paths. One truth.</p>
        <div className="landing-orbs">

          <div className="landing-path teal-path" onClick={() => navigate('/login')}>
            <div className="orb-wrap">
              <NebulaOrb id="neb-work" size={200} colors={['#1db88a', '#38e0aa', '#0f6e56', '#a8f0d8']} />
              <div className="orb-letter teal-letter">M</div>
              <div className="orb-ring teal-ring ring-1" />
              <div className="orb-ring teal-ring ring-2" />
            </div>
            <div className="path-name">Mind for Work</div>
            <div className="path-desc">Talent visibility and team culture — for growing companies and their leaders</div>
            <button className="path-btn teal-btn">Explore →</button>
          </div>

          <div className="landing-path amber-path" onClick={() => navigate('/discover')}>
            <div className="orb-wrap">
              <NebulaOrb id="neb-you" size={200} colors={['#ef9f27', '#fac775', '#854f0b', '#faedda']} />
              <div className="orb-letter amber-letter">M</div>
              <div className="orb-ring amber-ring ring-1" />
              <div className="orb-ring amber-ring ring-2" />
            </div>
            <div className="path-name">Mind for You</div>
            <div className="path-desc">Are you a born Leader? A natural Manager? An Elite Contributor? Find out.</div>
            <button className="path-btn amber-btn">Discover →</button>
          </div>

        </div>
      </div>
    </div>
  );
}
