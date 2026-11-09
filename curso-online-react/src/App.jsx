import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiService } from './services/api.service';

export default function App() {
  const [modoAuth, setModoAuth] = useState('login'); // 'login', 'registro', 'verificar'
  const [mensaje, setMensaje] = useState('');

  // Estados de Formularios
  const [formLogin, setFormLogin] = useState({ correo: '', contrasena: '' });
  const [formReg, setFormReg] = useState({ cedula: '', nombre: '', correo: '', contrasena: '', rol: 'ESTUDIANTE' });
  const [verifData, setVerifData] = useState({ correo: '', codigo: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.iniciarSesion(formLogin);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol);
      localStorage.setItem('nombre', res.data.nombre);
      
      const rol = res.data.rol;
      if (rol === 'ADMIN') window.location.href = '/admin';
      else if (rol === 'PROFESOR') window.location.href = '/profesor';
      else if (rol === 'ESTUDIANTE') window.location.href = '/estudiante';

    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await apiService.registrarUsuario(formReg);
      setMensaje('¡Registro exitoso! Revisa tu correo e introduce el código de 6 dígitos.');
      setVerifData({ correo: formReg.correo, codigo: '' });
      setModoAuth('verificar');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error en el registro.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await apiService.verificarCuenta(verifData);
      setMensaje('¡Cuenta verificada con éxito! Pendiente de aprobación del Administrador.');
      setModoAuth('login');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Código incorrecto.');
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 m-0 overflow-hidden">
      <div className="row h-100 g-0">
        
        {/* COLUMNA IZQUIERDA: Banner azul corporativo con degradado */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative overflow-hidden" 
             style={{ 
               background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' 
             }}>
          
          {/* Logo y Marca */}
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">🎓</span>
            <h3 className="fw-bold fs-4 mb-0 tracking-wide text-white">CursoOnline</h3>
          </div>

          {/* Contenido Central de Bienvenida */}
          <div className="my-auto pe-lg-5" style={{ maxWidth: '480px' }}>
            <div className="mb-3">
              <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-25 px-3 py-2 rounded-pill fw-normal small">
                Plataforma Educativa V1.0
              </span>
            </div>
            <h1 className="display-5 fw-bold mb-3 lh-sm">
              Bienvenido a <br />CursoOnline 👋
            </h1>
            <p className="fs-6 text-white-50 lh-base mb-0">
              Gestiona tus materias, automatiza inscripciones de alumnos y mantén el control total de tu entorno académico integrado con Spring Boot y React.
            </p>
          </div>

          {/* Pie de página del banner */}
          <div>
            <small className="text-white-50">© 2026 CursoOnline • Todos los derechos reservados.</small>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formularios limpios y minimalistas */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center bg-white p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            
            <div className="mb-4">
              <h2 className="fw-bold text-dark mb-1">
                {modoAuth === 'login' && 'Welcome Back!'}
                {modoAuth === 'registro' && 'Crea tu cuenta'}
                {modoAuth === 'verificar' && 'Verifica tu correo'}
              </h2>
              <p className="text-muted small">
                {modoAuth === 'login' && <>¿No tienes una cuenta? <span className="text-primary fw-bold" role="button" onClick={() => setModoAuth('registro')}>Regístrate ahora</span></>}
                {modoAuth === 'registro' && <>¿Ya tienes una cuenta? <span className="text-primary fw-bold" role="button" onClick={() => setModoAuth('login')}>Inicia sesión</span></>}
                {modoAuth === 'verificar' && 'Introduce el código de 6 dígitos enviado a tu correo.'}
              </p>
            </div>

            {mensaje && <div className="alert alert-info py-2 small text-center">{mensaje}</div>}

            {/* Formulario de Login */}
            {modoAuth === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Correo electrónico</label>
                  <input className="form-control" type="email" placeholder="nombre@correo.com" value={formLogin.correo} onChange={e => setFormLogin({...formLogin, correo: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Contraseña</label>
                  <input className="form-control" type="password" placeholder="••••••••" value={formLogin.contrasena} onChange={e => setFormLogin({...formLogin, contrasena: e.target.value})} required />
                </div>
                <button className="btn btn-dark w-100 py-2 fw-bold mb-3 shadow-sm" type="submit">Iniciar Sesión</button>
                
                {/* 👇 ENLACE RÁPIDO AGREGADO AQUÍ 👇 */}
                <div className="text-center mt-3">
                  <span 
                    className="text-muted small" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setVerifData({ correo: formLogin.correo, codigo: '' }); // Opcional: arrastra el correo si ya lo escribió
                      setModoAuth('verificar');
                    }}>
                    ¿Ya te registraste y necesitas <span className="text-primary fw-bold text-decoration-underline">verificar tu cuenta</span>?
                  </span>
                </div>
              </form>
            )}

            {/* Formulario de Registro */}
            {modoAuth === 'registro' && (
              <form onSubmit={handleRegister}>
                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted">Cédula</label>
                  <input className="form-control" placeholder="10 dígitos" value={formReg.cedula} onChange={e => setFormReg({...formReg, cedula: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted">Nombre completo</label>
                  <input className="form-control" placeholder="Ej. Juan Pérez" value={formReg.nombre} onChange={e => setFormReg({...formReg, nombre: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted">Correo electrónico</label>
                  <input className="form-control" type="email" placeholder="nombre@correo.com" value={formReg.correo} onChange={e => setFormReg({...formReg, correo: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted">Contraseña</label>
                  <input className="form-control" type="password" placeholder="••••••••" value={formReg.contrasena} onChange={e => setFormReg({...formReg, contrasena: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Rol en la plataforma</label>
                  <select className="form-select" value={formReg.rol} onChange={e => setFormReg({...formReg, rol: e.target.value})}>
                    <option value="ESTUDIANTE">ESTUDIANTE</option>
                    <option value="PROFESOR">PROFESOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <button className="btn btn-success w-100 py-2 fw-bold mb-3 shadow-sm" type="submit">Registrarse</button>
              </form>
            )}

            {/* Formulario de Verificación */}
            {modoAuth === 'verificar' && (
              <form onSubmit={handleVerify}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Tu Correo</label>
                  <input className="form-control" value={verifData.correo} onChange={e => setVerifData({...verifData, correo: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Código de verificación</label>
                  <input className="form-control text-center fs-4" placeholder="123456" value={verifData.codigo} onChange={e => setVerifData({...verifData, codigo: e.target.value})} required />
                </div>
                <button className="btn btn-warning w-100 py-2 fw-bold text-dark mb-3 shadow-sm" type="submit">Verificar Cuenta</button>
                <div className="text-center">
                  <span className="text-primary small fw-bold" role="button" onClick={() => setModoAuth('login')}>Regresar al Login</span>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}