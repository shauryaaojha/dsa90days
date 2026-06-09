'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { problems } from '@/data/problems';
import { weeks } from '@/data/weeks';
import { patterns } from '@/data/patterns';
import PledgeModal from '@/components/PledgeModal';
import DailyQuoteModal from '@/components/DailyQuoteModal';

interface DailyQuote {
  text: string;
  translation?: string;
  meaning: string;
  source: string;
}

interface ProgressEntry {
  problemId: string;
  completed: boolean;
  notes: string;
  completedAt: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledgeDate, setPledgeDate] = useState<string | null>(null);
  const [pledgeLoading, setPledgeLoading] = useState(true);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    if (session) {
      fetchProgress();
      fetchPledge();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setPledgeLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (!pledgeLoading && pledgeDate) {
      const today = new Date().toDateString();
      if (localStorage.getItem('dsa_quote_date') !== today) {
        fetchDailyQuote(today);
      }
    }
  }, [pledgeLoading, pledgeDate]);

  const fetchDailyQuote = async (_today: string) => {
    try {
      const res = await fetch('/api/quote');
      if (!res.ok) return;
      const data = await res.json();
      setDailyQuote(data.quote);
      setShowQuoteModal(true);
    } catch {
      // silently fail — quote is non-critical
    }
  };

  const fetchPledge = async () => {
    try {
      const res = await fetch('/api/pledge');
      const data = await res.json();
      setPledgeDate(data.pledgeAcceptedAt ?? null);
    } catch {
      setPledgeDate(null);
    } finally {
      setPledgeLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      const data = await res.json();
      setProgress(data.progress || []);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProblem = async (problemId: string, currentStatus: boolean) => {
    try {
      // Optimistic state update for instant Gen Z responsive feedback
      setProgress((prev) => {
        const exists = prev.some((p) => p.problemId === problemId);
        if (exists) {
          return prev.map((p) =>
            p.problemId === problemId
              ? {
                  ...p,
                  completed: !currentStatus,
                  completedAt: !currentStatus ? new Date().toISOString() : null,
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              problemId,
              completed: !currentStatus,
              notes: '',
              completedAt: !currentStatus ? new Date().toISOString() : null,
            },
          ];
        }
      });

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          completed: !currentStatus,
        }),
      });

      if (!res.ok) {
        fetchProgress(); // Revert on failure
      }
    } catch (err) {
      console.error('Failed to toggle problem progress:', err);
      fetchProgress(); // Revert on failure
    }
  };

  if (status === 'loading' || (session && (loading || pledgeLoading))) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return <LandingPage />;
  }

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.problemId));
  const totalProblems = problems.length;
  const totalCompleted = completedIds.size;
  const percentage = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  const phase1Problems = problems.filter((p) => p.phase === 1);
  const phase2Problems = problems.filter((p) => p.phase === 2);
  const phase1Completed = phase1Problems.filter((p) => completedIds.has(p.id)).length;
  const phase2Completed = phase2Problems.filter((p) => completedIds.has(p.id)).length;

  const easyProblems = problems.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = problems.filter((p) => p.difficulty === 'Medium');
  const hardProblems = problems.filter((p) => p.difficulty === 'Hard');
  const easyCompleted = easyProblems.filter((p) => completedIds.has(p.id)).length;
  const mediumCompleted = mediumProblems.filter((p) => completedIds.has(p.id)).length;
  const hardCompleted = hardProblems.filter((p) => completedIds.has(p.id)).length;

  const completedDays = new Set(
    problems.filter((p) => completedIds.has(p.id)).map((p) => p.day)
  );

  // Calendar-based day counter — counts real days since pledge date
  const todayDay = pledgeDate
    ? Math.min(90, Math.max(1, Math.floor((Date.now() - new Date(pledgeDate).getTime()) / 86_400_000) + 1))
    : 1;

  // Today's questions list
  const todaysQuestions = problems.filter((p) => p.day === todayDay);

  // Find today's week information
  const todayWeek =
    weeks.find((w) => {
      const match = w.dayRange.match(/Day\s+(\d+)[^\d]+(\d+)/i);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);
        return todayDay >= start && todayDay <= end;
      }
      return false;
    }) || weeks[0];

  // Dynamic streak calculator
  const calculateStreak = () => {
    const completedDates = progress
      .filter((p) => p.completed && p.completedAt)
      .map((p) => new Date(p.completedAt!).toLocaleDateString('en-CA')) // 'YYYY-MM-DD'
      .filter((value, index, self) => self.indexOf(value) === index); // unique dates

    if (completedDates.length === 0) return 0;

    const datesSet = new Set(completedDates);
    let streak = 0;
    const checkDate = new Date();

    const todayStr = checkDate.toLocaleDateString('en-CA');
    if (datesSet.has(todayStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      while (datesSet.has(checkDate.toLocaleDateString('en-CA'))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toLocaleDateString('en-CA');
      if (datesSet.has(yesterdayStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        while (datesSet.has(checkDate.toLocaleDateString('en-CA'))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }
    return streak;
  };
  const currentStreak = calculateStreak();

  // Streak grid generating (3 rows of 7 days) Monday-Sunday
  const getStreakGrid = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 Sun, 1 Mon, ... 6 Sat
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - distanceToMonday);

    const gridStart = new Date(mondayOfThisWeek);
    gridStart.setDate(mondayOfThisWeek.getDate() - 14);

    const completedDates = new Set(
      progress
        .filter((p) => p.completed && p.completedAt)
        .map((p) => new Date(p.completedAt!).toLocaleDateString('en-CA'))
    );

    const todayStr = today.toLocaleDateString('en-CA');

    const gridCells = [];
    for (let i = 0; i < 21; i++) {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + i);
      const cellStr = cellDate.toLocaleDateString('en-CA');

      let type: 'empty' | 'done' | 'today' = 'empty';
      if (cellStr === todayStr) {
        type = 'today';
      } else if (completedDates.has(cellStr)) {
        type = 'done';
      }
      gridCells.push({ date: cellDate, type });
    }
    return gridCells;
  };
  const streakGrid = getStreakGrid();

  const easyPct = easyProblems.length > 0 ? Math.round((easyCompleted / easyProblems.length) * 100) : 0;
  const medPct = mediumProblems.length > 0 ? Math.round((mediumCompleted / mediumProblems.length) * 100) : 0;
  const hardPct = hardProblems.length > 0 ? Math.round((hardCompleted / hardProblems.length) * 100) : 0;

  // SVG circular progress ring calculations
  const strokeDasharray = 276.5;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <>
    {!pledgeDate && (
      <PledgeModal
        userName={session.user?.name || 'Warrior'}
        onAccepted={(date) => setPledgeDate(date)}
      />
    )}
    {showQuoteModal && dailyQuote && (
      <DailyQuoteModal
        quote={dailyQuote}
        onClose={() => {
          localStorage.setItem('dsa_quote_date', new Date().toDateString());
          setShowQuoteModal(false);
        }}
      />
    )}
    <div className="wrap-bento page-container" style={{ padding: '1.75rem 1.5rem 4rem' }}>
      
      {/* Bento Grid */}
      <div className="bento-grid animate-fade-in stagger-children">
        
        {/* 1. Hero progress card (2x2) */}
        <div className="bento-card card-hero-bento">
          <div className="hero-top-bento">
            <span className="hero-title-bento">
              <i className="ti ti-rocket" aria-hidden="true" style={{ fontSize: '16px' }}></i>
              Your Progress
            </span>
            <div className="streak-badge-bento">
              <i className="ti ti-flame" aria-hidden="true"></i>
              {currentStreak} day streak
            </div>
          </div>

          <div className="progress-ring-wrap-bento">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0dfd9" strokeWidth="9" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#944521" strokeWidth="9"
                strokeDasharray="314.16"
                strokeDashoffset={314.16 - (314.16 * percentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" fontSize="24" fontWeight="800" fill="#944521">{percentage}%</text>
              <text x="60" y="72" textAnchor="middle" fontSize="11" fontWeight="500" fill="#88726b">{totalCompleted} / {totalProblems}</text>
            </svg>

            <div className="ring-divider-bento"></div>

            <div className="ring-stats-bento">
              <div className="ring-stat-bento">
                <span className="ring-stat-val-bento">Day {todayDay}</span>
                <span className="ring-stat-lbl-bento">Current day</span>
              </div>
              <div className="ring-stat-bento">
                <span className="ring-stat-val-bento">{completedDays.size}</span>
                <span className="ring-stat-lbl-bento">Days active</span>
              </div>
              <div className="ring-stat-bento">
                <span className="ring-stat-val-bento">{90 - todayDay}</span>
                <span className="ring-stat-lbl-bento">Days left</span>
              </div>
            </div>
          </div>

          <div className="hero-week-strip-bento">
            <div className="hero-week-item-bento">
              <i className="ti ti-calendar-week" style={{ fontSize: '13px', color: 'var(--primary)' }}></i>
              <span>Week {todayWeek.week}</span>
            </div>
            <div className="hero-week-sep-bento"></div>
            <div className="hero-week-item-bento">
              <i className="ti ti-book-2" style={{ fontSize: '13px', color: 'var(--primary)' }}></i>
              <span>{todayWeek.topic}</span>
            </div>
            <div className="hero-week-sep-bento"></div>
            <div className="hero-week-item-bento">
              <i className="ti ti-clock" style={{ fontSize: '13px', color: 'var(--primary)' }}></i>
              <span>{todayWeek.dayRange}</span>
            </div>
          </div>
        </div>

        {/* 2. Streak Card (2x1) */}
        <div className="bento-card card-streak-bento">
          <div className="streak-title-bento">
            <i className="ti ti-calendar-stats" aria-hidden="true" style={{ fontSize: '15px' }}></i>
            Weekly activity — last 3 weeks
          </div>
          <div className="streak-grid-bento">
            {streakGrid.map((cell, idx) => (
              <div 
                key={idx} 
                className={`streak-cell-bento ${cell.type}`}
                title={cell.date.toDateString()}
              />
            ))}
          </div>
          <div className="streak-days-bento">
            <span className="streak-day-bento">Mon</span>
            <span className="streak-day-bento">Tue</span>
            <span className="streak-day-bento">Wed</span>
            <span className="streak-day-bento">Thu</span>
            <span className="streak-day-bento">Fri</span>
            <span className="streak-day-bento">Sat</span>
            <span className="streak-day-bento">Sun</span>
          </div>
        </div>

        {/* 3. Difficulty Card (2x1) */}
        <div className="bento-card card-diff-bento">
          <div className="diff-title-bento">
            <i className="ti ti-chart-bar" aria-hidden="true" style={{ fontSize: '15px' }}></i>
            Difficulty breakdown
          </div>
          <div className="diff-bars-bento">
            <div className="diff-row-bento">
              <span className="diff-label-bento easy-label-bento">Easy</span>
              <div className="diff-track-bento">
                <div className="diff-fill-bento easy-fill-bento" style={{ width: `${easyPct}%` }}></div>
              </div>
              <span className="diff-count-bento">
                {easyCompleted}/{easyProblems.length}
              </span>
            </div>
            <div className="diff-row-bento">
              <span className="diff-label-bento med-label-bento">Medium</span>
              <div className="diff-track-bento">
                <div className="diff-fill-bento med-fill-bento" style={{ width: `${medPct}%` }}></div>
              </div>
              <span className="diff-count-bento">
                {mediumCompleted}/{mediumProblems.length}
              </span>
            </div>
            <div className="diff-row-bento">
              <span className="diff-label-bento hard-label-bento">Hard</span>
              <div className="diff-track-bento">
                <div className="diff-fill-bento hard-fill-bento" style={{ width: `${hardPct}%` }}></div>
              </div>
              <span className="diff-count-bento">
                {hardCompleted}/{hardProblems.length}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Today's Tasks Card (span 2) */}
        <div className="bento-card card-today-bento">
          <div className="today-header-bento">
            <span className="today-title-bento">
              <i className="ti ti-list-check" aria-hidden="true" style={{ fontSize: '15px' }}></i>
              Today's questions — Day {todayDay}
            </span>
            <span className="today-day-bento">
              Week {todayWeek.week} · {todayWeek.topic}
            </span>
          </div>
          
          <div className="task-list-bento">
            {todaysQuestions.length > 0 ? (
              todaysQuestions.map((q) => {
                const isCompleted = completedIds.has(q.id);
                return (
                  <div key={q.id} className={`task-row-bento ${isCompleted ? 'completed' : ''}`}>
                    <input 
                      type="checkbox" 
                      className="task-check-bento" 
                      checked={isCompleted}
                      onChange={() => toggleProblem(q.id, isCompleted)}
                    />
                    <span className="task-name-bento">{q.name}</span>
                    
                    <span className={`task-diff-bento ${
                      q.difficulty === 'Easy' ? 't-easy-bento' : q.difficulty === 'Medium' ? 't-med-bento' : 't-hard-bento'
                    }`}>
                      {q.difficulty}
                    </span>
                    
                    {q.videos?.striver && (
                      <a
                        href={q.videos.striver}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="task-lc-bento"
                        title="Striver Solution"
                      >
                        <i className="ti ti-brand-youtube" style={{ fontSize: '11px' }}></i>
                        <span>Striver</span>
                      </a>
                    )}
                    {q.videos?.apnaCollege && (
                      <a
                        href={q.videos.apnaCollege}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="task-lc-bento"
                        title="Apna College Solution"
                      >
                        <i className="ti ti-brand-youtube" style={{ fontSize: '11px' }}></i>
                        <span>Apna</span>
                      </a>
                    )}
                    {q.videos?.padhoPratyush && (
                      <a
                        href={q.videos.padhoPratyush}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="task-lc-bento"
                        title="Padho w Pratyush Solution"
                      >
                        <i className="ti ti-brand-youtube" style={{ fontSize: '11px' }}></i>
                        <span>Pratyush</span>
                      </a>
                    )}
                    <a
                      href={q.leetcodeLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="task-lc-bento"
                    >
                      <i className="ti ti-external-link" style={{ fontSize: '11px' }}></i>
                      <span>Solve</span>
                    </a>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: 600, textAlign: 'center', padding: '12px' }}>
                All problems completed — keep going!
              </div>
            )}
          </div>
        </div>

        {/* 5. Mini Stats Widgets (span 1 each) — 4 cards fill the row */}
        <div className="bento-card card-mini-bento card-premium-purple">
          <div className="mini-icon-bento">
            <i className="ti ti-target" style={{ fontSize: '15px' }} aria-hidden="true"></i>
          </div>
          <span className="mini-val-bento">{totalProblems}</span>
          <span className="mini-lbl-bento">Total problems</span>
        </div>

        <div className="bento-card card-mini-bento card-premium-green">
          <div className="mini-icon-bento">
            <i className="ti ti-award" style={{ fontSize: '15px' }} aria-hidden="true"></i>
          </div>
          <span className="mini-val-bento">{patterns.length}</span>
          <span className="mini-lbl-bento">Patterns</span>
        </div>

        <div className="bento-card card-mini-bento" style={{ background: '#fef3e2', borderColor: '#fcd9a0' }}>
          <div className="mini-icon-bento" style={{ background: 'rgba(201,114,21,0.12)', color: '#c97215' }}>
            <i className="ti ti-flame" style={{ fontSize: '15px' }} aria-hidden="true"></i>
          </div>
          <span className="mini-val-bento">{currentStreak}</span>
          <span className="mini-lbl-bento">Day streak</span>
        </div>

        <div className="bento-card card-mini-bento" style={{ background: 'var(--surface-container-low)', borderColor: 'var(--outline-variant)' }}>
          <div className="mini-icon-bento">
            <i className="ti ti-calendar-check" style={{ fontSize: '15px' }} aria-hidden="true"></i>
          </div>
          <span className="mini-val-bento">{90 - todayDay}</span>
          <span className="mini-lbl-bento">Days remaining</span>
        </div>

        {/* 6. Phase Cards (span 2 each) */}
        <div className="bento-card card-phase-bento card-premium-purple">
          <div className="phase-header-bento">
            <span className="phase-badge-bento p1-badge-bento">Phase 1</span>
            <span className="phase-days-bento">Day 1–60</span>
          </div>
          <div className="phase-title-bento">Core DS & Algorithms</div>
          <div className="phase-sub-bento">Arrays → Trees → BST → Heaps</div>
          
          <div className="phase-progress-row-bento">
            <div className="phase-track-bento">
              <div 
                className="p1-fill-bento" 
                style={{ width: `${phase1Problems.length > 0 ? (phase1Completed / phase1Problems.length) * 100 : 0}%` }}
              />
            </div>
            <span className="phase-pct-bento p1-pct-bento">
              {phase1Problems.length > 0 ? Math.round((phase1Completed / phase1Problems.length) * 100) : 0}%
            </span>
          </div>
          
          <div className="phase-counts-bento">
            {phase1Completed} / {phase1Problems.length} problems
          </div>
          
          <Link href="/phase/1" style={{ textDecoration: 'none' }}>
            <button className="phase-btn-bento">
              <i className="ti ti-player-play" style={{ fontSize: '13px' }} aria-hidden="true"></i>
              {phase1Completed > 0 ? 'Continue Phase 1' : 'Start Phase 1'}
            </button>
          </Link>
        </div>

        <div className={`bento-card card-phase-bento ${phase1Completed >= phase1Problems.length ? 'card-premium-green' : ''}`}>
          <div className="phase-header-bento">
            <span className="phase-badge-bento p2-badge-bento">Phase 2</span>
            <span className="phase-days-bento">Day 61–90</span>
          </div>
          <div className="phase-title-bento">Advanced + Mixed Mock</div>
          <div className="phase-sub-bento">Graphs → DP → Tries → Mock</div>
          
          <div className="phase-progress-row-bento">
            <div className="phase-track-bento">
              <div 
                className="p2-fill-bento" 
                style={{ width: `${phase2Problems.length > 0 ? (phase2Completed / phase2Problems.length) * 100 : 0}%` }}
              />
            </div>
            <span className="phase-pct-bento p2-pct-bento">
              {phase2Problems.length > 0 ? Math.round((phase2Completed / phase2Problems.length) * 100) : 0}%
            </span>
          </div>
          
          <div className="phase-counts-bento">
            {phase2Completed} / {phase2Problems.length} problems
          </div>
          
          {phase1Completed >= phase1Problems.length ? (
            <Link href="/phase/2" style={{ textDecoration: 'none' }}>
              <button className="phase-btn-bento">
                <i className="ti ti-player-play" style={{ fontSize: '13px' }} aria-hidden="true"></i>
                {phase2Completed > 0 ? 'Continue Phase 2' : 'Start Phase 2'}
              </button>
            </Link>
          ) : (
            <button 
              className="phase-btn-bento" 
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
              disabled
            >
              <i className="ti ti-lock" style={{ fontSize: '13px' }} aria-hidden="true"></i>
              Unlocks after Phase 1
            </button>
          )}
        </div>

      </div>

    </div>
    </>
  );
}

function LandingPage() {
  return (
    <div className="landing-container animate-fade-in">
      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <i className="ti ti-trophy" style={{ fontSize: '13px' }}></i>
            90-Day DSA Mastery Roadmap
          </div>
          <h1 className="landing-hero-title">
            Go from Zero to <br />
            <span>Interview Ready</span>
          </h1>
          <p className="landing-hero-subtitle">
            200+ handpicked LeetCode problems. Daily check-ins. Pattern cheatsheets. Everything you need to crack top-tier SWE interviews — structured into a focused 90-day plan.
          </p>
          <div className="landing-hero-actions">
            <Link href="/register" className="btn-landing-primary">
              <i className="ti ti-rocket" style={{ fontSize: '15px' }}></i>
              Start for Free
            </Link>
            <Link href="/login" className="btn-landing-secondary">
              Sign In
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <span className="landing-stat-num">200+</span>
              <span className="landing-stat-label">Curated Problems</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <span className="landing-stat-num">20</span>
              <span className="landing-stat-label">Key Patterns</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <span className="landing-stat-num">90</span>
              <span className="landing-stat-label">Day Roadmap</span>
            </div>
          </div>
        </div>
        <div className="landing-hero-graphic">
          <div className="landing-hero-visual">
            <div className="landing-visual-card lvc-top">
              <div className="lvc-icon"><i className="ti ti-flame"></i></div>
              <div className="lvc-text">
                <div className="lvc-label">Current Streak</div>
                <div className="lvc-val">7 days 🔥</div>
              </div>
            </div>
            <div className="landing-visual-card lvc-mid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--on-surface)' }}>Overall Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>68%</span>
              </div>
              <div className="lvc-track"><div className="lvc-fill" style={{ width: '68%' }} /></div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span className="lvc-badge lvc-easy">Easy 45/60</span>
                <span className="lvc-badge lvc-med">Med 80/110</span>
                <span className="lvc-badge lvc-hard">Hard 11/30</span>
              </div>
            </div>
            <div className="landing-visual-card lvc-bottom">
              <div className="lvc-icon lvc-icon-green"><i className="ti ti-check"></i></div>
              <div className="lvc-text">
                <div className="lvc-label">Today&apos;s problems done</div>
                <div className="lvc-val" style={{ color: 'var(--secondary)' }}>3 / 3 ✓</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing-section">
        <div className="landing-section-header">
          <span className="landing-section-badge">Features</span>
          <h2 className="landing-section-title">Built for serious preparation</h2>
          <p className="landing-section-subtitle">
            No distractions, no fluff — a razor-sharp tracker built to keep you consistent and confident.
          </p>
        </div>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-card-icon-wrap feature-icon-orange">
              <i className="ti ti-checkbox" style={{ fontSize: '20px' }}></i>
            </div>
            <h3 className="feature-card-title">Daily Progress Tracking</h3>
            <p className="feature-card-desc">
              Check off problems as you go. Visual streak grids and difficulty breakdowns keep you motivated and accountable every single day.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-card-icon-wrap feature-icon-green">
              <i className="ti ti-notes" style={{ fontSize: '20px' }}></i>
            </div>
            <h3 className="feature-card-title">Problem Notes</h3>
            <p className="feature-card-desc">
              Jot down time complexities, tricks, or pseudo-code right on the problem card. Notes auto-save to the cloud so you never lose insights.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-card-icon-wrap feature-icon-orange">
              <i className="ti ti-map-2" style={{ fontSize: '20px' }}></i>
            </div>
            <h3 className="feature-card-title">Pattern Cheatsheet</h3>
            <p className="feature-card-desc">
              20 essential patterns — Sliding Window, Two Pointers, BFS/DFS, and more — with time/space complexity and direct problem links.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-card-icon-wrap feature-icon-green">
              <i className="ti ti-books" style={{ fontSize: '20px' }}></i>
            </div>
            <h3 className="feature-card-title">Curated Resources</h3>
            <p className="feature-card-desc">
              Handpicked YouTube playlists, sheets, and platforms — Striver, Apna College, NeetCode — so you always know what to watch next.
            </p>
          </div>
        </div>
      </section>

      {/* 90-Day Timeline Section */}
      <section className="landing-section">
        <div className="landing-section-header">
          <span className="landing-section-badge">Roadmap</span>
          <h2 className="landing-section-title">Two phases. One goal.</h2>
          <p className="landing-section-subtitle">
            Foundation first, then mastery. Each week builds on the last so you&apos;re never overwhelmed.
          </p>
        </div>
        <div className="timeline-list">
          <div className="glass-card timeline-card">
            <div className="timeline-phase-dot dot-orange"></div>
            <div className="timeline-week">Weeks 1–3</div>
            <h4 className="timeline-title">Core Foundations</h4>
            <p className="timeline-desc">Arrays, Two Pointers, Sliding Window, Matrices, and Recursion.</p>
          </div>
          <div className="glass-card timeline-card">
            <div className="timeline-phase-dot dot-orange"></div>
            <div className="timeline-week">Weeks 4–6</div>
            <h4 className="timeline-title">Linear & Trees</h4>
            <p className="timeline-desc">Linked Lists, Stacks, Queues, Binary Trees, and BSTs.</p>
          </div>
          <div className="glass-card timeline-card">
            <div className="timeline-phase-dot dot-green"></div>
            <div className="timeline-week">Weeks 7–9</div>
            <h4 className="timeline-title">Heaps & Graphs</h4>
            <p className="timeline-desc">Priority Queues, HashMaps, Backtracking, BFS/DFS, Topo Sort.</p>
          </div>
          <div className="glass-card timeline-card">
            <div className="timeline-phase-dot dot-green"></div>
            <div className="timeline-week">Weeks 10–13</div>
            <h4 className="timeline-title">Advanced Mastery</h4>
            <p className="timeline-desc">Dynamic Programming, Greedy, Tries, and Mixed Mock problems.</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="landing-section">
        <div className="glass-card testimonial-card">
          <div className="testimonial-quote-mark">&ldquo;</div>
          <p className="testimonial-sanskrit">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
          </p>
          <p className="testimonial-translation">
            You have the right to perform your actions, but never to the fruits of those actions. Focus on the work — the results will follow.
          </p>
          <div className="testimonial-author">
            <span className="testimonial-name">Bhagavad Gita</span>
            <span className="testimonial-role">Chapter 2, Verse 47</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <div className="landing-cta-card">
          <h2 className="landing-cta-title">Ready to commit to 90 days?</h2>
          <p className="landing-cta-sub">Join hundreds of engineers who started their journey. It&apos;s free, forever.</p>
          <Link href="/register" className="btn-landing-primary btn-cta-large">
            <i className="ti ti-rocket" style={{ fontSize: '16px' }}></i>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} DSA Mastery Tracker &mdash; Built to empower developers.</p>
      </footer>
    </div>
  );
}
