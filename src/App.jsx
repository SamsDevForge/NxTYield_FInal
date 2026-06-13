import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingStatus from './components/FloatingStatus';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Weather = lazy(() => import('./pages/Weather'));
const Crop = lazy(() => import('./pages/Crop'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));

function RouteFallback() {
  return (
    <div className="container">
      <div className="panel app-fallback-panel">
        <h2 className="panel-title">Loading view</h2>
        <p className="text-muted">Preparing the dashboard module...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/crop" element={<Crop />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/chat" element={<ChatAssistant />} />
                <Route path="/system" element={<SystemStatus />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <FloatingStatus />
      </div>
    </Router>
  );
}

export default App;
