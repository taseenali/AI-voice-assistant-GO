import React from 'react';

/**
 * Data table inside a card. Columns: { key, header, render?, className?, align? }.
 * Rows are clickable when `onRowClick` is provided (hover highlight).
 */
export function Table({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No data available', className = '', style = {} }) {
  const [hoverKey, setHoverKey] = React.useState(null);

  const shell = {
    background: 'var(--mvair-bg-card)',
    border: '1px solid var(--mvair-border-card)',
    borderRadius: 'var(--mvair-radius-card)',
    boxShadow: 'var(--mvair-shadow-card)',
    overflow: 'hidden',
    fontFamily: 'var(--mvair-font-sans)',
    ...style,
  };

  if (!data || data.length === 0) {
    return (
      <div className={className} style={{ ...shell, padding: 32, textAlign: 'center', color: 'var(--mvair-text-muted)', fontSize: 'var(--mvair-body)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className} style={shell}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--mvair-card-border)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || 'left',
                    padding: '12px 24px',
                    fontSize: 'var(--mvair-table-header)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--mvair-table-header-tracking)',
                    color: 'var(--mvair-text-secondary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const k = keyExtractor(item);
              return (
                <tr
                  key={k}
                  onClick={() => onRowClick && onRowClick(item)}
                  onMouseEnter={() => setHoverKey(k)}
                  onMouseLeave={() => setHoverKey(null)}
                  style={{
                    borderBottom: '1px solid var(--mvair-card-border)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: onRowClick && hoverKey === k ? 'var(--mvair-surface)' : 'transparent',
                    transition: 'background var(--mvair-duration-fast) ease',
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        textAlign: col.align || 'left',
                        padding: '12px 24px',
                        fontSize: 'var(--mvair-body)',
                        color: 'var(--mvair-text-primary)',
                      }}
                    >
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
