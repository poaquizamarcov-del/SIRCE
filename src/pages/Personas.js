import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [bandas, setBandas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '', alias: '', cedula: '', provincia: '',
    banda_id: '', nivel: 'bajo', estado: 'activo', notas: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarPersonas();
    cargarBandas();
  }, []);

  const cargarPersonas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/personas');
      setPersonas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarBandas = async () => {
    try {
      const res = await axios.get('https://sirce-production.up.railway.app/api/bandas');
      setBandas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const guardarPersona = async () => {
    try {
      await axios.post('https://sirce-production.up.railway.app/api/personas', form);
      setModal(false);
      setForm({
        nombre: '', alias: '', cedula: '', provincia: '',
        banda_id: '', nivel: 'bajo', estado: 'activo', notas: ''
      });
      cargarPersonas();
    } catch (error) {
      console.error(error);
    }
  };

  const personasFiltradas = personas.filter(p => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.alias && p.alias.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.cedula && p.cedula.includes(busqueda));
    const coincideNivel = filtroNivel === 'todos' || p.nivel === filtroNivel;
    return coincideBusqueda && coincideNivel;
  });

  const nivelColor = (nivel) => {
    if (nivel === 'alto') return { bg: '#7f1d1d', color: '#fca5a5' };
    if (nivel === 'medio') return { bg: '#78350f', color: '#fcd34d' };
    return { bg: '#1e3a5f', color: '#93c5fd' };
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px',
    color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box',
    marginTop: '4px'
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
          <button onClick={() => navigate('/grafo')} style={btnStyle}>Red criminal</button>
          <button onClick={() => navigate('/mapa')} style={btnStyle}>Mapa</button>
          <button onClick={() => setModal(true)} style={{
            background: '#2563eb', border: 'none',
            color: 'white', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer'
          }}>+ Nuevo perfil</button>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Perfiles registrados</h2>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            placeholder="Buscar por nombre, alias o cédula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ ...inputStyle, marginTop: 0, flex: 1 }}
          />
          <select
            value={filtroNivel}
            onChange={e => setFiltroNivel(e.target.value)}
            style={{ ...inputStyle, marginTop: 0, width: '160px' }}
          >
            <option value="todos">Todos los niveles</option>
            <option value="alto">Alto riesgo</option>
            <option value="medio">Medio riesgo</option>
            <option value="bajo">Bajo riesgo</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b' }}>
                {['Nombre', 'Alias', 'Cédula', 'Provincia', 'Banda', 'Nivel', 'Estado'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    color: '#64748b', fontSize: '12px', fontWeight: '500',
                    borderBottom: '1px solid #334155'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personasFiltradas.map((p, i) => (
                <tr key={p.id} style={{
                  background: i % 2 === 0 ? '#0f172a' : '#1e293b',
                  borderBottom: '1px solid #1e293b'
                }}>
                  <td style={{ padding: '12px 16px', color: '#f1f5f9', fontSize: '14px' }}>{p.nombre}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{p.alias || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{p.cedula || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{p.provincia || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{p.banda_nombre || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: nivelColor(p.nivel).bg,
                      color: nivelColor(p.nivel).color,
                      padding: '3px 10px', borderRadius: '4px', fontSize: '12px'
                    }}>{p.nivel}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: p.estado === 'activo' ? '#14532d' : '#334155',
                      color: p.estado === 'activo' ? '#86efac' : '#94a3b8',
                      padding: '3px 10px', borderRadius: '4px', fontSize: '12px'
                    }}>{p.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b', borderRadius: '12px',
            padding: '24px', width: '480px', border: '1px solid #334155'
          }}>
            <h3 style={{ color: '#f1f5f9', marginTop: 0 }}>Nuevo perfil</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Nombre completo', key: 'nombre', type: 'text' },
                { label: 'Alias', key: 'alias', type: 'text' },
                { label: 'Cédula', key: 'cedula', type: 'text' },
                { label: 'Provincia', key: 'provincia', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: '#94a3b8', fontSize: '13px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px' }}>Banda</label>
                <select value={form.banda_id}
                  onChange={e => setForm({ ...form, banda_id: e.target.value })}
                  style={inputStyle}>
                  <option value="">Seleccionar banda</option>
                  {bandas.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px' }}>Nivel</label>
                <select value={form.nivel}
                  onChange={e => setForm({ ...form, nivel: e.target.value })}
                  style={inputStyle}>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px' }}>Estado</label>
                <select value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value })}
                  style={inputStyle}>
                  <option value="activo">Activo</option>
                  <option value="detenido">Detenido</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px' }}>Notas</label>
              <textarea
                value={form.notas}
                onChange={e => setForm({ ...form, notas: e.target.value })}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(false)} style={{
                background: 'transparent', border: '1px solid #334155',
                color: '#94a3b8', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer'
              }}>Cancelar</button>
              <button onClick={guardarPersona} style={{
                background: '#2563eb', border: 'none',
                color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer'
              }}>Guardar perfil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personas;