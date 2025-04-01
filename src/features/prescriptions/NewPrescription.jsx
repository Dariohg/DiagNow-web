    import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
    IconButton,
    useToast,
    Divider,
    Text,
    SimpleGrid,
    Badge,
    Spinner,
    Center,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiPlus, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi';
import { patientService, prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const NewPrescription = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medications, setMedications] = useState([
        {
            id: 1,
            name: '',
            dosage: '',
            administrationRoute: '',
            frequency: '',
            days: ''
        }
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdFromUrl = searchParams.get('patientId');
    const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (patientIdFromUrl && patients.length > 0) {
            const patient = patients.find(p => p.id === patientIdFromUrl);
            if (patient) {
                setSelectedPatient(patient);
                formik.setFieldValue('patientId', patientIdFromUrl);
            }
        }
    }, [patientIdFromUrl, patients]);

    const fetchPatients = async () => {
        try {
            setIsLoading(true);
            const response = await patientService.getPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los pacientes',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validationSchema = Yup.object({
        patientId: Yup.string().required('Selecciona un paciente'),
        date: Yup.date().required('La fecha es requerida'),
        diagnosis: Yup.string().required('El diagnóstico es requerido'),
        notes: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            patientId: patientIdFromUrl || '',
            date: currentDate,
            diagnosis: '',
            notes: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsSaving(true);

                // Validar que haya al menos un medicamento con datos
                const hasValidMedications = medications.some(
                    med => med.name.trim() !== '' && med.dosage.trim() !== ''
                );

                if (!hasValidMedications) {
                    toast({
                        title: 'Error',
                        description: 'Debes agregar al menos un medicamento con nombre y dosis',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return;
                }

                // Construir el objeto de receta
                const prescriptionData = {
                    ...values,
                    medications: medications.filter(med => med.name.trim() !== ''),
                };

                // En un entorno real, enviaríamos la receta al backend
                await prescriptionService.createPrescription(prescriptionData);

                toast({
                    title: 'Receta creada',
                    description: 'La receta ha sido creada exitosamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                if (patientIdFromUrl) {
                    navigate(`/patients/${patientIdFromUrl}`);
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error creating prescription:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudo guardar la receta',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsSaving(false);
            }
        },
    });

    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        formik.setFieldValue('patientId', patientId);

        if (patientId) {
            const patient = patients.find(p => p.id === patientId);
            setSelectedPatient(patient);
        } else {
            setSelectedPatient(null);
        }
    };

    const handleAddMedication = () => {
        setMedications([
            ...medications,
            {
                id: Date.now(), // Usar timestamp como ID temporal
                name: '',
                dosage: '',
                administrationRoute: '',
                frequency: '',
                days: ''
            }
        ]);
    };

    const handleRemoveMedication = (id) => {
        if (medications.length > 1) {
            setMedications(medications.filter(med => med.id !== id));
        }
    };

    const handleMedicationChange = (id, field, value) => {
        setMedications(
            medications.map(med =>
                med.id === id ? { ...med, [field]: value } : med
            )
        );
    };

    if (isLoading) {
        return (
            <MainLayout>
                <Center h="50vh">
                    <Spinner size="xl" color="brand.500" />
                </Center>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', md: 'center' }}
                    mb={6}
                >
                    <HStack spacing={2}>
                        <IconButton
                            icon={<FiArrowLeft />}
                            variant="ghost"
                            onClick={() => patientIdFromUrl ? navigate(`/patients/${patientIdFromUrl}`) : navigate('/dashboard')}
                            aria-label="Volver"
                        />
                        <Heading as="h1" size="lg">
                            Nueva receta médica
                        </Heading>
                    </HStack>
                </Flex>

                <Box as="form" onSubmit={formik.handleSubmit}>
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
                        <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                            <CardHeader>
                                <Heading size="md">Información de la receta</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <FormControl isInvalid={formik.touched.patientId && formik.errors.patientId}>
                                        <FormLabel>Seleccionar paciente</FormLabel>
                                        <Select
                                            name="patientId"
                                            placeholder="Seleccionar paciente"
                                            value={formik.values.patientId}
                                            onChange={handlePatientChange}
                                            onBlur={formik.handleBlur}
                                            isDisabled={!!patientIdFromUrl}
                                        >
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.name} {patient.lastName}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormErrorMessage>{formik.errors.patientId}</FormErrorMessage>
                                    </FormControl>

                                    {selectedPatient && (
                                        <Box bg="gray.700" p={4} borderRadius="md">
                                            <Text fontWeight="bold" mb={2}>Información del paciente:</Text>
                                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                                <GridItem>
                                                    <Text fontSize="sm" color="gray.400">Nombre:</Text>
                                                    <Text>{selectedPatient.name} {selectedPatient.lastName}</Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text fontSize="sm" color="gray.400">Email:</Text>
                                                    <Text>{selectedPatient.email}</Text>
                                                </GridItem>
                                                <GridItem>
                                                    <Text fontSize="sm" color="gray.400">Estado:</Text>
                                                    <Badge colorScheme="green">Activo</Badge>
                                                </GridItem>
                                            </Grid>
                                        </Box>
                                    )}

                                    <FormControl isInvalid={formik.touched.date && formik.errors.date}>
                                        <FormLabel>Fecha de receta</FormLabel>
                                        <Input
                                            name="date"
                                            type="date"
                                            value={formik.values.date}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={formik.touched.diagnosis && formik.errors.diagnosis}>
                                        <FormLabel>Diagnóstico</FormLabel>
                                        <Textarea
                                            name="diagnosis"
                                            placeholder="Ingrese el diagnóstico del paciente"
                                            value={formik.values.diagnosis}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            rows={4}
                                        />
                                        <FormErrorMessage>{formik.errors.diagnosis}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Notas / Comentarios</FormLabel>
                                        <Textarea
                                            name="notes"
                                            placeholder="Notas adicionales (opcional)"
                                            value={formik.values.notes}
                                            onChange={formik.handleChange}
                                            rows={3}
                                        />
                                    </FormControl>
                                </VStack>
                            </CardBody>
                        </Card>

                        <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                            <CardHeader>
                                <Flex justify="space-between" align="center">
                                    <Heading size="md">Medicamentos</Heading>
                                    <Button
                                        leftIcon={<FiPlus />}
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleAddMedication}
                                    >
                                        Agregar medicamento
                                    </Button>
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={6} align="stretch">
                                    {medications.map((medication, index) => (
                                        <Box key={medication.id}>
                                            {index > 0 && <Divider my={4} />}
                                            <Flex justify="space-between" align="center" mb={3}>
                                                <Text fontWeight="medium">Medicamento {index + 1}</Text>
                                                {medications.length > 1 && (
                                                    <IconButton
                                                        icon={<FiTrash2 />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        onClick={() => handleRemoveMedication(medication.id)}
                                                        aria-label="Eliminar medicamento"
                                                    />
                                                )}
                                            </Flex>
                                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                                <FormControl>
                                                    <FormLabel>Nombre del medicamento</FormLabel>
                                                    <Input
                                                        value={medication.name}
                                                        placeholder="Ej: Paracetamol"
                                                        onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Dosis</FormLabel>
                                                    <Input
                                                        value={medication.dosage}
                                                        placeholder="Ej: 500mg"
                                                        onChange={(e) => handleMedicationChange(medication.id, 'dosage', e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Vía de administración</FormLabel>
                                                    <Select
                                                        value={medication.administrationRoute}
                                                        placeholder="Seleccionar vía"
                                                        onChange={(e) => handleMedicationChange(medication.id, 'administrationRoute', e.target.value)}
                                                    >
                                                        <option value="oral">Oral</option>
                                                        <option value="intravenosa">Intravenosa</option>
                                                        <option value="intramuscular">Intramuscular</option>
                                                        <option value="subcutánea">Subcutánea</option>
                                                        <option value="tópica">Tópica</option>
                                                        <option value="inhalada">Inhalada</option>
                                                        <option value="rectal">Rectal</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Frecuencia (horas)</FormLabel>
                                                    <NumberInput min={1} max={24}>
                                                        <NumberInputField
                                                            value={medication.frequency}
                                                            placeholder="Ej: 8"
                                                            onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                                                        />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Cantidad de días</FormLabel>
                                                    <NumberInput min={1} max={365}>
                                                        <NumberInputField
                                                            value={medication.days}
                                                            placeholder="Ej: 7"
                                                            onChange={(e) => handleMedicationChange(medication.id, 'days', e.target.value)}
                                                        />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </FormControl>
                                            </SimpleGrid>
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    </SimpleGrid>

                    <Flex justify="flex-end" mt={4}>
                        <HStack spacing={4}>
                            <Button variant="ghost" onClick={() => patientIdFromUrl ? navigate(`/patients/${patientIdFromUrl}`) : navigate('/dashboard')}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                leftIcon={<FiSave />}
                                isLoading={isSaving}
                                loadingText="Guardando..."
                            >
                                Guardar receta
                            </Button>
                        </HStack>
                    </Flex>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default NewPrescription;