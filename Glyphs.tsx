import React from 'react';

/**
 * Decorative symbols drawn as inline SVG.
 * Inter and Cormorant Garamond do not contain U+2726 / U+2715 / U+26A0, so using the text
 * characters would silently fall back to an operating-system symbol font.
 */
const base: React.CSSProperties = { width: '1em', height: '1em', display: 'inline-block', verticalAlign: '-0.14em', flex: 'none' };

export const Spark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" style={base} className={className} aria-hidden="true" focusable="false">
    <path d="M12 1.5 14.4 9.6 22.5 12 14.4 14.4 12 22.5 9.6 14.4 1.5 12 9.6 9.6Z" fill="currentColor" />
  </svg>
);

export const CloseMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" style={base} className={className} aria-hidden="true" focusable="false">
    <path d="M5 5 19 19M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const WarnMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" style={base} className={className} aria-hidden="true" focusable="false">
    <path d="M12 3 22 20H2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 9.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17.4" r="1.2" fill="currentColor" />
  </svg>
);
