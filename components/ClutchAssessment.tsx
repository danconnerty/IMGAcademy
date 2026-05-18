import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ClutchAssessmentProps {
  onBack?: () => void;
  firstName?: string;
  lastName?: string;
  score?: number;
  assessedDate?: string;
}

type TierKey = 'elite' | 'great' | 'above-average' | 'average' | 'below-average';

const DEFAULT_FIRST = 'Reagan';
const DEFAULT_LAST = 'Zepeda';
const DEFAULT_SCORE = 850;
const DEFAULT_DATE = 'December 19 2025';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const TIERS_CANVAS: Record<string, { accent: string; glow: string; bgS: string; bgF: string }> = {
  ELITE:            { accent: '#F59E0B', glow: 'rgba(245,158,11,0.22)',  bgS: 'rgba(245,158,11,0.10)',  bgF: 'rgba(245,158,11,0.02)' },
  GREAT:            { accent: '#10B981', glow: 'rgba(16,185,129,0.20)',  bgS: 'rgba(16,185,129,0.08)',  bgF: 'rgba(16,185,129,0.02)' },
  'ABOVE AVERAGE':  { accent: '#06B6D4', glow: 'rgba(6,182,212,0.18)',   bgS: 'rgba(6,182,212,0.07)',   bgF: 'rgba(6,182,212,0.01)' },
  AVERAGE:          { accent: '#9CA3AF', glow: 'rgba(156,163,175,0.15)', bgS: 'rgba(156,163,175,0.05)', bgF: 'rgba(156,163,175,0.01)' },
  'BELOW AVERAGE':  { accent: '#818CF8', glow: 'rgba(129,140,248,0.18)', bgS: 'rgba(129,140,248,0.07)', bgF: 'rgba(129,140,248,0.01)' },
};

const EXTERNAL_CSS: { id: string; href: string }[] = [
  { id: 'ntgbl-clutch-bootstrap-css', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' },
  { id: 'ntgbl-clutch-cropper-css', href: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css' },
  { id: 'ntgbl-clutch-material-symbols', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' },
];
const CROPPER_JS_ID = 'ntgbl-clutch-cropper-js';
const CROPPER_JS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js';

function computeTierKey(score: number): TierKey {
  if (score < 651) return 'below-average';
  if (score < 725) return 'average';
  if (score < 750) return 'above-average';
  if (score < 800) return 'great';
  return 'elite';
}

function tierLabel(k: TierKey): string {
  return k.replace('-', ' ').toUpperCase();
}

function genReportId(score: number, first: string, last: string, year: number, month: number): string {
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let seed = score * 31 + first.charCodeAt(0) * 17 + last.charCodeAt(0) * 13 + year * 7 + month * 3;
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
    suffix += CHARS[seed % CHARS.length];
  }
  const yy = String(year).slice(-2);
  const mm = String(month + 1).padStart(2, '0');
  return `CF${score}-${yy}${mm}-${suffix}`;
}

function spW(ctx: CanvasRenderingContext2D, text: string, sp: number): number {
  let w = 0;
  for (let i = 0; i < text.length; i++) w += ctx.measureText(text[i]).width + sp;
  return Math.max(0, w - sp);
}
function spDraw(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, sp: number): void {
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  let cx = x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], cx, y);
    cx += ctx.measureText(text[i]).width + sp;
  }
  ctx.textAlign = prev;
}
function spDrawR(ctx: CanvasRenderingContext2D, t: string, rx: number, y: number, sp: number): void {
  spDraw(ctx, t, rx - spW(ctx, t, sp), y, sp);
}
function spDrawC(ctx: CanvasRenderingContext2D, t: string, cx: number, y: number, sp: number): void {
  spDraw(ctx, t, cx - spW(ctx, t, sp) / 2, y, sp);
}

const HERO_GRID_SVG = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==";

type CanvasD = {
  first: string;
  last: string;
  score: number;
  tier: string;
  assessed: string;
  validThru: string;
};

function drawUserPhotoFrame(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  accent: string,
  img: HTMLImageElement | null
): void {
  const half = size / 2;
  const x = cx - half;
  const y = cy - half;

  if (img && img.naturalWidth) {
    const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = cx - dw / 2;
    const dy = cy - dh / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.save();
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.6);
    bg.addColorStop(0, 'rgba(245,158,11,0.10)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.2;
    const cs = Math.max(8, size * 0.04);
    ctx.beginPath();
    ctx.moveTo(cx - cs, cy); ctx.lineTo(cx + cs, cy);
    ctx.moveTo(cx, cy - cs); ctx.lineTo(cx, cy + cs);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '500 ' + Math.max(8, Math.round(size * 0.045)) + 'px "Rajdhani", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    spDrawC(ctx, 'INSERT PHOTO', cx, cy + size * 0.09, 1.5);
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  const bl = Math.max(10, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(x, y + bl); ctx.lineTo(x, y); ctx.lineTo(x + bl, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + size - bl, y); ctx.lineTo(x + size, y); ctx.lineTo(x + size, y + bl);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + size - bl); ctx.lineTo(x, y + size); ctx.lineTo(x + bl, y + size);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + size - bl, y + size); ctx.lineTo(x + size, y + size); ctx.lineTo(x + size, y + size - bl);
  ctx.stroke();
  ctx.restore();
}

function renderSquareCanvas(
  el: HTMLCanvasElement,
  D: CanvasD,
  userPhoto: HTMLImageElement | null,
  logo: HTMLImageElement | null,
  ntangibleLogo: HTMLImageElement | null,
  now: Date
): void {
  const W = 800, H = 800, S = 4;
  el.width = W * S;
  el.height = H * S;
  el.style.maxWidth = '100%';
  el.style.width = W + 'px';
  el.style.height = 'auto';
  const ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(S, S);
  const t = TIERS_CANVAS[D.tier] || TIERS_CANVAS.AVERAGE;

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

  const dg = ctx.createLinearGradient(0, 0, W * 0.55, H * 0.55);
  dg.addColorStop(0, t.bgS); dg.addColorStop(0.4, t.bgF); dg.addColorStop(1, 'rgba(5,5,5,0)');
  ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);

  const pg = ctx.createRadialGradient(W * 0.88, H * 0.9, 0, W * 0.88, H * 0.9, 260);
  pg.addColorStop(0, 'rgba(139,92,246,0.06)'); pg.addColorStop(1, 'rgba(5,5,5,0)');
  ctx.fillStyle = pg; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let gx = 40; gx < W; gx += 40) {
    for (let gy = 40; gy < H - 90; gy += 40) {
      ctx.beginPath();
      ctx.arc(gx, gy, 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const topL = ctx.createLinearGradient(0, 0, W, 0);
  topL.addColorStop(0, 'rgba(0,0,0,0)');
  topL.addColorStop(0.2, t.accent); topL.addColorStop(0.8, t.accent);
  topL.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = topL; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(W, 1); ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  const headerY = 52;
  let curX = 26;
  // NTangible wordmark first (primary brand), then divider, then IMG badge.
  if (ntangibleLogo && ntangibleLogo.naturalWidth && ntangibleLogo.naturalHeight) {
    const nlh = 18;
    const nlw = Math.round(nlh * (ntangibleLogo.naturalWidth / ntangibleLogo.naturalHeight));
    ctx.globalAlpha = 0.95;
    ctx.drawImage(ntangibleLogo, curX, Math.round(headerY - nlh / 2), nlw, nlh);
    ctx.globalAlpha = 1;
    curX += nlw + 12;
    // Thin vertical divider
    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(curX, headerY - 12);
    ctx.lineTo(curX, headerY + 12);
    ctx.stroke();
    curX += 12;
  }
  if (logo && logo.naturalWidth && logo.naturalHeight) {
    const lh = 26;
    const lw = Math.round(lh * (logo.naturalWidth / logo.naturalHeight));
    ctx.globalAlpha = 0.95;
    ctx.drawImage(logo, curX, Math.round(headerY - lh / 2), lw, lh);
    ctx.globalAlpha = 1;
  }
  ctx.font = '600 11px "Rajdhani", Arial, sans-serif';
  ctx.fillStyle = '#4B5563';
  ctx.textBaseline = 'middle';
  spDrawR(ctx, 'CLUTCH FACTOR™', W - 44, 52, 2);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(44, 86); ctx.lineTo(W - 44, 86); ctx.stroke();

  drawUserPhotoFrame(ctx, W / 2, 235, 230, t.accent, userPhoto);

  const scoreY = 460;
  ctx.shadowColor = t.glow;
  ctx.shadowBlur = 60;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 150px "Oswald", Impact, "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(D.score.toString(), W / 2, scoreY);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  const sepY = 555;
  const sepG = ctx.createLinearGradient(W / 2 - 90, sepY, W / 2 + 90, sepY);
  sepG.addColorStop(0, 'rgba(0,0,0,0)'); sepG.addColorStop(0.5, t.accent); sepG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = sepG; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W / 2 - 90, sepY); ctx.lineTo(W / 2 + 90, sepY); ctx.stroke();

  ctx.fillStyle = t.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const words = D.tier.split(' ');
  const showTier = D.score >= 750;
  if (showTier) {
    if (words.length === 1) {
      ctx.font = 'bold 38px "Oswald", Impact, "Arial Black", sans-serif';
      spDrawC(ctx, D.tier, W / 2, sepY + 52, 8);
    } else {
      ctx.font = 'bold 30px "Oswald", Impact, "Arial Black", sans-serif';
      spDrawC(ctx, words[0], W / 2, sepY + 40, 5);
      spDrawC(ctx, words[1], W / 2, sepY + 74, 5);
    }
  }

  const nameY = !showTier ? sepY + 64 : (words.length === 1 ? sepY + 104 : sepY + 118);
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.font = 'bold 44px "Oswald", Impact, "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(D.first + ' ' + D.last, W / 2, nameY);

  const stubY = 708;
  ctx.setLineDash([3, 8]);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, stubY); ctx.lineTo(W, stubY); ctx.stroke();
  ctx.setLineDash([]);

  const stubMid = stubY + (H - stubY) / 2;

  ctx.fillStyle = t.accent;
  ctx.font = 'bold 10px "Rajdhani", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', 36, stubMid);
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  ctx.fillText(' NTANGIBLE VERIFIED', 50, stubMid);

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  spDrawC(ctx, 'ASSESSED ' + D.assessed + '  ·  VALID THRU ' + D.validThru, W / 2, stubMid, 1.2);

  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(genReportId(D.score, D.first, D.last, now.getFullYear(), now.getMonth()), W - 36, stubMid);
}

function renderStoryCanvas(
  el: HTMLCanvasElement,
  D: CanvasD,
  userPhoto: HTMLImageElement | null,
  logo: HTMLImageElement | null,
  ntangibleLogo: HTMLImageElement | null,
  now: Date
): void {
  const W = 540, H = 960, S = 3;
  el.width = W * S;
  el.height = H * S;
  el.style.maxWidth = '100%';
  el.style.width = W + 'px';
  el.style.height = 'auto';
  const ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(S, S);
  const t = TIERS_CANVAS[D.tier] || TIERS_CANVAS.AVERAGE;

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

  const dg = ctx.createLinearGradient(0, 0, W * 0.55, H * 0.5);
  dg.addColorStop(0, t.bgS); dg.addColorStop(0.45, t.bgF); dg.addColorStop(1, 'rgba(5,5,5,0)');
  ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);

  const pg = ctx.createRadialGradient(W * 0.9, H * 0.9, 0, W * 0.9, H * 0.9, 360);
  pg.addColorStop(0, 'rgba(139,92,246,0.06)'); pg.addColorStop(1, 'rgba(5,5,5,0)');
  ctx.fillStyle = pg; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let gx = 32; gx < W; gx += 32) {
    for (let gy = 32; gy < H - 120; gy += 32) {
      ctx.beginPath();
      ctx.arc(gx, gy, 0.75, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const topL = ctx.createLinearGradient(0, 0, W, 0);
  topL.addColorStop(0, 'rgba(0,0,0,0)');
  topL.addColorStop(0.2, t.accent); topL.addColorStop(0.8, t.accent);
  topL.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = topL; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(W, 1); ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  const headerY = 54;
  let curX = 24;
  if (ntangibleLogo && ntangibleLogo.naturalWidth && ntangibleLogo.naturalHeight) {
    const nlh = 15;
    const nlw = Math.round(nlh * (ntangibleLogo.naturalWidth / ntangibleLogo.naturalHeight));
    ctx.globalAlpha = 0.95;
    ctx.drawImage(ntangibleLogo, curX, Math.round(headerY - nlh / 2), nlw, nlh);
    ctx.globalAlpha = 1;
    curX += nlw + 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(curX, headerY - 10);
    ctx.lineTo(curX, headerY + 10);
    ctx.stroke();
    curX += 10;
  }
  if (logo && logo.naturalWidth && logo.naturalHeight) {
    const lh = 22;
    const lw = Math.round(lh * (logo.naturalWidth / logo.naturalHeight));
    ctx.globalAlpha = 0.95;
    ctx.drawImage(logo, curX, Math.round(headerY - lh / 2), lw, lh);
    ctx.globalAlpha = 1;
  }
  ctx.font = '600 10px "Rajdhani", Arial, sans-serif';
  ctx.fillStyle = '#4B5563';
  ctx.textBaseline = 'middle';
  spDrawR(ctx, 'CLUTCH FACTOR™', W - 34, headerY, 1.5);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(34, 88); ctx.lineTo(W - 34, 88); ctx.stroke();

  drawUserPhotoFrame(ctx, W / 2, 280, 260, t.accent, userPhoto);

  const scoreY = 530;
  ctx.shadowColor = t.glow;
  ctx.shadowBlur = 60;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 140px "Oswald", Impact, "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(D.score.toString(), W / 2, scoreY);
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  const sepY = 625;
  const sepG = ctx.createLinearGradient(W / 2 - 82, sepY, W / 2 + 82, sepY);
  sepG.addColorStop(0, 'rgba(0,0,0,0)'); sepG.addColorStop(0.5, t.accent); sepG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = sepG; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W / 2 - 82, sepY); ctx.lineTo(W / 2 + 82, sepY); ctx.stroke();

  ctx.fillStyle = t.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const words = D.tier.split(' ');
  const showTier = D.score >= 750;
  if (showTier) {
    if (words.length === 1) {
      ctx.font = 'bold 34px "Oswald", Impact, "Arial Black", sans-serif';
      spDrawC(ctx, D.tier, W / 2, sepY + 52, 6);
    } else {
      ctx.font = 'bold 28px "Oswald", Impact, "Arial Black", sans-serif';
      spDrawC(ctx, words[0], W / 2, sepY + 42, 4);
      spDrawC(ctx, words[1], W / 2, sepY + 74, 4);
    }
  }

  const nameY = !showTier ? sepY + 64 : (words.length === 1 ? sepY + 104 : sepY + 118);
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.font = 'bold 42px "Oswald", Impact, "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(D.first + ' ' + D.last, W / 2, nameY);

  const stubY = H - 94;
  ctx.setLineDash([3, 8]);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, stubY); ctx.lineTo(W, stubY); ctx.stroke();
  ctx.setLineDash([]);

  const stubMid = stubY + (H - stubY) / 2;
  ctx.fillStyle = t.accent;
  ctx.font = 'bold 10px "Rajdhani", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', 28, stubMid);
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  ctx.fillText(' NTANGIBLE VERIFIED', 42, stubMid);

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  spDrawC(ctx, 'ASSESSED ' + D.assessed + '  ·  VALID THRU ' + D.validThru, W / 2, stubMid, 1.1);

  ctx.fillStyle = 'rgba(255,255,255,0.30)';
  ctx.font = '500 10px "Rajdhani", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(genReportId(D.score, D.first, D.last, now.getFullYear(), now.getMonth()), W - 28, stubMid);
}

const COMPONENT_STYLES = `
  .cf-report {
    --bg-color: #050505;
    --surface: #0A0A0A;
    --surface-highlight: #141414;
    --primary: #FFFFFF;
    --primary-glow: #E5E7EB;
    --accent: #F59E0B;
    --success: #10B981;
    --danger: #EF4444;
    --purple: #8B5CF6;
    --font-sans: 'Inter', sans-serif;
    --font-display: 'Oswald', sans-serif;
    --font-tech: 'Rajdhani', sans-serif;
    background-color: var(--bg-color);
    color: #E5E7EB;
    font-family: var(--font-sans);
    background-image:
      radial-gradient(at 10% 10%, rgba(255,255,255,0.03) 0px, transparent 60%),
      radial-gradient(at 90% 10%, rgba(100,100,100,0.05) 0px, transparent 60%),
      radial-gradient(at 50% 90%, rgba(168,85,247,0.02) 0px, transparent 60%);
    scroll-behavior: smooth;
  }
  .cf-report .font-display { font-family: var(--font-display); }
  .cf-report .font-tech { font-family: var(--font-tech); }
  .cf-report .text-accent { color: var(--accent); }
  .cf-report .text-purple { color: var(--purple); }
  .cf-report .text-success { color: var(--success) !important; }
  .cf-report .text-danger { color: var(--danger) !important; }
  .cf-report .bg-accent { background-color: var(--accent); }
  .cf-report .bg-surface { background-color: var(--surface); }

  .cf-report .glass-panel {
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  .cf-report .glass-card {
    background: rgba(20, 20, 20, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .cf-report .glass-card:hover {
    background: rgba(30, 30, 30, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px -10px rgba(255, 255, 255, 0.1);
  }
  .cf-report .hover-scale { transition: all 0.2s ease-in-out; }
  .cf-report .hover-scale:hover { transform: translateY(-2px); filter: brightness(1.15); }

  .cf-report .hero-text-glow { text-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }

  .cf-report .tracking-widest { letter-spacing: 0.1em; }
  .cf-report .tracking-tighter { letter-spacing: -0.05em; }
  .cf-report .tracking-tech { letter-spacing: 0.3em; }
  .cf-report .text-10px { font-size: 10px; }
  .cf-report .text-11px { font-size: 11px; }
  .cf-report .text-12px { font-size: 12px; }
  .cf-report .text-14px { font-size: 14px; }
  .cf-report .leading-09 { line-height: 0.9; }
  .cf-report .leading-07 { line-height: 0.7; }
  .cf-report .opacity-80 { opacity: 0.8; }
  .cf-report .opacity-90 { opacity: 0.9; }
  .cf-report .border-white-10 { border-color: rgba(255,255,255,0.1); }
  .cf-report .bg-white-5 { background-color: rgba(255,255,255,0.05); }
  .cf-report .bg-white-10 { background-color: rgba(255,255,255,0.1); }
  .cf-report .text-gray-300 { color: #d1d5db; }
  .cf-report .text-gray-400 { color: #9ca3af; }
  .cf-report .text-gray-500 { color: #6b7280; }
  .cf-report .divider-gradient {
    height: 1px;
    width: 8rem;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
    margin: 2rem auto;
  }
  .cf-report .performance-hud {
    position: sticky;
    top: 0;
    z-index: 1030;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: rgba(5, 5, 5, 0.82);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .cf-report .hud-pill {
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
  }
  .cf-report .ambient-left {
    position: fixed;
    top: 5rem; left: 2.5rem;
    width: 24rem; height: 24rem;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .cf-report .ambient-right {
    position: fixed;
    bottom: 2.5rem; right: 2.5rem;
    width: 31rem; height: 31rem;
    background: rgba(168,85,247,0.05);
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .cf-report .hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image: url("${HERO_GRID_SVG}");
    opacity: 0.2;
    filter: grayscale(1);
    pointer-events: none;
  }
  @keyframes cf-pulse-amber {
    0%   { box-shadow: 0 0 0 0   rgba(245,158,11,0.6), 0 0 30px rgba(245,158,11,0.2); }
    65%  { box-shadow: 0 0 0 18px rgba(245,158,11,0),   0 0 30px rgba(245,158,11,0.2); }
    100% { box-shadow: 0 0 0 0   rgba(245,158,11,0),    0 0 30px rgba(245,158,11,0.2); }
  }
`;

const ClutchAssessment: React.FC<ClutchAssessmentProps> = ({
  onBack,
  firstName = DEFAULT_FIRST,
  lastName = DEFAULT_LAST,
  score = DEFAULT_SCORE,
  assessedDate = DEFAULT_DATE,
}) => {
  const tierKey = computeTierKey(score);
  const tier = tierLabel(tierKey);

  const nowRef = useRef<Date>(new Date());
  const now = nowRef.current;
  const aM = now.getMonth();
  const aY = now.getFullYear();
  const vM = (aM + 6) % 12;
  const vY = aY + (aM + 6 >= 12 ? 1 : 0);

  const D = {
    first: firstName.toUpperCase(),
    last: lastName.toUpperCase(),
    score,
    tier,
    assessed: `${MONTHS[aM]} ${aY}`,
    validThru: `${MONTHS[vM]} ${vY}`,
  };

  // State (canvas + photo state is referenced here; consumed in a later phase)
  const [activeDrill, setActiveDrill] = useState<'focus-interval' | 'confidence-scripting' | null>(null);
  const [activePreview, setActivePreview] = useState<'square' | 'story'>('square');
  const [userPhotoImg, setUserPhotoImg] = useState<HTMLImageElement | null>(null);
  const [photoSourceDataUrl, setPhotoSourceDataUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropperReady, setCropperReady] = useState<boolean>(typeof (window as any).Cropper !== 'undefined');
  const [logoReady, setLogoReady] = useState<boolean>(false);
  const [fontsReady, setFontsReady] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // Refs (same - wired in a later phase)
  const squareCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const storyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropImgRef = useRef<HTMLImageElement | null>(null);
  const cropperInstanceRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const ntangibleLogoImgRef = useRef<HTMLImageElement | null>(null);

  // Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhotoSourceDataUrl(url);
      setCropSrc(url);
    };
    reader.readAsDataURL(file);
  };

  const handleRecrop = () => {
    if (photoSourceDataUrl) setCropSrc(photoSourceDataUrl);
  };

  const handleClearPhoto = () => {
    setUserPhotoImg(null);
    setPhotoSourceDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropApply = () => {
    const inst = cropperInstanceRef.current;
    if (!inst) return;
    const canvas = inst.getCroppedCanvas({
      width: 1024,
      height: 1024,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const img = new Image();
    img.onload = () => setUserPhotoImg(img);
    img.src = url;
    setCropSrc(null);
  };

  const handleCropAction = (action: 'zoom-in' | 'zoom-out' | 'rotate-left' | 'reset') => {
    const c = cropperInstanceRef.current;
    if (!c) return;
    if (action === 'zoom-in') c.zoom(0.1);
    else if (action === 'zoom-out') c.zoom(-0.1);
    else if (action === 'rotate-left') c.rotate(-90);
    else if (action === 'reset') c.reset();
  };

  const downloadCanvas = (which: 'square' | 'story') => {
    const c = which === 'square' ? squareCanvasRef.current : storyCanvasRef.current;
    if (!c) return;
    const a = document.createElement('a');
    const suffix = which === 'square' ? 'social' : 'story';
    a.download = `${D.first.toLowerCase()}-${D.last.toLowerCase()}-clutch-factor-${suffix}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
  };

  // Render social-card canvases whenever athlete/photo/logo/fonts state changes.
  useEffect(() => {
    const sq = squareCanvasRef.current;
    const st = storyCanvasRef.current;
    const logo = logoImgRef.current;
    const ntLogo = ntangibleLogoImgRef.current;
    if (sq) renderSquareCanvas(sq, D, userPhotoImg, logo, ntLogo, now);
    if (st) renderStoryCanvas(st, D, userPhotoImg, logo, ntLogo, now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [D.first, D.last, D.score, D.tier, D.assessed, D.validThru, userPhotoImg, logoReady, fontsReady]);

  // Initialize CropperJS when the crop modal opens; destroy on close.
  useEffect(() => {
    if (!cropSrc) return;
    const CropperCtor = (window as any).Cropper;
    if (!CropperCtor) return;
    const timer = window.setTimeout(() => {
      const img = cropImgRef.current;
      if (!img) return;
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
      cropperInstanceRef.current = new CropperCtor(img, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.95,
        background: false,
        movable: true,
        zoomable: true,
        zoomOnWheel: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        responsive: true,
      });
    }, 50);
    return () => {
      window.clearTimeout(timer);
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
    };
  }, [cropSrc, cropperReady]);

  // Load external CSS / JS once mounted; remove on unmount.
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
    if (!(window as any).Cropper) {
      const existing = document.getElementById(CROPPER_JS_ID) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => setCropperReady(true));
      } else {
        const s = document.createElement('script');
        s.id = CROPPER_JS_ID;
        s.src = CROPPER_JS_SRC;
        s.async = true;
        s.onload = () => setCropperReady(true);
        document.head.appendChild(s);
        appended.push(s);
      }
    } else {
      setCropperReady(true);
    }
    let loaded = 0;
    const markReady = () => { loaded += 1; if (loaded >= 2) setLogoReady(true); };
    const img = new Image();
    img.onload = markReady;
    img.onerror = markReady;
    img.src = '/IMG.png';
    logoImgRef.current = img;
    const ntImg = new Image();
    ntImg.onload = markReady;
    ntImg.onerror = markReady;
    ntImg.src = '/NTangiblelogowhite.PNG';
    ntangibleLogoImgRef.current = ntImg;

    // Canvas uses Oswald/Rajdhani - wait for fonts to load before rendering,
    // otherwise the social card falls back to Impact/Arial Black while the
    // rest of the page uses the properly-loaded web fonts.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsReady(true)).catch(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }

    return () => {
      appended.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);

  return (
    <div
      className="cf-report min-vh-100 text-white"
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

      {/* Performance HUD */}
      <div className="performance-hud py-2 px-2 px-md-3 mb-3">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="hud-pill text-10px font-tech text-uppercase tracking-tech text-gray-400">
                Athlete <span className="text-white fw-bold ms-1">{firstName} {lastName}</span>
              </span>
              <span className="hud-pill text-10px font-tech text-uppercase tracking-tech text-gray-400">
                Score <span className="text-white fw-bold ms-1">{score}</span>
              </span>
              <span className="hud-pill text-10px font-tech text-uppercase tracking-tech text-gray-400">
                Tier <span className="text-accent fw-bold ms-1">{tier}</span>
              </span>
              <span className="hud-pill text-10px font-tech text-uppercase tracking-tech text-gray-400">
                Assessed <span className="text-white fw-bold ms-1">{assessedDate}</span>
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={() => downloadCanvas('square')}
                className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-accent bg-transparent"
                style={{ border: '1px solid rgba(245,158,11,0.35)' }}
              >
                Download Post 1080&times;1080
              </button>
              <button
                type="button"
                onClick={() => downloadCanvas('story')}
                className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-purple bg-transparent"
                style={{ border: '1px solid rgba(168,85,247,0.35)' }}
              >
                Download Story 1080&times;1920
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Report - floating pill below the HUD, top-right. */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn btn-sm d-inline-flex align-items-center gap-1 position-fixed"
          style={{
            top: '3.5rem',
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

      <main className="container py-5 position-relative" style={{ maxWidth: 1200, zIndex: 1 }}>

        {/* Hero */}
        <section className="position-relative py-5 d-flex flex-column align-items-center text-center overflow-hidden">
          <div className="hero-grid-bg" />
          <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
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
              style={{ height: '3rem', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))' }}
            />
          </div>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-5">
            <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <span
                className="rounded-circle bg-white me-2"
                style={{ width: '0.5rem', height: '0.5rem' }}
              />
              <span className="text-10px font-tech fw-bold text-gray-400 tracking-tech text-uppercase">
                Analysis Complete // {assessedDate}
              </span>
            </div>
          </div>

          <h1
            className="font-display fw-bold text-uppercase tracking-tighter mb-4 leading-09"
            style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
          >
            <span className="d-block text-white">{firstName}</span>
            <span className="d-block text-white opacity-90 mt-2">{lastName}</span>
          </h1>

          <div className="divider-gradient" />

          <p className="text-14px font-tech text-gray-400 text-uppercase tracking-tech fw-medium">
            NTANGIBLE ASSESSMENT / CLUTCH FACTOR REPORT
          </p>
        </section>

        {/* Clutch Factor score + tier breakdown */}
        <section className="mb-5">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="glass-card rounded-4 p-5 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden h-100">
                <h2 className="text-14px font-tech fw-bold text-gray-500 text-uppercase tracking-tech mb-5">
                  Clutch Factor&trade;
                </h2>
                <div className="position-relative d-flex flex-column align-items-center">
                  <span
                    className="leading-07 font-display fw-bold text-white tracking-tighter"
                    style={{ fontSize: 'clamp(8rem, 15vw, 14rem)' }}
                  >
                    {score}
                  </span>
                  <div className="mt-5 text-center">
                    <p className="text-10px font-tech fw-bold text-gray-400 text-uppercase tracking-tech mb-0">
                      Scored on 1000 point scale
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="glass-card rounded-4 p-4 p-md-5 position-relative overflow-hidden d-flex flex-column justify-content-center h-100">
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-pill"
                      style={{
                        width: 4,
                        height: '2rem',
                        background: 'linear-gradient(to bottom, #fde047, #f59e0b)',
                        boxShadow: '0 0 15px rgba(251,191,36,0.5)',
                      }}
                    />
                    <h3 className="fs-4 font-display fw-bold text-white text-uppercase tracking-widest mb-0">
                      THE NTANGIBLE EDGE: THE PREDICTIVE POWER OF YOUR SCORE
                    </h3>
                  </div>
                  <p
                    className="text-14px text-gray-400 fw-light"
                    style={{ lineHeight: 1.6, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}
                  >
                    Your Clutch Factor&trade; is not a personality test. It is a biological and neurological measurement of how you process information under high-leverage constraints. Here is what the data says about your specific tier:
                  </p>
                </div>

                <div className="d-flex flex-column gap-3 font-tech position-relative">
                  {/* Elite Tier */}
                  <div
                    className="position-relative p-3 rounded-3"
                    style={
                      tierKey === 'elite'
                        ? {
                            backgroundColor: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }
                    }
                  >
                    <div
                      className="position-absolute bg-accent rounded-pill d-none d-md-block"
                      style={{ left: -4, top: '50%', transform: 'translateY(-50%)', width: 8, height: '2rem' }}
                    />
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-accent fw-bold fs-5 tracking-tighter">800+</span>
                        <span className="text-white font-display fw-bold text-uppercase tracking-widest text-14px">ELITE</span>
                      </div>
                      {tierKey === 'elite' && (
                        <span className="bg-accent text-dark text-10px fw-bold px-2 py-1 rounded text-uppercase tracking-tighter">
                          You Are Here
                        </span>
                      )}
                    </div>
                    <p className="text-11px mb-2 fw-medium" style={{ color: 'rgba(245,158,11,0.9)' }}>
                      <span className="text-white fw-bold">The Stat:</span> 73% of NCAA athletes scoring in this range achieve All-American or All-Conference honors.
                    </p>
                    <p className="text-12px text-gray-300 mb-0" style={{ lineHeight: 1.4 }}>
                      <span className="text-white fw-bold">The Meaning:</span> You possess elite situational awareness and emotional regulation. You are wired to accelerate when the pressure peaks, making you a premium asset for high-stakes moments.
                    </p>
                  </div>

                  {/* Great Tier */}
                  <div
                    className="p-3 rounded-3"
                    style={
                      tierKey === 'great'
                        ? {
                            backgroundColor: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderLeftColor: 'rgba(16,185,129,0.3)',
                          }
                    }
                  >
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-success fw-bold fs-5 tracking-tighter">750 - 799</span>
                        <span className="text-gray-300 font-display fw-bold text-uppercase tracking-widest text-14px">GREAT</span>
                      </div>
                      {tierKey === 'great' && (
                        <span className="bg-accent text-dark text-10px fw-bold px-2 py-1 rounded text-uppercase tracking-tighter">
                          You Are Here
                        </span>
                      )}
                    </div>
                    <p className="text-11px mb-2 fw-medium" style={{ color: 'rgba(16,185,129,0.8)' }}>
                      <span className="text-white fw-bold">The Stat:</span> High school athletes scoring 750+ are 2x more likely to commit to a Division 1 program.
                    </p>
                    <p className="text-12px text-gray-400 mb-0" style={{ lineHeight: 1.4 }}>
                      <span className="text-gray-200 fw-bold">The Meaning:</span> You have the internal stability and decision-making speed that elite college recruiters demand. You are officially in the &lsquo;D1 Standard&rsquo; zone.
                    </p>
                  </div>

                  {/* Above Average Tier */}
                  <div
                    className="p-3 rounded-3"
                    style={
                      tierKey === 'above-average'
                        ? {
                            backgroundColor: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderLeftColor: 'rgba(16,185,129,0.3)',
                          }
                    }
                  >
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-success fw-bold fs-5 tracking-tighter">725 - 749</span>
                        <span className="text-gray-300 font-display fw-bold text-uppercase tracking-widest text-14px">ABOVE AVERAGE</span>
                      </div>
                      {tierKey === 'above-average' && (
                        <span className="bg-accent text-dark text-10px fw-bold px-2 py-1 rounded text-uppercase tracking-tighter">
                          You Are Here
                        </span>
                      )}
                    </div>
                    <p className="text-11px mb-2 fw-medium" style={{ color: 'rgba(16,185,129,0.8)' }}>
                      <span className="text-white fw-bold">The Benchmark:</span> This is where most collegiate starters and high school prospects land. You are outperforming the majority of elite developmental talent.
                    </p>
                    <p className="text-12px text-gray-400 mb-0" style={{ lineHeight: 1.4 }}>
                      <span className="text-gray-200 fw-bold">The Meaning:</span> You handle pressure well and are on the cusp of top-tier recruit status. Fine-tuning your mental game with targeted exercises will push you into the 750+ bracket.
                    </p>
                  </div>

                  {/* Average Tier */}
                  <div
                    className="p-3 rounded-3"
                    style={
                      tierKey === 'average'
                        ? {
                            backgroundColor: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderLeftColor: 'rgba(255,255,255,0.15)',
                          }
                    }
                  >
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-white fw-bold fs-5 tracking-tighter">651 - 724</span>
                        <span className="text-gray-400 font-display fw-bold text-uppercase tracking-widest text-14px">AVERAGE</span>
                      </div>
                      {tierKey === 'average' && (
                        <span className="bg-accent text-dark text-10px fw-bold px-2 py-1 rounded text-uppercase tracking-tighter">
                          You Are Here
                        </span>
                      )}
                    </div>
                    <p className="text-11px text-gray-500 mb-2 fw-medium">
                      <span className="text-white fw-bold">The Benchmark:</span> The national high school average across sports tested is 668.
                    </p>
                    <p className="text-12px text-gray-400 mb-0" style={{ lineHeight: 1.4 }}>
                      <span className="text-gray-200 fw-bold">The Meaning:</span> You are performing at the national baseline. You have the foundation, but consistency under stress is your current ceiling. Closing this gap is the fastest way to separate yourself from the pack.
                    </p>
                  </div>

                  {/* Below Average Tier */}
                  <div
                    className="p-3 rounded-3"
                    style={
                      tierKey === 'below-average'
                        ? {
                            backgroundColor: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderLeftColor: 'rgba(251,146,60,0.3)',
                          }
                    }
                  >
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold fs-5 tracking-tighter" style={{ color: '#fb923c' }}>
                          650 &amp; UNDER
                        </span>
                        <span className="text-gray-500 font-display fw-bold text-uppercase tracking-widest text-14px">BELOW AVERAGE</span>
                      </div>
                      {tierKey === 'below-average' && (
                        <span className="bg-accent text-dark text-10px fw-bold px-2 py-1 rounded text-uppercase tracking-tighter">
                          You Are Here
                        </span>
                      )}
                    </div>
                    <p className="text-12px text-gray-400 mb-0" style={{ lineHeight: 1.4 }}>
                      <span className="text-gray-200 fw-bold">The Meaning:</span> Pressure currently disrupts your focus or mechanics in game-time situations. Just like physical strength, your mental resilience is a muscle that requires deliberate reps to build.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Assessment Explained */}
        <section
          className="glass-panel rounded-4 p-4 p-md-5 position-relative overflow-hidden mb-5"
          style={{ borderColor: 'rgba(168,85,247,0.2)' }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: 'linear-gradient(to bottom right, rgba(88,28,135,0.15), transparent, transparent)', pointerEvents: 'none' }}
          />
          <div
            className="position-absolute top-0 start-0 w-100"
            style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)', pointerEvents: 'none' }}
          />
          <div
            className="position-absolute rounded-circle"
            style={{ top: '-8rem', left: '-8rem', width: '16rem', height: '16rem', backgroundColor: '#8B5CF6', opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none' }}
          />
          <div
            className="position-absolute rounded-circle"
            style={{ bottom: '-8rem', right: '-8rem', width: '16rem', height: '16rem', backgroundColor: '#8B5CF6', opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none' }}
          />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center gap-3 mb-5">
              <div
                className="rounded-pill"
                style={{
                  width: 4,
                  height: '2rem',
                  background: 'linear-gradient(to bottom, #c084fc, #7e22ce)',
                  boxShadow: '0 0 12px rgba(168,85,247,0.5)',
                }}
              />
              <h2 className="fs-3 font-display fw-bold text-white text-uppercase tracking-widest mb-0">
                Your Assessment Explained
              </h2>
            </div>

            <div className="row g-4">
              {/* What We Measure */}
              <div className="col-md-6">
                <div className="bg-white-5 border border-white-10 rounded-4 p-4 p-md-5 position-relative overflow-hidden h-100">
                  <div
                    className="position-absolute rounded-circle"
                    style={{ top: '-2.5rem', right: '-2.5rem', width: '10rem', height: '10rem', backgroundColor: '#8B5CF6', opacity: 0.05, filter: 'blur(40px)', pointerEvents: 'none' }}
                  />
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-purple" style={{ fontSize: '2rem' }}>
                      psychology
                    </span>
                    <h3 className="fs-5 font-display fw-bold text-white text-uppercase tracking-widest mb-0">What We Measure</h3>
                  </div>
                  <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                    The Clutch Factor&trade; evaluates your cognitive processing speed, emotional regulation, and decision-making accuracy under simulated high-stakes pressure. It identifies whether your performance elevates, stabilizes, or degrades when the game is on the line.
                  </p>
                </div>
              </div>

              {/* How to Use This */}
              <div className="col-md-6">
                <div className="bg-white-5 border border-white-10 rounded-4 p-4 p-md-5 position-relative overflow-hidden h-100">
                  <div
                    className="position-absolute rounded-circle"
                    style={{ top: '-2.5rem', right: '-2.5rem', width: '10rem', height: '10rem', backgroundColor: '#F59E0B', opacity: 0.05, filter: 'blur(40px)', pointerEvents: 'none' }}
                  />
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-accent" style={{ fontSize: '2rem' }}>
                      trending_up
                    </span>
                    <h3 className="fs-5 font-display fw-bold text-white text-uppercase tracking-widest mb-0">How to Use This</h3>
                  </div>
                  <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                    Use this score as a baseline. Elite athletes train their minds just like their bodies. Identify your tier, understand your current limitations, and use targeted mental conditioning to push your Clutch Factor&trade; into the next bracket.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Big Picture + Video */}
        <section
          className="position-relative rounded-4 overflow-hidden p-4 p-md-5 mb-5"
          style={{ border: '1px solid rgba(168,85,247,0.2)' }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: 'linear-gradient(to bottom right, rgba(88,28,135,0.3), #000, #000)' }}
          />
          <div
            className="position-absolute top-0 start-0 w-100"
            style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.6), transparent)' }}
          />
          <div
            className="position-absolute bottom-0 start-0 w-100"
            style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)' }}
          />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-pill"
                    style={{
                      width: 4,
                      height: '3rem',
                      background: 'linear-gradient(to bottom, #c084fc, #7e22ce)',
                      boxShadow: '0 0 12px rgba(168,85,247,0.5)',
                    }}
                  />
                  <div>
                    <p
                      className="text-12px font-tech fw-bold text-uppercase tracking-tech mb-1"
                      style={{ color: '#c084fc' }}
                    >
                      The Big Picture
                    </p>
                    <h2 className="fs-2 font-display fw-bold text-white text-uppercase tracking-widest mb-0">
                      A Note On Your Score
                    </h2>
                  </div>
                </div>
                <p className="text-gray-300 fw-light fs-5 mb-4" style={{ lineHeight: 1.6 }}>
                  Your Clutch Factor is not the be-all, end-all; it is just one piece of your complete athletic profile. A lower score does not mean you are a bad player. It simply indicates that your physical skills are currently much more developed than your mental skills.
                </p>
                <p className="text-gray-300 fw-light fs-5 mb-0" style={{ lineHeight: 1.6 }}>
                  Your clutch abilities are <strong className="text-white fw-bold">highly trainable</strong>. By engaging with the targeted personalized exercises below, you can bridge that gap and actively build the mental mechanics required to match your physical talent.
                </p>
              </div>

              <div className="col-lg-6">
                <div className="d-flex justify-content-center">
                  <div
                    onClick={() => !videoLoaded && setVideoLoaded(true)}
                    className="position-relative overflow-hidden"
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      aspectRatio: '9 / 16',
                      cursor: videoLoaded ? 'default' : 'pointer',
                      background: '#0d0b06',
                      borderRadius: 18,
                      border: '1px solid rgba(245,158,11,0.24)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.88), 0 0 48px rgba(245,158,11,0.06)',
                      transition: 'border-color .3s, box-shadow .3s, transform .35s',
                    }}
                  >
                    {videoLoaded ? (
                      <iframe
                        src="https://drive.google.com/file/d/1ZFKFJe3KRGib_mwIxZ7ssJp5bTOhryRr/preview"
                        title="Clutch Factor Report"
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
                          src="https://drive.google.com/thumbnail?id=1ZFKFJe3KRGib_mwIxZ7ssJp5bTOhryRr&sz=w1280"
                          alt="Clutch Factor Report - Watch Video"
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
                              'linear-gradient(to right, transparent 5%, rgba(245,158,11,0.5) 40%, rgba(245,158,11,0.5) 60%, transparent 95%)',
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
                          <div style={{ borderRadius: '50%', animation: 'cf-pulse-amber 2.6s ease-out infinite' }}>
                            <div
                              style={{
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(10,8,3,0.58)',
                                border: '1.5px solid rgba(245,158,11,0.88)',
                                backdropFilter: 'blur(14px)',
                                WebkitBackdropFilter: 'blur(14px)',
                                boxShadow: '0 0 36px rgba(245,158,11,0.18), 0 12px 36px rgba(0,0,0,0.6)',
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
                                color: 'rgba(245,158,11,0.92)',
                                fontWeight: 700,
                                fontFamily: "'Rajdhani', sans-serif",
                              }}
                            >
                              Clutch Factor Report
                            </span>
                            <span
                              style={{
                                fontSize: '.42rem',
                                letterSpacing: '.06em',
                                textTransform: 'uppercase',
                                padding: '.14rem .42rem',
                                borderRadius: 4,
                                background: 'rgba(245,158,11,0.11)',
                                border: '1px solid rgba(245,158,11,0.42)',
                                color: 'rgba(245,158,11,0.96)',
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
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Exercises */}
        <section
          className="position-relative py-5 px-3 px-lg-5 rounded-4 overflow-hidden shadow-lg mb-5"
          style={{ border: '1px solid rgba(245,158,11,0.2)', marginLeft: 0, marginRight: 0 }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 opacity-90"
            style={{ background: 'linear-gradient(to bottom, #1a1505, #000)', zIndex: 0 }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 opacity-70"
            style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
            }}
          />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center justify-content-between mb-5">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-pill"
                  style={{
                    width: 6,
                    height: '2.5rem',
                    background: 'linear-gradient(to bottom, #fde047, #f59e0b)',
                    boxShadow: '0 0 15px rgba(251,191,36,0.5)',
                  }}
                />
                <h2
                  className="font-display fw-bold text-white text-uppercase tracking-widest mb-0"
                  style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  Suggested Exercises
                </h2>
              </div>
              <div
                className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <span className="text-12px font-tech fw-bold text-accent text-uppercase tracking-tech">
                  Priority Focus
                </span>
              </div>
            </div>

            <div className="row g-4">
              {/* Exercise 1 - Focus Interval Training */}
              <div className="col-md-6">
                <div
                  className="position-relative rounded-4 h-100"
                  style={{
                    padding: 1,
                    background: 'linear-gradient(to bottom, #1c1c1c, #0f0f0f)',
                    border: '1px solid rgba(245,158,11,0.4)',
                  }}
                >
                  <div
                    className="h-100 rounded-3 p-4 p-md-5 d-flex flex-column position-relative overflow-hidden"
                    style={{ backgroundColor: '#111' }}
                  >
                    <div
                      className="position-absolute top-0 start-0 w-100 opacity-50"
                      style={{
                        height: 4,
                        background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)',
                      }}
                    />
                    <div className="d-flex align-items-start justify-content-between mb-4 position-relative" style={{ zIndex: 1 }}>
                      <span className="font-display fw-bold" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.05)' }}>
                        01
                      </span>
                    </div>
                    <h3 className="fs-4 font-display fw-bold text-white mb-3 text-uppercase tracking-widest">
                      Focus Interval Training
                    </h3>
                    <div className="flex-grow-1 d-flex flex-column gap-4">
                      <p className="text-14px text-gray-300 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                        Practice focusing on a single task or image for a set amount of time, gradually increasing duration. This drill helps improve your concentration and ability to stay present during high-pressure situations, which is essential for maintaining focus during critical moments like pitching.
                      </p>
                      <div
                        className="rounded-3 p-3 shadow-sm"
                        style={{
                          backgroundColor: '#18120a',
                          border: '1px solid rgba(245,158,11,0.5)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        }}
                      >
                        <p className="text-12px text-accent font-tech fw-bold text-uppercase tracking-tech mb-2">
                          Drill Video
                        </p>
                        <a
                          href="https://youtu.be/QliFmb9QFbA"
                          target="_blank"
                          rel="noreferrer"
                          className="d-block rounded-3 overflow-hidden position-relative text-decoration-none hover-scale"
                          style={{ border: '1px solid rgba(253,230,138,0.2)' }}
                        >
                          <img
                            alt="Focus Interval Training drill video thumbnail"
                            className="w-100 h-auto opacity-75"
                            style={{ objectFit: 'cover' }}
                            src="https://img.youtube.com/vi/QliFmb9QFbA/hqdefault.jpg"
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), transparent)' }}
                          />
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <div
                              className="d-inline-flex align-items-center gap-2 rounded-pill text-white px-4 py-2 shadow"
                              style={{ backgroundColor: 'rgba(226,61,50,0.95)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                              <span className="material-symbols-outlined">play_arrow</span>
                              <span className="text-12px fw-bold tracking-widest text-uppercase">Watch on YouTube</span>
                            </div>
                          </div>
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDrill('focus-interval')}
                        className="w-100 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-2 px-3 text-12px font-tech fw-bold text-uppercase tracking-widest text-accent hover-scale"
                        style={{
                          border: '1px solid rgba(245,158,11,0.4)',
                          backgroundColor: 'rgba(245,158,11,0.1)',
                        }}
                      >
                        <span className="material-symbols-outlined fs-5">info</span>
                        How to Do This Drill
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise 2 - Confidence Scripting */}
              <div className="col-md-6">
                <div
                  className="position-relative rounded-4 h-100"
                  style={{
                    padding: 1,
                    background: 'linear-gradient(to bottom, #1c1c1c, #0f0f0f)',
                    border: '1px solid rgba(168,85,247,0.4)',
                  }}
                >
                  <div
                    className="h-100 rounded-3 p-4 p-md-5 d-flex flex-column position-relative overflow-hidden"
                    style={{ backgroundColor: '#111' }}
                  >
                    <div
                      className="position-absolute top-0 end-0"
                      style={{
                        width: '8rem',
                        height: '8rem',
                        backgroundColor: 'rgba(168,85,247,0.05)',
                        marginRight: '-1rem',
                        marginTop: '-1rem',
                        filter: 'blur(20px)',
                        borderBottomLeftRadius: '9999px',
                      }}
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 opacity-50"
                      style={{
                        height: 4,
                        background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)',
                      }}
                    />
                    <div className="d-flex align-items-start justify-content-between mb-4 position-relative" style={{ zIndex: 1 }}>
                      <span className="font-display fw-bold" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.05)' }}>
                        02
                      </span>
                    </div>
                    <h3 className="fs-4 font-display fw-bold text-white mb-3 text-uppercase tracking-widest">
                      Confidence Scripting
                    </h3>
                    <div className="flex-grow-1 d-flex flex-column gap-4">
                      <p className="text-14px text-gray-300 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                        Write and rehearse short, first-person confidence statements tied to pressure moments (for example, stepping onto the mound with runners on base). Repeat the script before and during practice to reinforce composure, trust your preparation, and keep your self-talk constructive under pressure.
                      </p>
                      <div
                        className="rounded-3 p-3 shadow-sm"
                        style={{
                          backgroundColor: '#130f1f',
                          border: '1px solid rgba(168,85,247,0.5)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        }}
                      >
                        <p className="text-12px text-purple font-tech fw-bold text-uppercase tracking-tech mb-2">
                          Drill Video
                        </p>
                        <a
                          href="https://youtu.be/Qc7q9L_NRlU"
                          target="_blank"
                          rel="noreferrer"
                          className="d-block rounded-3 overflow-hidden position-relative text-decoration-none hover-scale"
                          style={{ border: '1px solid rgba(216,180,254,0.2)' }}
                        >
                          <img
                            alt="Confidence Scripting drill video thumbnail"
                            className="w-100 h-auto opacity-75"
                            style={{ objectFit: 'cover' }}
                            src="https://img.youtube.com/vi/Qc7q9L_NRlU/hqdefault.jpg"
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), transparent)' }}
                          />
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <div
                              className="d-inline-flex align-items-center gap-2 rounded-pill text-white px-4 py-2 shadow"
                              style={{ backgroundColor: 'rgba(226,61,50,0.95)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                              <span className="material-symbols-outlined">play_arrow</span>
                              <span className="text-12px fw-bold tracking-widest text-uppercase">Watch on YouTube</span>
                            </div>
                          </div>
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDrill('confidence-scripting')}
                        className="w-100 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-2 px-3 text-12px font-tech fw-bold text-uppercase tracking-widest text-purple hover-scale"
                        style={{
                          border: '1px solid rgba(168,85,247,0.4)',
                          backgroundColor: 'rgba(168,85,247,0.1)',
                        }}
                      >
                        <span className="material-symbols-outlined fs-5">info</span>
                        How to Do This Drill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Playbook */}
        <section className="glass-panel rounded-4 p-4 p-md-5 position-relative overflow-hidden mb-5">
          <div
            className="position-absolute rounded-circle"
            style={{
              top: 0,
              right: 0,
              width: '16rem',
              height: '16rem',
              backgroundColor: '#F59E0B',
              opacity: 0.05,
              filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />

          <div className="position-relative d-flex flex-column gap-4 mb-5" style={{ zIndex: 1 }}>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-accent rounded-pill" style={{ width: 4, height: '2rem' }} />
              <h2 className="fs-3 font-display fw-bold text-white text-uppercase tracking-widest mb-0">
                YOUR PLAYBOOK: HOW TO USE CLUTCH FACTOR DATA
              </h2>
            </div>
            <p
              className="fs-5 text-gray-300 fw-light mb-0"
              style={{ lineHeight: 1.6, maxWidth: '48rem' }}
            >
              Physical stats are the baseline; your Clutch Factor&trade; is the differentiator. Here is how to use this verified report to advance your career:
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-4">
              <div className="glass-card rounded-3 p-4 h-100 d-flex flex-column gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  <span className="material-symbols-outlined text-accent">campaign</span>
                </div>
                <h3 className="fs-5 font-display fw-bold text-white text-uppercase mb-0">The Recruiting Bio</h3>
                <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                  Treat this score like your SAT for sports. Add your verified Clutch Factor&trade; score to your X (Twitter) bio, Instagram profile, and directly onto the opening frame of your Hudl highlight reel.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-4">
              <div className="glass-card rounded-3 p-4 h-100 d-flex flex-column gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  <span className="material-symbols-outlined text-accent">mail</span>
                </div>
                <h3 className="fs-5 font-display fw-bold text-white text-uppercase mb-0">The Coach Outreach</h3>
                <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                  College coaches are terrified of the transfer portal and want athletes who won&rsquo;t fold under pressure. Attach this PDF to your recruiting emails to mathematically prove you have the mental makeup for their program.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4">
              <div className="glass-card rounded-3 p-4 h-100 d-flex flex-column gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  <span className="material-symbols-outlined text-accent">shield</span>
                </div>
                <h3 className="fs-5 font-display fw-bold text-white text-uppercase mb-0">The Negotiation Advantage</h3>
                <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                  Brands want reliable ambassadors. Use your &ldquo;Elite&rdquo; or &ldquo;Great&rdquo; classification in Free Agency/NIL sponsorship pitches to prove you are mature, resilient, and built to handle the spotlight.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Share Your Score */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-accent rounded-pill" style={{ width: 4, height: '2rem' }} />
            <h2 className="fs-3 font-display fw-bold text-white text-uppercase tracking-widest mb-0">
              SHARE YOUR SCORE
            </h2>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Canvas preview */}
            <div className="col-lg-6">
              <div className="glass-card rounded-4 p-3 p-md-4 h-100 d-flex align-items-center justify-content-center">
                <div className="w-100">
                  <ul className="nav nav-pills justify-content-center gap-2 mb-3">
                    <li className="nav-item">
                      <button
                        type="button"
                        onClick={() => setActivePreview('square')}
                        className={`btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-accent bg-transparent${
                          activePreview === 'square' ? ' active' : ''
                        }`}
                        style={{ border: '1px solid rgba(245,158,11,0.35)' }}
                      >
                        Square
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        onClick={() => setActivePreview('story')}
                        className={`btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-purple bg-transparent${
                          activePreview === 'story' ? ' active' : ''
                        }`}
                        style={{ border: '1px solid rgba(168,85,247,0.35)' }}
                      >
                        Story
                      </button>
                    </li>
                  </ul>
                  <canvas
                    ref={squareCanvasRef}
                    className={`w-100 h-auto rounded-3${activePreview === 'square' ? ' d-block' : ' d-none'}`}
                  />
                  <canvas
                    ref={storyCanvasRef}
                    className={`w-100 h-auto rounded-3${activePreview === 'story' ? ' d-block' : ' d-none'}`}
                  />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="col-lg-6">
              <div className="glass-card rounded-4 p-4 p-md-5 h-100 d-flex flex-column justify-content-center gap-4">
                <div>
                  <h3 className="fs-4 font-display fw-bold text-white text-uppercase tracking-widest mb-1">
                    Share Your Score
                  </h3>
                  <p className="text-10px text-gray-500 font-tech text-uppercase tracking-tech mb-0">
                    Instagram · X · Facebook · TikTok · 1080&times;1080 + Story 1080&times;1920
                  </p>
                </div>
                <p className="text-14px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.6 }}>
                  Post this the moment the report drops. Your verified score and tier are front and center - and the card carries a six-month validity window so coaches know it&rsquo;s current.
                </p>

                {/* Photo upload */}
                <div className="d-flex flex-column gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    id="cf-photo-upload-input"
                    onChange={handlePhotoUpload}
                  />
                  <label
                    htmlFor="cf-photo-upload-input"
                    className="w-100 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-3 px-4 text-12px font-tech fw-bold text-uppercase tracking-tech text-white mb-0 hover-scale"
                    style={{
                      border: '1px solid rgba(255,255,255,0.25)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="material-symbols-outlined fs-5">add_a_photo</span>
                    <span>{userPhotoImg ? 'Change Photo' : 'Add Your Photo'}</span>
                  </label>
                  {userPhotoImg && (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={handleRecrop}
                        className="flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-2 px-3 text-10px font-tech fw-bold text-uppercase tracking-tech text-white bg-transparent"
                        style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        <span className="material-symbols-outlined fs-6">crop</span>
                        Re-crop
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-2 px-3 text-10px font-tech fw-bold text-uppercase tracking-tech text-gray-400 bg-transparent"
                        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        <span className="material-symbols-outlined fs-6">close</span>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => downloadCanvas('square')}
                  className="w-100 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-3 px-4 text-12px font-tech fw-bold text-uppercase tracking-tech text-accent hover-scale"
                  style={{ border: '1px solid rgba(245,158,11,0.3)', backgroundColor: 'rgba(245,158,11,0.1)' }}
                >
                  <span className="material-symbols-outlined fs-5">download</span>
                  Download Post 1080&times;1080 PNG
                </button>
                <button
                  type="button"
                  onClick={() => downloadCanvas('story')}
                  className="w-100 d-inline-flex align-items-center justify-content-center gap-2 rounded-3 py-3 px-4 text-12px font-tech fw-bold text-uppercase tracking-tech text-purple hover-scale"
                  style={{ border: '1px solid rgba(168,85,247,0.3)', backgroundColor: 'rgba(168,85,247,0.1)' }}
                >
                  <span className="material-symbols-outlined fs-5">download</span>
                  Download Story 1080&times;1920 PNG
                </button>

                <div className="d-flex align-items-center gap-3 my-2">
                  <div className="flex-grow-1 bg-white-10" style={{ height: 1 }} />
                  <span className="text-10px font-tech text-gray-500 text-uppercase tracking-widest">
                    How To Use This
                  </span>
                  <div className="flex-grow-1 bg-white-10" style={{ height: 1 }} />
                </div>

                <div className="d-flex flex-column gap-3">
                  <div
                    className="rounded-3 p-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-accent fs-5">share</span>
                      <h4 className="text-12px text-white font-tech fw-bold text-uppercase tracking-tech mb-0">
                        Social Media
                      </h4>
                    </div>
                    <p className="text-12px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.5 }}>
                      Post this on Instagram, X, or TikTok and use #ClutchFactor to get noticed by the community and recruiters.
                    </p>
                  </div>

                  <div
                    className="rounded-3 p-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-accent fs-5">mail</span>
                      <h4 className="text-12px text-white font-tech fw-bold text-uppercase tracking-tech mb-0">
                        College Coaches
                      </h4>
                    </div>
                    <p className="text-12px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.5 }}>
                      Attach this image directly to your recruiting emails. College coaches want athletes who have proven mental toughness and won&rsquo;t fold under pressure.
                    </p>
                  </div>

                  <div
                    className="rounded-3 p-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-accent fs-5">movie</span>
                      <h4 className="text-12px text-white font-tech fw-bold text-uppercase tracking-tech mb-0">
                        Highlight Reels
                      </h4>
                    </div>
                    <p className="text-12px text-gray-400 fw-light mb-0" style={{ lineHeight: 1.5 }}>
                      Add this graphic as the opening or closing frame of your Hudl or YouTube highlight tape to set yourself apart immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-4">
          <p
            className="font-monospace text-uppercase mb-0"
            style={{ fontSize: '.6rem', color: '#374151', letterSpacing: '0.1em' }}
          >
            © NTANGIBLE, INC. ALL RIGHTS RESERVED
          </p>
        </div>
      </main>

      {/* Drill detail modal */}
      {activeDrill && (
        <>
          <div
            onClick={() => setActiveDrill(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              zIndex: 1050,
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1055,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            <div
              className="modal-content text-white"
              style={{
                backgroundColor: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 80px rgba(0,0,0,0.65)',
                width: '100%',
                maxWidth: 800,
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto',
                borderRadius: '0.5rem',
                pointerEvents: 'auto',
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between p-3 p-md-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
              >
                <h5 className="font-display fw-bold text-uppercase tracking-widest mb-0">
                  {activeDrill === 'focus-interval'
                    ? 'Focus Interval Training: Build Your Mental Muscle'
                    : 'Confidence Scripting: Fuel Your Belief'}
                </h5>
                <button
                  type="button"
                  onClick={() => setActiveDrill(null)}
                  aria-label="Close"
                  className="btn btn-sm text-white bg-transparent"
                  style={{ border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  <span className="material-symbols-outlined fs-6 align-middle">close</span>
                </button>
              </div>
              <div className="p-4 p-md-5">
                {activeDrill === 'focus-interval' ? (
                  <>
                    <p className="text-gray-300 mb-4" style={{ lineHeight: 1.6 }}>
                      <span className="text-white fw-bold">Why it works:</span> Focus is a muscle. This drill trains your brain to completely block out external noise-like a loud crowd, the score, or negative thoughts-so you can lock in exclusively on your job.
                    </p>
                    <div className="mb-4">
                      <h4 className="text-14px font-tech fw-bold text-uppercase tracking-widest text-accent mb-3">
                        How to do it (The 45-Second Challenge)
                      </h4>
                      <ol className="text-gray-300 ps-3 mb-0" style={{ lineHeight: 1.6 }}>
                        <li className="mb-2">
                          <span className="text-white fw-bold">Find a Target:</span> Pick a tiny spot, like a scratch on your equipment, a seam on your ball, or a mark on the wall.
                        </li>
                        <li className="mb-2">
                          <span className="text-white fw-bold">Lock In:</span> Stare at that single spot and try to clear your mind completely.
                        </li>
                        <li className="mb-2">
                          <span className="text-white fw-bold">Set the Clock (Start with 10s):</span> Try to hold perfect focus on that spot for 10 seconds without a single outside thought.
                        </li>
                        <li className="mb-2">
                          <span className="text-white fw-bold">The Reset Rule:</span> If your mind wanders or a distracting thought pops up, that is totally normal! Just restart the timer.
                        </li>
                        <li>
                          <span className="text-white fw-bold">Level Up:</span> Once you conquer 10 seconds successfully, add 5 seconds. Keep building your mental muscle until you can hold unbroken focus for a full 45 seconds.
                        </li>
                      </ol>
                    </div>
                    <div
                      className="rounded-3 p-3"
                      style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      <p className="text-14px mb-0" style={{ color: '#fef3c7', lineHeight: 1.6 }}>
                        💡 <span className="fw-bold text-white">Game Day Tip:</span> Your equipment is your anchor! Pick a specific spot on your gear (like a logo on your shoe or the grip of your stick). During breaks in the action, staring at that spot is the ultimate way to quickly tune out the crowd and reset.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 mb-4" style={{ lineHeight: 1.6 }}>
                      <span className="text-white fw-bold">Why it works:</span> Your brain listens to what you tell it. Using specific, practiced phrases reminds you of your abilities, blocks out self-doubt, and locks your focus onto exactly what you need to do to succeed.
                    </p>
                    <div className="mb-4">
                      <h4 className="text-14px font-tech fw-bold text-uppercase tracking-widest text-purple mb-3">
                        How to do it (The Pre-Game Routine)
                      </h4>
                      <ol className="text-gray-300 ps-3 mb-0" style={{ lineHeight: 1.6 }}>
                        <li className="mb-2">
                          <span className="text-white fw-bold">Pick Your Script:</span> Choose 2 to 3 short, powerful, positive sentences. (Examples: &ldquo;I belong here,&rdquo; &ldquo;I can make this happen,&rdquo; or &ldquo;I am going to play my game today.&rdquo;)
                        </li>
                        <li className="mb-2">
                          <span className="text-white fw-bold">Commit to Memory:</span> Memorize these exact phrases so you don&rsquo;t even have to think about them when the pressure is on.
                        </li>
                        <li className="mb-2">
                          <span className="text-white fw-bold">The Trigger Moment:</span> Right before you step onto the ice, field, or court, repeat your script to yourself.
                        </li>
                        <li>
                          <span className="text-white fw-bold">Feel the Words:</span> Don&rsquo;t just go through the motions. Say them with conviction to remind yourself of all the hard work and practice you have put in.
                        </li>
                      </ol>
                    </div>
                    <div
                      className="rounded-3 p-3"
                      style={{ backgroundColor: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}
                    >
                      <p className="text-14px mb-0" style={{ color: '#f3e8ff', lineHeight: 1.6 }}>
                        💡 <span className="fw-bold text-white">Game Day Tip:</span> Write your short script somewhere you will see it right before the action starts! Put a piece of tape on your stick or racket, write it on your water bottle, or stick it inside your locker so your phrases are always front and center.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Photo crop modal */}
      {cropSrc && (
        <>
          <div
            onClick={() => setCropSrc(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              zIndex: 1060,
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1065,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            <div
              className="modal-content text-white"
              style={{
                backgroundColor: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 80px rgba(0,0,0,0.65)',
                width: '100%',
                maxWidth: 800,
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto',
                borderRadius: '0.5rem',
                pointerEvents: 'auto',
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between p-3 p-md-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
              >
                <h5 className="font-display fw-bold text-uppercase tracking-widest mb-0">Crop Your Photo</h5>
                <button
                  type="button"
                  onClick={() => setCropSrc(null)}
                  aria-label="Close"
                  className="btn btn-sm text-white bg-transparent"
                  style={{ border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  <span className="material-symbols-outlined fs-6 align-middle">close</span>
                </button>
              </div>
              <div className="p-3 p-md-4">
                <p className="text-12px text-gray-400 font-tech text-uppercase tracking-tech mb-3">
                  Drag to reposition · Pinch or scroll to zoom · Square crop
                </p>
                <div
                  style={{
                    maxHeight: '60vh',
                    backgroundColor: '#000',
                    borderRadius: '.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    ref={cropImgRef}
                    src={cropSrc}
                    alt="Crop source"
                    style={{ display: 'block', maxWidth: '100%' }}
                  />
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleCropAction('zoom-in')}
                    className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-white bg-transparent"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined fs-6 align-middle">zoom_in</span> Zoom In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCropAction('zoom-out')}
                    className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-white bg-transparent"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined fs-6 align-middle">zoom_out</span> Zoom Out
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCropAction('rotate-left')}
                    className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-white bg-transparent"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined fs-6 align-middle">rotate_left</span> Rotate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCropAction('reset')}
                    className="btn btn-sm text-10px font-tech fw-bold text-uppercase tracking-tech text-white bg-transparent"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined fs-6 align-middle">restart_alt</span> Reset
                  </button>
                </div>
              </div>
              <div
                className="d-flex justify-content-end gap-2 p-3 p-md-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
              >
                <button
                  type="button"
                  onClick={() => setCropSrc(null)}
                  className="btn btn-sm text-12px font-tech fw-bold text-uppercase tracking-tech text-gray-400 bg-transparent"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropApply}
                  className="btn btn-sm text-12px font-tech fw-bold text-uppercase tracking-tech text-accent bg-transparent"
                  style={{ border: '1px solid rgba(245,158,11,0.35)', backgroundColor: 'rgba(245,158,11,0.1)' }}
                >
                  <span className="material-symbols-outlined fs-6 align-middle">check</span> Apply Crop
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClutchAssessment;
