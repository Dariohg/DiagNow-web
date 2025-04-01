import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardBody,
    Flex,
    Grid,
    Heading,
    Text,
    HStack,
    VStack,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import { patientService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await patientService.getPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientClick = (patientId) => {
        navigate(`/patients/${patientId}`);
    };

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
                </Flex>

                <Heading size="md" mb={4}>Pacientes Registrados</Heading>

                {patients.length > 0 ? (
                    <Grid
                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                        gap={6}
                    >
                        {patients.map((patient) => (
                            <Card
                                key={patient.id}
                                bg="gray.800"
                                borderRadius="lg"
                                overflow="hidden"
                                _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s', cursor: 'pointer' }}
                                onClick={() => handlePatientClick(patient.id)}
                            >
                                <CardBody>
                                    <VStack spacing={2} align="stretch">
                                        <Heading size="md">
                                            {patient.name} {patient.lastName}
                                        </Heading>

                                        <HStack spacing={4} mt={2}>
                                            <Box>
                                                <Text fontSize="sm" color="gray.400">Edad</Text>
                                                <Text>{patient.age || 'N/A'} años</Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color="gray.400">Altura</Text>
                                                <Text>{patient.height || 'N/A'} cm</Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color="gray.400">Peso</Text>
                                                <Text>{patient.weight || 'N/A'} kg</Text>
                                            </Box>
                                        </HStack>

                                        <Box mt={2}>
                                            <Text fontSize="sm" color="gray.400">Email</Text>
                                            <Text>{patient.email}</Text>
                                        </Box>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </Grid>
                ) : (
                    <Card bg="gray.800" p={6}>
                        <Center flexDirection="column" py={8}>
                            <Text color="gray.400">No hay pacientes registrados</Text>
                        </Center>
                    </Card>
                )}
            </Box>
        </MainLayout>
    );
};

export default Dashboard;