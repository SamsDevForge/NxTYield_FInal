import { Activity, Droplets, Target, Cpu } from 'lucide-react';
import './FloatingStatus.css';

function FloatingStatus() {
  return (
    <div className="floating-status panel">
      <div className="status-group">
        <div className="status-item">
          <Activity size={16} className="text-success" />
          <span className="fs-label">Health Score:</span>
          <span className="fs-val text-success">92.0</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <Droplets size={16} className="text-primary" />
          <span className="fs-label">Moisture:</span>
          <span className="fs-val">67%</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <Target size={16} className="text-warning" />
          <span className="fs-label">Crop:</span>
          <span className="fs-val">Soybean (Var. 4)</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <Cpu size={16} className="text-success" />
          <span className="fs-label">AI Agent:</span>
          <span className="fs-val text-success">Active</span>
        </div>
      </div>
    </div>
  );
}

export default FloatingStatus;
