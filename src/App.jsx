import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Pages
import Landing from './features/landing/Landing';
import Dashboard from './features/patients/Dashboard';
import PatientDetail from './features/patients/PatientDetail';
import NewPrescription from './features/prescriptions/NewPrescription';
import PrescriptionDetail from './features/prescriptions/PrescriptionDetail.jsx';

function App() {
    // Actualizar el título de la página
    useEffect(() => {
        document.title = 'DiagNow - Sistema de Gestión Médica';
    }, []);

    return (
        <AuthProvider>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patients/:id"
                    element={
                        <ProtectedRoute>
                            <PatientDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/prescriptions/new"
                    element={
                        <ProtectedRoute>
                            <NewPrescription />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/prescriptions/:id"
                    element={
                        <ProtectedRoute>
                            <PrescriptionDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/prescriptions/edit/:id"
                    element={
                        <ProtectedRoute>
                            <NewPrescription />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;