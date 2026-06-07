import { Brain, TrendingUp, ShieldAlert, Zap, AlertTriangle, CheckCircle, ArrowUpRight, Activity } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './AIInsights.css';

const radarData = [
  { metric: 'Soil Health', value: 94 },
  { metric: 'Moisture', value: 78 },
  { metric: 'Weather', value: 85 },
  { metric: 'Crop Vigor', value: 91 },
  { metric: 'Nutrient', value: 70 },
  { metric: 'Connectivity', value: 98 },
];

function AIInsights() {
  return (
    <div className="container page-ai">

      {/* Top Row */}
      <div className="ai-top-grid mb-4">

        {/* Farm Intelligence Report */}
        <div className="panel farm-report">
          <div className="panel-header">
            <h2 className="panel-title">Farm Analysis Report</h2>
            <span className="badge badge-success">Updated 08:45</span>
          </div>
          <div className="report-summary">
            <p className="report-text">
              Demo Farm is currently performing in the <strong className="text-success">top 12%</strong> of regional farms for this season.
              Soil conditions are optimal for Soybean at vegetative stage. Moisture tracking is stable across Zones A, C, and D.
              Zone B requires attention — moisture trending 8% below target. AI engine forecasts a <strong className="text-success">+12% yield advantage</strong> over the regional baseline if current trajectory is maintained.
            </p>
          </div>

          <div className="report-metrics mt-4">
            <div className="rm-item">
              <Activity size={16} className="text-success" />
              <div>
                <span className="rm-label">Farm Percentile</span>
                <span className="rm-val text-success">Top 12% Regional</span>
              </div>
            </div>
            <div className="rm-item">
              <TrendingUp size={16} className="text-success" />
              <div>
                <span className="rm-label">Yield Advantage</span>
                <span className="rm-val">+12% vs Baseline</span>
              </div>
            </div>
            <div className="rm-item">
              <ShieldAlert size={16} className="text-warning" />
              <div>
                <span className="rm-label">Active Risks</span>
                <span className="rm-val text-warning">2 Moderate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="panel radar-panel">
          <div className="panel-header">
            <h2 className="panel-title">Farm Intelligence Matrix</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'Inter' }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--color-success)"
                fill="var(--color-success)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Yield Prediction */}
        <div className="panel yield-panel">
          <div className="panel-header">
            <h2 className="panel-title">Yield Prediction Engine</h2>
          </div>
          <div className="yield-content">
            <div className="yield-primary">
              <span className="yield-val">3.2</span>
              <span className="yield-unit">T / Acre</span>
            </div>
            <div className="confidence-block mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-muted text-sm">Model Confidence</span>
                <span className="text-sm font-600 text-success">88.4%</span>
              </div>
              <div className="conf-bar">
                <div className="conf-fill success" style={{ width: '88.4%' }}></div>
              </div>
            </div>
            <div className="yield-range mt-4">
              <div className="yr-item">
                <span className="yr-label">Pessimistic</span>
                <span className="yr-val">2.7 T</span>
              </div>
              <div className="yr-divider"></div>
              <div className="yr-item">
                <span className="yr-label">Expected</span>
                <span className="yr-val text-success">3.2 T</span>
              </div>
              <div className="yr-divider"></div>
              <div className="yr-item">
                <span className="yr-label">Optimistic</span>
                <span className="yr-val">3.6 T</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="ai-bottom-grid">

        {/* Priority Action Queue */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Priority Action Queue</h2>
            <span className="badge badge-warning">2 Actions Pending</span>
          </div>
          <div className="action-queue">

            <div className="action-row high">
              <div className="a-impact-badge badge badge-danger">High Impact</div>
              <div className="a-content">
                <div className="a-header">
                  <span className="a-title">Zone B Pre-Irrigation</span>
                  <ArrowUpRight size={16} className="text-muted" />
                </div>
                <p className="a-desc text-muted">Moisture at Zone B has dropped to 58%. Initiate targeted irrigation sequence to avoid early-season stress before the next forecast rainfall in 72h.</p>
              </div>
              <button className="btn btn-primary a-btn">Execute</button>
            </div>

            <div className="action-row medium">
              <div className="a-impact-badge badge badge-warning">Medium Impact</div>
              <div className="a-content">
                <div className="a-header">
                  <span className="a-title">Sensor Calibration — Zone C Node 3</span>
                  <ArrowUpRight size={16} className="text-muted" />
                </div>
                <p className="a-desc text-muted">Anomalous reading variance detected on Zone C, sensor node 3. Variance exceeds the 15% threshold. Manual or remote calibration recommended within 24h.</p>
              </div>
              <button className="btn btn-accent a-btn">Schedule</button>
            </div>

          </div>
        </div>

        {/* Threat Matrix */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Risk Assessment Matrix</h2>
          </div>
          <div className="risk-grid">
            <div className="risk-item low">
              <CheckCircle size={20} className="text-success" />
              <div>
                <span className="risk-label">Drought Risk</span>
                <span className="risk-level text-success">Low</span>
                <span className="risk-desc">Rainfall forecast adequate for 30-day outlook</span>
              </div>
            </div>
            <div className="risk-item elevated">
              <AlertTriangle size={20} className="text-warning" />
              <div>
                <span className="risk-label">Disease Risk</span>
                <span className="risk-level text-warning">Elevated</span>
                <span className="risk-desc">RH consistently above 70% — fungal watch active</span>
              </div>
            </div>
            <div className="risk-item low">
              <CheckCircle size={20} className="text-success" />
              <div>
                <span className="risk-label">Nutrient Deficiency</span>
                <span className="risk-level text-success">Low</span>
                <span className="risk-desc">N and K levels within optimal range</span>
              </div>
            </div>
            <div className="risk-item low">
              <CheckCircle size={20} className="text-success" />
              <div>
                <span className="risk-label">Pest Pressure</span>
                <span className="risk-level text-success">Low</span>
                <span className="risk-desc">No abnormal pest activity reported in surrounding farms</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AIInsights;
