import { Link, NavLink, Route, Routes } from 'react-router';
import Contador from './01-basico/Contador.jsx';
import FormularioRegistro from './01-basico/FormularioRegistro.jsx';
import ListaTareas from './01-basico/ListaTareas.jsx';
import TablaProductos from './02-intermedio/TablaProductos.jsx';
import Login from './03-avanzado/Login.jsx';
import Perfil from './03-avanzado/Perfil.jsx';
import RutaProtegida from './03-avanzado/RutaProtegida.jsx';
import { useAuth } from './03-avanzado/useAuth.js';

// El menú y las rutas de los ejercicios
export default function App() {
  const { usuario } = useAuth();

  return (
    <>
      <header className="encabezado">
        <Link to="/" className="marca">
          Ejercicios de React
        </Link>
        <nav className="menu">
          <NavLink to="/contador">Contador</NavLink>
          <NavLink to="/tareas">Tareas</NavLink>
          <NavLink to="/formulario">Formulario</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
        </nav>
        <span className="sesion">{usuario ? `Sesión: ${usuario.nombre}` : 'Sin sesión'}</span>
      </header>

      <main className="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/contador" element={<Contador />} />
          <Route path="/tareas" element={<ListaTareas />} />
          <Route path="/formulario" element={<FormularioRegistro />} />
          <Route path="/productos" element={<TablaProductos />} />
          <Route path="/login" element={<Login />} />
          {/* Ruta protegida: si no hay sesión, RutaProtegida manda al login */}
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}

// La página de inicio, con un enlace a cada ejercicio
function Inicio() {
  const ejercicios = [
    { ruta: '/contador', nivel: 'Básico', clase: 'basico', nombre: 'Contador', que: 'useState y eventos: sumar, restar y reiniciar' },
    { ruta: '/tareas', nivel: 'Básico', clase: 'basico', nombre: 'Lista de tareas', que: 'Listas con key, agregar, marcar y borrar' },
    { ruta: '/formulario', nivel: 'Básico', clase: 'basico', nombre: 'Formulario controlado', que: 'Cada campo vive en el estado y se revisa al enviar' },
    { ruta: '/productos', nivel: 'Intermedio', clase: 'intermedio', nombre: 'Tabla de productos', que: 'useEffect pide GET /productos, con carga y error' },
    { ruta: '/perfil', nivel: 'Avanzado', clase: 'avanzado', nombre: 'useApi y ruta protegida', que: 'Login, token en el contexto y una página que pide sesión' },
  ];

  return (
    <section className="tarjeta">
      <h1>Ejercicios del día 11</h1>
      <ul className="lista-ejercicios">
        {ejercicios.map((ejercicio) => (
          <li key={ejercicio.ruta}>
            <span className={`nivel nivel-${ejercicio.clase}`}>{ejercicio.nivel}</span>
            <Link to={ejercicio.ruta}>{ejercicio.nombre}</Link>
            <span className="ayuda">{ejercicio.que}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NoEncontrada() {
  return (
    <section className="tarjeta">
      <h1>Esta página no existe</h1>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
