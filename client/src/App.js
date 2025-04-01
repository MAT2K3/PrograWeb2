import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("Cargando...");

  return (
    <Router>
      <Routes>
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;