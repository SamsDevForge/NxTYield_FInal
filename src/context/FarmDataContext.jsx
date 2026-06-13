/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  getChatStatus,
  getHealth,
  getInsights,
  getLatestSensor,
  getSensorHistory,
  getWeather,
  openSensorStream,
} from '../lib/api';
import { calculateHealthScore, getSeason, hasSensorData, hasSensorPacket } from '../lib/farmUtils';

const FarmDataContext = createContext(null);
const INSIGHTS_COOLDOWN_MS = 120000;
const MAX_HISTORY = 60;
const SENSOR_POLL_MS = 5000;

function readingKey(reading) {
  if (!reading) return '';
  return [
    reading.source,
    reading.timestamp,
    reading.nitrogen,
    reading.phosphorus,
    reading.potassium,
    reading.moisture,
    reading.ph,
    reading.soil_temperature,
    reading.air_temperature,
    reading.humidity,
    reading.pressure,
    reading.rain_detected,
    reading.irrigation_active,
    reading.health_score,
  ].map((value) => value ?? '').join('|');
}

export function FarmDataProvider({ children }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [health, setHealth] = useState(null);
  const [apiErrors, setApiErrors] = useState({});
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [chatStatus, setChatStatus] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const lastInsightsFetch = useRef(0);
  const lastReadingKey = useRef('');

  const setApiError = useCallback((key, message = '') => {
    setApiErrors((prev) => ({ ...prev, [key]: message }));
  }, []);

  const applyReading = useCallback((reading) => {
    if (!reading) return;
    const key = readingKey(reading);
    if (key && key === lastReadingKey.current) return;
    lastReadingKey.current = key;

    setLatest(reading);
    setApiError('sensor', reading.available === false ? reading.message || 'Sensor API not available' : '');
    setHistory((prev) => {
      if (!hasSensorData(reading)) return prev;
      const next = [...prev, reading].filter(Boolean);
      return next.slice(-MAX_HISTORY);
    });
  }, [setApiError]);

  const refreshHealth = useCallback(async () => {
    try {
      const data = await getHealth();
      setHealth(data);
      setApiError('health', '');
    } catch (error) {
      setHealth(null);
      setApiError('health', error.message || 'Backend API not available');
    }
  }, [setApiError]);

  const refreshInsights = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastInsightsFetch.current < INSIGHTS_COOLDOWN_MS) return;

    setInsightsLoading(true);
    setInsightsError('');
    try {
      const data = await getInsights();
      setInsights(data);
      setInsightsError(data?.available === false ? data.message || 'AI insights API not available' : '');
      setApiError('insights', data?.available === false ? data.message || 'AI insights API not available' : '');
      lastInsightsFetch.current = Date.now();
    } catch (error) {
      setInsightsError(error.message);
      setApiError('insights', error.message);
      setInsights({
        available: false,
        provider: 'api',
        message: error.message || 'AI insights API not available',
        soil_health: null,
        crop_health: null,
        fertilizer: null,
        recommendation: null,
      });
    } finally {
      setInsightsLoading(false);
    }
  }, [setApiError]);

  const refreshWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError('');
    try {
      const data = await getWeather('Pune,IN');
      setWeather(data);
      const unavailable = data?.available === false ? data.message || 'Weather API not available' : '';
      setWeatherError(unavailable);
      setApiError('weather', unavailable);
    } catch (error) {
      setWeatherError(error.message);
      setApiError('weather', error.message);
      setWeather({
        available: false,
        provider: 'openweather',
        city: 'Pune,IN',
        current: null,
        forecast: [],
        message: error.message || 'Weather API not available',
      });
    } finally {
      setWeatherLoading(false);
    }
  }, [setApiError]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      const [latestResult, historyResult, chatResult] = await Promise.allSettled([
        getLatestSensor(),
        getSensorHistory(),
        getChatStatus(),
      ]);

      if (cancelled) return;

      if (historyResult.status === 'fulfilled') {
        const cleanHistory = historyResult.value.filter(hasSensorData).slice(-MAX_HISTORY);
        setHistory(cleanHistory);
        if (cleanHistory.length) {
          const latestHistoryReading = cleanHistory[cleanHistory.length - 1];
          lastReadingKey.current = readingKey(latestHistoryReading);
          setLatest(latestHistoryReading);
        }
      } else {
        setApiError('history', historyResult.reason?.message || 'Sensor history API not available');
      }

      if (latestResult.status === 'fulfilled') {
        if (hasSensorPacket(latestResult.value)) {
          lastReadingKey.current = readingKey(latestResult.value);
          setLatest(latestResult.value);
        }
        setApiError('sensor', latestResult.value?.available === false ? latestResult.value.message || 'Sensor API not available' : '');
      } else if (latestResult.status === 'rejected') {
        setApiError('sensor', latestResult.reason?.message || 'Sensor API not available');
      }

      if (chatResult.status === 'fulfilled') {
        setChatStatus(chatResult.value);
        setApiError('chat', chatResult.value?.available === false ? chatResult.value.message || 'AI API not available' : '');
      } else {
        setApiError('chat', chatResult.reason?.message || 'AI API not available');
      }
    }

    loadInitialData();
    window.setTimeout(refreshHealth, 0);
    window.setTimeout(() => refreshInsights(true), 0);
    window.setTimeout(refreshWeather, 0);

    const healthTimer = window.setInterval(refreshHealth, 60000);
    const weatherTimer = window.setInterval(refreshWeather, 10 * 60 * 1000);
    const sensorTimer = window.setInterval(async () => {
      try {
        const reading = await getLatestSensor();
        if (hasSensorPacket(reading)) {
          applyReading(reading);
        } else if (reading?.available === false) {
          setApiError('sensor', reading.message || 'Sensor API not available');
        }
      } catch (error) {
        setApiError('sensor', error.message || 'Sensor API not available');
        // The SSE stream will keep retrying; this poll is only a fallback.
      }
    }, SENSOR_POLL_MS);
    const chatTimer = window.setInterval(async () => {
      try {
        const status = await getChatStatus();
        setChatStatus(status);
        setApiError('chat', status?.available === false ? status.message || 'AI API not available' : '');
      } catch (error) {
        setChatStatus(null);
        setApiError('chat', error.message || 'AI API not available');
      }
    }, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(healthTimer);
      window.clearInterval(weatherTimer);
      window.clearInterval(sensorTimer);
      window.clearInterval(chatTimer);
    };
  }, [applyReading, refreshHealth, refreshInsights, refreshWeather, setApiError]);

  useEffect(() => {
    const stream = openSensorStream({
      onOpen: () => setConnected(true),
      onError: () => {
        setConnected(false);
        setApiError('stream', 'Live sensor stream not available');
      },
      onMessage: (reading) => {
        setConnected(true);
        setApiError('stream', '');
        applyReading(reading);
      },
    });

    return () => stream.close();
  }, [applyReading, setApiError]);

  useEffect(() => {
    if (hasSensorData(latest)) {
      const timer = window.setTimeout(() => refreshInsights(false), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [latest, refreshInsights]);

  const summary = useMemo(() => {
    const healthScore = calculateHealthScore(latest, insights);
    return {
      connected,
      backendAvailable: !apiErrors.health,
      source: latest?.source || 'none',
      season: getSeason(),
      hasSensor: hasSensorData(latest),
      healthScore,
      demoMode: false,
    };
  }, [apiErrors.health, connected, insights, latest]);

  const value = useMemo(() => ({
    latest,
    history,
    connected,
    health,
    apiErrors,
    demoMode: false,
    insights,
    insightsLoading,
    insightsError,
    chatStatus,
    weather,
    weatherLoading,
    weatherError,
    summary,
    refreshHealth,
    refreshInsights,
    refreshWeather,
  }), [
    latest,
    history,
    connected,
    health,
    apiErrors,
    insights,
    insightsLoading,
    insightsError,
    chatStatus,
    weather,
    weatherLoading,
    weatherError,
    summary,
    refreshHealth,
    refreshInsights,
    refreshWeather,
  ]);

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  );
}

export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used inside FarmDataProvider');
  }
  return context;
}
