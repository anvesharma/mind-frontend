import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import './PersonalResults.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [emailsSent, setEmailsSent] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const socialId = searchParams.get('social_id');
    if (!sessionId || !socialId) { setStatus('error'); return; }

    api.post('/social/payment-success', { sessionId, socialId })
      .then(res => {
        setEmailsSent(res.data.emailsSent || 0);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="pr-bg">
      <div className="pr-wrapper">
        <div className="pr-logo">
          <span className="pr-logo-dot" style={{ background: '#ef9f27' }} />
          <span className="pr-logo-text" style={{ color: '#ef9f27' }}>Mind</span>
          <span className="pr-logo-tag">for You</span>
        </div>

        {status === 'processing' && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <p>Processing your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#ef9f27', marginBottom: '0.75rem' }}>
              You're all set!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 1.5rem' }}>
              We've sent rating invites to <strong style={{ color: '#fff' }}>{emailsSent} {emailsSent === 1 ? 'person' : 'people'}</strong>. You'll get an email as soon as 3 or more have rated you.
            </p>
            <div style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: '14px', padding: '1.2rem 1.5rem', marginBottom: '2rem', maxWidth: '380px', margin: '0 auto 2rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>What happens next</p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                Your friends will receive a unique rating link. Once 3+ complete it, we'll email you with a link to your real results. Links expire in 7 days.
              </p>
            </div>
            <button
              style={{ background: '#ef9f27', color: '#050810', border: 'none', borderRadius: '12px', padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
              onClick={() => navigate('/')}
            >
              Back to Mind →
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ color: '#e05c5c', fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Your payment may have gone through. Please contact Anvesh directly.</p>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
              onClick={() => navigate('/')}>Back to Mind</button>
          </div>
        )}
      </div>
    </div>
  );
}
