import { useState } from 'react';
import { Sprout, CheckCircle, ChevronRight, Crosshair, BarChart2, Droplets, Zap, AlertTriangle } from 'lucide-react';
import './Crop.css';

function Crop() {
  const [hasPlanted, setHasPlanted] = useState(false);

  return (
    <div className="container page-crop">

      {!hasPlanted ? (
        <div className="crop-planning-phase">
          {/* Current Field Conditions */}
          <div className="panel mb-4">
            <div className="panel-header">
              <h2 className="panel-title">Current Field Conditions</h2>
              <span className="badge badge-success">Live Sensor Data</span>
            </div>
            <div className="conditions-grid">
              <div className="condition-node">
                <span className="cn-label">Nitrogen (N)</span>
                <span className="cn-val text-success">High</span>
                <span className="cn-sub">142 kg/ha</span>
              </div>
              <div className="condition-node">
                <span className="cn-label">Phosphorus (P)</span>
                <span className="cn-val text-warning">Medium</span>
                <span className="cn-sub">28 kg/ha</span>
              </div>
              <div className="condition-node">
                <span className="cn-label">Potassium (K)</span>
                <span className="cn-val text-success">High</span>
                <span className="cn-sub">210 kg/ha</span>
              </div>
              <div className="condition-node">
                <span className="cn-label">Season Rainfall</span>
                <span className="cn-val">620 mm</span>
                <span className="cn-sub">Avg: 580 mm</span>
              </div>
              <div className="condition-node">
                <span className="cn-label">Avg. Temperature</span>
                <span className="cn-val">27.4°C</span>
                <span className="cn-sub">Suitable range</span>
              </div>
              <div className="condition-node">
                <span className="cn-label">Soil Moisture</span>
                <span className="cn-val">67%</span>
                <span className="cn-sub">Zone avg</span>
              </div>
            </div>
          </div>

          {/* Crop Recommendation Grid */}
          <div className="crops-comparison-grid">
            <div className="panel crop-card recommended">
              <div className="crop-card-header">
                <div>
                  <div className="badge badge-success mb-2">Primary Recommendation</div>
                  <h3 className="crop-name">Soybean</h3>
                  <p className="crop-variety text-muted">Variety: JS 335</p>
                </div>
                <div className="crop-score">
                  <span className="score-val">94</span>
                  <span className="score-label text-muted">/ 100</span>
                </div>
              </div>

              <div className="suitability-bar-wrapper mt-3">
                <div className="suitability-bar success" style={{ width: '94%' }}></div>
              </div>

              <div className="crop-factors mt-4">
                <div className="factor success"><CheckCircle size={14} /> Soil NPK levels optimal</div>
                <div className="factor success"><CheckCircle size={14} /> Rainfall within target range</div>
                <div className="factor success"><CheckCircle size={14} /> Temperature suitable for vegetative growth</div>
                <div className="factor warning"><AlertTriangle size={14} /> Monitor P levels at Day 45</div>
              </div>

              <div className="crop-metrics mt-4">
                <div className="cm-item">
                  <span className="cm-label">Expected Yield</span>
                  <span className="cm-val text-success">3.2 T/Acre</span>
                </div>
                <div className="cm-item">
                  <span className="cm-label">Season Duration</span>
                  <span className="cm-val">90–120 days</span>
                </div>
                <div className="cm-item">
                  <span className="cm-label">Water Requirement</span>
                  <span className="cm-val">450–700 mm</span>
                </div>
              </div>

              <button className="btn btn-primary w-full mt-4" onClick={() => setHasPlanted(true)}>
                Authorize Deployment
              </button>
            </div>

            <div className="panel crop-card">
              <div className="crop-card-header">
                <div>
                  <div className="badge badge-warning mb-2">Alternative</div>
                  <h3 className="crop-name">Cotton</h3>
                  <p className="crop-variety text-muted">Variety: RCH 776</p>
                </div>
                <div className="crop-score">
                  <span className="score-val">82</span>
                  <span className="score-label text-muted">/ 100</span>
                </div>
              </div>

              <div className="suitability-bar-wrapper mt-3">
                <div className="suitability-bar warning" style={{ width: '82%' }}></div>
              </div>

              <div className="crop-factors mt-4">
                <div className="factor success"><CheckCircle size={14} /> Soil temperature adequate</div>
                <div className="factor warning"><AlertTriangle size={14} /> Supplemental P injection at Day 40</div>
                <div className="factor warning"><AlertTriangle size={14} /> Boll rot risk — high late humidity</div>
              </div>

              <div className="crop-metrics mt-4">
                <div className="cm-item">
                  <span className="cm-label">Expected Yield</span>
                  <span className="cm-val">2.6 T/Acre</span>
                </div>
                <div className="cm-item">
                  <span className="cm-label">Season Duration</span>
                  <span className="cm-val">150–180 days</span>
                </div>
                <div className="cm-item">
                  <span className="cm-label">Water Requirement</span>
                  <span className="cm-val">700–1200 mm</span>
                </div>
              </div>

              <button className="btn btn-accent w-full mt-4">
                Deviate to Alternative
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="crop-command-center">
          {/* Header */}
          <div className="panel crop-active-header mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Sprout size={24} className="text-success" />
                  <h2 className="font-heading text-xl">Crop Command Center — Soybean (JS 335)</h2>
                </div>
                <p className="text-muted text-sm">Deployment authorized · Day 0 of 110 · Demo Farm, Zone A–D</p>
              </div>
              <div className="badge badge-success text-sm">Active Deployment</div>
            </div>
          </div>

          <div className="cmd-grid">
            {/* Growth Phase Timeline */}
            <div className="panel" style={{ gridColumn: 'span 2' }}>
              <div className="panel-header">
                <h2 className="panel-title">Growth Phase Timeline</h2>
              </div>
              <div className="phase-timeline">
                <div className="phase-node active">
                  <div className="phase-dot active"></div>
                  <div className="phase-info">
                    <span className="phase-name">Seedling</span>
                    <span className="phase-range text-muted">Day 0–10</span>
                  </div>
                </div>
                <div className="phase-link"></div>
                <div className="phase-node">
                  <div className="phase-dot"></div>
                  <div className="phase-info">
                    <span className="phase-name">Vegetative</span>
                    <span className="phase-range text-muted">Day 10–40</span>
                  </div>
                </div>
                <div className="phase-link"></div>
                <div className="phase-node">
                  <div className="phase-dot"></div>
                  <div className="phase-info">
                    <span className="phase-name">Flowering</span>
                    <span className="phase-range text-muted">Day 40–60</span>
                  </div>
                </div>
                <div className="phase-link"></div>
                <div className="phase-node">
                  <div className="phase-dot"></div>
                  <div className="phase-info">
                    <span className="phase-name">Pod Fill</span>
                    <span className="phase-range text-muted">Day 60–90</span>
                  </div>
                </div>
                <div className="phase-link"></div>
                <div className="phase-node">
                  <div className="phase-dot"></div>
                  <div className="phase-info">
                    <span className="phase-name">Maturity & Harvest</span>
                    <span className="phase-range text-muted">Day 90–110</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Targets Panel */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Active Targets</h2>
              </div>
              <div className="targets-list">
                <div className="target-row">
                  <Droplets size={16} className="text-primary" />
                  <div>
                    <span className="t-name">Soil Moisture</span>
                    <span className="t-range">60% – 75%</span>
                  </div>
                  <span className="t-current text-success">67%</span>
                </div>
                <div className="target-row">
                  <Zap size={16} className="text-warning" />
                  <div>
                    <span className="t-name">Nitrogen Injection</span>
                    <span className="t-range">Next: Day 45</span>
                  </div>
                  <span className="t-current">Scheduled</span>
                </div>
                <div className="target-row">
                  <BarChart2 size={16} className="text-success" />
                  <div>
                    <span className="t-name">Predicted Yield</span>
                    <span className="t-range">Target: 3.0 T/Acre</span>
                  </div>
                  <span className="t-current text-success">3.2 T</span>
                </div>
                <div className="target-row warning-row">
                  <AlertTriangle size={16} className="text-warning" />
                  <div>
                    <span className="t-name">Phosphorus Alert</span>
                    <span className="t-range">Action needed at Day 45</span>
                  </div>
                  <span className="t-current text-warning">Monitor</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Crop;
