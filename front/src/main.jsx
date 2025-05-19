import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch cambia a Routes
import { Login, RegisterClient, RegisterProf, RoleSelection } from './pages/pages.jsx';
const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes> {/* Switch cambia a Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/roleSelection" element={<RoleSelection />} />
      <Route path='/registerClient' element={<RegisterClient />} />
      <Route path='/registerProf' element={<RegisterProf />}/>
    </Routes>
  </Router>
);
