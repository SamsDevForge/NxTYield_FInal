import { useEffect, useState } from 'react';
import { Activity, Droplets, Cloud, Wifi, Sprout, Thermometer, Wind, FlaskConical, Leaf } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import {
  buildAlerts,
  compactValue,
  formatShortTime,
  formatTime,
  healthLabel,
  humidityStatus,
  moistureStatus,
  nutrientStatus,
  toNumber,
} from '../lib/farmUtils';
import './Home.css';

const grassBlades = [
  { top: '8%', left: '12%', delay: '0.1s', scale: 0.9 },
  { top: '10%', left: '35%', delay: '0.6s', scale: 1.1 },
  { top: '12%', left: '58%', delay: '1.2s', scale: 0.8 },
  { top: '14%', left: '82%', delay: '0.4s', scale: 1.05 },
  { top: '18%', left: '20%', delay: '0.8s', scale: 0.95 },
  { top: '20%', left: '46%', delay: '1.5s', scale: 1.2 },
  { top: '22%', left: '72%', delay: '0.3s', scale: 0.85 },
  { top: '25%', left: '15%', delay: '0.9s', scale: 1.1 },
  { top: '28%', left: '38%', delay: '0.2s', scale: 1.0 },
  { top: '30%', left: '64%', delay: '1.1s', scale: 1.25 },
  { top: '32%', left: '88%', delay: '0.5s', scale: 0.9 },
  { top: '36%', left: '25%', delay: '1.4s', scale: 1.15 },
  { top: '38%', left: '52%', delay: '0.7s', scale: 0.85 },
  { top: '40%', left: '78%', delay: '0.3s', scale: 1.0 },
  { top: '45%', left: '10%', delay: '0.9s', scale: 1.1 },
  { top: '46%', left: '34%', delay: '1.6s', scale: 0.95 },
  { top: '48%', left: '60%', delay: '0.2s', scale: 1.2 },
  { top: '50%', left: '82%', delay: '0.8s', scale: 1.05 },
  { top: '54%', left: '22%', delay: '1.3s', scale: 0.85 },
  { top: '56%', left: '48%', delay: '0.5s', scale: 1.1 },
  { top: '58%', left: '74%', delay: '1.1s', scale: 1.0 },
  { top: '62%', left: '15%', delay: '0.4s', scale: 1.15 },
  { top: '64%', left: '40%', delay: '1.5s', scale: 0.9 },
  { top: '66%', left: '68%', delay: '0.7s', scale: 1.2 },
  { top: '68%', left: '90%', delay: '0.1s', scale: 1.0 },
  { top: '72%', left: '28%', delay: '0.9s', scale: 0.85 },
  { top: '74%', left: '55%', delay: '1.4s', scale: 1.1 },
  { top: '76%', left: '80%', delay: '0.3s', scale: 1.0 },
  { top: '80%', left: '12%', delay: '0.8s', scale: 1.05 },
  { top: '82%', left: '36%', delay: '1.6s', scale: 0.9 },
  { top: '84%', left: '62%', delay: '0.2s', scale: 1.25 },
  { top: '86%', left: '85%', delay: '1.0s', scale: 0.95 },
  { top: '90%', left: '20%', delay: '0.5s', scale: 1.1 },
  { top: '92%', left: '45%', delay: '1.2s', scale: 0.85 },
  { top: '94%', left: '70%', delay: '0.3s', scale: 1.0 },
];

const sensorDefinitions = [
  {
    id: 'soil-moisture',
    label: 'Soil Moisture',
    field: 'moisture',
    unit: '%',
    icon: Droplets,
    color: 'var(--color-blue)',
    min: 0,
    max: 100,
    target: '40-70%',
    statusFor: moistureStatus,
  },
  {
    id: 'atm-temp',
    label: 'Atm. Temperature',
    field: 'air_temperature',
    unit: 'C',
    icon: Thermometer,
    color: 'var(--color-amber)',
    min: 0,
    max: 50,
    target: '18-35 C',
  },
  {
    id: 'pressure',
    label: 'Atm. Pressure',
    field: 'pressure',
    unit: 'hPa',
    icon: Wind,
    color: 'var(--color-secondary)',
    min: 960,
    max: 1040,
    target: '980-1035 hPa',
  },
  {
    id: 'soil-temp',
    label: 'Soil Temperature',
    field: 'soil_temperature',
    unit: 'C',
    icon: Thermometer,
    color: 'var(--color-success)',
    min: 0,
    max: 50,
    target: '18-30 C',
  },
  {
    id: 'nitrogen',
    label: 'Nitrogen (N)',
    field: 'nitrogen',
    unit: 'mg/kg',
    icon: FlaskConical,
    color: 'var(--color-success)',
    min: 0,
    max: 60,
    target: '20-40 mg/kg',
    statusFor: (value) => nutrientStatus('nitrogen', value),
  },
  {
    id: 'phosphorus',
    label: 'Phosphorus (P)',
    field: 'phosphorus',
    unit: 'mg/kg',
    icon: FlaskConical,
    color: 'var(--color-amber)',
    min: 0,
    max: 50,
    target: '12-35 mg/kg',
    statusFor: (value) => nutrientStatus('phosphorus', value),
  },
  {
    id: 'potassium',
    label: 'Potassium (K)',
    field: 'potassium',
    unit: 'mg/kg',
    icon: Leaf,
    color: 'var(--color-success)',
    min: 0,
    max: 300,
    target: '150-250 mg/kg',
    statusFor: (value) => nutrientStatus('potassium', value),
  },
  {
    id: 'humidity',
    label: 'Humidity',
    field: 'humidity',
    unit: '%',
    icon: Droplets,
    color: 'var(--color-blue)',
    min: 0,
    max: 100,
    target: '35-90%',
    statusFor: humidityStatus,
  },
];

function buildSensorData(latest) {
  return sensorDefinitions.map((sensor) => {
    const value = latest?.[sensor.field] ?? null;
    const status = sensor.statusFor?.(value) || {
      label: value === null ? 'Waiting' : 'OK',
      status: value === null ? 'warning' : 'success',
    };
    return { ...sensor, value, status: status.status, badgeLabel: status.label };
  });
}

function SensorCard({ sensor }) {
  const numeric = toNumber(sensor.value);
  const hasValue = numeric !== null;
  const pct = hasValue ? ((numeric - sensor.min) / (sensor.max - sensor.min)) * 100 : 0;
  const Icon = sensor.icon;

  return (
    <div className={`sensor-card sensor-${sensor.status}`}>
      <div className="sc-header">
        <div className="sc-icon-wrap" style={{ color: sensor.color }}>
          <Icon size={16} />
        </div>
        <span className="sc-label">{sensor.label}</span>
        <span className={`sc-badge badge badge-${sensor.status}`}>
          {sensor.badgeLabel}
        </span>
      </div>
      <div className="sc-value-row">
        <span className="sc-value" style={{ color: sensor.color }}>{hasValue ? compactValue(numeric, numeric % 1 ? 1 : 0) : '--'}</span>
        <span className="sc-unit">{sensor.unit}</span>
      </div>
      <div className="sc-bar-track">
        <div className="sc-bar-fill" style={{ width: `${Math.max(0, Math.min(pct, 100))}%`, backgroundColor: sensor.color }} />
      </div>
      <span className="sc-target">Target: {sensor.target}</span>
    </div>
  );
}

function Home() {
  const { latest, connected, insights, summary, weather, refreshInsights } = useFarmData();
  const [irrigationLevel, setIrrigationLevel] = useState(0);

  useEffect(() => {
    if (latest?.irrigation_active !== undefined && latest?.irrigation_active !== null) {
      const timer = window.setTimeout(() => setIrrigationLevel(latest.irrigation_active ? 100 : 0), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [latest?.irrigation_active]);

  const sensorData = buildSensorData(latest);
  const healthScore = summary.healthScore;
  const healthDisplay = healthScore === null ? '--' : `${healthScore}%`;
  const moistureDisplay = compactValue(latest?.moisture);
  const weatherDisplay = weather?.available
    ? weather?.current?.description || 'Available'
    : weather?.message || 'Weather API not available';
  const cropStatus = insights?.crop_health?.status || 'Waiting';
  const networkStatus = connected ? 'UP' : 'WAIT';
  const alerts = buildAlerts(latest, insights, connected);
  const irrigationActive = latest?.irrigation_active === true;
  const irrigationDisplay = irrigationActive ? 'ACTIVE' : irrigationLevel === 0 ? 'OFF' : `${irrigationLevel}%`;

  return (
    <div className="container page-home">
      <div className="hud-grid">
        <div className="panel central-hud">
          <div className="panel-header">
            <h2 className="panel-title">Farm Health Overview</h2>
          </div>

          <div className="hud-label-table">
            <div className="hlt-row">
              <Sprout size={13} style={{ color: 'var(--color-success)' }} />
              <span className="hlt-name">Soil Health</span>
              <span className="hlt-val" style={{ color: 'var(--color-success)' }}>{healthDisplay}</span>
            </div>
            <div className="hlt-row">
              <Droplets size={13} style={{ color: 'var(--color-blue)' }} />
              <span className="hlt-name">Moisture</span>
              <span className="hlt-val" style={{ color: 'var(--color-blue)' }}>{moistureDisplay === '--' ? '--' : `${moistureDisplay}%`}</span>
            </div>
            <div className="hlt-row">
              <Cloud size={13} style={{ color: 'var(--color-amber)' }} />
              <span className="hlt-name">Weather</span>
              <span className="hlt-val" style={{ color: 'var(--color-amber)' }}>{weatherDisplay}</span>
            </div>
            <div className="hlt-row">
              <Activity size={13} style={{ color: 'var(--color-success)' }} />
              <span className="hlt-name">Crop Vigor</span>
              <span className="hlt-val" style={{ color: 'var(--color-success)' }}>{cropStatus}</span>
            </div>
            <div className="hlt-row">
              <Wifi size={13} style={{ color: connected ? 'var(--color-success)' : 'var(--color-amber)' }} />
              <span className="hlt-name">Network</span>
              <span className="hlt-val" style={{ color: connected ? 'var(--color-success)' : 'var(--color-amber)' }}>{networkStatus}</span>
            </div>
          </div>

          <div className="radial-container">
            <svg viewBox="0 0 200 200" className="radial-svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border-color)" strokeWidth="1" />
              <path d="M 100 25 A 75 75 0 0 1 165 62" fill="none" stroke="var(--color-success)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 170 70 A 75 75 0 0 1 170 130" fill="none" stroke="var(--color-blue)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 165 138 A 75 75 0 0 1 100 175" fill="none" stroke="var(--color-amber)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 90 175 A 75 75 0 0 1 25 138" fill="none" stroke="var(--color-success)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 22 125 A 75 75 0 0 1 25 62" fill="none" stroke="var(--color-success)" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <div className="radial-center-text">
              <span className="hud-score">{healthScore === null ? '--' : healthScore}</span>
              <span className="hud-status text-success">{healthLabel(healthScore)}</span>
            </div>
          </div>
        </div>

        <div className="panel digital-twin">
          <div className="panel-header">
            <h2 className="panel-title">Digital Farm Twin</h2>
            <div className={`badge ${connected ? 'badge-success' : 'badge-warning'}`}>{connected ? 'Live Tracking' : 'Waiting'}</div>
          </div>
          <div className="iso-container">
            <div className="iso-scene">
              <div className="iso-farm">
                <div className="grass-layer" />
                {grassBlades.map((gb, idx) => (
                  <div
                    key={idx}
                    className="grass-blade"
                    style={{
                      top: gb.top,
                      left: gb.left,
                      animationDelay: gb.delay,
                      transform: `scale(${gb.scale})`,
                    }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="crop-row" />
                ))}
              </div>
            </div>
            <div className="compass">N ^</div>
          </div>
        </div>

        <div className="panel action-feed">
          <div className="panel-header">
            <h2 className="panel-title">System Actions & Alerts</h2>
          </div>
          <div className="feed-list">
            {alerts.length ? alerts.map((item, index) => (
              <div className="feed-item" key={`${item.code}-${index}`}>
                <span className="feed-time">{formatShortTime(item.time)}</span>
                <span className={`feed-code ${item.tone}`}>{item.code}</span>
                <span className="feed-msg">{item.message}</span>
              </div>
            )) : (
              <div className="feed-item">
                <span className="feed-time">--</span>
                <span className="feed-code text-warning">System</span>
                <span className="feed-msg">Waiting for live telemetry.</span>
              </div>
            )}
          </div>

          <div className="irrigation-control">
            <div className="irr-header">
              <span className="irr-label">Irrigation Intensity</span>
              <span className={`irr-val ${irrigationActive || irrigationLevel > 0 ? 'active' : ''}`}>
                {irrigationDisplay}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={irrigationLevel}
              onChange={(e) => setIrrigationLevel(Number(e.target.value))}
              className="irr-slider"
              style={{ backgroundSize: `${irrigationLevel}% 100%` }}
            />
            <div className="irr-marks">
              <span>Off</span>
              <span>Low</span>
              <span>Med</span>
              <span>High</span>
            </div>
          </div>

          <button className="btn btn-accent w-full mt-3" onClick={() => refreshInsights(true)}>Run Full Diagnostic</button>
        </div>
      </div>

      <div className="sensor-section mt-4">
        <div className="sensor-section-header">
          <h2 className="section-title">Live Sensor Telemetry</h2>
          <div className="flex items-center gap-2">
            <div className="pulse-dot-sm" />
            <span className="text-muted text-sm">Refreshed {formatTime(latest?.timestamp)}</span>
          </div>
        </div>
        <div className="sensor-grid">
          {sensorData.map((sensor) => <SensorCard key={sensor.id} sensor={sensor} />)}
        </div>
      </div>
    </div>
  );
}

export default Home;
