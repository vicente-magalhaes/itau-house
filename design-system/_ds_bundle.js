/* @ds-bundle: {"format":4,"namespace":"ItaDesignSystem_961918","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"4f583f4df065","components/core/Icon.jsx":"2314a11c5011","components/core/IconButton.jsx":"632e9648c97a","components/core/Logo.jsx":"0a353a3691a3","components/display/Badge.jsx":"e92eaf7c08db","components/display/Card.jsx":"1c50f11274f0","components/display/Tag.jsx":"ab9f20f9d676","components/feedback/Dialog.jsx":"380ead5544a0","components/feedback/Toast.jsx":"02bd9680c1f2","components/feedback/Tooltip.jsx":"1147c94b465b","components/forms/Checkbox.jsx":"8ea3aeef0343","components/forms/Input.jsx":"b9a8cb26fd62","components/forms/Radio.jsx":"49b27bf693ed","components/forms/Select.jsx":"9fbac60f190f","components/forms/Switch.jsx":"b7497103352f","components/navigation/Tabs.jsx":"92ffff5f7f5c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ItaDesignSystem_961918 = window.ItaDesignSystem_961918 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 24,
  color = 'currentColor',
  label,
  style
}) {
  const url = 'https://unpkg.com/lucide-static@0.456.0/icons/' + name + '.svg';
  return React.createElement('span', {
    role: label ? 'img' : undefined,
    'aria-label': label,
    'aria-hidden': label ? undefined : true,
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMask: 'url(' + url + ') center/contain no-repeat',
      mask: 'url(' + url + ') center/contain no-repeat',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 36,
    px: 16,
    fs: 14
  },
  md: {
    h: 44,
    px: 20,
    fs: 16
  },
  lg: {
    h: 52,
    px: 28,
    fs: 18
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--itau-laranja)',
    hover: 'var(--laranja-400)',
    press: 'var(--brand-press)',
    fg: 'var(--itau-preto)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'var(--itau-preto)',
    hover: 'var(--gray-800)',
    press: 'var(--gray-700)',
    fg: 'var(--itau-branco)',
    bd: 'transparent'
  },
  outline: {
    bg: 'transparent',
    hover: 'var(--gray-50)',
    press: 'var(--gray-100)',
    fg: 'var(--itau-preto)',
    bd: 'var(--itau-preto)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--gray-50)',
    press: 'var(--gray-100)',
    fg: 'var(--itau-preto)',
    bd: 'transparent'
  },
  inverse: {
    bg: 'var(--itau-branco)',
    hover: 'var(--gray-50)',
    press: 'var(--gray-100)',
    fg: 'var(--itau-preto)',
    bd: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  children,
  onClick,
  type = 'button',
  style
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const bg = disabled ? variant === 'ghost' || variant === 'outline' ? 'transparent' : 'var(--gray-100)' : p ? v.press : h ? v.hover : v.bg;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      width: fullWidth ? '100%' : undefined,
      border: '1.5px solid ' + (disabled && variant === 'outline' ? 'var(--gray-200)' : v.bd),
      borderRadius: 'var(--radius-md)',
      background: bg,
      color: disabled ? 'var(--text-disabled)' : v.fg,
      font: 'var(--fw-bold) ' + s.fs + 'px/1 var(--font-text)',
      letterSpacing: 'var(--ls-text)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
      transform: p && !disabled ? 'scale(.98)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.fs + 4
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.fs + 4
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 44,
  disabled,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const map = {
    ghost: ['transparent', 'var(--gray-50)', 'var(--itau-preto)'],
    filled: ['var(--itau-laranja)', 'var(--laranja-400)', 'var(--itau-preto)'],
    subtle: ['var(--gray-50)', 'var(--gray-100)', 'var(--itau-preto)'],
    inverse: ['var(--itau-preto)', 'var(--gray-800)', 'var(--itau-branco)']
  };
  const [bg, hv, fg] = map[variant] || map.ghost;
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      display: 'inline-grid',
      placeItems: 'center',
      border: 0,
      borderRadius: 'var(--radius-pill)',
      background: disabled ? 'transparent' : h ? hv : bg,
      color: disabled ? 'var(--text-disabled)' : fg,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      padding: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.5)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function Logo({
  size = 48,
  variant = 'positive',
  basePath = '',
  style
}) {
  const src = basePath + 'assets/logo/itau-logo-' + (variant === 'negative' ? 'neg' : 'pos') + '.png';
  const s = Math.max(size, 30);
  return /*#__PURE__*/React.createElement("span", {
    role: "img",
    "aria-label": "Ita\xFA",
    style: {
      display: 'inline-block',
      position: 'relative',
      width: s,
      height: s,
      overflow: 'hidden',
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      position: 'absolute',
      width: '166%',
      left: '-33%',
      top: '-33%'
    }
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const T = {
  brand: ['var(--itau-laranja)', 'var(--itau-preto)'],
  neutral: ['var(--gray-100)', 'var(--itau-preto)'],
  dark: ['var(--itau-preto)', 'var(--itau-branco)'],
  success: ['var(--status-success-bg)', 'var(--verde-500)'],
  info: ['var(--status-info-bg)', 'var(--azul-500)'],
  warning: ['var(--status-warning-bg)', '#8A4B00']
};
function Badge({
  tone = 'brand',
  children,
  dot,
  style
}) {
  const [bg, fg] = T[tone] || T.brand;
  if (dot) return /*#__PURE__*/React.createElement("span", {
    "aria-label": typeof children === 'string' ? children : undefined,
    style: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: tone === 'neutral' ? 'var(--gray-400)' : bg === 'var(--gray-100)' ? fg : tone === 'brand' || tone === 'dark' ? bg : fg,
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      font: 'var(--fw-bold) 12px/1 var(--font-text)',
      letterSpacing: 'var(--ls-text)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  tone = 'default',
  padding = 24,
  interactive,
  onClick,
  image,
  imageHeight = 160,
  eyebrow,
  title,
  children,
  footer,
  style
}) {
  const [h, setH] = React.useState(false);
  const tones = {
    default: ['var(--surface-card)', 'var(--text-primary)', 'inset 0 0 0 1px var(--border-subtle)'],
    subtle: ['var(--surface-subtle)', 'var(--text-primary)', 'none'],
    brand: ['var(--itau-laranja)', 'var(--itau-preto)', 'none'],
    inverse: ['var(--itau-preto)', 'var(--itau-branco)', 'none']
  };
  const [bg, fg, bd] = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: bg,
      color: fg,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: interactive && h ? bd + ', var(--shadow-2)' : bd,
      cursor: interactive ? 'pointer' : undefined,
      transform: interactive && h ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      height: imageHeight,
      background: 'url(' + image + ') center/cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) 11px/1 var(--font-text)',
      letterSpacing: 'var(--ls-overline)',
      textTransform: 'uppercase',
      color: tone === 'default' || tone === 'subtle' ? 'var(--itau-laranja)' : 'inherit'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) 22px/1.15 var(--font-display)',
      letterSpacing: 'var(--ls-display)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) 15px/1.45 var(--font-text)',
      color: tone === 'default' || tone === 'subtle' ? 'var(--text-secondary)' : 'inherit'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 12
    }
  }, footer)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  selected,
  onClick,
  onRemove,
  icon,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    role: onClick ? 'button' : undefined,
    "aria-pressed": onClick ? !!selected : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      background: selected ? 'var(--itau-preto)' : h && onClick ? 'var(--gray-50)' : 'var(--itau-branco)',
      color: selected ? 'var(--itau-branco)' : 'var(--itau-preto)',
      boxShadow: selected ? 'none' : 'inset 0 0 0 1px var(--border-default)',
      font: 'var(--fw-bold) 14px/1 var(--font-text)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "Remover",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-grid',
      marginRight: -4,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  children,
  actions,
  onClose,
  width = 480,
  inline,
  style
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === 'string' ? title : undefined,
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--itau-branco)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      position: 'relative',
      ...style
    }
  }, onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Fechar",
    size: 40,
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 16,
      right: 16
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) 24px/1.15 var(--font-display)',
      letterSpacing: 'var(--ls-display)',
      paddingRight: 40
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) 16px/1.45 var(--font-text)',
      color: 'var(--text-secondary)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => e.target === e.currentTarget && onClose && onClose(),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.48)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      zIndex: 1000
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const T = {
  neutral: ['var(--itau-preto)', 'var(--itau-branco)', 'info'],
  success: ['var(--itau-preto)', 'var(--itau-branco)', 'circle-check'],
  brand: ['var(--itau-laranja)', 'var(--itau-preto)', 'sparkles'],
  error: ['var(--azul-900)', 'var(--itau-branco)', 'circle-alert']
};
function Toast({
  tone = 'neutral',
  children,
  action,
  onAction,
  onClose,
  style
}) {
  const [bg, fg, ic] = T[tone] || T.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 52,
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      background: bg,
      color: fg,
      boxShadow: 'var(--shadow-3)',
      font: 'var(--fw-regular) 15px/1.35 var(--font-text)',
      maxWidth: 480,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: tone === 'success' ? 'var(--verde-100)' : tone === 'neutral' ? 'var(--itau-laranja)' : fg
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, children), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      font: 'var(--fw-bold) 15px/1 var(--font-text)',
      cursor: 'pointer',
      padding: 4,
      textDecoration: 'none'
    }
  }, action), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Fechar",
    onClick: onClose,
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      padding: 2,
      display: 'grid'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = 'top',
  open,
  style
}) {
  const [h, setH] = React.useState(false);
  const show = open ?? h;
  const pos = placement === 'bottom' ? {
    top: '100%',
    marginTop: 8
  } : {
    bottom: '100%',
    marginBottom: 8
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    onFocus: () => setH(true),
    onBlur: () => setH(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--itau-preto)',
      color: 'var(--itau-branco)',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--fw-regular) 13px/1.35 var(--font-text)',
      width: 'max-content',
      maxWidth: 240,
      zIndex: 10,
      pointerEvents: 'none',
      ...style
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--fw-regular) 16px/1.3 var(--font-text)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    },
    onClick: e => {
      e.preventDefault();
      toggle();
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle()),
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: 6,
      display: 'grid',
      placeItems: 'center',
      background: on ? disabled ? 'var(--gray-200)' : 'var(--itau-laranja)' : 'var(--itau-branco)',
      boxShadow: on ? 'none' : 'inset 0 0 0 1.5px ' + (disabled ? 'var(--gray-200)' : 'var(--gray-500)'),
      color: 'var(--itau-preto)',
      transition: 'background var(--dur-fast) var(--ease-standard)'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  helper,
  error,
  disabled,
  icon,
  type = 'text',
  id,
  style
}) {
  const [f, setF] = React.useState(false);
  const iid = id || React.useId();
  const bd = error ? 'var(--status-error)' : f ? 'var(--itau-preto)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: iid,
    style: {
      font: 'var(--fw-bold) 14px/1.2 var(--font-text)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 48,
      padding: '0 14px',
      borderRadius: 'var(--radius-md)',
      background: disabled ? 'var(--gray-50)' : 'var(--itau-branco)',
      boxShadow: 'inset 0 0 0 ' + (f || error ? 2 : 1) + 'px ' + bd,
      transition: 'box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("input", {
    id: iid,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      font: 'var(--fw-regular) 16px/1 var(--font-text)',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--ls-text)'
    }
  }), error && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 20,
    color: "var(--status-error)"
  })), (error || helper) && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-' + (error ? 'bold' : 'regular') + ') 12px/1.3 var(--font-text)',
      color: error ? 'var(--status-error)' : 'var(--text-secondary)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  disabled,
  name,
  value,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--fw-regular) 16px/1.3 var(--font-text)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    },
    onClick: e => {
      e.preventDefault();
      if (!disabled && onChange) onChange(value);
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "radio",
    "aria-checked": !!checked,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: e => (e.key === ' ' || e.key === 'Enter') && !disabled && onChange && (e.preventDefault(), onChange(value)),
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'inset 0 0 0 ' + (checked ? 2 : 1.5) + 'px ' + (disabled ? 'var(--gray-200)' : checked ? 'var(--itau-laranja)' : 'var(--gray-500)'),
      background: 'var(--itau-branco)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: disabled ? 'var(--gray-200)' : 'var(--itau-laranja)'
    }
  })), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  helper,
  style
}) {
  const [f, setF] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      font: 'var(--fw-bold) 14px/1.2 var(--font-text)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    defaultValue: defaultValue ?? (placeholder ? '' : undefined),
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      height: 48,
      padding: '0 44px 0 14px',
      appearance: 'none',
      WebkitAppearance: 'none',
      border: 0,
      outline: 0,
      borderRadius: 'var(--radius-md)',
      background: disabled ? 'var(--gray-50)' : 'var(--itau-branco)',
      boxShadow: 'inset 0 0 0 ' + (f ? 2 : 1) + 'px ' + (f ? 'var(--itau-preto)' : 'var(--border-default)'),
      font: 'var(--fw-regular) 16px/1 var(--font-text)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--itau-laranja)",
    style: {
      position: 'absolute',
      right: 14,
      top: 14,
      pointerEvents: 'none'
    }
  })), helper && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) 12px/1.3 var(--font-text)',
      color: 'var(--text-secondary)'
    }
  }, helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--fw-regular) 16px/1.3 var(--font-text)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    },
    onClick: e => {
      e.preventDefault();
      toggle();
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle()),
    style: {
      width: 48,
      height: 28,
      flex: 'none',
      borderRadius: 999,
      position: 'relative',
      background: disabled ? 'var(--gray-100)' : on ? 'var(--itau-laranja)' : 'var(--gray-300)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 23 : 3,
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'var(--itau-branco)',
      boxShadow: 'var(--shadow-1)',
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const cur = value ?? inner;
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 24,
      boxShadow: 'inset 0 -1px 0 var(--border-subtle)',
      ...style
    }
  }, items.map(it => {
    const v = it.value ?? it;
    const l = it.label ?? it;
    const on = v === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setInner(v);
        onChange && onChange(v);
      },
      style: {
        height: 44,
        padding: 0,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        font: 'var(--fw-bold) 15px/1 var(--font-text)',
        letterSpacing: 'var(--ls-text)',
        color: on ? 'var(--itau-preto)' : 'var(--text-tertiary)',
        boxShadow: on ? 'inset 0 -3px 0 var(--itau-laranja)' : 'none',
        transition: 'color var(--dur-fast) var(--ease-standard)'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
