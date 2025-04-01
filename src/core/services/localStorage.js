const PREFIX = 'diagnow_';

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const localStorageService = {
    // Patients
    getPatients: () => {
        const patients = localStorage.getItem(`${PREFIX}patients`);
        return patients ? JSON.parse(patients) : [];
    },

    savePatients: (patients) => {
        localStorage.setItem(`${PREFIX}patients`, JSON.stringify(patients));
    },

    addPatient: (patient) => {
        const patients = localStorageService.getPatients();
        const newPatient = { ...patient, id: generateId() };
        patients.push(newPatient);
        localStorageService.savePatients(patients);
        return newPatient;
    },

    updatePatient: (id, updatedPatient) => {
        const patients = localStorageService.getPatients();
        const index = patients.findIndex(p => p.id === id);
        if (index !== -1) {
            patients[index] = { ...updatedPatient, id };
            localStorageService.savePatients(patients);
            return patients[index];
        }
        return null;
    },

    deletePatient: (id) => {
        const patients = localStorageService.getPatients();
        const filteredPatients = patients.filter(p => p.id !== id);
        localStorageService.savePatients(filteredPatients);
    },

    // Prescriptions
    getPrescriptions: () => {
        const prescriptions = localStorage.getItem(`${PREFIX}prescriptions`);
        return prescriptions ? JSON.parse(prescriptions) : [];
    },

    savePrescriptions: (prescriptions) => {
        localStorage.setItem(`${PREFIX}prescriptions`, JSON.stringify(prescriptions));
    },

    addPrescription: (prescription) => {
        const prescriptions = localStorageService.getPrescriptions();
        const newPrescription = { ...prescription, id: generateId() };
        prescriptions.push(newPrescription);
        localStorageService.savePrescriptions(prescriptions);
        return newPrescription;
    },

    getPrescriptionsByPatient: (patientId) => {
        const prescriptions = localStorageService.getPrescriptions();
        return prescriptions.filter(p => p.patientId === patientId);
    },

    deletePrescription: (id) => {
        const prescriptions = localStorageService.getPrescriptions();
        const filteredPrescriptions = prescriptions.filter(p => p.id !== id);
        localStorageService.savePrescriptions(filteredPrescriptions);
    },

    // Auth related
    saveToken: (token) => {
        localStorage.setItem(`${PREFIX}token`, token);
    },

    getToken: () => {
        return localStorage.getItem(`${PREFIX}token`);
    },

    removeToken: () => {
        localStorage.removeItem(`${PREFIX}token`);
    },

    saveUser: (user) => {
        localStorage.setItem(`${PREFIX}user`, JSON.stringify(user));
    },

    getUser: () => {
        const user = localStorage.getItem(`${PREFIX}user`);
        return user ? JSON.parse(user) : null;
    },

    removeUser: () => {
        localStorage.removeItem(`${PREFIX}user`);
    },

    // Initialize demo data
    initDemoData: () => {
        // Check if data already exists
        if (localStorageService.getPatients().length === 0) {
            const demoPatients = [
                { id: 'p1', name: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com' },
                { id: 'p2', name: 'María', lastName: 'González', email: 'maria.gonzalez@example.com' },
                { id: 'p3', name: 'Carlos', lastName: 'Rodríguez', email: 'carlos.rodriguez@example.com' },
            ];
            localStorageService.savePatients(demoPatients);
        }

        if (localStorageService.getPrescriptions().length === 0) {
            const demoPrescriptions = [
                {
                    id: 'rx1',
                    patientId: 'p1',
                    patientName: 'Juan Pérez',
                    date: '2025-03-29',
                    diagnosis: 'Gripe estacional',
                    status: 'active',
                    medications: [
                        { name: 'Paracetamol', dosage: '500mg', administrationRoute: 'oral', frequency: '8', days: '5' }
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
                        { name: 'Losartan', dosage: '50mg', administrationRoute: 'oral', frequency: '24', days: '30' }
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
                        { name: 'Diclofenaco', dosage: '100mg', administrationRoute: 'oral', frequency: '12', days: '7' },
                        { name: 'Metocarbamol', dosage: '750mg', administrationRoute: 'oral', frequency: '8', days: '5' }
                    ]
                }
            ];
            localStorageService.savePrescriptions(demoPrescriptions);
        }
    },

    clearAll: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};

export default localStorageService;