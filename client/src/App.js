import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import Landing from "./components/Landing";
import Publicar from "./components/Publicar";
import BusquedaAvanzada from "./components/BusquedaAvanzada";
import Carrito from "./components/Carrito";
import Profile from "./components/Profile";
import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("Cargando...");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Publicar" element={<Publicar />} />
        <Route path="/Busqueda" element={<BusquedaAvanzada />} />
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;