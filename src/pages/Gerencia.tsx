
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedGerencia } from '@/components/ProtectedGerencia';
import AnalisisFinanciero from './AnalisisFinanciero';
import GastosFijos from './GastosFijos';
import Reportes from './Reportes';

const Gerencia = () => {
  return (
    <ProtectedGerencia>
      <Routes>
        <Route path="/" element={<Navigate to="/gerencia/analisis-financiero" replace />} />
        <Route path="/analisis-financiero" element={<AnalisisFinanciero />} />
        <Route path="/gastos-fijos" element={<GastosFijos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </ProtectedGerencia>
  );
};

export default Gerencia;
