import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FarmDataProvider } from './context/FarmDataContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FarmDataProvider>
      <App />
    </FarmDataProvider>
  </React.StrictMode>,
)
