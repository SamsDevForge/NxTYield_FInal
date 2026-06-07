import { CloudRain, Wind, Droplets, Thermometer, Sun } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Weather.css';

const seasonalData = [
  { month: 'Jun', histTemp: 26, currTemp: 28, histRain: 120, currRain: 100 },
  { month: 'Jul', histTemp: 27, currTemp: 29, histRain: 200, currRain: 180 },
  { month: 'Aug', histTemp: 26, currTemp: 27, histRain: 180, currRain: 150 },
  { month: 'Sep', histTemp: 25, currTemp: 26, histRain: 90, currRain: 110 },
];

const forecastData = [
  { day: 'Today', high: 29, low: 21, rain: 10 },
  { day: 'Tue', high: 27, low: 20, rain: 40 },
  { day: 'Wed', high: 24, low: 19, rain: 75 },
  { day: 'Thu', high: 25, low: 18, rain: 30 },
  { day: 'Fri', high: 28, low: 20, rain: 5 },
  { day: 'Sat', high: 30, low: 22, rain: 0 },
  { day: 'Sun', high: 31, low: 23, rain: 0 },
];

function Weather() {
  return (
    <div className="container page-weather">

      {/* Hero Section */}
      <div className="panel weather-hero mb-4">
        <div className="weather-main">
          <div className="temp-display">
            <Sun size={64} className="sun-icon" />
            <div>
              <span className="w-temp-large">28.4°C</span>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Partly Cloudy — Demo Farm, Maharashtra</p>
            </div>
          </div>

          <div className="w-metrics-grid">
            <div className="w-metric-box">
              <Droplets size={18} className="text-primary" />
              <span className="w-m-label">Humidity</span>
              <span className="w-m-val">72%</span>
            </div>
            <div className="w-metric-box">
              <CloudRain size={18} className="text-primary" />
              <span className="w-m-label">Rain Prob.</span>
              <span className="w-m-val">12%</span>
            </div>
            <div className="w-metric-box">
              <Wind size={18} className="text-primary" />
              <span className="w-m-label">Wind Speed</span>
              <span className="w-m-val">14<span className="w-m-unit"> km/h</span></span>
            </div>
            <div className="w-metric-box">
              <Thermometer size={18} className="text-warning" />
              <span className="w-m-label">Feels Like</span>
              <span className="w-m-val">31°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day Forecast Ribbon */}
      <div className="panel mb-4 forecast-ribbon-panel">
        <div className="panel-header">
          <h2 className="panel-title">7-Day Forecast</h2>
        </div>
        <div className="ribbon-container">
          {forecastData.map((day, i) => (
            <div key={i} className={`ribbon-node ${i === 0 ? 'active' : ''}`}>
              <span className="r-day">{day.day}</span>
              <div className="r-icon">
                {day.rain > 50
                  ? <CloudRain size={22} className="text-primary" />
                  : day.rain > 20
                    ? <CloudRain size={22} className="text-muted" />
                    : <Sun size={22} className="text-warning" />}
              </div>
              <span className="r-high">{day.high}°</span>
              <span className="r-low text-muted">{day.low}°</span>
              <div className="r-rain-bar">
                <div className="r-rain-fill" style={{ height: `${day.rain}%` }}></div>
              </div>
              <span className="r-rain-label">{day.rain}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-bottom-grid">

        {/* Seasonal Trend Visualization */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Seasonal Trend vs. Historical Avg</h2>
            <div className="flex gap-2">
              <span className="legend-dot success" /> <span className="legend-text">Current</span>
              <span className="legend-dot muted" /> <span className="legend-text">Historical</span>
            </div>
          </div>

          <div className="chart-wrapper mb-4">
            <h3 className="chart-title"><Thermometer size={14}/> Temperature (°C)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={seasonalData}>
                <defs>
                  <linearGradient id="colorCurrT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-amber)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-amber)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="currTemp" stroke="var(--color-amber)" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrT)" />
                <Area type="monotone" dataKey="histTemp" stroke="var(--text-muted)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3 className="chart-title"><CloudRain size={14}/> Rainfall (mm)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={seasonalData}>
                <XAxis dataKey="month" stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem' }} />
                <Bar dataKey="currRain" fill="var(--color-blue)" radius={[2,2,0,0]} opacity={0.8} />
                <Bar dataKey="histRain" fill="var(--border-highlight)" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Suitability Panel */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Crop Suitability — Current Conditions</h2>
          </div>
          <div className="rec-matrix">

            <div className="rec-matrix-item optimal">
              <div className="rec-m-header">
                <span className="r-crop-name">Soybean</span>
                <span className="badge badge-success">94% Match</span>
              </div>
              <div className="suitability-bar-wrapper">
                <div className="suitability-bar success" style={{width: '94%'}}></div>
              </div>
              <p className="rec-reason">Temperature and humidity align with Phase 2 vegetative growth requirements. Low waterlogging risk (&lt;2%).</p>
            </div>

            <div className="rec-matrix-item">
              <div className="rec-m-header">
                <span className="r-crop-name">Cotton</span>
                <span className="badge badge-warning">82% Match</span>
              </div>
              <div className="suitability-bar-wrapper">
                <div className="suitability-bar warning" style={{width: '82%'}}></div>
              </div>
              <p className="rec-reason">Humidity levels borderline. Monitor late-season rainfall to prevent boll rot. Requires close irrigation control.</p>
            </div>

            <div className="rec-matrix-item">
              <div className="rec-m-header">
                <span className="r-crop-name">Maize</span>
                <span className="badge badge-warning">71% Match</span>
              </div>
              <div className="suitability-bar-wrapper">
                <div className="suitability-bar warning" style={{width: '71%'}}></div>
              </div>
              <p className="rec-reason">Soil temperature adequate. Wind velocity may impact pollination. Best suited for sheltered zones.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Weather;
