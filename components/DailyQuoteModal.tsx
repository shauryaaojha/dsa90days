'use client';

interface Quote {
  text: string;
  translation?: string;
  meaning: string;
  source: string;
}

interface Props {
  quote: Quote;
  onClose: () => void;
}

export default function DailyQuoteModal({ quote, onClose }: Props) {
  const hasSanskrit = !!quote.translation;

  return (
    <div className="dq-overlay" onClick={onClose}>
      <div className="dq-card animate-fade-in" onClick={(e) => e.stopPropagation()}>

        <div className="dq-om">ॐ</div>

        <div className="dq-label">Today&apos;s Wisdom</div>

        <div className="dq-verse-card">
          {hasSanskrit && (
            <p className="dq-sanskrit">{quote.text}</p>
          )}
          <p className="dq-translation">{hasSanskrit ? quote.translation : quote.text}</p>
          <p className="dq-source">— {quote.source}</p>
        </div>

        <div className="dq-meaning">
          <p className="dq-meaning-label">
            <i className="ti ti-bulb" style={{ fontSize: '12px' }}></i>
            Apply this today
          </p>
          <p className="dq-meaning-text">{quote.meaning}</p>
        </div>

        <button className="dq-btn" onClick={onClose}>
          Begin Today&apos;s Practice
        </button>

      </div>
    </div>
  );
}
