import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Personas from './pages/Personas';
import Grafo from './pages/Grafo';
import Mapa from './pages/Mapa';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/grafo" element={
        <PrivateRoute><Grafo /></PrivateRoute>
        } /> 
        <Route path="/mapa" element={
        <PrivateRoute><Mapa /></PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/personas" element={
          <PrivateRoute><Personas /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;