'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { problems, Problem } from '@/data/problems';

interface ProgressEntry {
  problemId: string;
  completed: boolean;
  notes: string;
}

export default function PhasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const phaseId = parseInt(resolvedParams.id) as 1 | 2;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<Map<string, ProgressEntry>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [notesOpen, setNotesOpen] = useState<Set<string>>(new Set());
  const [savingNotes, setSavingNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) fetchProgress();
  }, [session]);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      const data = await res.json();
      const map = new Map<string, ProgressEntry>();
      (data.progress || []).forEach((p: ProgressEntry) => {
        map.set(p.problemId, p);
      });
      setProgress(map);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProblem = async (problemId: string) => {
    const current = progress.get(problemId);
    const newCompleted = !current?.completed;

    // Optimistic update
    const newProgress = new Map(progress);
    newProgress.set(problemId, {
      problemId,
      completed: newCompleted,
      notes: current?.notes || '',
    });
    setProgress(newProgress);

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, completed: newCompleted }),
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
      // Revert
      const revert = new Map(progress);
      if (current) revert.set(problemId, current);
      else revert.delete(problemId);
      setProgress(revert);
    }
  };

  const saveNotes = useCallback(async (problemId: string, notes: string) => {
    setSavingNotes(prev => new Set(prev).add(problemId));
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, notes }),
      });
      const newProgress = new Map(progress);
      const current = newProgress.get(problemId);
      newProgress.set(problemId, {
        problemId,
        completed: current?.completed || false,
        notes,
      });
      setProgress(newProgress);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(prev => {
        const next = new Set(prev);
        next.delete(problemId);
        return next;
      });
    }
  }, [progress]);

  if (status === 'loading' || loading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }
  if (!session) return null;

  const phaseProblems = problems.filter(p => p.phase === phaseId);

  // Get unique topics
  const topics = [...new Set(phaseProblems.map(p => p.topic))];

  // Apply filters
  let filteredProblems = phaseProblems;
  if (filter === 'completed') {
    filteredProblems = filteredProblems.filter(p => progress.get(p.id)?.completed);
  } else if (filter === 'pending') {
    filteredProblems = filteredProblems.filter(p => !progress.get(p.id)?.completed);
  } else if (filter !== 'all') {
    filteredProblems = filteredProblems.filter(p => p.topic === filter);
  }

  if (diffFilter !== 'all') {
    filteredProblems = filteredProblems.filter(p => p.difficulty === diffFilter);
  }

  // Group by day
  const dayGroups = new Map<number, Problem[]>();
  filteredProblems.forEach(p => {
    if (!dayGroups.has(p.day)) dayGroups.set(p.day, []);
    dayGroups.get(p.day)!.push(p);
  });

  const totalCompleted = phaseProblems.filter(p => progress.get(p.id)?.completed).length;
  const percentage = phaseProblems.length > 0 ? Math.round((totalCompleted / phaseProblems.length) * 100) : 0;

  // Dynamic today's learning day calculation: Smallest day with uncompleted problems
  let todayDay = 1;
  for (let d = 1; d <= 90; d++) {
    const dayProbs = problems.filter((p) => p.day === d);
    if (dayProbs.length > 0) {
      const allDone = dayProbs.every((p) => progress.get(p.id)?.completed);
      if (!allDone) {
        todayDay = d;
        break;
      }
    }
  }

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) newExpanded.delete(day);
    else newExpanded.add(day);
    setExpandedDays(newExpanded);
  };

  const toggleNotes = (problemId: string) => {
    const newNotes = new Set(notesOpen);
    if (newNotes.has(problemId)) newNotes.delete(problemId);
    else newNotes.add(problemId);
    setNotesOpen(newNotes);
  };

  const getDifficultyClass = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return '';
    }
  };

  return (
    <div className="wrap-bento page-container" style={{ padding: '1.5rem 1.5rem 3rem' }}>
      
      {/* Premium Bento Header */}
      <div className="bento-header-wrapper animate-fade-in">
        <div className="bento-header-left">
          <h1 className="page-title">
            Phase {phaseId} Details
          </h1>
          <p className="page-subtitle">
            {phaseId === 1
              ? 'Core DS & Algorithms — Arrays → Trees → BST → Heaps'
              : 'Advanced + Mixed Mock — Graphs → DP → Tries → Mock'}
          </p>
        </div>
        <span className={`phase-badge-bento ${phaseId === 1 ? 'p1-badge-bento' : 'p2-badge-bento'}`}>
          {phaseId === 1 ? 'Day 1–60' : 'Day 61–90'}
        </span>
      </div>

      {/* Phase Progress Card */}
      <div className="bento-card animate-fade-in" style={{
        marginBottom: '1.5rem',
        background: phaseId === 1 ? 'var(--surface-container-low)' : 'var(--secondary-container)',
        borderColor: phaseId === 1 ? '#ffb598' : '#b9ccb1',
        color: phaseId === 1 ? 'var(--primary)' : 'var(--secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ti ti-target" aria-hidden="true"></i>
            Phase {phaseId} Core Objectives
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
            {totalCompleted} of {phaseProblems.length} completed
          </span>
        </div>
        <div className="phase-progress-row-bento" style={{ margin: '10px 0' }}>
          <div className="phase-track-bento">
            <div
              className={phaseId === 1 ? 'p1-fill-bento' : 'p2-fill-bento'}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Bento Filter Console */}
      <div className="bento-filter-bar animate-fade-in">
        <button
          className={`bento-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`bento-filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <i className="ti ti-checkbox" style={{ fontSize: '13px' }}></i> Completed
        </button>
        <button
          className={`bento-filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <i className="ti ti-hourglass" style={{ fontSize: '13px' }}></i> Pending
        </button>
        
        <div className="bento-filter-divider"></div>
        
        {topics.map(topic => (
          <button
            key={topic}
            className={`bento-filter-btn ${filter === topic ? 'active' : ''}`}
            onClick={() => setFilter(filter === topic ? 'all' : topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="bento-filter-bar animate-fade-in" style={{ marginTop: '-0.5rem', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0 8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty:</span>
        {['all', 'Easy', 'Medium', 'Hard'].map(d => (
          <button
            key={d}
            className={`bento-filter-btn ${diffFilter === d ? 'active' : ''}`}
            onClick={() => setDiffFilter(d)}
            style={{ padding: '4px 12px' }}
          >
            {d === 'all' ? 'All' : d === 'Easy' ? '🟢 Easy' : d === 'Medium' ? '🟡 Medium' : '🔴 Hard'}
          </button>
        ))}
      </div>

      {/* Problems Organized in Bento Day Cards */}
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
        {Array.from(dayGroups.entries())
          .sort(([a], [b]) => a - b)
          .map(([day, dayProblems]) => {
            const dayCompleted = dayProblems.filter(p => progress.get(p.id)?.completed).length;
            const isExpanded = expandedDays.has(day) || expandedDays.size === 0;
            const firstProblem = dayProblems[0];

            const isDayCompleted = dayCompleted === dayProblems.length;
            const isToday = day === todayDay;

            // Day card state colours — Warm Logic palette
            let cardBg = '#ffffff';
            let cardBorder = 'var(--outline-variant)';
            let cardColor = 'var(--on-surface)';
            let badgeBg = 'var(--surface-container-highest)';
            let badgeColor = 'var(--on-surface-variant)';
            let subtitleColor = 'var(--on-surface-variant)';
            let chevronColor = 'var(--outline)';
            let statusBg = 'var(--surface-container-highest)';
            let statusBorder = 'var(--outline-variant)';
            let statusColor = 'var(--on-surface-variant)';

            if (isDayCompleted) {
              cardBg = 'var(--secondary-container)';
              cardBorder = '#b9ccb1';
              cardColor = 'var(--on-secondary-container)';
              badgeBg = 'var(--secondary)';
              badgeColor = '#ffffff';
              subtitleColor = 'var(--secondary)';
              chevronColor = 'var(--secondary)';
              statusBg = 'var(--secondary)';
              statusBorder = 'transparent';
              statusColor = '#ffffff';
            } else if (isToday) {
              cardBg = 'var(--surface-container-low)';
              cardBorder = '#ffb598';
              cardColor = 'var(--on-primary-container)';
              badgeBg = 'var(--primary)';
              badgeColor = '#ffffff';
              subtitleColor = 'var(--primary)';
              chevronColor = 'var(--primary)';
              statusBg = 'var(--primary)';
              statusBorder = 'transparent';
              statusColor = '#ffffff';
            }

            return (
              <div 
                key={day} 
                className="bento-day-card" 
                style={{ 
                  background: cardBg, 
                  borderColor: cardBorder, 
                  color: cardColor 
                }}
              >
                
                {/* Header block */}
                <div 
                  className={`bento-day-header ${isExpanded ? 'expanded' : ''}`} 
                  onClick={() => toggleDay(day)}
                  style={{ borderBottomColor: isExpanded ? cardBorder : 'transparent' }}
                >
                  <div className="bento-day-title-wrap">
                    <div 
                      className="bento-day-num-badge" 
                      style={{ background: badgeBg, color: badgeColor }}
                    >
                      {day}
                    </div>
                    <div className="bento-day-meta">
                      <span className="bento-day-title-text" style={{ color: cardColor }}>
                        Day {day} Challenges
                      </span>
                      <span className="bento-day-subtitle-text" style={{ color: subtitleColor }}>
                        {firstProblem.topic} &middot; {firstProblem.subTopic}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span 
                      className="bento-day-status-pill" 
                      style={{ 
                        background: statusBg, 
                        color: statusColor,
                        borderColor: statusBorder
                      }}
                    >
                      {dayCompleted} of {dayProblems.length} Solved
                    </span>
                    <span 
                      className={`bento-day-chevron-icon ${isExpanded ? 'open' : ''}`}
                      style={{ color: chevronColor }}
                    >
                      <i className="ti ti-chevron-down"></i>
                    </span>
                  </div>
                </div>

                {/* Problems checklist wrapper */}
                {isExpanded && (
                  <div className="bento-problem-list">
                    {dayProblems.map(problem => {
                      const prog = progress.get(problem.id);
                      const isCompleted = prog?.completed || false;
                      const isNotesOpen = notesOpen.has(problem.id);

                      return (
                        <div key={problem.id} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className={`bento-problem-row ${isCompleted ? 'completed' : ''}`}>
                            
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              className="bento-checkbox-custom"
                              checked={isCompleted}
                              onChange={() => toggleProblem(problem.id)}
                            />

                            {/* Info */}
                            <div className="bento-problem-info-column">
                              <span className="bento-problem-name-text">{problem.name}</span>
                              <div className="bento-problem-meta-row">
                                <span className="bento-problem-pattern-tag">
                                  {problem.pattern}
                                </span>
                                {problem.lcNumber && (
                                  <span>LeetCode #{problem.lcNumber}</span>
                                )}
                              </div>
                            </div>

                            {/* Difficulty */}
                            <span className={`bento-difficulty-badge ${
                              problem.difficulty === 'Easy' ? 't-easy-bento' : problem.difficulty === 'Medium' ? 't-med-bento' : 't-hard-bento'
                            }`}>
                              {problem.difficulty}
                            </span>

                            {/* Actions */}
                            <div className="bento-actions-group">
                              {/* Dynamic Video Solutions */}
                              {problem.videos?.striver && (
                                <a
                                  href={problem.videos.striver}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bento-link-button"
                                  title="Striver Solution"
                                >
                                  <i className="ti ti-brand-youtube" style={{ fontSize: '12px' }}></i> Striver
                                </a>
                              )}
                              {problem.videos?.apnaCollege && (
                                <a
                                  href={problem.videos.apnaCollege}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bento-link-button"
                                  title="Apna College Solution"
                                >
                                  <i className="ti ti-brand-youtube" style={{ fontSize: '12px' }}></i> Apna
                                </a>
                              )}
                              {problem.videos?.padhoPratyush && (
                                <a
                                  href={problem.videos.padhoPratyush}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bento-link-button"
                                  title="Padho w Pratyush Solution"
                                >
                                  <i className="ti ti-brand-youtube" style={{ fontSize: '12px' }}></i> Pratyush
                                </a>
                              )}

                              {problem.leetcodeLink && (
                                <a
                                  href={problem.leetcodeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bento-link-button"
                                >
                                  Solve <i className="ti ti-external-link" style={{ fontSize: '10px' }}></i>
                                </a>
                              )}
                              <button
                                className={`bento-notes-toggle-btn ${isNotesOpen ? 'active' : ''}`}
                                onClick={() => toggleNotes(problem.id)}
                              >
                                <i className="ti ti-notebook" style={{ fontSize: '11px' }}></i> Notes
                              </button>
                            </div>
                          </div>

                          {/* Expansion drawer for text notes */}
                          {isNotesOpen && (
                            <div className="bento-notes-drawer animate-fade-in">
                              <textarea
                                className="bento-notes-textarea"
                                placeholder="Jot down notes, optimized algorithms, complex space-time limits, or pointers..."
                                defaultValue={prog?.notes || ''}
                                onBlur={(e) => saveNotes(problem.id, e.target.value)}
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {savingNotes.has(problem.id) ? (
                                  <span className="bento-notes-save-status" style={{ color: 'var(--primary)' }}>
                                    <i className="ti ti-rotate spin" style={{ marginRight: '4px' }}></i> Saving...
                                  </span>
                                ) : (
                                  <span className="bento-notes-save-status" style={{ color: 'var(--secondary)' }}>
                                    <i className="ti ti-circle-check" style={{ marginRight: '4px' }}></i> Saved
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
