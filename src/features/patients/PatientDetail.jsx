// src/features/patients/PatientDetail.jsx
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
    HStack,
    IconButton,
    Input,
    Select,
    SimpleGrid,
    Textarea,
    useToast,
    VStack,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    Center,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiArrowLeft, FiSave, FiFileText, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { patientService, prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const PatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    useEffect(() => {
        fetchPatientData();
    }, [id]);

    const fetchPatientData = async () => {
        try {
            setIsLoading(true);

            // Obtener datos del paciente
            const patientResponse = await patientService.getPatientById(id);
            setPatient(patientResponse.data);

            // Obtener recetas del paciente
            const prescriptionsResponse = await prescriptionService.getPatientPrescriptions(id);
            setPrescriptions(prescriptionsResponse.data || []);

        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información del paciente',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/patients');
        } finally {
            setIsLoading(false);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        lastName: Yup.string().required('El apellido es requerido'),
        email: Yup.string().email('Email inválido').required('El email es requerido'),
    });

    const formik = useFormik({
        initialValues: {
            name: patient?.name || '',
            lastName: patient?.lastName || '',
            email: patient?.email || '',
            phone: patient?.phone || '',
            birthDate: patient?.birthDate || '',
            gender: patient?.gender || '',
            address: patient?.address || '',
            allergies: patient?.allergies || '',
            medicalNotes: patient?.medicalNotes || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                await patientService.updatePatient(id, values);

                toast({
                    title: 'Paciente actualizado',
                    description: 'La información del paciente ha sido actualizada exitosamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                setIsEditing(false);
                fetchPatientData();
            } catch (error) {
                const errorMessage = error.message || 'Error al actualizar el paciente';

                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleDeletePatient = async () => {
        try {
            await patientService.deletePatient(id);

            toast({
                title: 'Paciente eliminado',
                description: 'El paciente ha sido eliminado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            navigate('/patients');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el paciente',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onClose();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                            onClick={() => navigate('/patients')}
                            aria-label="Volver"
                        />
                        <Heading as="h1" size="lg">
                            {isEditing ? 'Editar Paciente' : `Paciente: ${patient?.name} ${patient?.lastName}`}
                        </Heading>
                    </HStack>
                    <HStack spacing={2}>
                        {!isEditing ? (
                            <>
                                <Button
                                    leftIcon={<FiEdit />}
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    leftIcon={<FiTrash2 />}
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={onOpen}
                                >
                                    Eliminar
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to={`/prescriptions/new?patientId=${id}`}
                                    leftIcon={<FiFileText />}
                                    variant="primary"
                                >
                                    Nueva receta
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    leftIcon={<FiSave />}
                                    variant="primary"
                                    onClick={formik.handleSubmit}
                                    isLoading={isSubmitting}
                                >
                                    Guardar
                                </Button>
                            </>
                        )}
                    </HStack>
                </Flex>

                {/* Información del paciente */}
                <Card bg="gray.800" borderRadius="lg" boxShadow="md" mb={6}>
                    <CardHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Heading size="md">Información Personal</Heading>
                    </CardHeader>
                    <CardBody>
                        <Box as="form" onSubmit={formik.handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={formik.touched.lastName && formik.errors.lastName}>
                                    <FormLabel>Apellido</FormLabel>
                                    <Input
                                        name="lastName"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                    <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <Input
                                        name="birthDate"
                                        type="date"
                                        value={formik.values.birthDate}
                                        onChange={formik.handleChange}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Dirección</FormLabel>
                                    <Input
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        isReadOnly={!isEditing}
                                        bg={isEditing ? undefined : "gray.700"}
                                    />
                                </FormControl>

                                {isEditing && (
                                    <FormControl>
                                        <FormLabel>Género</FormLabel>
                                        <Select
                                            name="gender"
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                            <option value="otro">Otro</option>
                                        </Select>
                                    </FormControl>
                                )}
                            </SimpleGrid>
                        </Box>
                    </CardBody>
                </Card>

                {/* Recetas médicas */}
                <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Flex justify="space-between" align="center">
                            <Heading size="md">Recetas Médicas</Heading>
                            <Button
                                as={RouterLink}
                                to={`/prescriptions/new?patientId=${id}`}
                                leftIcon={<FiPlus />}
                                variant="primary"
                                size="sm"
                            >
                                Nueva receta
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {prescriptions.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Fecha</Th>
                                            <Th>Diagnóstico</Th>
                                            <Th>Estado</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {prescriptions.map((prescription) => (
                                            <Tr key={prescription.id}>
                                                <Td>{formatDate(prescription.date)}</Td>
                                                <Td>
                                                    <Text noOfLines={1}>{prescription.diagnosis}</Text>
                                                </Td>
                                                <Td>
                                                    <Badge colorScheme="green">
                                                        Activa
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={2}>
                                                        <IconButton
                                                            icon={<FiFileText />}
                                                            aria-label="Ver receta"
                                                            size="sm"
                                                            variant="ghost"
                                                            as={RouterLink}
                                                            to={`/prescriptions/${prescription.id}`}
                                                        />
                                                        <IconButton
                                                            icon={<FiTrash2 />}
                                                            aria-label="Eliminar receta"
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            onClick={() => {
                                                                prescriptionService.deletePrescription(prescription.id)
                                                                    .then(() => {
                                                                        fetchPatientData();
                                                                        toast({
                                                                            title: 'Receta eliminada',
                                                                            status: 'success',
                                                                            duration: 3000,
                                                                        });
                                                                    });
                                                            }}
                                                        />
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Box p={6} textAlign="center">
                                <Text color="gray.400" mb={4}>No hay recetas médicas registradas para este paciente</Text>
                                <Button
                                    as={RouterLink}
                                    to={`/prescriptions/new?patientId=${id}`}
                                    leftIcon={<FiPlus />}
                                    variant="primary"
                                    size="sm"
                                >
                                    Crear receta
                                </Button>
                            </Box>
                        )}
                    </CardBody>
                </Card>
            </Box>

            {/* Confirm Delete Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Paciente
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro que deseas eliminar este paciente? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleDeletePatient} ml={3}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </MainLayout>
    );
};

export default PatientDetail;