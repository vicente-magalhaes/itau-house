import React from 'react';
export function Icon({ name, size = 24, color = 'currentColor', label, style }) {
  const url = 'https://unpkg.com/lucide-static@0.456.0/icons/' + name + '.svg';
  return React.createElement('span', { role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : true, style: { display: 'inline-block', flex: 'none', width: size, height: size, backgroundColor: color, WebkitMask: 'url(' + url + ') center/contain no-repeat', mask: 'url(' + url + ') center/contain no-repeat', ...style } });
}