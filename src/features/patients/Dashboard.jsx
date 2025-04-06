// src/features/patients/Dashboard.jsx (actualización parcial)

import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardBody, Flex, Grid, Heading, Text, HStack, VStack,
    Spinner, Center, useToast, Alert, AlertIcon, AlertTitle, AlertDescription
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import { patientService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await patientService.getPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('No se pudieron cargar los pacientes. Por favor intenta más tarde.');

            toast({
                title: 'Error',
                description: 'No se pudieron cargar los pacientes',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePatientClick = (patient) => {
        navigate(`/patients/${patient.id}`, { state: { patient } });
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

                {error && (
                    <Alert status="error" mb={6} borderRadius="md">
                        <AlertIcon />
                        <AlertTitle>Error:</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!error && patients.length > 0 ? (
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
                                onClick={() => handlePatientClick(patient)}
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
                            <Text color="gray.400">
                                {error ? 'Error al cargar pacientes' : 'No hay pacientes registrados'}
                            </Text>
                        </Center>
                    </Card>
                )}
            </Box>
        </MainLayout>
    );
};

export default Dashboard;