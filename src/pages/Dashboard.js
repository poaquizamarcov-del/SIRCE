import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    personas: 0, bandas: 0, incidentes: 0, cabecillas: 0
  });
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [personas, bandas] = await Promise.all([
          axios.get('https://sirce-production.up.railway.app/api/personas'),
          axios.get('https://sirce-production.up.railway.app/api/bandas'),
        ]);
        setStats({
          personas: personas.data.length,
          bandas: bandas.data.length,
          cabecillas: personas.data.filter(p => p.nivel === 'alto').length,
          incidentes: 1204
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const cardStyle = {
    background: '#1e293b', borderRadius: '12px',
    padding: '24px', border: '1px solid #334155'
  };

  const btnStyle = {
    background: 'transparent', border: '1px solid #334155',
    color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <nav style={{
        background: '#1e293b', padding: '0 24px',
        borderBottom: '1px solid #334155',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>🛡️</span>
          <span style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '16px' }}>SIRCE</span>
          <span style={{
            background: '#7f1d1d', color: '#fca5a5',
            fontSize: '11px', padding: '2px 8px', borderRadius: '4px'
          }}>CLASIFICADO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/personas')} style={btnStyle}>Perfiles</button>
          <button onClick={() => navigate('/grafo')} style={btnStyle}>Red criminal</button>
          <button onClick={() => navigate('/mapa')} style={btnStyle}>Mapa</button>
          <span style={{ color: '#64748b', fontSize: '13px' }}>{usuario.nombre}</span>
          <button onClick={cerrarSesion} style={{
            background: '#7f1d1d', border: 'none', color: '#fca5a5',
            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer'
          }}>Salir</button>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Panel de Control</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Bienvenido, {usuario.nombre} — {new Date().toLocaleDateString('es-EC', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', marginBottom: '24px'
        }}>
          {[
            { label: 'Personas registradas', value: stats.personas, color: '#3b82f6', icon: '👤' },
            { label: 'Bandas activas', value: stats.bandas, color: '#f59e0b', icon: '⚠️' },
            { label: 'Cabecillas alto riesgo', value: stats.cabecillas, color: '#ef4444', icon: '🎯' },
            { label: 'Incidentes 2025', value: stats.incidentes, color: '#10b981', icon: '📋' },
          ].map((stat, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginTop: 0, marginBottom: '16px' }}>
              Incidentes por banda
            </h3>
            {[
              { nombre: 'Los Lobos', value: 412, color: '#ef4444' },
              { nombre: 'Choneros', value: 338, color: '#3b82f6' },
              { nombre: 'Fatales', value: 204, color: '#f59e0b' },
              { nombre: 'Otros', value: 126, color: '#64748b' },
            ].map((banda, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{banda.nombre}</span>
                  <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{banda.value}</span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px' }}>
                  <div style={{
                    width: `${(banda.value / 412) * 100}%`,
                    background: banda.color, height: '100%', borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#f1f5f9', marginTop: 0, marginBottom: '16px' }}>
              Alertas recientes
            </h3>
            {[
              { texto: 'Nuevo parte policial — J. Mendoza', tiempo: 'hace 2h', tipo: 'urgente' },
              { texto: 'Actualización de perfil — C. Torres', tiempo: 'hace 5h', tipo: 'info' },
              { texto: 'Nuevo vínculo detectado — R. Suárez', tiempo: 'hace 1d', tipo: 'medio' },
            ].map((alerta, i) => (
              <div key={i} style={{
                padding: '12px', background: '#0f172a',
                borderRadius: '8px', marginBottom: '10px',
                borderLeft: `3px solid ${alerta.tipo === 'urgente' ? '#ef4444' : alerta.tipo === 'info' ? '#3b82f6' : '#f59e0b'}`
              }}>
                <p style={{ color: '#f1f5f9', margin: 0, fontSize: '13px' }}>{alerta.texto}</p>
                <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '12px' }}>{alerta.tiempo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;