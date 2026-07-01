import React from 'react';

/**
 * Labeled text input with the MVAIR focus ring (petrol, 2px @ 30%).
 * Wraps the native input; pass any input props through `...rest`.
 */
export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  hint,
  disabled = false,
  fullWidth = true,
  className = '',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined, fontFamily: 'var(--mvair-font-sans)' }} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ display: 'block', fontSize: 'var(--mvair-body)', fontWeight: 500, color: 'var(--mvair-text-secondary)', marginBottom: 4 }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          fontSize: 'var(--mvair-body)',
          fontFamily: 'var(--mvair-font-sans)',
          color: 'var(--mvair-text-primary)',
          background: disabled ? 'var(--mvair-surface)' : 'var(--mvair-white)',
          border: `1px solid ${error ? 'var(--mvair-danger)' : 'var(--mvair-card-border)'}`,
          borderRadius: 'var(--mvair-radius-button)',
          outline: 'none',
          boxShadow: focus ? `0 0 0 3px ${error ? 'rgb(var(--mvair-danger-rgb) / 0.25)' : 'var(--mvair-focus-ring)'}` : 'none',
          transition: 'box-shadow var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
          ...style,
        }}
        {...rest}
      />
      {(error || hint) && (
        <div style={{ fontSize: 'var(--mvair-body-sm)', marginTop: 4, color: error ? 'var(--mvair-danger)' : 'var(--mvair-text-muted)' }}>
          {error || hint}
        </div>
      )}
    </div>
  );
}
