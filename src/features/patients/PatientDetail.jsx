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
    Heading,
    HStack,
    IconButton,
    Input,
    SimpleGrid,
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
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import { useNavigate, useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const PatientDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    // Usar datos pasados por navigate o usar localStorage como respaldo
    useEffect(() => {
        // Si tenemos los datos del paciente en el estado de navegación, úsalos
        if (location.state?.patient) {
            setPatient(location.state.patient);
            fetchPrescriptions(id);
        } else {
            // Si no tenemos los datos, intentamos obtenerlos del localStorage (para mantener compatibilidad)
            const localPatients = localStorage.getItem('diagnow_patients');
            if (localPatients) {
                const parsedPatients = JSON.parse(localPatients);
                const foundPatient = parsedPatients.find(p => p.id === id);

                if (foundPatient) {
                    setPatient(foundPatient);
                    fetchPrescriptions(id);
                } else {
                    setError('No se encontró información del paciente');
                    setIsLoading(false);
                }
            } else {
                // No tenemos datos ni en state ni en localStorage
                setError('No se encontró información del paciente. Regresa al dashboard e intenta nuevamente.');
                setIsLoading(false);
            }
        }
    }, [id, location.state]);

    // Función separada para obtener solo prescripciones
    const fetchPrescriptions = async (patientId) => {
        try {
            const response = await prescriptionService.getPatientPrescriptions(patientId);
            setPrescriptions(response.data || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setError('No se pudieron cargar las recetas médicas del paciente');
            setIsLoading(false);

            toast({
                title: 'Error',
                description: 'No se pudieron cargar las recetas médicas',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        fetchPrescriptions(id);
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

    if (error) {
        return (
            <MainLayout>
                <Box mb={4}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={() => navigate('/dashboard')}
                        aria-label="Volver"
                    />
                </Box>
                <Alert status="error" mb={6} borderRadius="md">
                    <AlertIcon />
                    <AlertTitle>Error:</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                    leftIcon={<FiArrowLeft />}
                    onClick={() => navigate('/dashboard')}
                    variant="primary"
                >
                    Volver al Dashboard
                </Button>
            </MainLayout>
        );
    }

    // El resto del componente sigue igual, usando la variable patient para mostrar los datos
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
                            onClick={() => navigate('/dashboard')}
                            aria-label="Volver"
                        />
                        <Heading as="h1" size="lg">
                            {patient?.name} {patient?.lastName}
                        </Heading>
                    </HStack>
                    <Button
                        as={RouterLink}
                        to={`/prescriptions/new?patientId=${id}`}
                        leftIcon={<FiPlus />}
                        variant="primary"
                    >
                        Crear receta
                    </Button>
                </Flex>

                {/* Información del paciente */}
                <Card bg="gray.800" borderRadius="lg" boxShadow="md" mb={6}>
                    <CardHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Heading size="md">Información Personal</Heading>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                            <Box>
                                <FormControl>
                                    <FormLabel>Nombre completo</FormLabel>
                                    <Input
                                        value={`${patient.name} ${patient.lastName}`}
                                        isReadOnly
                                        bg="gray.700"
                                    />
                                </FormControl>
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel>Edad</FormLabel>
                                    <Input
                                        value={patient.age ? `${patient.age} años` : 'N/A'}
                                        isReadOnly
                                        bg="gray.700"
                                    />
                                </FormControl>
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        value={patient.email}
                                        isReadOnly
                                        bg="gray.700"
                                    />
                                </FormControl>
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel>Altura</FormLabel>
                                    <Input
                                        value={patient.height ? `${patient.height} cm` : 'N/A'}
                                        isReadOnly
                                        bg="gray.700"
                                    />
                                </FormControl>
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel>Peso</FormLabel>
                                    <Input
                                        value={patient.weight ? `${patient.weight} kg` : 'N/A'}
                                        isReadOnly
                                        bg="gray.700"
                                    />
                                </FormControl>
                            </Box>
                        </SimpleGrid>
                    </CardBody>
                </Card>

                {/* Recetas médicas */}
                <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Flex justify="space-between" align="center">
                            <Heading size="md">Recetas Médicas</Heading>
                            <HStack>
                                <IconButton
                                    icon={<FiRefreshCw />}
                                    aria-label="Recargar recetas"
                                    size="sm"
                                    onClick={handleRefresh}
                                />
                                <Button
                                    as={RouterLink}
                                    to={`/prescriptions/new?patientId=${id}`}
                                    leftIcon={<FiPlus />}
                                    variant="primary"
                                    size="sm"
                                >
                                    Nueva receta
                                </Button>
                            </HStack>
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
                                            <Tr key={prescription.id}
                                                _hover={{
                                                    bg: "gray.700",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                                            >
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
                                                    <Button
                                                        as={RouterLink}
                                                        to={`/prescriptions/${prescription.id}`}
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => e.stopPropagation()} // Evitar que el clic en el botón active el clic en la fila
                                                    >
                                                        Ver
                                                    </Button>
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
        </MainLayout>
    );
};

export default PatientDetail;