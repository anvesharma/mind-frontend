import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function GuestEntry() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const res = await api.post('/auth/guest');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('mind_mode', 'work');
        navigate('/assessment', { state: { mode: 'work' }, replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, #0a1a0a 0%, #050810 60%, #020308 100%)',
      color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
    }}>
      Setting up Mind for Work…
    </div>
  );
}
