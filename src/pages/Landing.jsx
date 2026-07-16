import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Landing.css';

function NebulaOrb({ size, colors }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2;
    let animId;
    const blobs = colors.map((_col, i) => ({
      ox: cx * (0.7 + Math.random() * 0.6),
      oy: cy * (0.7 + Math.random() * 0.6),
      rx: size * (0.28 + Math.random() * 0.18),
      ry: size * (0.2 + Math.random() * 0.15),
      a: Math.random() * Math.PI * 2,
      da: (Math.random() - 0.5) * 0.003,
      pox: 0, poy: 0,
      dpx: (Math.random() - 0.5) * 0.25,
      dpy: (Math.random() - 0.5) * 0.25,
      ci: i,
    }));
    let pulse = 1, dp = 0.0012;
    function draw() {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r - 1, 0, Math.PI * 2); ctx.clip();
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      bg.addColorStop(0, colors[0] + '22'); bg.addColorStop(1, '#050810');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
      blobs.forEach(b => {
        b.pox += b.dpx; b.poy += b.dpy;
        if (Math.abs(b.pox) > size * 0.1) b.dpx *= -1;
        if (Math.abs(b.poy) > size * 0.1) b.dpy *= -1;
        b.a += b.da;
        ctx.save();
        ctx.translate(b.ox + b.pox, b.oy + b.poy); ctx.rotate(b.a);
        const col = colors[b.ci % colors.length];
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, b.rx);
        g.addColorStop(0, col + 'bb');
        g.addColorStop(0.45, col + '55');
        g.addColorStop(1, col + '00');
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
  }, []);

  const tealColors = ['#1db88a', '#38e0aa', '#0f6e56', '#a8f0d8'];
  const amberColors = ['#ef9f27', '#fac775', '#854f0b', '#faedda'];
  const novaColors = ['#1db88a', '#ef9f27', '#38e0aa', '#fac775', '#0f6e56'];

  return (
    <div className="landing-bg">
      <canvas ref={starsRef} className="landing-stars" />
      <div className="landing-content">

        {/* Nova at top center */}
        <div className="landing-nova-wrap" onClick={() => window.open('/nova.html', '_blank')}>
          <div className="landing-nova-orb">
            <NebulaOrb size={72} colors={novaColors} />
            <div className="landing-nova-letter">N</div>
            <div className="landing-nova-ring ring-1" />
            <div className="landing-nova-ring ring-2" />
          </div>
          <div className="landing-nova-label">Ask Nova</div>
        </div>

        {/* Headline */}
        <div className="landing-eyebrow">✦ Discover Mind</div>
        <p className="landing-sub">What's Your Vibe?</p>

        {/* Two paths */}
        <div className="landing-orbs">

          {/* Mind for You — LEFT */}
          <div className="landing-path" onClick={() => navigate('/discover')}>
            <div className="orb-wrap">
              <NebulaOrb size={210} colors={amberColors} />
              <div className="orb-letter amber-letter">M</div>
              <div className="orb-ring amber-ring ring-1" />
              <div className="orb-ring amber-ring ring-2" />
            </div>
            <div className="path-name amber-name">Mind for You</div>
            <div className="path-desc clickable-desc amber-desc" onClick={(e) => { e.stopPropagation(); navigate('/discover'); }}>
              Discover who you really are!
            </div>
          </div>

          {/* Mind for Work — RIGHT */}
          <div className="landing-path" onClick={() => navigate('/login')}>
            <div className="orb-wrap">
              <NebulaOrb size={210} colors={tealColors} />
              <div className="orb-letter teal-letter">M</div>
              <div className="orb-ring teal-ring ring-1" />
              <div className="orb-ring teal-ring ring-2" />
            </div>
            <div className="path-name teal-name">Mind for Work</div>
            <div className="path-desc clickable-desc teal-desc" onClick={(e) => { e.stopPropagation(); navigate('/login'); }}>
              Align your team with your vision
            </div>
          </div>

        </div>

        {/* QR Code */}
        <div className="landing-qr-wrap">
          <div className="landing-qr-box">
            <QRCodeSVG value="https://www.discovermind.net" size={64} />
          </div>
          <div className="landing-qr-label">Scan to open on your phone</div>
        </div>

      </div>
    </div>
  );
}
