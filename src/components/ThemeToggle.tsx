import { useTheme } from './theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      case 'system': return <Monitor size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <div
        style={{
          padding: '0.5rem',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-color)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title="Change theme"
      >
        {getIcon()}
      </div>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        id="theme-toggle"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          appearance: 'none'
        }}
      >
        <option value="light" style={{ padding: '0.5rem 1rem' }}>&nbsp;&nbsp;Light&nbsp;&nbsp;</option>
        <option value="dark" style={{ padding: '0.5rem 1rem' }}>&nbsp;&nbsp;Dark&nbsp;&nbsp;</option>
        <option value="system" style={{ padding: '0.5rem 1rem' }}>&nbsp;&nbsp;System&nbsp;&nbsp;</option>
      </select>
    </div>
  );
}
