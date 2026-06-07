import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingStatus from './components/FloatingStatus';
import Home from './pages/Home';
import Weather from './pages/Weather';
import Crop from './pages/Crop';
import AIInsights from './pages/AIInsights';
import ChatAssistant from './pages/ChatAssistant';
import SystemStatus from './pages/SystemStatus';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crop" element={<Crop />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/system" element={<SystemStatus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <FloatingStatus />
      </div>
    </Router>
  );
}

export default App;
