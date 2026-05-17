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
    --color-bg: #050505;
    --color-surface: #0A0A0A;
    --color-highlight: #141414;
    --color-accent: #F59E0B;
    --color-success: #10B981;
    --color-purple: #8B5CF6;
    --color-danger: #EF4444;
    background-color: var(--color-bg);
    color: #E5E7EB;
    font-family: 'Inter', sans-serif;
    background-image:
      radial-gradient(at 10% 10%, rgba(255,255,255,0.03) 0px, transparent 60%),
      radial-gradient(at 90% 10%, rgba(100,100,100,0.05) 0px, transparent 60%),
      radial-gradient(at 50% 90%, rgba(16,185,129,0.02) 0px, transparent 60%);
  }
  .np-report .font-display { font-family: 'Oswald', sans-serif; }
  .np-report .font-tech    { font-family: 'Rajdhani', sans-serif; }
  .np-report .fw-black     { font-weight: 900; }
  .np-report .lh-tight     { line-height: 0.85; }
  .np-report .lh-relaxed   { line-height: 1.6; }
  .np-report .text-xxs     { font-size: 0.65rem; }
  .np-report .ls-wide      { letter-spacing: 0.1em; }
  .np-report .ls-wider     { letter-spacing: 0.2em; }
  .np-report .ls-widest    { letter-spacing: 0.35em; }
  .np-report .ls-tight     { letter-spacing: -0.03em; }
  .np-report .hero-text-glow { text-shadow: 0 0 20px rgba(255,255,255,0.3); }

  .np-report .text-gradient-primary {
    background: linear-gradient(to right, #FFFFFF, #9CA3AF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .np-report .glass-panel {
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .np-report .glass-card {
    background: rgba(20,20,20,0.4);
    border: 1px solid rgba(255,255,255,0.05);
  }

  .np-report .accent-bar       { width: 4px; height: 32px; border-radius: 4px; background: var(--color-accent); flex-shrink: 0; }
  .np-report .accent-bar-white { width: 4px; height: 32px; border-radius: 4px; background: #fff; flex-shrink: 0; }

  .np-report .section-heading { font-size: 1.75rem; }

  .np-report .hero-section {
    min-height: 50vh;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .np-report .hero-name { font-size: clamp(3.5rem, 10vw, 6rem); }
  .np-report .hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image: url("${HERO_GRID_SVG}");
    opacity: 0.2;
    filter: grayscale(1);
    pointer-events: none;
  }
  .np-report .hero-line-top {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; max-width: 48rem; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
  }

  .np-report .badge-analysis {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 1rem;
    border-radius: 999px;
    border: 1px solid rgba(16,185,129,0.3);
    background: rgba(16,185,129,0.1);
    color: #10B981;
    box-shadow: 0 0 15px rgba(16,185,129,0.15);
    backdrop-filter: blur(4px);
  }

  .np-report .gradient-divider {
    height: 1px;
    background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
  }
  .np-report .summary-rainbow {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(to right, #fff, #a855f7, #F59E0B);
    opacity: 0.6;
  }

  .np-report .border-white-5  { border-color: rgba(255,255,255,0.05) !important; }
  .np-report .border-white-10 { border-color: rgba(255,255,255,0.1) !important; }
  .np-report .bg-surface { background-color: var(--color-surface) !important; }
  .np-report .pe-none { pointer-events: none; }
  .np-report .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 1.5rem; line-height: 1; }

  .np-report .ambient-left {
    position: fixed;
    top: 5rem; left: 2.5rem;
    width: 24rem; height: 24rem;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .np-report .ambient-right {
    position: fixed;
    bottom: 2.5rem; right: 2.5rem;
    width: 31rem; height: 31rem;
    background: rgba(139,92,246,0.05);
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes np-pulse-violet {
    0%   { box-shadow: 0 0 0 0   rgba(168,85,247,0.6), 0 0 30px rgba(168,85,247,0.2); }
    65%  { box-shadow: 0 0 0 18px rgba(168,85,247,0),   0 0 30px rgba(168,85,247,0.2); }
    100% { box-shadow: 0 0 0 0   rgba(168,85,247,0),    0 0 30px rgba(168,85,247,0.2); }
  }

  .np-report .attr-card {
    background: rgba(10,10,10,0.5);
    border: 1px solid rgba(255,255,255,0.05);
    padding: 2rem;
    position: relative;
  }
  .np-report .attr-card-first  { border-radius: 1rem 1rem 0 0; }
  .np-report .attr-card-last   { border-radius: 0 0 1rem 1rem; }
  @media (min-width: 992px) {
    .np-report .attr-card-first  { border-radius: 1rem 0 0 1rem; border-right: none; }
    .np-report .attr-card-middle { border-radius: 0; border-right: none; }
    .np-report .attr-card-last   { border-radius: 0 1rem 1rem 0; }
  }
  .np-report .attr-icon-wrap {
    width: 4rem; height: 4rem;
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
    background: rgba(255,255,255,0.2);
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
    border: 2px solid rgba(255,255,255,0.55);
    background: rgba(255,255,255,0.18);
    box-shadow: 0 0 18px rgba(255,255,255,0.35);
  }
  .np-report .growth-dot-bottom {
    top: 75%;
    border: 2px solid rgba(255,210,80,0.9);
    background: rgba(255,210,80,0.15);
    box-shadow: 0 0 16px rgba(255,210,80,0.45);
  }

  .np-report .hack-card {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    min-height: 240px;
    border: 1px solid rgba(255,255,255,0.1);
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
  }
  .np-report .hack-card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(255,255,0,0.18), transparent 55%);
    opacity: 0.7;
    pointer-events: none;
  }
  .np-report .hack-card-border {
    position: absolute;
    left: 0; top: 0;
    height: 100%; width: 4px;
    background: linear-gradient(to bottom, #FDE047, rgba(253,224,71,0.8), transparent);
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
    border-radius: 0.75rem;
    padding: 1rem;
  }
  .np-report .playbook-coach {
    border: 1px solid rgba(52,211,153,0.3);
    background: rgba(52,211,153,0.1);
  }
  .np-report .playbook-support {
    border: 1px solid rgba(96,165,250,0.3);
    background: rgba(96,165,250,0.1);
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
            border: '1px solid rgba(255,255,255,0.25)',
            backgroundColor: 'rgba(10,10,10,0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#fff',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.7rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 999,
          }}
        >
          <ArrowLeft size={12} /> Exit Report
        </button>
      )}

      <main
        className="container-xl px-3 px-sm-4 py-5 position-relative"
        style={{ maxWidth: 1200, zIndex: 1 }}
      >

        {/* Hero */}
        <section className="hero-section glass-panel d-flex flex-column justify-content-center align-items-center text-center p-4 p-md-5 mb-5">
          <div
            className="position-absolute"
            style={{
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent, transparent)',
              opacity: 0.3,
              pointerEvents: 'none',
            }}
          />
          <div className="hero-line-top" />
          <div className="hero-grid-bg" />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <img
                src="/NTangiblelogowhite.PNG"
                alt="NTangible"
                style={{ height: '1.6rem', width: 'auto' }}
              />
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 1,
                  height: '2.25rem',
                  background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)',
                }}
              />
              <img
                src="/IMG.png"
                alt="IMG Academy"
                style={{ height: '3rem', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))' }}
              />
            </div>

            <div className="d-flex justify-content-center mb-4">
              <div className="badge-analysis">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  check_circle
                </span>
                <span
                  className="font-monospace fw-bold text-uppercase ls-widest"
                  style={{ fontSize: '.7rem' }}
                >
                  Analysis Complete
                </span>
              </div>
            </div>

            <h1 className="font-display fw-black text-uppercase lh-tight hero-name mb-0">
              <span className="d-block text-white">{firstName}</span>
              <span className="d-block text-gradient-primary hero-text-glow mt-2">{lastName}</span>
            </h1>

            <div className="gradient-divider mx-auto my-4" style={{ width: '6rem' }} />

            <p
              className="font-tech text-uppercase text-secondary ls-widest fw-light mb-0"
              style={{ fontSize: '1rem' }}
            >
              NTERPRET / MENTAL SCOUTING REPORT
            </p>
          </div>
        </section>

        {/* Quick Report Walkthrough */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="accent-bar" />
            <h2 className="font-display fw-bold text-white text-uppercase ls-wide section-heading mb-0">
              Quick Report Walkthrough
            </h2>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Video card */}
            <div className="col-12 col-xl-7">
              <article className="glass-card rounded-4 p-4 p-md-5 h-100 position-relative overflow-hidden">
                <div
                  className="position-absolute"
                  style={{
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                    opacity: 0.3,
                    pointerEvents: 'none',
                  }}
                />
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3
                    className="font-display text-uppercase ls-wide text-white mb-4"
                    style={{ fontSize: '1rem' }}
                  >
                    Video Overview
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
                        background: '#0a0810',
                        borderRadius: 18,
                        border: '1px solid rgba(168,85,247,0.24)',
                        boxShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.88), 0 0 48px rgba(168,85,247,0.06)',
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
                                'linear-gradient(to right, transparent 5%, rgba(168,85,247,0.55) 40%, rgba(168,85,247,0.55) 60%, transparent 95%)',
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
                            <div style={{ borderRadius: '50%', animation: 'np-pulse-violet 2.6s ease-out infinite' }}>
                              <div
                                style={{
                                  width: 72,
                                  height: 72,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(5,3,12,0.58)',
                                  border: '1.5px solid rgba(168,85,247,0.88)',
                                  backdropFilter: 'blur(14px)',
                                  WebkitBackdropFilter: 'blur(14px)',
                                  boxShadow: '0 0 36px rgba(168,85,247,0.2), 0 12px 36px rgba(0,0,0,0.6)',
                                }}
                              >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                  <polygon
                                    points="10,5 10,23 25,14"
                                    fill="rgba(255,255,255,0.97)"
                                    style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.85))' }}
                                  />
                                </svg>
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: '.47rem',
                                letterSpacing: '.36em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.52)',
                                fontWeight: 700,
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
                                  color: 'rgba(168,85,247,0.92)',
                                  fontWeight: 700,
                                  fontFamily: "'Rajdhani', sans-serif",
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
                                  borderRadius: 4,
                                  background: 'rgba(168,85,247,0.11)',
                                  border: '1px solid rgba(168,85,247,0.42)',
                                  color: 'rgba(168,85,247,0.96)',
                                  fontWeight: 800,
                                  fontFamily: "'Rajdhani', sans-serif",
                                }}
                              >
                                HD 1080p
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '.58rem',
                                color: 'rgba(255,255,255,0.32)',
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
                  <p className="text-secondary mt-3 mb-0 lh-relaxed" style={{ fontSize: '.875rem' }}>
                    This brief walkthrough highlights what the report includes and how coaches, players, and families should use it.
                  </p>
                </div>
              </article>
            </div>

            {/* Summary card */}
            <div className="col-12 col-xl-5">
              <article className="glass-card rounded-4 p-4 p-md-5 h-100">
                <h3
                  className="font-display text-uppercase ls-wide text-white mb-3"
                  style={{ fontSize: '1rem' }}
                >
                  Summary Insights
                </h3>
                <div
                  className="d-inline-flex align-items-center gap-2 border border-white-10 rounded-pill px-3 py-1 mb-4"
                  style={{ background: 'rgba(0,0,0,0.2)', opacity: 0.7 }}
                >
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '1rem' }}>
                    calendar_today
                  </span>
                  <span className="font-monospace text-secondary" style={{ fontSize: '.65rem' }}>
                    GENERATED: {generatedDate}
                  </span>
                </div>
                <p
                  className="text-secondary lh-relaxed fw-light mb-4"
                  style={{ fontSize: '.875rem' }}
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
                  className="position-absolute"
                  style={{
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: '1.75rem' }}>
                      forum
                    </span>
                  </div>
                  <p
                    className="font-tech fw-bold text-uppercase ls-widest text-secondary mb-2"
                    style={{ fontSize: '.7rem' }}
                  >
                    Communication Style
                  </p>
                  <div className="divider-line" style={{ background: 'rgba(255,255,255,0.3)' }} />
                  <h3 className="font-display text-white mb-2" style={{ fontSize: '1.2rem' }}>
                    Supportive
                  </h3>
                  <p
                    className="text-secondary fw-light lh-relaxed mb-4"
                    style={{ fontSize: '.875rem' }}
                  >
                    You typically share cautiously and respond best to caring, belief, and kindness. You open up after a relationship is built and do best when feedback is delivered with trust and encouragement.
                  </p>
                  <p
                    className="text-secondary fw-light pt-3 mb-0"
                    style={{ fontSize: '.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
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
                  className="position-absolute"
                  style={{
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(139,92,246,0.05), transparent)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: '#c084fc', fontSize: '1.75rem' }}
                    >
                      psychology
                    </span>
                  </div>
                  <p
                    className="font-tech fw-bold text-uppercase ls-widest text-secondary mb-2"
                    style={{ fontSize: '.7rem' }}
                  >
                    Learning Style
                  </p>
                  <div className="divider-line" style={{ background: 'rgba(139,92,246,0.5)' }} />
                  <h3 className="font-display text-white mb-2" style={{ fontSize: '1.2rem' }}>
                    Kinesthetic
                  </h3>
                  <p
                    className="text-secondary fw-light lh-relaxed mb-4"
                    style={{ fontSize: '.875rem' }}
                  >
                    You learn fastest by doing - you want skills shown to you and then to try them while someone watches. Hands-on reps with coach observation and immediate, specific feedback help you improve fastest.
                  </p>
                  <p
                    className="text-secondary fw-light pt-3 mb-0"
                    style={{ fontSize: '.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
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
                  className="position-absolute"
                  style={{
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(16,185,129,0.05), transparent)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="position-relative d-flex flex-column align-items-center text-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="attr-icon-wrap"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: '#34d399', fontSize: '1.75rem' }}
                    >
                      anchor
                    </span>
                  </div>
                  <p
                    className="font-tech fw-bold text-uppercase ls-widest text-secondary mb-2"
                    style={{ fontSize: '.7rem' }}
                  >
                    Motivational Anchor
                  </p>
                  <div className="divider-line" style={{ background: 'rgba(16,185,129,0.5)' }} />
                  <h3 className="font-display text-white mb-2" style={{ fontSize: '1.2rem' }}>
                    Team Commitment
                  </h3>
                  <p
                    className="text-secondary fw-light lh-relaxed mb-4"
                    style={{ fontSize: '.875rem' }}
                  >
                    Belonging and harmony motivate you. You want a team where people get along and support each other - that sense of connection makes you feel secure and pushes you to perform for the group.
                  </p>
                  <p
                    className="text-secondary fw-light pt-3 mb-0"
                    style={{ fontSize: '.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Athletes anchored by Team Commitment are driven by loyalty, trust, and the collective purpose of the group. Their best performances come when they feel their role directly impacts team success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Areas */}
        <section className="glass-panel rounded-4 p-4 p-md-5 mb-5 position-relative overflow-hidden">
          <div
            className="position-absolute pe-none"
            style={{
              inset: 0,
              background:
                'radial-gradient(circle at 16% 22%, rgba(255,255,255,0.04), transparent 48%), radial-gradient(circle at 82% 78%, rgba(255,255,0,0.07), transparent 42%)',
            }}
          />

          <div className="position-relative d-flex align-items-center gap-3 mb-5" style={{ zIndex: 1 }}>
            <div className="accent-bar" />
            <h2 className="font-display fw-bold text-white text-uppercase ls-wide section-heading mb-0">
              Growth Areas
            </h2>
          </div>

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="growth-grid">
              {/* Growth Area 01 */}
              <div className="growth-area-1 text-center text-lg-end">
                <p
                  className="font-tech text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: 'rgba(254,240,138,0.85)' }}
                >
                  Growth Area 01
                </p>
                <p
                  className="text-white lh-relaxed fw-light mb-0"
                  style={{ fontSize: '1rem', opacity: 0.9 }}
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
                  className="font-tech text-uppercase ls-widest mb-2"
                  style={{ fontSize: '.65rem', color: 'rgba(254,240,138,0.85)' }}
                >
                  Growth Area 02
                </p>
                <p
                  className="text-white lh-relaxed fw-light mb-0"
                  style={{ fontSize: '1rem', opacity: 0.9 }}
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
            <h2 className="font-display fw-bold text-white text-uppercase ls-wide section-heading mb-0">
              Performance Hacks
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
                      className="font-tech text-uppercase ls-widest text-secondary"
                      style={{ fontSize: '.65rem' }}
                    >
                      Pre-Game
                    </span>
                    <span className="material-symbols-outlined" style={{ color: 'rgba(253,224,71,0.8)' }}>
                      bolt
                    </span>
                  </div>
                  <p className="text-white lh-relaxed fw-light flex-grow-1 mb-0">
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
                      className="font-tech text-uppercase ls-widest text-secondary"
                      style={{ fontSize: '.65rem' }}
                    >
                      Post-Game
                    </span>
                    <span className="material-symbols-outlined" style={{ color: 'rgba(253,224,71,0.8)' }}>
                      replay
                    </span>
                  </div>
                  <p className="text-white lh-relaxed fw-light flex-grow-1 mb-0">
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
                      className="font-tech text-uppercase ls-widest text-secondary"
                      style={{ fontSize: '.65rem' }}
                    >
                      Practice
                    </span>
                    <span className="material-symbols-outlined" style={{ color: 'rgba(253,224,71,0.8)' }}>
                      model_training
                    </span>
                  </div>
                  <p className="text-white lh-relaxed fw-light flex-grow-1 mb-0">
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
            <h2 className="font-display fw-bold text-white text-uppercase ls-wide section-heading mb-0">
              Coach + Support Circle Performance Playbook
            </h2>
          </div>
          <p className="text-secondary fw-light mb-4" style={{ fontSize: '.875rem' }}>
            Applied pregame and postgame notes based on this athlete&rsquo;s selected styles:{' '}
            <span className="text-white">Supportive</span> communication,{' '}
            <span className="text-white">Kinesthetic</span> learning, and{' '}
            <span className="text-white">Team Commitment</span> motivation.{' '}
            <span className="text-secondary" style={{ opacity: 0.6 }}>
              Support circle = parent, significant other, or partner.
            </span>
          </p>

          <div className="row g-4">
            {/* Communication Style Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-4 p-4 border border-white-10 h-100">
                <p
                  className="font-tech text-uppercase ls-widest text-secondary mb-2"
                  style={{ fontSize: '.65rem' }}
                >
                  Communication Style
                </p>
                <h3 className="font-display text-white mb-4" style={{ fontSize: '1.2rem' }}>
                  Supportive
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6ee7b7' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Pregame:</span>{' '}
                        Lead with belief and one clear role cue so confidence is stable before first rep.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Postgame:</span>{' '}
                        Start with belonging and effort, then give one specific next-step adjustment.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#93c5fd' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Pregame:</span>{' '}
                        Keep communication calm and brief: confidence statement + one process cue.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Postgame:</span>{' '}
                        Ask timing first (&ldquo;Now or later?&rdquo;), then use process questions instead of blame.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            {/* Learning Style Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-4 p-4 border border-white-10 h-100">
                <p
                  className="font-tech text-uppercase ls-widest text-secondary mb-2"
                  style={{ fontSize: '.65rem' }}
                >
                  Learning Style
                </p>
                <h3 className="font-display text-white mb-4" style={{ fontSize: '1.2rem' }}>
                  Kinesthetic
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6ee7b7' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Pregame:</span>{' '}
                        Use demo → quick rep progression with one body cue before first live sequence.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Postgame:</span>{' '}
                        Debrief with one rep-based fix that can be physically rehearsed next practice.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#93c5fd' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Pregame:</span>{' '}
                        Keep prep movement-based (walkthrough + breath/posture cue), not long verbal talks.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Postgame:</span>{' '}
                        Close with two effective actions and one physical reset cue to limit rumination.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            {/* Motivational Anchor Playbook */}
            <div className="col-12 col-lg-4">
              <article className="glass-card rounded-4 p-4 border border-white-10 h-100">
                <p
                  className="font-tech text-uppercase ls-widest text-secondary mb-2"
                  style={{ fontSize: '.65rem' }}
                >
                  Motivational Anchor
                </p>
                <h3 className="font-display text-white mb-4" style={{ fontSize: '1.2rem' }}>
                  Team Commitment
                </h3>
                <div className="d-flex flex-column gap-3">
                  <div className="playbook-sub playbook-coach">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#6ee7b7' }}
                    >
                      Coach
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Pregame:</span>{' '}
                        Define team-role impact clearly so purpose and belonging are locked in early.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#6ee7b7' }}>Postgame:</span>{' '}
                        Evaluate contribution and trust behaviors before outcome stats.
                      </li>
                    </ul>
                  </div>
                  <div className="playbook-sub playbook-support">
                    <p
                      className="text-uppercase ls-wider mb-2"
                      style={{ fontSize: '.7rem', color: '#93c5fd' }}
                    >
                      Support Circle
                    </p>
                    <ul className="mb-0 ps-4" style={{ fontSize: '.875rem', color: '#f3f4f6' }}>
                      <li>
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Pregame:</span>{' '}
                        Reinforce mission language (&ldquo;How will you help the group today?&rdquo;), not comparison.
                      </li>
                      <li className="mt-1">
                        <span className="fw-semibold" style={{ color: '#93c5fd' }}>Postgame:</span>{' '}
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
            style={{ fontSize: '.6rem', color: '#374151', letterSpacing: '0.35em' }}
          >
            © NTANGIBLE, INC. ALL RIGHTS RESERVED
          </p>
        </div>
      </main>

    </div>
  );
};

export default NTerpretAssessment;
