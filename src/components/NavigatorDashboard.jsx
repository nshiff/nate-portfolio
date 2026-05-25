import React, { useState, useEffect } from 'react';
import {
    Cpu,
    Wifi,
    WifiOff,
    Battery,
    BatteryCharging,
    Globe,
    Monitor,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';

// --- Custom Hooks for Real-Time Navigator APIs ---

const useNetworkStatus = () => {
    const [network, setNetwork] = useState({
        online: navigator.onLine,
        type: 'Unknown',
        effectiveType: 'Unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
    });

    useEffect(() => {
        const updateOnlineStatus = () => {
            setNetwork(prev => ({ ...prev, online: navigator.onLine }));
        };

        const updateConnectionStatus = () => {
            if (navigator.connection) {
                setNetwork(prev => ({
                    ...prev,
                    type: navigator.connection.type || 'Unknown',
                    effectiveType: navigator.connection.effectiveType || 'Unknown',
                    downlink: navigator.connection.downlink || 0,
                    rtt: navigator.connection.rtt || 0,
                    saveData: navigator.connection.saveData || false
                }));
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        if (navigator.connection) {
            updateConnectionStatus();
            navigator.connection.addEventListener('change', updateConnectionStatus);
        }

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            if (navigator.connection) {
                navigator.connection.removeEventListener('change', updateConnectionStatus);
            }
        };
    }, []);

    return network;
};

const useBatteryStatus = () => {
    const [battery, setBattery] = useState({
        supported: false,
        level: 0,
        charging: false,
        chargingTime: 0,
        dischargingTime: 0
    });

    useEffect(() => {
        let batteryManager = null;

        const updateBattery = (b) => {
            setBattery({
                supported: true,
                level: b.level * 100,
                charging: b.charging,
                chargingTime: b.chargingTime,
                dischargingTime: b.dischargingTime
            });
        };

        if ('getBattery' in navigator) {
            navigator.getBattery().then(b => {
                batteryManager = b;
                updateBattery(b);
                b.addEventListener('levelchange', () => updateBattery(b));
                b.addEventListener('chargingchange', () => updateBattery(b));
                b.addEventListener('chargingtimechange', () => updateBattery(b));
                b.addEventListener('dischargingtimechange', () => updateBattery(b));
            });
        }

        return () => {
            if (batteryManager) {
                batteryManager.removeEventListener('levelchange', () => updateBattery(batteryManager));
                batteryManager.removeEventListener('chargingchange', () => updateBattery(batteryManager));
                // ... remove other listeners if needed in a more robust cleanup
            }
        };
    }, []);

    return battery;
};

// --- CSS Styles ---

const globalStyles = `
  :root {
    --cyan-100: #cffafe;
    --cyan-400: #22d3ee;
    --cyan-500: #06b6d4;
    --cyan-900: #164e63;
    --emerald-400: #34d399;
    --red-500: #ef4444;
    --yellow-400: #facc15;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    --slate-950: #020617;
    --bg-glow: rgba(30, 58, 138, 0.3);
  }

  ::selection {
    background-color: var(--cyan-900);
    color: var(--cyan-100);
  }

  .app-container {
    min-height: 100vh;
    background-color: var(--slate-950);
    background-image: radial-gradient(ellipse 80% 80% at 50% -20%, var(--bg-glow), transparent);
    color: var(--slate-200);
    padding: 1.5rem;
    overflow-x: hidden;
    font-family: system-ui, -apple-system, sans-serif;
  }

  @media (min-width: 768px) {
    .app-container { padding: 3rem; }
  }

  .header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
  }

  .logo-title {
    font-size: 1.875rem;
    font-weight: 300;
    letter-spacing: -0.025em;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }

  .logo-icon { color: var(--cyan-500); }
  .logo-nav { font-weight: 700; color: var(--cyan-400); }

  .logo-subtitle {
    color: var(--slate-500);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    margin-bottom: 0;
  }

  .widget-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 80rem;
    margin: 0 auto;
  }

  @media (min-width: 768px) { .widget-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .widget-grid { grid-template-columns: repeat(3, 1fr); } }

  .widget-panel {
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(51, 65, 85, 0.5);
    border-radius: 0.5rem;
    padding: 1.25rem;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(51, 65, 85, 0.5);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .widget-header-icon { color: var(--cyan-400); }

  .widget-header-title {
    color: var(--cyan-400);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
    margin: 0;
  }

  .widget-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .data-row-label {
    color: var(--slate-400);
    transition: color 0.2s;
  }

  .data-row:hover .data-row-label { color: var(--slate-300); }

  .data-row-value {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
    color: var(--slate-200);
  }

  .data-row-value.highlight {
    color: var(--emerald-400);
    font-weight: 600;
  }

  .ua-box {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--slate-800);
    border-radius: 0.25rem;
    font-size: 0.625rem;
    color: var(--slate-500);
    word-break: break-word;
    line-height: 1.6;
  }

  .status-hero {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .status-hero-text { font-weight: 700; }

  .text-emerald { color: var(--emerald-400); }
  .text-red { color: var(--red-500); }
  .text-yellow { color: var(--yellow-400); }
  .text-slate { color: var(--slate-200); }

  .shadow-emerald { filter: drop-shadow(0 0 5px rgba(52, 211, 153, 0.8)); }
  .shadow-yellow { filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.8)); }

  .note {
    font-size: 0.75rem;
    color: var(--slate-500);
    font-style: italic;
    margin-top: 0.5rem;
  }

  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--slate-400);
  }

  .progress-track {
    width: 100%;
    height: 0.375rem;
    background-color: var(--slate-800);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.5s ease-out, background-color 0.5s ease-out;
  }

  .bg-cyan { background-color: var(--cyan-500); box-shadow: 0 0 8px rgba(0, 255, 255, 0.5); }
  .bg-emerald { background-color: var(--emerald-400); box-shadow: 0 0 8px rgba(52, 211, 153, 0.5); }
  .bg-yellow { background-color: var(--yellow-400); box-shadow: 0 0 8px rgba(250, 204, 21, 0.5); }
  .bg-red { background-color: var(--red-500); box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
`;

// --- UI Components ---

const WidgetPanel = ({ title, icon: Icon, children }) => (
    <div className="widget-panel">
        <div className="widget-header">
            <Icon size={18} className="widget-header-icon" />
            <h2 className="widget-header-title">{title}</h2>
        </div>
        <div className="widget-content">
            {children}
        </div>
    </div>
);

const DataRow = ({ label, value, unit = '', highlight = false }) => (
    <div className="data-row">
        <span className="data-row-label">{label}</span>
        <span className={`data-row-value ${highlight ? 'highlight' : ''}`} title={typeof value === 'string' ? value : ''}>
            {value} {unit}
        </span>
    </div>
);

const ProgressBar = ({ label, value, max, colorClass = 'bg-cyan' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className="progress-container">
            <div className="progress-labels">
                <span>{label}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className={`progress-fill ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// --- Main App ---

export default function NavigatorDashboard() {
    const network = useNetworkStatus();
    const battery = useBatteryStatus();

    // Static/One-time navigator reads
    const ua = navigator.userAgent;
    const platform = navigator.platform || navigator.userAgentData?.platform || 'Unknown';
    const language = navigator.language;
    const cores = navigator.hardwareConcurrency || 'Unknown';
    const memory = navigator.deviceMemory || 'Unknown'; // Chrome only
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const pdfViewerEnabled = navigator.pdfViewerEnabled;
    const cookiesEnabled = navigator.cookieEnabled;

    return (
        <>
            <style>{globalStyles}</style>
            <div className="app-container">

                {/* Header */}
                <header className="header">
                    <div>
                        <h1 className="logo-title">
                            <Activity className="logo-icon" />
                            The "navigator" object
                        </h1>
                        <p className="logo-subtitle">System metrics through the lens of the browser</p>
                    </div>
                </header>

                {/* Grid Layout for Conky Widgets */}
                <div className="widget-grid">

                    {/* Environment / User Agent */}
                    <WidgetPanel title="Environment" icon={Monitor}>
                        <DataRow label="Platform" value={platform} />
                        <DataRow label="Language" value={language} />
                        <DataRow label="Cookies Enabled" value={cookiesEnabled ? 'Yes' : 'No'} highlight={cookiesEnabled} />
                        <DataRow label="PDF Viewer" value={pdfViewerEnabled ? 'Native' : 'None'} />
                        <DataRow label="Do Not Track" value={navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled'} />
                        <div className="ua-box">
                            {ua}
                        </div>
                    </WidgetPanel>

                    {/* Hardware */}
                    <WidgetPanel title="Hardware" icon={Cpu}>
                        <DataRow label="Logical Cores" value={cores} highlight={true} />
                        <DataRow label="Device Memory" value={memory !== 'Unknown' ? memory : 'N/A'} unit={memory !== 'Unknown' ? 'GB+' : ''} />
                        <DataRow label="Max Touch Points" value={maxTouchPoints} />
                        <DataRow label="Vibration API" value={'vibrate' in navigator ? 'Supported' : 'Unsupported'} />
                    </WidgetPanel>

                    {/* Connectivity */}
                    <WidgetPanel title="Network & Comm" icon={Globe}>
                        <div className="status-hero">
                            {network.online ? (
                                <Wifi size={24} className="text-emerald shadow-emerald" />
                            ) : (
                                <WifiOff size={24} className="text-red" />
                            )}
                            <span className={`status-hero-text ${network.online ? 'text-emerald' : 'text-red'}`}>
                                {network.online ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>

                        {navigator.connection ? (
                            <>
                                <DataRow label="Effective Type" value={network.effectiveType.toUpperCase()} highlight={true} />
                                <DataRow label="Downlink" value={network.downlink} unit="Mbps" />
                                <DataRow label="RTT (Latency)" value={network.rtt} unit="ms" />
                                <DataRow label="Data Saver" value={network.saveData ? 'Enabled' : 'Disabled'} />
                            </>
                        ) : (
                            <div className="note">Network Information API not fully supported in this browser.</div>
                        )}
                    </WidgetPanel>

                    {/* Power / Battery */}
                    <WidgetPanel title="Power Status" icon={Zap}>
                        {!battery.supported ? (
                            <div className="note">Battery API not supported (or blocked by browser privacy settings).</div>
                        ) : (
                            <>
                                <div className="status-hero">
                                    {battery.charging ? (
                                        <BatteryCharging size={24} className="text-yellow shadow-yellow" />
                                    ) : (
                                        <Battery size={24} className={battery.level > 20 ? 'text-emerald' : 'text-red'} />
                                    )}
                                    <span className="status-hero-text text-slate">
                                        {battery.charging ? 'CHARGING' : 'DISCHARGING'}
                                    </span>
                                </div>
                                <DataRow label="Charge Level" value={battery.level.toFixed(0)} unit="%" highlight={true} />

                                <ProgressBar
                                    label="Capacity"
                                    value={battery.level}
                                    max={100}
                                    colorClass={battery.level > 20 ? (battery.charging ? 'bg-yellow' : 'bg-emerald') : 'bg-red'}
                                />
                            </>
                        )}
                    </WidgetPanel>

                    {/* APIs & Privacy */}
                    <WidgetPanel title="APIs & Features" icon={ShieldCheck}>
                        <DataRow label="Geolocation" value={'geolocation' in navigator ? 'Available' : 'N/A'} />
                        <DataRow label="Web Bluetooth" value={'bluetooth' in navigator ? 'Available' : 'N/A'} />
                        <DataRow label="Web USB" value={'usb' in navigator ? 'Available' : 'N/A'} />
                        <DataRow label="Web Share" value={'share' in navigator ? 'Available' : 'N/A'} />
                        <DataRow label="Clipboard API" value={'clipboard' in navigator ? 'Available' : 'N/A'} />
                        <DataRow label="Service Worker" value={'serviceWorker' in navigator ? 'Supported' : 'N/A'} />
                        <DataRow label="Media Session" value={'mediaSession' in navigator ? 'Supported' : 'N/A'} />
                    </WidgetPanel>

                </div>

            </div>
        </>
    );
}