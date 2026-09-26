import React from 'react';
export function Logo({ size = 48, variant = 'positive', basePath = '', style }) {
  const src = basePath + 'assets/logo/itau-logo-' + (variant === 'negative' ? 'neg' : 'pos') + '.png';
  const s = Math.max(size, 30);
  return (
    <span role="img" aria-label="Itaú" style={{ display: 'inline-block', position: 'relative', width: s, height: s, overflow: 'hidden', flex: 'none', ...style }}>
      <img src={src} alt="" style={{ position: 'absolute', width: '166%', left: '-33%', top: '-33%' }} />
    </span>
  );
}