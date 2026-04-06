import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Mapa() {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapRef.current._leaflet_id) return;

    const L = window.L;

    const map = L.map(mapRef.current).setView([-1.8312, -78.1834], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const incidentes = [
      { lat: -2.1894, lng: -79.8891, provincia: 'Guayas', banda: 'Los Lobos', casos: 412, color: '#ef4444' },
      { lat: -0.2295, lng: -78.5243, provincia: 'Pichincha', banda: 'Choneros', casos: 338, color: '#3b82f6' },
      { lat: -1.0547, lng: -80.4524, provincia: 'Manabí', banda: 'Fatales', casos: 204, color: '#f59e0b' },
      { lat: -3.2581, lng: -79.9554, provincia: 'El Oro', banda: 'Los Lobos', casos: 98, color: '#ef4444' },
      { lat: -2.8974, lng: -78.9968, provincia: 'Azuay', banda: 'Otros', casos: 76, color: '#64748b' },
      { lat: 0.3516, lng: -78.1122, provincia: 'Imbabura', banda: 'Otros', casos: 45, color: '#64748b' },
      { lat: -1.6635, lng: -78.6546, provincia: 'Tungurahua', banda: 'Otros', casos: 38, color: '#64748b' },
    ];

    incidentes.forEach(inc => {
      const circle = L.circle([inc.lat, inc.lng], {
        color: inc.color,
        fillColor: inc.color,
        fillOpacity: 0.5,
        radius: inc.casos * 80
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: sans-serif; min-width: 150px;">
          <strong style="font-size: 14px;">${inc.provincia}</strong><br/>
          <span style="color: #666;">Banda principal:</span> ${inc.banda}<br/>
          <span style="color: #666;">Casos 2025:</span> <strong>${inc.casos}</strong>
        </div>
      `);
    });

  }, []);

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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} style={btnStyle}>Dashboard</button>
          <button onClick={() => navigate('/personas')} style={btnStyle}>Perfiles</button>
          <button onClick={() => navigate('/grafo')} style={btnStyle}>Red criminal</button>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Mapa de incidentes — Ecuador 2025</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
          Click en cada círculo para ver detalles de la provincia
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[
            { color: '#ef4444', nombre: 'Los Lobos' },
            { color: '#3b82f6', nombre: 'Choneros' },
            { color: '#f59e0b', nombre: 'Fatales' },
            { color: '#64748b', nombre: 'Otros' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: b.color }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{b.nombre}</span>
            </div>
          ))}
        </div>

        <div
          ref={mapRef}
          style={{
            width: '100%', height: '600px',
            borderRadius: '12px', border: '1px solid #334155',
            zIndex: 1
          }}
        />
      </div>
    </div>
  );
}

export default Mapa;