'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTopicsForLanguage, getChaptersForLanguage, languageMeta } from '@/data/day0to1Topics';

type Step = 'tutorial' | 'choose' | 'language' | 'saving';
type TrackChoice = 'phase0' | 'phase1' | null;
type LangChoice = 'cpp' | 'java' | 'python' | null;

const tutorialSlides = [
  {
    icon: 'ti-target-arrow',
    title: 'Track Your DSA Progress',
    desc: 'This platform gives you a structured 90-day plan with 200+ curated LeetCode problems, organized by topic and difficulty. Mark problems as solved, write approach notes, and watch your progress grow.',
  },
  {
    icon: 'ti-certificate',
    title: 'Verified & Genuine Practice',
    desc: 'Your LeetCode account is linked for verification. Faculty advisors can see genuine progress — not just self-reported ticks. Quality approach notes are scored automatically.',
  },
  {
    icon: 'ti-chart-line',
    title: 'Faculty & Advisor Visibility',
    desc: 'Your faculty advisor monitors your section\'s progress weekly. They see completion rates, trust scores, and can identify students who need help. Transparency drives accountability.',
  },
  {
    icon: 'ti-route',
    title: 'Two Paths — Your Choice',
    desc: 'Not everyone starts from the same place. Choose Phase 0 to build language fluency first, or jump straight into Phase 1 if you\'re already confident with your language of choice.',
  },
];

const LANGUAGE_COLORS = {
  cpp: '#00599C',
  java: '#ED8B00',
  python: '#3776AB',
} as const;

const LANGUAGE_CARDS = (['cpp', 'java', 'python'] as const).map((key) => ({
  key,
  color: LANGUAGE_COLORS[key],
  chapters: getChaptersForLanguage(key).length,
  topics: getTopicsForLanguage(key).length,
}));

export default function TrackSelectPage() {
  const { status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>('tutorial');
  const [slideIndex, setSlideIndex] = useState(0);
  const [trackChoice, setTrackChoice] = useState<TrackChoice>(null);
  const [langChoice, setLangChoice] = useState<LangChoice>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // If already has a track, redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/track')
        .then((r) => r.json())
        .then((d) => {
          if (d.track) {
            router.replace(d.track === 'phase0' ? '/day0to1' : '/');
          }
        })
        .catch(() => {});
    }
  }, [status, router]);

  const nextSlide = () => {
    if (slideIndex < tutorialSlides.length - 1) {
      setSlideIndex((i) => i + 1);
    } else {
      setStep('choose');
    }
  };

  const skipTutorial = () => setStep('choose');

  const selectTrack = (track: TrackChoice) => {
    setTrackChoice(track);
    if (track === 'phase0') {
      setStep('language');
    }
  };

  const confirmChoice = async () => {
    if (!trackChoice) return;
    if (trackChoice === 'phase0' && !langChoice) return;

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: trackChoice, language: langChoice }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Something went wrong');
        setSaving(false);
        return;
      }
      router.replace(trackChoice === 'phase0' ? '/day0to1' : '/');
    } catch {
      setError('Network error. Please try again.');
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="track-select-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="track-select-page">
      <div className="track-select-container">

        {/* ——— TUTORIAL STEP ——— */}
        {step === 'tutorial' && (
          <div className="tutorial-section animate-fade-in" key={`slide-${slideIndex}`}>
            <div className="tutorial-slide">
              <div className="tutorial-icon-wrap">
                <i className={`ti ${tutorialSlides[slideIndex].icon}`} />
              </div>
              <h2 className="tutorial-title">{tutorialSlides[slideIndex].title}</h2>
              <p className="tutorial-desc">{tutorialSlides[slideIndex].desc}</p>
            </div>

            <div className="tutorial-dots">
              {tutorialSlides.map((_, i) => (
                <span
                  key={i}
                  className={`tutorial-dot ${i === slideIndex ? 'active' : ''} ${i < slideIndex ? 'done' : ''}`}
                />
              ))}
            </div>

            <div className="tutorial-actions">
              <button className="btn-tutorial-skip" onClick={skipTutorial}>
                Skip intro
              </button>
              <button className="btn-tutorial-next" onClick={nextSlide}>
                {slideIndex < tutorialSlides.length - 1 ? 'Next' : 'Choose Your Path'}
                <i className="ti ti-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* ——— CHOOSE TRACK STEP ——— */}
        {step === 'choose' && (
          <div className="track-choose-section animate-fade-in">
            <h2 className="track-choose-heading">Choose Your Path</h2>
            <p className="track-choose-sub">
              Everyone starts from a different place — pick the track that fits you best.
            </p>

            <div className="track-cards">
              <button
                className={`track-card ${trackChoice === 'phase0' ? 'selected' : ''}`}
                onClick={() => selectTrack('phase0')}
              >
                <div className="track-card-badge phase0">Phase 0</div>
                <div className="track-card-icon">
                  <i className="ti ti-plant-2" />
                </div>
                <h3>Language Foundation</h3>
                <p>
                  Build your coding fluency first. Master syntax, data structures, and patterns
                  in C++, Java, or Python before solving LeetCode.
                </p>
                <div className="track-card-rec">
                  <i className="ti ti-info-circle" />
                  Recommended if you struggle with syntax or STL / collections
                </div>
              </button>

              <div className="track-card-divider">
                <span>or</span>
              </div>

              <button
                className={`track-card ${trackChoice === 'phase1' ? 'selected' : ''}`}
                onClick={() => {
                  setTrackChoice('phase1');
                  setLangChoice(null);
                }}
              >
                <div className="track-card-badge phase1">Phase 1</div>
                <div className="track-card-icon">
                  <i className="ti ti-rocket" />
                </div>
                <h3>DSA Sprint</h3>
                <p>
                  Jump straight into 200+ curated LeetCode problems across 14 weeks.
                  Arrays, trees, graphs, DP — the full journey.
                </p>
                <div className="track-card-rec">
                  <i className="ti ti-info-circle" />
                  Recommended if you can already code confidently
                </div>
              </button>
            </div>

            {trackChoice === 'phase1' && (
              <div className="track-confirm-wrap animate-fade-in">
                <button
                  className="btn-track-confirm"
                  onClick={confirmChoice}
                  disabled={saving}
                >
                  {saving ? 'Setting up…' : 'Start DSA Sprint →'}
                </button>
              </div>
            )}

            {error && <p className="track-error">{error}</p>}
          </div>
        )}

        {/* ——— LANGUAGE SELECTION STEP ——— */}
        {step === 'language' && (
          <div className="lang-choose-section animate-fade-in">
            <button className="btn-back" onClick={() => { setStep('choose'); setLangChoice(null); }}>
              <i className="ti ti-arrow-left" /> Back
            </button>

            <h2 className="lang-choose-heading">Pick Your Language</h2>
            <p className="lang-choose-sub">
              Phase 0 covers the same concepts in each language — from setup to LeetCode readiness.
              Choose the one you&apos;ll use for DSA practice.
            </p>

            <div className="lang-cards">
              {LANGUAGE_CARDS.map((lang) => (
                <button
                  key={lang.key}
                  className={`lang-card ${langChoice === lang.key ? 'selected' : ''}`}
                  onClick={() => setLangChoice(lang.key)}
                >
                  <div className="lang-card-icon" style={{ color: lang.color }}>
                    <i className={`ti ${languageMeta[lang.key].icon}`} />
                  </div>
                  <h3>{languageMeta[lang.key].name}</h3>
                  <div className="lang-card-meta">
                    <span>{lang.chapters} chapters</span>
                    <span className="lang-dot">·</span>
                    <span>{lang.topics} topics</span>
                  </div>
                </button>
              ))}
            </div>

            {langChoice && (
              <div className="track-confirm-wrap animate-fade-in">
                <button
                  className="btn-track-confirm"
                  onClick={confirmChoice}
                  disabled={saving}
                >
                  {saving ? 'Setting up…' : `Begin Phase 0 in ${langChoice === 'cpp' ? 'C++' : langChoice === 'java' ? 'Java' : 'Python'} →`}
                </button>
              </div>
            )}

            {error && <p className="track-error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
