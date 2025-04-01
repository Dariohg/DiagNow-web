import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Flex,
    Grid,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    HStack,
    Icon,
    useColorModeValue,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiPlus, FiUser, FiFileText, FiClock, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../shared/contexts/AuthContext';
import { patientService, prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [patientCount, setPatientCount] = useState(0);
    const [prescriptionCount, setPrescriptionCount] = useState(0);
    const [recentPatients, setRecentPatients] = useState([]);
    const [recentPrescriptions, setRecentPrescriptions] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // En un entorno real, estos endpoints deberían existir para obtener datos del dashboard
                // Por ahora, simulamos con los endpoints disponibles
                const patientsResponse = await patientService.getPatients();
                const patients = patientsResponse.data || [];

                // Simulamos recetas recientes combinando datos
                // En un entorno real, esto vendría de un endpoint específico
                const prescriptions = [];
                if (patients.length > 0) {
                    try {
                        const prescriptionsResponse = await prescriptionService.getPatientPrescriptions(patients[0].id);
                        prescriptions.push(...(prescriptionsResponse.data || []));
                    } catch (error) {
                        console.error('Error fetching prescriptions:', error);
                    }
                }

                setPatientCount(patients.length);
                setPrescriptionCount(prescriptions.length);
                setRecentPatients(patients.slice(0, 5));
                setRecentPrescriptions(prescriptions.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
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
                    <Heading as="h1" size="lg" mb={{ base: 4, md: 0 }}>
                        Bienvenido, Dr. {currentUser?.name}
                    </Heading>
                    <HStack spacing={4}>
                        <Button
                            as={RouterLink}
                            to="/prescriptions/new"
                            leftIcon={<FiPlus />}
                            variant="primary"
                            size="sm"
                        >
                            Nueva receta
                        </Button>
                    </HStack>
                </Flex>

                {/* Stats cards */}
                <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={6}
                    mb={8}
                >
                    <StatCard
                        label="Pacientes registrados"
                        value={patientCount}
                        icon={FiUser}
                        iconBg="blue.500"
                    />
                    <StatCard
                        label="Recetas emitidas"
                        value={prescriptionCount}
                        icon={FiFileText}
                        iconBg="green.500"
                    />
                    <StatCard
                        label="Recetas esta semana"
                        value={prescriptionCount > 0 ? Math.floor(prescriptionCount / 2) : 0}
                        icon={FiClock}
                        iconBg="purple.500"
                    />
                    <StatCard
                        label="Pacientes este mes"
                        value={patientCount > 0 ? Math.floor(patientCount * 0.7) : 0}
                        icon={FiCalendar}
                        iconBg="orange.500"
                    />
                </Grid>

                {/* Recent data tables */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                        <CardHeader>
                            <Flex justify="space-between" align="center">
                                <Heading size="md">Pacientes recientes</Heading>
                                <Button
                                    as={RouterLink}
                                    to="/patients"
                                    size="sm"
                                    variant="secondary"
                                >
                                    Ver todos
                                </Button>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            {recentPatients.length > 0 ? (
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Nombre</Th>
                                            <Th>Email</Th>
                                            <Th>Estado</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {recentPatients.map((patient, index) => (
                                            <Tr key={patient.id || index}>
                                                <Td>
                                                    <Text fontWeight="medium">
                                                        {patient.name} {patient.lastName}
                                                    </Text>
                                                </Td>
                                                <Td>{patient.email}</Td>
                                                <Td>
                                                    <Badge colorScheme="green">Activo</Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            ) : (
                                <Center py={6}>
                                    <Text color="gray.500">No hay pacientes registrados</Text>
                                </Center>
                            )}
                        </CardBody>
                    </Card>

                    <Card bg="gray.800" borderRadius="lg" boxShadow="md">
                        <CardHeader>
                            <Flex justify="space-between" align="center">
                                <Heading size="md">Recetas recientes</Heading>
                                <Button
                                    as={RouterLink}
                                    to="/prescriptions"
                                    size="sm"
                                    variant="secondary"
                                >
                                    Ver todas
                                </Button>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            {recentPrescriptions.length > 0 ? (
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Paciente</Th>
                                            <Th>Fecha</Th>
                                            <Th>Estado</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {recentPrescriptions.map((prescription, index) => (
                                            <Tr key={prescription.id || index}>
                                                <Td>
                                                    <Text fontWeight="medium">
                                                        {prescription.patientName || 'Paciente'}
                                                    </Text>
                                                </Td>
                                                <Td>{prescription.date || new Date().toLocaleDateString()}</Td>
                                                <Td>
                                                    <Badge colorScheme="blue">Emitida</Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            ) : (
                                <Center py={6}>
                                    <Text color="gray.500">No hay recetas emitidas</Text>
                                </Center>
                            )}
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </Box>
        </MainLayout>
    );
};

const StatCard = ({ label, value, icon, iconBg }) => {
    return (
        <Card bg="gray.800" borderRadius="lg" boxShadow="md">
            <CardBody>
                <Flex align="center">
                    <Box
                        bg={iconBg}
                        p={3}
                        borderRadius="full"
                        mr={4}
                    >
                        <Icon as={icon} boxSize={5} color="white" />
                    </Box>
                    <Stat>
                        <StatLabel color="gray.400">{label}</StatLabel>
                        <StatNumber fontSize="2xl">{value}</StatNumber>
                    </Stat>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default Dashboard;