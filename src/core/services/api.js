// src/core/services/api.js
import axios from 'axios';
import { localStorageService } from './localStorage';

// Configuración del entorno
const isProduction = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true' || !isProduction;

// Inicializar datos demo si estamos en modo local
if (USE_LOCAL_STORAGE) {
    localStorageService.initDemoData();
}

// Configuración de Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptores de solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const authService = {
    register: async (userData) => {
        if (USE_LOCAL_STORAGE) {
            // Simular registro exitoso
            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                lastName: userData.lastName,
                email: userData.email,
            };

            // Almacenar user (simulando un usuario registrado)
            localStorageService.saveUser(newUser);

            // Generar token simulado
            const token = `demo_token_${Date.now()}`;
            localStorageService.saveToken(token);

            // Delay simulado para imitar una petición real
            await new Promise(resolve => setTimeout(resolve, 600));

            return Promise.resolve({
                data: {
                    user: newUser,
                    token: token
                }
            });
        }

        return api.post('/auth/register', userData);
    },

    login: async (credentials) => {
        if (USE_LOCAL_STORAGE) {
            // En un caso real verificaríamos credenciales
            // Aquí simplemente validamos que el email termine en @ejemplo.com para demo
            if (!credentials.email.endsWith('@ejemplo.com') && !credentials.email.endsWith('@example.com')) {
                return Promise.reject({
                    response: {
                        status: 401,
                        data: { message: 'Credenciales inválidas' }
                    }
                });
            }

            const user = {
                id: 'demo_user',
                name: 'Usuario',
                lastName: 'Demo',
                email: credentials.email
            };

            // Guardar en local storage
            localStorageService.saveUser(user);
            const token = `demo_token_${Date.now()}`;
            localStorageService.saveToken(token);

            return Promise.resolve({
                data: {
                    user: user,
                    token: token
                }
            });
        }

        return api.post('/auth/login', credentials);
    },

    logout: () => {
        localStorageService.removeToken();
        localStorageService.removeUser();
    }
};

// Servicios para pacientes
export const patientService = {
    getPatients: async () => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorageService.getPatients();
            return Promise.resolve({ data: patients });
        }

        return api.get('/patients');
    },

    getPatientById: async (id) => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorageService.getPatients();
            const patient = patients.find(p => p.id === id);

            if (!patient) {
                return Promise.reject({
                    response: {
                        status: 404,
                        data: { message: 'Paciente no encontrado' }
                    }
                });
            }

            return Promise.resolve({ data: patient });
        }

        return api.get(`/patients/${id}`);
    },

    createPatient: async (patientData) => {
        if (USE_LOCAL_STORAGE) {
            const newPatient = localStorageService.addPatient(patientData);
            return Promise.resolve({ data: newPatient });
        }

        return api.post('/patients', patientData);
    },

    updatePatient: async (id, patientData) => {
        if (USE_LOCAL_STORAGE) {
            const updatedPatient = localStorageService.updatePatient(id, patientData);

            if (!updatedPatient) {
                return Promise.reject({
                    response: {
                        status: 404,
                        data: { message: 'Paciente no encontrado' }
                    }
                });
            }

            return Promise.resolve({ data: updatedPatient });
        }

        return api.put(`/patients/${id}`, patientData);
    },

    deletePatient: async (id) => {
        if (USE_LOCAL_STORAGE) {
            localStorageService.deletePatient(id);
            return Promise.resolve({ status: 200 });
        }

        return api.delete(`/patients/${id}`);
    }
};

// Servicios para recetas médicas
export const prescriptionService = {
    createPrescription: async (prescriptionData) => {
        if (USE_LOCAL_STORAGE) {
            // Obtener detalles del paciente para nombre completo
            let patientName = prescriptionData.patientName;

            if (!patientName && prescriptionData.patientId) {
                const patients = localStorageService.getPatients();
                const patient = patients.find(p => p.id === prescriptionData.patientId);
                if (patient) {
                    patientName = `${patient.name} ${patient.lastName}`;
                }
            }

            const newPrescription = localStorageService.addPrescription({
                ...prescriptionData,
                patientName,
                status: 'active',
                createdAt: new Date().toISOString()
            });

            return Promise.resolve({ data: newPrescription });
        }

        return api.post('/prescriptions', prescriptionData);
    },

    getPrescriptions: async () => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorageService.getPrescriptions();
            return Promise.resolve({ data: prescriptions });
        }

        return api.get('/prescriptions');
    },

    getPrescriptionById: async (id) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorageService.getPrescriptions();
            const prescription = prescriptions.find(p => p.id === id);

            if (!prescription) {
                return Promise.reject({
                    response: {
                        status: 404,
                        data: { message: 'Receta no encontrada' }
                    }
                });
            }

            return Promise.resolve({ data: prescription });
        }

        return api.get(`/prescriptions/${id}`);
    },

    getPatientPrescriptions: async (patientId) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorageService.getPrescriptionsByPatient(patientId);
            return Promise.resolve({ data: prescriptions });
        }

        return api.get(`/prescriptions/patient/${patientId}`);
    },

    updatePrescription: async (id, prescriptionData) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorageService.getPrescriptions();
            const index = prescriptions.findIndex(p => p.id === id);

            if (index === -1) {
                return Promise.reject({
                    response: {
                        status: 404,
                        data: { message: 'Receta no encontrada' }
                    }
                });
            }

            const updatedPrescription = {
                ...prescriptions[index],
                ...prescriptionData,
                id
            };

            prescriptions[index] = updatedPrescription;
            localStorageService.savePrescriptions(prescriptions);

            return Promise.resolve({ data: updatedPrescription });
        }

        return api.put(`/prescriptions/${id}`, prescriptionData);
    },

    deletePrescription: async (id) => {
        if (USE_LOCAL_STORAGE) {
            localStorageService.deletePrescription(id);
            return Promise.resolve({ status: 200 });
        }

        return api.delete(`/prescriptions/${id}`);
    }
};

export default api;