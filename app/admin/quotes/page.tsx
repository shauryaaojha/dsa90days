'use client';

import { useEffect, useState } from 'react';

interface Quote {
  _id: string;
  dayIndex: number;
  text: string;
  translation?: string;
  meaning: string;
  source: string;
}

type QuoteForm = Omit<Quote, '_id'>;

const emptyForm: QuoteForm = {
  dayIndex: 1,
  text: '',
  translation: '',
  meaning: '',
  source: '',
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuoteForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/admin/quotes')
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (q: Quote) => {
    setEditingId(q._id);
    setForm({
      dayIndex: q.dayIndex,
      text: q.text,
      translation: q.translation ?? '',
      meaning: q.meaning,
      source: q.source,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.text || !form.meaning || !form.source || !form.dayIndex) {
      setError('Day, text, meaning, and source are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/admin/quotes', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to save.');
        return;
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quote?')) return;
    await fetch('/api/admin/quotes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: '1.5px solid var(--outline-variant)',
    background: 'var(--surface-container-lowest)',
    fontSize: '13.5px',
    color: 'var(--on-surface)',
    outline: 'none',
    width: '100%',
    resize: 'vertical' as const,
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
            Quotes
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--outline)', marginTop: '4px' }}>
            Daily motivational quotes — {quotes.length} total
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            background: 'var(--primary)',
            color: 'white',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <i className="ti ti-plus" style={{ fontSize: '14px' }}></i>
          Add Quote
        </button>
      </div>

      <div
        style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-container-low)' }}>
                  {['Day', 'Text', 'Source', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--outline)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => (
                  <tr
                    key={q._id}
                    style={{ borderTop: i > 0 ? '1px solid var(--outline-variant)' : undefined }}
                  >
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        width: '52px',
                      }}
                    >
                      {q.dayIndex}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '13px', maxWidth: '380px' }}>
                      <div
                        style={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: 'var(--on-surface)',
                        }}
                      >
                        {q.text}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '12.5px',
                        color: 'var(--outline)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {q.source}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => openEdit(q)}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          background: 'var(--primary-container)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          marginRight: '6px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--error)',
                          background: 'var(--error-container)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '2.5rem',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: 'var(--outline)',
                      }}
                    >
                      No quotes yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(34,26,22,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '540px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 1.5rem' }}>
              {editingId ? 'Edit Quote' : 'Add Quote'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)' }}>
                    Day
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={form.dayIndex}
                    onChange={(e) => setForm((f) => ({ ...f, dayIndex: Number(e.target.value) }))}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)' }}>
                    Source
                  </label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    placeholder="e.g. Bhagavad Gita, Chapter 2 · Verse 47"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)' }}>
                  Text (Sanskrit / English quote)
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  rows={3}
                  placeholder="Quote text..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)' }}>
                  Translation{' '}
                  <span style={{ fontWeight: 400, color: 'var(--outline)' }}>(optional)</span>
                </label>
                <textarea
                  value={form.translation}
                  onChange={(e) => setForm((f) => ({ ...f, translation: e.target.value }))}
                  rows={2}
                  placeholder="English translation..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)' }}>
                  Meaning / DSA application
                </label>
                <textarea
                  value={form.meaning}
                  onChange={(e) => setForm((f) => ({ ...f, meaning: e.target.value }))}
                  rows={3}
                  placeholder="How does this apply to the DSA journey?"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--error)',
                  background: 'var(--error-container)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  marginTop: '1rem',
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9px',
                  background: 'var(--surface-container)',
                  color: 'var(--on-surface-variant)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9px',
                  background: saving ? 'var(--outline-variant)' : 'var(--primary)',
                  color: saving ? 'var(--outline)' : 'white',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
