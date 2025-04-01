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
} from '@chakra-ui/react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { patientService, prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const PatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

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
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
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