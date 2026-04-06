import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://sirce-production.up.railway.app/api/auth/login', {
        email, password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f172a'
    }}>
      <div style={{
        background: '#1e293b', padding: '40px', borderRadius: '12px',
        width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛡️</div>
          <h1 style={{ color: '#f1f5f9', fontSize: '22px', margin: '0' }}>SIRCE</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            Sistema de Inteligencia de Redes Criminales del Ecuador
          </p>
        </div>

        {error && (
          <div style={{
            background: '#7f1d1d', color: '#fca5a5', padding: '10px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '13px'
          }}>{error}</div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Correo institucional</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="usuario@sirce.gob.ec"
            style={{
              width: '100%', padding: '10px 12px', marginTop: '6px',
              background: '#0f172a', border: '1px solid #334155',
              borderRadius: '8px', color: '#f1f5f9', fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%', padding: '10px 12px', marginTop: '6px',
              background: '#0f172a', border: '1px solid #334155',
              borderRadius: '8px', color: '#f1f5f9', fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '12px', background: '#2563eb',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '15px', fontWeight: '500', cursor: 'pointer'
          }}
        >
          Ingresar al sistema
        </button>

        <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          Acceso restringido — Solo personal autorizado
        </p>
      </div>
    </div>
  );
}

export default Login;