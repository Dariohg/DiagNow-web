import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Pages
import Landing from './features/landing/Landing';
import Dashboard from './features/patients/Dashboard';
import PatientsList from './features/patients/PatientsList';
import PrescriptionsList from './features/prescriptions/PrescriptionsList';
import NewPrescription from './features/prescriptions/NewPrescription';

function App() {
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
                    path="/patients"
                    element={
                        <ProtectedRoute>
                            <PatientsList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/prescriptions"
                    element={
                        <ProtectedRoute>
                            <PrescriptionsList />
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

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;