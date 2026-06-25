import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

import { AuthProvider } from './context/AuthContext';

import Layout         from './components/Layout';
import HomePage       from './components/HomePage';
import Dashboard      from './components/Dashboard';
import FutureSelf     from './components/FutureSelf';
import ElderlyMode    from './components/ElderlyMode';
import VoiceInterface from './components/VoiceInterface';
import Biometrics     from './components/Biometrics';
import MapTracker     from './components/MapTracker';
import AgentPanel     from './components/AgentPanel';
import Constitution   from './components/Constitution';
import ScamShield     from './components/ScamShield';
import AAYAAssist     from './components/AAYAAssist';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/app">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home"         element={<HomePage />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="future-self"  element={<FutureSelf />} />
            <Route path="constitution" element={<Constitution />} />
            <Route path="scam-shield"  element={<ScamShield />} />
            <Route path="elderly"      element={<ElderlyMode />} />
            <Route path="assist"       element={<AAYAAssist />} />
            <Route path="voice"        element={<VoiceInterface />} />
            <Route path="biometrics"   element={<Biometrics />} />
            <Route path="map"          element={<MapTracker />} />
            <Route path="agents"       element={<AgentPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
