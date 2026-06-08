'use client';

import { useState } from 'react';

const ACCEPTANCE_PHRASE = 'I will rise and conquer';

interface Props {
  userName: string;
  onAccepted: (pledgeDate: string) => void;
}

export default function PledgeModal({ userName, onAccepted }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isMatch = input.trim().toLowerCase() === ACCEPTANCE_PHRASE.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pledge', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        onAccepted(data.pledgeAcceptedAt);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pledge-overlay">
      <div className="pledge-card animate-fade-in">

        {/* OM symbol */}
        <div className="pledge-om">ॐ</div>

        <div className="pledge-header">
          <h2 className="pledge-title">Welcome, {userName.split(' ')[0]}.</h2>
          <p className="pledge-intro">
            Before your journey begins, the Gita asks you to rise.
          </p>
        </div>

        {/* Bhagavad Gita verse */}
        <div className="pledge-verse-card">
          <p className="pledge-sanskrit">
            क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।<br />
            क्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥
          </p>
          <p className="pledge-translation">
            &ldquo;Do not yield to weakness, O Arjuna — it does not befit you. Shake off this faint-heartedness and <strong>arise</strong>, O scorcher of enemies.&rdquo;
          </p>
          <p className="pledge-ref">— Bhagavad Gita, Chapter 2 · Verse 3</p>
        </div>

        {/* What this means */}
        <div className="pledge-commitment">
          <p>
            You are about to commit to <strong>90 days</strong> of structured DSA practice.
            Your journey starts <strong>today</strong> — the calendar begins the moment you accept.
            Each day counts whether you solve problems or not. Show up.
          </p>
        </div>

        {/* Acceptance input */}
        <form onSubmit={handleSubmit} className="pledge-form">
          <label className="pledge-label">
            Type &nbsp;<span className="pledge-phrase">&ldquo;{ACCEPTANCE_PHRASE}&rdquo;</span>&nbsp; to begin
          </label>
          <input
            className={`pledge-input ${input.length > 0 ? (isMatch ? 'pledge-input-valid' : 'pledge-input-typing') : ''}`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ACCEPTANCE_PHRASE}
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="pledge-error">{error}</p>}
          <button
            type="submit"
            className="pledge-btn"
            disabled={!isMatch || loading}
          >
            {loading ? (
              <span className="auth-btn-spinner" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }}></span>
            ) : (
              <>
                <span>ॐ</span>
                Begin My 90-Day Journey
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
