import { useState } from 'react';
import { Activity, Droplets, Cloud, Wifi, Sprout, Thermometer, Wind, FlaskConical, Leaf, Gauge } from 'lucide-react';
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

const sensorData = [
  {
    id: 'soil-moisture',
    label: 'Soil Moisture',
    value: 67,
    unit: '%',
    icon: Droplets,
    color: 'var(--color-blue)',
    min: 0, max: 100,
    target: '60–75%',
    status: 'success',
  },
  {
    id: 'atm-temp',
    label: 'Atm. Temperature',
    value: 28.4,
    unit: '°C',
    icon: Thermometer,
    color: 'var(--color-amber)',
    min: 0, max: 50,
    target: '20–35°C',
    status: 'success',
  },
  {
    id: 'pressure',
    label: 'Atm. Pressure',
    value: 1013,
    unit: 'hPa',
    icon: Wind,
    color: 'var(--color-secondary)',
    min: 960, max: 1040,
    target: '1010–1020 hPa',
    status: 'success',
  },
  {
    id: 'soil-temp',
    label: 'Soil Temperature',
    value: 24.1,
    unit: '°C',
    icon: Thermometer,
    color: 'var(--color-success)',
    min: 0, max: 50,
    target: '18–28°C',
    status: 'success',
  },
  {
    id: 'nitrogen',
    label: 'Nitrogen (N)',
    value: 142,
    unit: 'kg/ha',
    icon: FlaskConical,
    color: 'var(--color-success)',
    min: 0, max: 200,
    target: '120–160 kg/ha',
    status: 'success',
  },
  {
    id: 'phosphorus',
    label: 'Phosphorus (P)',
    value: 28,
    unit: 'kg/ha',
    icon: FlaskConical,
    color: 'var(--color-amber)',
    min: 0, max: 80,
    target: '30–50 kg/ha',
    status: 'warning',
  },
  {
    id: 'potassium',
    label: 'Potassium (K)',
    value: 210,
    unit: 'kg/ha',
    icon: Leaf,
    color: 'var(--color-success)',
    min: 0, max: 300,
    target: '150–250 kg/ha',
    status: 'success',
  },
  {
    id: 'soil-ph',
    label: 'Soil pH',
    value: 6.4,
    unit: 'pH',
    icon: Gauge,
    color: 'var(--color-success)',
    min: 4, max: 9,
    target: '6.0–7.0',
    status: 'success',
  },
];

function SensorCard({ sensor }) {
  const pct = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
  const Icon = sensor.icon;
  return (
    <div className={`sensor-card sensor-${sensor.status}`}>
      <div className="sc-header">
        <div className="sc-icon-wrap" style={{ color: sensor.color }}>
          <Icon size={16} />
        </div>
        <span className="sc-label">{sensor.label}</span>
        <span className={`sc-badge badge badge-${sensor.status}`}>
          {sensor.status === 'warning' ? 'Low' : 'OK'}
        </span>
      </div>
      <div className="sc-value-row">
        <span className="sc-value" style={{ color: sensor.color }}>{sensor.value}</span>
        <span className="sc-unit">{sensor.unit}</span>
      </div>
      <div className="sc-bar-track">
        <div className="sc-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: sensor.color }} />
      </div>
      <span className="sc-target">Target: {sensor.target}</span>
    </div>
  );
}

function Home() {
  const [irrigationLevel, setIrrigationLevel] = useState(0);

  return (
    <div className="container page-home">

      {/* ── TOP TRIO ── */}
      <div className="hud-grid">

        {/* Farm Health Radial */}
        <div className="panel central-hud">
          <div className="panel-header">
            <h2 className="panel-title">Farm Health Overview</h2>
          </div>

          {/* Label table above gauge */}
          <div className="hud-label-table">
            <div className="hlt-row">
              <Sprout size={13} style={{ color: 'var(--color-success)' }} />
              <span className="hlt-name">Soil Health</span>
              <span className="hlt-val" style={{ color: 'var(--color-success)' }}>94%</span>
            </div>
            <div className="hlt-row">
              <Droplets size={13} style={{ color: 'var(--color-blue)' }} />
              <span className="hlt-name">Moisture</span>
              <span className="hlt-val" style={{ color: 'var(--color-blue)' }}>67%</span>
            </div>
            <div className="hlt-row">
              <Cloud size={13} style={{ color: 'var(--color-amber)' }} />
              <span className="hlt-name">Weather</span>
              <span className="hlt-val" style={{ color: 'var(--color-amber)' }}>Good</span>
            </div>
            <div className="hlt-row">
              <Activity size={13} style={{ color: 'var(--color-success)' }} />
              <span className="hlt-name">Crop Vigor</span>
              <span className="hlt-val" style={{ color: 'var(--color-success)' }}>95%</span>
            </div>
            <div className="hlt-row">
              <Wifi size={13} style={{ color: 'var(--color-success)' }} />
              <span className="hlt-name">Network</span>
              <span className="hlt-val" style={{ color: 'var(--color-success)' }}>UP</span>
            </div>
          </div>

          {/* Gauge */}
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
              <span className="hud-score">92</span>
              <span className="hud-status text-success">OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* Digital Farm Twin — single unified farm */}
        <div className="panel digital-twin">
          <div className="panel-header">
            <h2 className="panel-title">Digital Farm Twin</h2>
            <div className="badge badge-success">Live Tracking</div>
          </div>
          <div className="iso-container">
            <div className="iso-scene">
              <div className="iso-farm">
                {/* Grass base */}
                <div className="grass-layer" />

                {/* Dense animated grass blades */}
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

                {/* Uniform soybean crop rows */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="crop-row" />
                ))}
              </div>
            </div>

            {/* Compass */}
            <div className="compass">N ↑</div>
          </div>
        </div>

        {/* Actions & Alerts */}
        <div className="panel action-feed">
          <div className="panel-header">
            <h2 className="panel-title">System Actions & Alerts</h2>
          </div>
          <div className="feed-list">
            <div className="feed-item">
              <span className="feed-time">08:45</span>
              <span className="feed-code text-success">Insights</span>
              <span className="feed-msg">Yield outlook tracking +12% vs regional baseline.</span>
            </div>
            <div className="feed-item">
              <span className="feed-time">08:42</span>
              <span className="feed-code text-warning">Alert</span>
              <span className="feed-msg">Zone B moisture dropping. Pre-irrigation recommended.</span>
            </div>
            <div className="feed-item">
              <span className="feed-time">08:30</span>
              <span className="feed-code text-primary">System</span>
              <span className="feed-msg">Daily uplink established. All 42 sensors verified.</span>
            </div>
            <div className="feed-item">
              <span className="feed-time">08:15</span>
              <span className="feed-code text-success">Crop</span>
              <span className="feed-msg">Soybean Variant 4 maturity tracking optimally.</span>
            </div>
          </div>

          {/* Irrigation Slider */}
          <div className="irrigation-control">
            <div className="irr-header">
              <span className="irr-label">Irrigation Intensity</span>
              <span className={`irr-val ${irrigationLevel > 0 ? 'active' : ''}`}>
                {irrigationLevel === 0 ? 'OFF' : `${irrigationLevel}%`}
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

          <button className="btn btn-accent w-full mt-3">Run Full Diagnostic</button>
        </div>

      </div>

      {/* ── SENSOR DASHBOARD ── */}
      <div className="sensor-section mt-4">
        <div className="sensor-section-header">
          <h2 className="section-title">Live Sensor Telemetry</h2>
          <div className="flex items-center gap-2">
            <div className="pulse-dot-sm" />
            <span className="text-muted text-sm">Refreshed 08:45:12</span>
          </div>
        </div>
        <div className="sensor-grid">
          {sensorData.map(s => <SensorCard key={s.id} sensor={s} />)}
        </div>
      </div>

    </div>
  );
}

export default Home;
