import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NTerpretAssessmentProps {
  onBack?: () => void;
  firstName?: string;
  lastName?: string;
  generatedDate?: string;
}

const DEFAULT_FIRST = 'Jane';
const DEFAULT_LAST = 'Doe';
const DEFAULT_DATE = 'DEC 19 2025';

const EXTERNAL_CSS: { id: string; href: string }[] = [
  { id: 'ntgbl-nterpret-bootstrap-css', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' },
  { id: 'ntgbl-nterpret-material-symbols', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' },
];

const HERO_GRID_SVG = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==";

const COMPONENT_STYLES = `
  .np-report {
    --nt-paper: #F7F6F3;
    --nt-ink: #0E0E0E;
    --nt-body: #42403B;
    --nt-gray-brand: #6F6C64;
    --nt-gray-soft: #9A968E;
    --nt-chip: #EDEBE5;
    --nt-line: #E6E3DD;
    --nt-line-strong: #D8D4CC;
    background-color: var(--nt-paper);
    color: var(--nt-body);
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .np-report .font-display { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; letter-spacing: -0.02em; }
  .np-report .font-tech    { font-family: 'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
  .np-report .font-monospace { font-family: 'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace !important; font-variant-numeric: tabular-nums; }
  .np-report .fw-black     { font-weight: 600; }
  .np-report .lh-tight     { line-height: 0.95; }
  .np-report .lh-relaxed   { line-height: 1.6; }
  .np-report .text-xxs     { font-size: 0.65rem; }
  .np-report .ls-wide      { letter-spacing: 0.1em; }
  .np-report .ls-wider     { letter-spacing: 0.16em; }
  .np-report .ls-widest    { letter-spacing: 0.25em; }
  .np-report .ls-tight     { letter-spacing: -0.02em; }
  .np-report .hero-text-glow { text-shadow: none; }

  /* Bootstrap text-color overrides, scoped to the report */
  .np-report .text-white { color: var(--nt-ink) !important; }
  .np-report .text-secondary { color: var(--nt-gray-brand) !important; }

  .np-report .text-gradient-primary {
    background: none;
    color: var(--nt-ink);
    -webkit-text-fill-color: currentColor;
  }

  .np-report .glass-panel {
    background: #FFFFFF;
    border: 1px solid var(--nt-line-strong);
    box-shadow: none;
  }
  .np-report .glass-card {
    background: #FFFFFF;
    border: 1px solid var(--nt-line-strong);
  }

  .np-report .accent-bar       { width: 3px; height: 28px; border-radius: 2px; background: var(--nt-ink); flex-shrink: 0; }
  .np-report .accent-bar-white { width: 3px; height: 28px; border-radius: 2px; background: var(--nt-ink); flex-shrink: 0; }

  .np-report .section-heading { font-size: 1.6rem; letter-spacing: -0.02em; }

  .np-report .hero-section {
    min-height: 40vh;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }
  .np-report .hero-name { font-size: clamp(3rem, 9vw, 5rem); letter-spacing: -0.02em; }
  .np-report .hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image: url("${HERO_GRID_SVG}");
    display: none;
    pointer-events: none;
  }
  .np-report .hero-line-top {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; max-width: 48rem; height: 1px;
    background: var(--nt-line-strong);
  }

  .np-report .badge-analysis {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--nt-line-strong);
    background: #FFFFFF;
    color: var(--nt-ink);
    box-shadow: none;
  }

  .np-report .gradient-divider {
    height: 1px;
    background: var(--nt-line-strong);
  }
  .np-report .summary-rainbow {
    height: 2px;
    border-radius: 0;
    background: var(--nt-line-strong);
    opacity: 1;
  }

  .np-report .border-white-5  { border-color: var(--nt-line) !important; }
  .np-report .border-white-10 { border-color: var(--nt-line-strong) !important; }
  .np-report .bg-surface { background-color: #FFFFFF !important; }
  .np-report .pe-none { pointer-events: none; }
  .np-report .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 1.5rem; line-height: 1; }

  .np-report .ambient-left { display: none; }
  .np-report .ambient-right { display: none; }

  .np-report .attr-card {
    background: #FFFFFF;
    border: 1px solid var(--nt-line-strong);
    padding: 2rem;
    position: relative;
  }
  .np-report .attr-card-first  { border-radius: 2px 2px 0 0; }
  .np-report .attr-card-last   { border-radius: 0 0 2px 2px; }
  @media (min-width: 992px) {
    .np-report .attr-card-first  { border-radius: 2px 0 0 2px; border-right: none; }
    .np-report .attr-card-middle { border-radius: 0; border-right: none; }
    .np-report .attr-card-last   { border-radius: 0 2px 2px 0; }
  }
  .np-report .attr-icon-wrap {
    width: 3.5rem; height: 3.5rem;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
  }
  .np-report .divider-line { height: 1px; width: 2rem; margin: 0 auto 1rem; }

  .np-report .growth-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  @media (min-width: 992px) {
    .np-report .growth-grid {
      display: grid;
      grid-template-columns: 1fr 100px 1fr;
      grid-template-rows: 1fr 1fr;
      column-gap: 2rem;
      row-gap: 2.5rem;
      min-height: 330px;
    }
    .np-report .growth-area-1   { grid-row: 1; grid-column: 1; align-self: center; }
    .np-report .growth-timeline { grid-row: 1 / span 2; grid-column: 2; }
    .np-report .growth-area-2   { grid-row: 2; grid-column: 3; align-self: center; }
  }
  .np-report .growth-timeline-col {
    position: relative;
    height: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .np-report .growth-timeline-line {
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: var(--nt-line-strong);
  }
  .np-report .growth-dot {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 1.75rem; height: 1.75rem;
    border-radius: 50%;
  }
  .np-report .growth-dot-top {
    top: 25%;
    border: 2px solid var(--nt-ink);
    background: #FFFFFF;
    box-shadow: none;
  }
  .np-report .growth-dot-bottom {
    top: 75%;
    border: 2px solid var(--nt-ink);
    background: var(--nt-ink);
    box-shadow: none;
  }

  .np-report .hack-card {
    position: relative;
    border-radius: 2px;
    overflow: hidden;
    min-height: 240px;
    border: 1px solid var(--nt-line-strong);
    background: #FFFFFF;
  }
  .np-report .hack-card-glow { display: none; }
  .np-report .hack-card-border {
    position: absolute;
    left: 0; top: 0;
    height: 100%; width: 3px;
    background: var(--nt-ink);
  }
  .np-report .hack-card-body {
    position: relative;
    z-index: 1;
    padding: 1.5rem 1.75rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .np-report .playbook-sub {
    border-radius: 2px;
    padding: 1rem;
  }
  .np-report .playbook-coach {
    border: 1px solid var(--nt-line-strong);
    background: var(--nt-chip);
  }
  .np-report .playbook-support {
    border: 1px solid var(--nt-line-strong);
    background: var(--nt-chip);
  }
`;

const NTerpretAssessment: React.FC<NTerpretAssessmentProps> = ({
  onBack,
  firstName = DEFAULT_FIRST,
  lastName = DEFAULT_LAST,
  generatedDate = DEFAULT_DATE,
}) => {
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // External CSS lifecycle - add on mount, remove on unmount.
  useEffect(() => {
    const appended: HTMLElement[] = [];
    EXTERNAL_CSS.forEach(({ id, href }) => {
      if (document.getElementById(id)) return;
      const l = document.createElement('link');
      l.id = id;
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
      appended.push(l);
    });
    return () => {
      appended.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);


  return (
    <div
      className="np-report min-vh-100"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <style>{COMPONENT_STYLES}</style>

      {/* Ambient glows */}
      <div className="ambient-left" />
      <div className="ambient-right" />

      {/* Exit Report button (fixed - this report has no sticky HUD) */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn btn-sm d-inline-flex align-items-center gap-1 position-fixed"
          style={{
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 1040,
            border: '1px solid #D8D4CC',
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#0E0E0E',
            fontFamily: "'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace",
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontSize: '0.7rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 999,
          }}
        >
          <ArrowLeft size={12} strokeWidth={1.8} /> Exit Report
        </button>
      )}

      <main
        className="container-xl px-3 px-sm-4 py-5 position-relative"
        style={{ maxWidth: 1200, zIndex: 1 }}
      >

        {/* Hero */}
        <section className="hero-section glass-panel d-flex flex-column justify-content-center align-items-center text-center p-4 p-md-5 mb-5">
          <div className="hero-line-top" />
          <div className="hero-grid-bg" />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <img
                src="/NTangiblelogowhite.PNG"
                alt="NTangible"
                style={{ height: '1.6rem', width: 'auto', filter: 'invert(1)' }}
              />
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 1,
                  height: '2.25rem',
                  background: '#D8D4CC',
                }}
              />
              <img
                src="/IMG.png"
                alt="IMG Academy"
                style={{ height: '3rem' }}
              />
            </div>

            <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4">
              <div className="badge-analysis">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  check_circle
                </span>
                <span
                  className="font-monospace fw-medium text-uppercase ls-widest"
                  style={{ fontSize: '.7rem' }}
                >
                  Analysis Complete
                </span>
              </div>
            </div>

            <h1 className="font-display fw-black lh-tight hero-name mb-0">
              <span className="d-block text-ink">{firstName}</span>
              <span className="d-block text-gradient-primary hero-text-glow mt-2">{lastName}</span>
            </h1>

            <div className="gradient-divider mx-auto my-4" style={{ width: '6rem' }} />

            <p
              className="font-tech text-uppercase ls-widest fw-normal mb-0"
              style={{ fontSize: '.8rem', color: '#6F6C64' }}
            >
              NTerpret&trade; / Mental Scouting Report
            </p>
          </div>
        </section>

        {/* Quick Report Walkthrough */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="accent-bar" />
            <h2 className="font-display fw-bold text-ink ls-tight section-heading mb-0">
              Quick report walkthrough
            </h2>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Video card */}
            <div className="col-12 col-xl-7">
              <article className="glass-card rounded-card p-4 p-md-5 h-100 position-relative overflow-hidden">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3
                    className="font-mono text-uppercase ls-wider mb-4"
                    style={{ fontSize: '.7rem', color: '#6F6C64' }}
                  >
                    Video overview
                  </h3>

                  <div className="d-flex justify-content-center">
                    <div
                      onClick={() => !videoLoaded && setVideoLoaded(true)}
                      className="position-relative overflow-hidden"
                      style={{
                        width: '100%',
                        maxWidth: 320,
                        aspectRatio: '9 / 16',
                        cursor: videoLoaded ? 'default' : 'pointer',
                        background: '#EDEBE5',
                        borderRadius: 2,
                        border: '1px solid #D8D4CC',
                        boxShadow: 'none',
                        transition: 'border-color .3s, box-shadow .3s, transform .35s',
                      }}
                    >
                      {videoLoaded ? (
                        <iframe
                          src="https://drive.google.com/file/d/1yoXXDJ0O6dYvUSEczQyD-nZqaiPZn9wh/preview"
                          title="NTerpret Report"
                          allowFullScreen
                          allow="autoplay; encrypted-media"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                            borderRadius: 'inherit',
                          }}
                        />
                      ) : (
                        <>
                          <img
                            src="https://drive.google.com/thumbnail?id=1yoXXDJ0O6dYvUSEczQyD-nZqaiPZn9wh&sz=w1280"
                            alt="NTerpret Report - Watch Video"
                            className="position-absolute w-100 h-100"
                            style={{ objectFit: 'cover', objectPosition: 'center top', top: 0, left: 0, zIndex: 0 }}
                          />
                          <div
                            className="position-absolute w-100"
                            style={{
                              top: 0,
                              left: 0,
                              height: 1,
                              zIndex: 6,
                              background:
                                'linear-gradient(to right, transparent 5%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.6) 60%, transparent 95%)',
                              pointerEvents: 'none',
                            }}
                          />
                          <div
                            className="position-absolute w-100 h-100"
                            style={{
                              top: 0,
                              left: 0,
                              zIndex: 1,
                              background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.9) 100%)',
                              pointerEvents: 'none',
                            }}
                          />
                          <div
                            className="position-absolute w-100 h-100"
                            style={{
                              top: 0,
                              left: 0,
                              zIndex: 2,
                              backgroundImage:
                                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.009) 2px, rgba(255,255,255,0.009) 3px)',
                              pointerEvents: 'none',
                            }}
                          />
                          <div
                            className="position-absolute w-100 h-100"
                            style={{
                              top: 0,
                              left: 0,
                              zIndex: 5,
                              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                              borderRadius: 'inherit',
                              pointerEvents: 'none',
                            }}
                          />
                          <div
                            className="position-absolute w-100 d-flex flex-column align-items-center"
                            style={{ top: '44%', left: 0, transform: 'translateY(-50%)', zIndex: 4, gap: '.75rem' }}
                          >
                            <div style={{ borderRadius: '50%' }}>
                              <div
                                style={{
                                  width: 72,
                                  height: 72,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(255,255,255,0.92)',
                                  border: '1.5px solid #0E0E0E',
                                  backdropFilter: 'blur(14px)',
                                  WebkitBackdropFilter: 'blur(14px)',
                                  boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
                                }}
                              >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                  <polygon
                                    points="10,5 10,23 25,14"
                                    fill="#0E0E0E"
                                  />
                                </svg>
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: '.47rem',
                                letterSpacing: '.36em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 500,
                                fontFamily: "'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace",
                                textShadow: '0 1px 10px rgba(0,0,0,1)',
                              }}
                            >
                              Play Video
                            </span>
                          </div>
                          <div
                            className="position-absolute w-100"
                            style={{ bottom: 0, left: 0, zIndex: 4, padding: '1rem 1.15rem 1.1rem' }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '.3rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '.5rem',
                                  letterSpacing: '.18em',
                                  textTransform: 'uppercase',
                                  color: 'rgba(255,255,255,0.92)',
                                  fontWeight: 500,
                                  fontFamily: "'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace",
                                }}
                              >
                                NTerpret Report
                              </span>
                              <span
                                style={{
                                  fontSize: '.42rem',
                                  letterSpacing: '.06em',
                                  textTransform: 'uppercase',
                                  padding: '.14rem .42rem',
                                  borderRadius: 2,
                                  background: 'rgba(255,255,255,0.12)',
                                  border: '1px solid rgba(255,255,255,0.5)',
                                  color: 'rgba(255,255,255,0.96)',
                                  fontWeight: 500,
                                  fontFamily: "'Roboto Mono', 'SF Mono', ui-monospace, Menlo, monospace",
                                }}
                              >
                                HD 1080p
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '.58rem',
                                color: 'rgba(255,255,255,0.55)',
                                fontWeight: 500,
                                letterSpacing: '.05em',
                              }}
                            >
                              Video Walkthrough
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 mb-0 lh-relaxed" style={{ fontSize: '.875rem', color: '#42403B' }}>
                    This brief walkthrough highlights what the report includes and how coaches, players, and families should use it.
                  </p>
                </div>
              </article>
            </div>

            {/* Summary card */}
            <div className="col-12 col-xl-5">
              <article className="glass-card rounded-card p-4 p-md-5 h-100">
                <h3
                  className="font-mono text-uppercase ls-wider mb-3"
                  style={{ fontSize: '.7rem', color: '#6F6C64' }}
                >
                  Summary insights
                </h3>
                <div
                  className="d-inline-flex align-items-center gap-2 border border-white-10 rounded-pill px-3 py-1 mb-4"
                  style={{ background: '#FFFFFF' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#6F6C64' }}>
                    calendar_today
                  </span>
                  <span className="font-monospace" style={{ fontSize: '.65rem', color: '#6F6C64' }}>
                    GENERATED: {generatedDate}
                  </span>
                </div>
                <p
                  className="lh-relaxed fw-normal mb-4"
                  style={{ fontSize: '.875rem', color: '#42403B' }}
                >
                  You perform best when you know your role and feel like you belong. When your role is unclear you say you &ldquo;mentally begin to spiral.&rdquo; You respond strongly to coaches who show they care and believe in you - that belief makes you try to exceed expectations. You want frequent feedback, prefer to have skills shown to you and then do them while being watched, and you open up slowly because you&rsquo;re shy and need time to build trust.
                </p>
                <div className="summary-rainbow" />
              </article>
            </div>
          </div>
        </section>

        {/* Three Attribute Cards */}
        <section className="mb-5">
          <div className="row g-0">
            {/* Communication Style */}
            <div className="col-12 col-lg-4">
              <div className="attr-card attr-card-first h-100">
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: '#FFFFFF', border: '1px solid #D8D4CC' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: '#0E0E0E' }}>
                      forum
                    </span>
                  </div>
                  <p
                    className="font-mono fw-medium text-uppercase ls-widest mb-2"
                    style={{ fontSize: '.7rem', color: '#6F6C64' }}
                  >
                    Communication Style
                  </p>
                  <div className="divider-line" style={{ background: '#D8D4CC' }} />
                  <h3 className="font-display text-ink ls-tight mb-2" style={{ fontSize: '1.2rem' }}>
                    Supportive
                  </h3>
                  <p
                    className="fw-normal lh-relaxed mb-4"
                    style={{ fontSize: '.875rem', color: '#42403B' }}
                  >
                    You typically share cautiously and respond best to caring, belief, and kindness. You open up after a relationship is built and do best when feedback is delivered with trust and encouragement.
                  </p>
                  <p
                    className="fw-normal pt-3 mb-0"
                    style={{ fontSize: '.75rem', color: '#6F6C64', borderTop: '1px solid #E6E3DD' }}
                  >
                    Athletes with a Supportive communication style thrive in environments built on trust, encouragement, and connection. They respond best when direction is paired with belief - when a coach&rsquo;s words reinforce that they are valued and capable.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Style */}
            <div className="col-12 col-lg-4">
              <div className="attr-card attr-card-middle h-100">
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: '#FFFFFF', border: '1px solid #D8D4CC' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: '#0E0E0E', fontSize: '1.6rem' }}
                    >
                      psychology
                    </span>
                  </div>
                  <p
                    className="font-mono fw-medium text-uppercase ls-widest mb-2"
                    style={{ fontSize: '.7rem', color: '#6F6C64' }}
                  >
                    Learning Style
                  </p>
                  <div className="divider-line" style={{ background: '#D8D4CC' }} />
                  <h3 className="font-display text-ink ls-tight mb-2" style={{ fontSize: '1.2rem' }}>
                    Kinesthetic
                  </h3>
                  <p
                    className="fw-normal lh-relaxed mb-4"
                    style={{ fontSize: '.875rem', color: '#42403B' }}
                  >
                    You learn fastest by doing - you want skills shown to you and then to try them while someone watches. Hands-on reps with coach observation and immediate, specific feedback help you improve fastest.
                  </p>
                  <p
                    className="fw-normal pt-3 mb-0"
                    style={{ fontSize: '.75rem', color: '#6F6C64', borderTop: '1px solid #E6E3DD' }}
                  >
                    Kinesthetic learners learn through experience - by physically doing, not by watching or hearing. They need to feel the skill in motion before it truly sticks. In practice, repetition, muscle memory, and live scenarios drive their development.
                  </p>
                </div>
              </div>
            </div>

            {/* Motivational Anchor */}
            <div className="col-12 col-lg-4">
              <div className="attr-card attr-card-last h-100">
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: '#FFFFFF', border: '1px solid #D8D4CC' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: '#0E0E0E', fontSize: '1.6rem' }}
                    >
                      anchor
                    </span>
                  </div>
                  <p
                    className="font-mono fw-medium text-uppercase ls-widest mb-2"
                    style={{ fontSize: '.7rem', color: '#6F6C64' }}
                  >
                    Motivational Anchor
                  </p>
                  <div className="divider-line" style={{ background: '#D8D4CC' }} />
                  <h3 className="font-display text-ink ls-tight mb-2" style={{ fontSize: '1.2rem' }}>
                    Team Commitment
                  </h3>
                  <p
                    className="fw-normal lh-relaxed mb-4"
                    style={{ fontSize: '.875rem', color: '#42403B' }}
                  >
                    Belonging and harmony motivate you. You want a team where people get along and support each other - that sense of connection makes you feel secure and pushes you to perform for the group.
                  </p>
                  <p
                    className="fw-normal pt-3 mb-0"
                    style={{ fontSize: '.75rem', color: '#6F6C64', borderTop: '1px solid #E6E3DD' }}
                  >
                    Athletes anchored by Team Commitment are driven by loyalty, trust, and the collective purpose of the group. Their best performances come when they feel their role directly impacts team success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Areas */}
        <section className="glass-panel rounded-card p-4 p-md-5 mb-5 position-relative overflow-hidden">
          <div className="position-relative d-flex align-items-center gap-3 mb-5" style={{ zIndex: 1 }}>
            <div className="accent-bar" />
            <h2 className="font-display fw-bold text-ink ls-tight section-heading mb-0">
              Growth areas
            </h2>
          </div>

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="growth-grid">
              {/* Growth Area 01 */}
              <div className="growth-area-1 text-center text-lg-end">
                <p
                  className="font-mono text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: '#6F6C64' }}
                >
                  Growth Area 01
                </p>
                <p
                  className="lh-relaxed fw-normal mb-0"
                  style={{ fontSize: '1rem', color: '#42403B' }}
                >
                  Unclear roles or perceived punishment trigger insecurity. Building a short routine to re-center and clarify your immediate responsibilities will cut that spiral short.
                </p>
              </div>

              {/* Center timeline (desktop only) */}
              <div className="growth-timeline d-none d-lg-block">
                <div className="growth-timeline-col">
                  <div className="growth-timeline-line" />
                  <div className="growth-dot growth-dot-top" />
                  <div className="growth-dot growth-dot-bottom" />
                </div>
              </div>

              {/* Growth Area 02 */}
              <div className="growth-area-2 text-center text-lg-start">
                <p
                  className="font-mono text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: '#6F6C64' }}
                >
                  Growth Area 02
                </p>
                <p
                  className="lh-relaxed fw-normal mb-0"
                  style={{ fontSize: '1rem', color: '#42403B' }}
                >
                  Faster trust and adaptation to new coaching: you take &lsquo;2–3 weeks&rsquo; to trust a new coach. Shortening that period with proactive communication and small early wins would speed tactical adaptation and connection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Hacks */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="accent-bar" />
            <h2 className="font-display fw-bold text-ink ls-tight section-heading mb-0">
              Performance hacks
            </h2>
          </div>

          <div className="row g-4">
            {/* Pre-Game */}
            <div className="col-12 col-md-4">
              <article className="hack-card h-100">
                <div className="hack-card-glow" />
                <div className="hack-card-border" />
                <div className="hack-card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span
                      className="font-mono text-uppercase ls-widest"
                      style={{ fontSize: '.65rem', color: '#6F6C64' }}
                    >
                      Pre-Game
                    </span>
                    <span className="material-symbols-outlined" style={{ color: '#0E0E0E' }}>
                      bolt
                    </span>
                  </div>
                  <p className="lh-relaxed fw-normal flex-grow-1 mb-0" style={{ color: '#42403B' }}>
                    Use a 3-word role cue before kickoff (example: &lsquo;control, connect, press&rsquo;) to lock in your responsibilities and speed up decision-making.
                  </p>
                </div>
              </article>
            </div>

            {/* Post-Game */}
            <div className="col-12 col-md-4">
              <article className="hack-card h-100">
                <div className="hack-card-glow" />
                <div className="hack-card-border" />
                <div className="hack-card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span
                      className="font-mono text-uppercase ls-widest"
                      style={{ fontSize: '.65rem', color: '#6F6C64' }}
                    >
                      Post-Game
                    </span>
                    <span className="material-symbols-outlined" style={{ color: '#0E0E0E' }}>
                      replay
                    </span>
                  </div>
                  <p className="lh-relaxed fw-normal flex-grow-1 mb-0" style={{ color: '#42403B' }}>
                    After the final whistle, run a 10-second reset: one deep breath, one honest reflection on what went well, and one clear intention to carry into your next game - keeps momentum positive and deliberate.
                  </p>
                </div>
              </article>
            </div>

            {/* Practice */}
            <div className="col-12 col-md-4">
              <article className="hack-card h-100">
                <div className="hack-card-glow" />
                <div className="hack-card-border" />
                <div className="hack-card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span
                      className="font-mono text-uppercase ls-widest"
                      style={{ fontSize: '.65rem', color: '#6F6C64' }}
                    >
                      Practice
                    </span>
                    <span className="material-symbols-outlined" style={{ color: '#0E0E0E' }}>
                      model_training
                    </span>
                  </div>
                  <p className="lh-relaxed fw-normal flex-grow-1 mb-0" style={{ color: '#42403B' }}>
                    Implement a short practice checklist: 2 things I want to reinforce + 1 specific skill to drill - focuses repetition on what matters and builds confidence through intentional reps.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Coach + Support Circle Performance Playbook */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="accent-bar-white" />
            <h2 className="font-display fw-bold text-ink ls-tight section-heading mb-0">
              Coach + support circle performance playbook
            </h2>
          </div>
          <p className="fw-normal mb-4" style={{ fontSize: '.875rem', color: '#6F6C64' }}>
            Applied pregame and postgame notes based on this athlete&rsquo;s selected styles:{' '}
            <span className="text-ink">Supportive</span> communication,{' '}
            <span className="text-ink">Kinesthetic</span> learning, and{' '}
            <span className="text-ink">Team Commitment</span> motivation.{' '}
            <span style={{ color: '#9A968E' }}>
              Support circle = parent, significant other, or partner.
            </span>
          </p>

          <div className="row g-4">
            {/* Communication Style Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-card p-4 border border-white-10 h-100">
                <p
                  className="font-mono text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: '#6F6C64' }}
                >
                  Communication Style
                </p>
                <h3 className="font-display text-ink ls-tight mb-4" style={{ fontSize: '1.2rem' }}>
                  Supportive
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Lead with belief and one clear role cue so confidence is stable before first rep.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Start with belonging and effort, then give one specific next-step adjustment.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Keep communication calm and brief: confidence statement + one process cue.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Ask timing first (&ldquo;Now or later?&rdquo;), then use process questions instead of blame.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            {/* Learning Style Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-card p-4 border border-white-10 h-100">
                <p
                  className="font-mono text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: '#6F6C64' }}
                >
                  Learning Style
                </p>
                <h3 className="font-display text-ink ls-tight mb-4" style={{ fontSize: '1.2rem' }}>
                  Kinesthetic
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Use demo → quick rep progression with one body cue before first live sequence.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Debrief with one rep-based fix that can be physically rehearsed next practice.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Keep prep movement-based (walkthrough + breath/posture cue), not long verbal talks.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Close with two effective actions and one physical reset cue to limit rumination.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            {/* Motivational Anchor Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-card p-4 border border-white-10 h-100">
                <p
                  className="font-mono text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: '#6F6C64' }}
                >
                  Motivational Anchor
                </p>
                <h3 className="font-display text-ink ls-tight mb-4" style={{ fontSize: '1.2rem' }}>
                  Team Commitment
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Define team-role impact clearly so purpose and belonging are locked in early.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Evaluate contribution and trust behaviors before outcome stats.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="font-mono text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6F6C64' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#42403B' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Pregame:</span>{' '}
                        Reinforce mission language (&ldquo;How will you help the group today?&rdquo;), not comparison.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#0E0E0E' }}>Postgame:</span>{' '}
                        Debrief team impact and close with a belonging statement to protect confidence.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-4">
          <p
            className="font-monospace text-uppercase ls-widest mb-0"
            style={{ fontSize: '.6rem', color: '#9A968E', letterSpacing: '0.25em' }}
          >
            © NTANGIBLE, INC. ALL RIGHTS RESERVED
          </p>
        </div>
      </main>

    </div>
  );
};

export default NTerpretAssessment;
