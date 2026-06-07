import { CheckCircle, AlertTriangle, XCircle, Activity, Server, Cpu, Database, Network, Clock, RefreshCw } from 'lucide-react';
import './SystemStatus.css';

const nodes = [
  { icon: Database, label: 'Sensor Network', sublabel: '42 nodes active', status: 'ok' },
  { icon: Cpu, label: 'ESP32 Controller', sublabel: 'RSSI −65 dBm · Up 14d', status: 'ok' },
  { icon: Server, label: 'Backend API', sublabel: 'Latency: 42ms · ERR: 0.01%', status: 'ok' },
  { icon: Activity, label: 'AI Inference Engine', sublabel: 'Recalculated 08:45', status: 'ok' },
  { icon: Network, label: 'Dashboard Uplink', sublabel: 'WSS · Connected', status: 'ok' },
];

const logs = [
  { time: '09:12:45', module: 'AI Engine', event: 'Model recalibration complete', status: 'ok' },
  { time: '08:46:22', module: 'Sensor Batch', event: 'Batch 402 received (42 packets)', status: 'ok' },
  { time: '08:43:10', module: 'API Gateway', event: 'WebSocket connection established', status: 'ok' },
  { time: '08:40:05', module: 'Zone B Sensor', event: 'Moisture reading below threshold (58%)', status: 'warn' },
  { time: '08:30:00', module: 'Scheduler', event: 'Daily uplink initiated', status: 'ok' },
  { time: '08:28:55', module: 'ESP32', event: 'Watchdog reset — non-critical', status: 'warn' },
];

const statusIcon = (s) => {
  if (s === 'ok') return <CheckCircle size={14} className="text-success" />;
  if (s === 'warn') return <AlertTriangle size={14} className="text-warning" />;
  return <XCircle size={14} className="text-danger" />;
};

function SystemStatus() {
  return (
    <div className="container page-system">

      {/* Top Row */}
      <div className="system-top-grid mb-4">

        {/* Overall Health Orb */}
        <div className="panel health-orb-panel">
          <div className="panel-header">
            <h2 className="panel-title">System Health</h2>
          </div>
          <div className="orb-wrapper">
            <div className="orb">
              <span className="orb-val">98%</span>
              <span className="orb-label text-success">Operational</span>
            </div>
          </div>
          <div className="orb-stats mt-4">
            <div className="orb-stat">
              <span className="os-label">Uptime</span>
              <span className="os-val">14d 8h</span>
            </div>
            <div className="orb-stat">
              <span className="os-label">Nodes Online</span>
              <span className="os-val text-success">42 / 42</span>
            </div>
            <div className="orb-stat">
              <span className="os-label">Active Warnings</span>
              <span className="os-val text-warning">2</span>
            </div>
          </div>
        </div>

        {/* Data Flow Topology */}
        <div className="panel topology-panel">
          <div className="panel-header">
            <h2 className="panel-title">Data Flow — Infrastructure Topology</h2>
            <div className="badge badge-success">All Systems Nominal</div>
          </div>
          <div className="topology-graph">
            {nodes.map((node, i) => (
              <div key={i} className="topo-node-group">
                <div className={`topo-node status-${node.status}`}>
                  <div className="topo-icon-wrapper">
                    <node.icon size={22} />
                  </div>
                  <div className="topo-label">
                    <span className="topo-name">{node.label}</span>
                    <span className="topo-sub text-muted">{node.sublabel}</span>
                  </div>
                  <div className={`topo-indicator status-${node.status}`}></div>
                </div>
                {i < nodes.length - 1 && (
                  <div className="topo-arrow">
                    <div className="topo-line">
                      <div className="topo-packet"></div>
                    </div>
                    <span className="topo-arrow-symbol">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="system-bottom-grid">

        {/* Hardware Diagnostics */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Hardware Diagnostics</h2>
            <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <RefreshCw size={12} style={{ marginRight: '0.4rem' }} /> Refresh
            </button>
          </div>
          <div className="diag-table">
            {[
              { key: 'ESP32 Signal Strength', val: '−65 dBm', status: 'ok', note: 'Strong' },
              { key: 'ESP32 Uptime', val: '14d 08h 22m', status: 'ok', note: '' },
              { key: 'Soil Sensor Array', val: '42 / 42 Active', status: 'ok', note: 'All Nominal' },
              { key: 'Weather Station', val: '1 / 1 Active', status: 'ok', note: 'Nominal' },
              { key: 'Battery Level (Main)', val: '87%', status: 'ok', note: '' },
              { key: 'SD Card Storage', val: '12.4 GB / 32 GB', status: 'ok', note: '' },
            ].map((row, i) => (
              <div key={i} className="diag-row">
                <span className="diag-key">{row.key}</span>
                <span className="diag-val">{row.val}</span>
                <span className={`diag-status text-${row.status === 'ok' ? 'success' : 'warning'}`}>
                  {row.status === 'ok' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  {row.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Metrics */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Network Metrics</h2>
          </div>
          <div className="net-metrics-grid">
            {[
              { label: 'Requests Today', val: '14,208', color: '' },
              { label: 'Packets Received', val: '42,911', color: '' },
              { label: 'Error Rate', val: '0.01%', color: 'text-success' },
              { label: 'Avg. Latency', val: '42 ms', color: '' },
              { label: 'Data Synced', val: '1.28 GB', color: '' },
              { label: 'Active WebSockets', val: '3', color: '' },
            ].map((m, i) => (
              <div key={i} className="net-metric-cell">
                <span className="nm-label">{m.label}</span>
                <span className={`nm-val ${m.color}`}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Log */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">System Event Log</h2>
            <Clock size={14} className="text-muted" />
          </div>
          <div className="log-list">
            {logs.map((log, i) => (
              <div key={i} className={`log-row ${log.status}`}>
                <span className="log-time">{log.time}</span>
                {statusIcon(log.status)}
                <span className="log-module">{log.module}</span>
                <span className="log-event">{log.event}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SystemStatus;
