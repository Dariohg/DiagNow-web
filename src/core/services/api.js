import axios from 'axios';

// Prefijo para localStorage
const PREFIX = 'diagnow_';

// Configuración del entorno
const API_URL = 'https://diagnow-api.onrender.com';
const USE_LOCAL_STORAGE = false;


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para generar IDs únicos
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Inicializar datos demo
const initDemoData = () => {
    // Verificar si ya existen datos
    const existingPatients = localStorage.getItem(`${PREFIX}patients`);
    if (!existingPatients) {
        const demoPatients = [
            { id: 'p1', name: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', phone: '555-1234', birthDate: '1985-05-15' },
            { id: 'p2', name: 'María', lastName: 'González', email: 'maria.gonzalez@example.com', phone: '555-5678', birthDate: '1990-10-20' },
            { id: 'p3', name: 'Carlos', lastName: 'Rodríguez', email: 'carlos.rodriguez@example.com', phone: '555-9012', birthDate: '1978-03-08' },
        ];
        localStorage.setItem(`${PREFIX}patients`, JSON.stringify(demoPatients));
    }

    const existingPrescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
    if (!existingPrescriptions) {
        const demoPrescriptions = [
            {
                id: 'rx1',
                patientId: 'p1',
                patientName: 'Juan Pérez',
                date: '2025-03-29',
                diagnosis: 'Gripe estacional',
                status: 'active',
                medications: [
                    { name: 'Paracetamol', dosage: '500mg', frequency: '8', days: '5' }
                ]
            },
            {
                id: 'rx2',
                patientId: 'p2',
                patientName: 'María González',
                date: '2025-03-28',
                diagnosis: 'Hipertensión arterial',
                status: 'active',
                medications: [
                    { name: 'Losartan', dosage: '50mg', frequency: '24', days: '30' }
                ]
            },
            {
                id: 'rx3',
                patientId: 'p1',
                patientName: 'Juan Pérez',
                date: '2025-03-25',
                diagnosis: 'Dolor lumbar',
                status: 'active',
                medications: [
                    { name: 'Diclofenaco', dosage: '100mg', frequency: '12', days: '7' }
                ]
            }
        ];
        localStorage.setItem(`${PREFIX}prescriptions`, JSON.stringify(demoPrescriptions));
    }
};

// Inicializar datos demo
if (USE_LOCAL_STORAGE) {
    initDemoData();
}


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(`${PREFIX}token`);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => {
        // Manejar errores de autenticación
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido
            authService.logout();
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
            localStorage.setItem(`${PREFIX}user`, JSON.stringify(newUser));

            // Generar token simulado
            const token = `demo_token_${Date.now()}`;
            localStorage.setItem(`${PREFIX}token`, token);

            // Delay simulado para imitar una petición real
            await new Promise(resolve => setTimeout(resolve, 600));

            return {
                data: {
                    user: newUser,
                    token: token
                }
            };
        }

        return api.post('/doctors/register', userData);
    },

    login: async (credentials) => {
        if (USE_LOCAL_STORAGE) {
            // Para facilitar pruebas, aceptamos cualquier email y contraseña
            const user = {
                id: 'demo_user',
                name: 'Usuario',
                lastName: 'Demo',
                email: credentials.email || 'demo@example.com'
            };

            // Guardar en local storage directamente
            localStorage.setItem(`${PREFIX}user`, JSON.stringify(user));
            const token = `demo_token_${Date.now()}`;
            localStorage.setItem(`${PREFIX}token`, token);

            // Delay simulado
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                data: {
                    user: user,
                    token: token
                }
            };
        }

        return api.post('/doctors/auth/login', credentials);
    },

    logout: () => {
        localStorage.removeItem(`${PREFIX}token`);
        localStorage.removeItem(`${PREFIX}user`);
    }
};

// Servicios para pacientes
export const patientService = {
    getPatients: async () => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorage.getItem(`${PREFIX}patients`);
            return {
                data: patients ? JSON.parse(patients) : []
            };
        }

        const response = await api.get('/patients');

        return {
            data: response.data.data.patients.map(patient => ({
                id: patient.id,
                name: patient.name,
                lastName: patient.last_name,
                email: patient.email,
                age: patient.age,
                height: patient.height,
                weight: patient.weight,
                birthDate: patient.created_at
            }))
        };
    },

    getPatientById: async (id) => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorage.getItem(`${PREFIX}patients`);
            const parsedPatients = patients ? JSON.parse(patients) : [];
            const patient = parsedPatients.find(p => p.id === id);

            if (!patient) {
                throw new Error('Paciente no encontrado');
            }

            return { data: patient };
        }

        return api.get(`/patients/${id}`);
    },

    createPatient: async (patientData) => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorage.getItem(`${PREFIX}patients`);
            const parsedPatients = patients ? JSON.parse(patients) : [];

            const newPatient = {
                ...patientData,
                id: generateId()
            };

            parsedPatients.push(newPatient);
            localStorage.setItem(`${PREFIX}patients`, JSON.stringify(parsedPatients));

            return { data: newPatient };
        }

        return api.post('/patients', patientData);
    },

    updatePatient: async (id, patientData) => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorage.getItem(`${PREFIX}patients`);
            const parsedPatients = patients ? JSON.parse(patients) : [];

            const index = parsedPatients.findIndex(p => p.id === id);

            if (index === -1) {
                throw new Error('Paciente no encontrado');
            }

            parsedPatients[index] = {
                ...patientData,
                id
            };

            localStorage.setItem(`${PREFIX}patients`, JSON.stringify(parsedPatients));

            return { data: parsedPatients[index] };
        }

        return api.put(`/patients/${id}`, patientData);
    },

    deletePatient: async (id) => {
        if (USE_LOCAL_STORAGE) {
            const patients = localStorage.getItem(`${PREFIX}patients`);
            const parsedPatients = patients ? JSON.parse(patients) : [];

            const filteredPatients = parsedPatients.filter(p => p.id !== id);

            localStorage.setItem(`${PREFIX}patients`, JSON.stringify(filteredPatients));

            return { status: 200 };
        }

        return api.delete(`/patients/${id}`);
    }
};

// Servicios para recetas médicas
export const prescriptionService = {
    createPrescription: async (prescriptionData) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            const parsedPrescriptions = prescriptions ? JSON.parse(prescriptions) : [];

            // Obtener detalles del paciente para nombre completo
            let patientName = prescriptionData.patientName;

            if (!patientName && prescriptionData.patientId) {
                const patients = localStorage.getItem(`${PREFIX}patients`);
                const parsedPatients = patients ? JSON.parse(patients) : [];
                const patient = parsedPatients.find(p => p.id === prescriptionData.patientId);

                if (patient) {
                    patientName = `${patient.name} ${patient.lastName}`;
                }
            }

            const newPrescription = {
                ...prescriptionData,
                id: generateId(),
                patientName,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            parsedPrescriptions.push(newPrescription);
            localStorage.setItem(`${PREFIX}prescriptions`, JSON.stringify(parsedPrescriptions));

            return { data: newPrescription };
        }

        try {
            // 1. Crear la receta
            const prescriptionPayload = {
                patientId: prescriptionData.patientId,
                diagnosis: prescriptionData.diagnosis,
                notes: prescriptionData.notes || ''
            };

            const response = await api.post('/prescriptions', prescriptionPayload);
            const newPrescription = response.data.data.prescription;

            // 2. Añadir los medicamentos uno por uno
            if (prescriptionData.medications && prescriptionData.medications.length > 0) {
                const medicationPromises = prescriptionData.medications
                    .filter(med => med.name.trim() !== '') // Filtrar medicamentos sin nombre
                    .map(med => {
                        const medicationPayload = {
                            prescriptionId: newPrescription.id,
                            name: med.name,
                            dosage: med.dosage || '',
                            frequency: med.frequency ? parseInt(med.frequency) : null,
                            days: med.days ? parseInt(med.days) : null,
                            administrationRoute: med.administrationRoute || '',
                            instructions: med.instructions || ''
                        };

                        return api.post('/medications', medicationPayload);
                    });

                // Esperar a que todos los medicamentos se añadan
                await Promise.all(medicationPromises);
            }

            // 3. Devolver la nueva receta con medicamentos
            return {
                data: {
                    ...newPrescription,
                    medications: prescriptionData.medications || []
                }
            };
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
        }    },

    getPrescriptions: async () => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            return {
                data: prescriptions ? JSON.parse(prescriptions) : []
            };
        }

        return api.get('/prescriptions');
    },

    getPatientPrescriptions: async (patientId) => {
        if (USE_LOCAL_STORAGE) {
            // Implementación localStorage (mantener para modo offline)
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            const parsedPrescriptions = prescriptions ? JSON.parse(prescriptions) : [];
            const patientPrescriptions = parsedPrescriptions.filter(p => p.patientId === patientId);
            return { data: patientPrescriptions };
        }

        // Usando el endpoint correcto
        try {
            const response = await api.get(`/prescriptions/patient/${patientId}`);

            // Transformar la respuesta al formato esperado
            const apiPrescriptions = response.data.data.prescriptions || [];
            return {
                data: apiPrescriptions.map(prescription => ({
                    id: prescription.id,
                    patientId: prescription.patientId || patientId,
                    diagnosis: prescription.diagnosis,
                    notes: prescription.notes,
                    date: prescription.createdAt,
                    status: "active",
                    medications: prescription.medications || []
                }))
            };
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            // En caso de error, devolver un array vacío para evitar errores en el componente
            return { data: [] };
        }
    },

    getPrescriptionById: async (id) => {
        if (USE_LOCAL_STORAGE) {
            // Implementación localStorage (mantener para modo offline)
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            const parsedPrescriptions = prescriptions ? JSON.parse(prescriptions) : [];
            const prescription = parsedPrescriptions.find(p => p.id === id);

            if (!prescription) {
                throw new Error('Receta no encontrada');
            }

            return { data: prescription };
        }

        // Llamada a la API real
        const response = await api.get(`/prescriptions/${id}`);

        // Transformar la respuesta
        const apiPrescription = response.data.data.prescription;
        return {
            data: {
                id: apiPrescription.id,
                patientId: apiPrescription.patientId,
                diagnosis: apiPrescription.diagnosis,
                notes: apiPrescription.notes,
                date: apiPrescription.createdAt,
                status: "active", // Asumiendo que todas son activas
                medications: apiPrescription.medications || []
            }
        };
    },

    updatePrescription: async (id, prescriptionData) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            const parsedPrescriptions = prescriptions ? JSON.parse(prescriptions) : [];

            const index = parsedPrescriptions.findIndex(p => p.id === id);

            if (index === -1) {
                throw new Error('Receta no encontrada');
            }

            parsedPrescriptions[index] = {
                ...parsedPrescriptions[index],
                ...prescriptionData,
                id
            };

            localStorage.setItem(`${PREFIX}prescriptions`, JSON.stringify(parsedPrescriptions));

            return { data: parsedPrescriptions[index] };
        }

        return api.put(`/prescriptions/${id}`, prescriptionData);
    },

    deletePrescription: async (id) => {
        if (USE_LOCAL_STORAGE) {
            const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
            const parsedPrescriptions = prescriptions ? JSON.parse(prescriptions) : [];

            const filteredPrescriptions = parsedPrescriptions.filter(p => p.id !== id);

            localStorage.setItem(`${PREFIX}prescriptions`, JSON.stringify(filteredPrescriptions));

            return { status: 200 };
        }

        return api.delete(`/prescriptions/${id}`);
    }
};

export default api;