/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Grafo() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await axios.get('https://sirce-production.up.railway.app/api/personas');
      dibujarGrafo(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const dibujarGrafo = (data) => {
    if (!containerRef.current) return;

    const colores = {
      'Los Lobos': '#ef4444',
      'Choneros': '#3b82f6',
      'Fatales': '#f59e0b',
    };

    const nodos = data.map(p => ({
      id: p.id,
      label: `${p.alias || p.nombre}\n${p.banda_nombre}`,
      color: {
        background: colores[p.banda_nombre] || '#64748b',
        border: '#ffffff',
        highlight: { background: '#ffffff', border: '#000000' }
      },
      font: { color: '#ffffff', size: p.nivel === 'alto' ? 16 : 13 },
      size: p.nivel === 'alto' ? 40 : p.nivel === 'medio' ? 28 : 20,
      shape: p.nivel === 'alto' ? 'star' : 'dot',
    }));

    const enlaces = [
      { from: data[0]?.id, to: data[2]?.id, label: 'manda a', color: { color: '#ef4444' } },
      { from: data[1]?.id, to: data[3]?.id, label: 'manda a', color: { color: '#3b82f6' } },
    ].filter(e => e.from && e.to);

    const Network = window.vis.Network;
    new Network(
      containerRef.current,
      { nodes: nodos, edges: enlaces },
      {
        physics: { enabled: true, stabilization: { iterations: 200 } },
        edges: {
          arrows: 'to',
          font: { color: '#94a3b8', size: 11 },
          smooth: { type: 'curvedCW', roundness: 0.2 }
        },
        interaction: { hover: true, zoomView: true, dragNodes: true }
      }
    );
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} style={btnStyle}>Dashboard</button>
          <button onClick={() => navigate('/personas')} style={btnStyle}>Perfiles</button>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Red de vínculos criminales</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          Puedes mover los nodos, hacer zoom y explorar las conexiones
        </p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[
            { color: '#ef4444', nombre: 'Los Lobos' },
            { color: '#3b82f6', nombre: 'Choneros' },
            { color: '#f59e0b', nombre: 'Fatales' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: b.color }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{b.nombre}</span>
            </div>
          ))}
        </div>
        <div ref={containerRef} style={{
          width: '100%', height: '600px',
          background: '#1e293b', borderRadius: '12px',
          border: '1px solid #334155'
        }} />
      </div>
    </div>
  );
}

export default Grafo;