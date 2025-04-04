
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    HStack,
    IconButton,
    VStack,
    Badge,
    Text,
    Divider,
    Grid,
    GridItem,
    useToast,
    Spinner,
    Center,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Tooltip,
} from '@chakra-ui/react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiPrinter, FiTrash2, FiUser } from 'react-icons/fi';
import { prescriptionService } from '../../core/services/api.js';
import MainLayout from '../../shared/layout/MainLayout.jsx';

const PrescriptionDetail = () => {
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    useEffect(() => {
        fetchPrescriptionData();
    }, [id]);

    const fetchPrescriptionData = async () => {
        try {
            setIsLoading(true);
            const response = await prescriptionService.getPrescriptionById(id);
            setPrescription(response.data);
        } catch (error) {
            console.error('Error fetching prescription data:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información de la receta',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePrescription = async () => {
        try {
            await prescriptionService.deletePrescription(id);

            toast({
                title: 'Receta eliminada',
                description: 'La receta ha sido eliminada exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            if (prescription && prescription.patientId) {
                navigate(`/patients/${prescription.patientId}`);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar la receta',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onClose();
        }
    };

    const handlePrintPrescription = () => {
        window.print();
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
            <Box className="prescription-detail">
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
                            onClick={() =>
                                prescription && prescription.patientId
                                    ? navigate(`/patients/${prescription.patientId}`)
                                    : navigate('/dashboard')
                            }
                            aria-label="Volver"
                        />
                        <Heading as="h1" size="lg">
                            Receta médica
                        </Heading>
                    </HStack>
                    <HStack spacing={2}>
                        {prescription && prescription.patientId && (
                            <Tooltip label="Ver paciente">
                                <IconButton
                                    as={RouterLink}
                                    to={`/patients/${prescription.patientId}`}
                                    icon={<FiUser />}
                                    variant="ghost"
                                    aria-label="Ver paciente"
                                />
                            </Tooltip>
                        )}
                        <Button
                            leftIcon={<FiPrinter />}
                            variant="secondary"
                            onClick={handlePrintPrescription}
                        >
                            Imprimir
                        </Button>
                        <Button
                            leftIcon={<FiEdit />}
                            variant="primary"
                            as={RouterLink}
                            to={`/prescriptions/edit/${id}`}
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
                    </HStack>
                </Flex>

                <Card bg="gray.800" borderRadius="lg" boxShadow="md" mb={6} className="prescription-card">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem>
                                <Heading size="md" color="medicine.blue" mb={2}>DiagNow</Heading>
                                <Text>Receta Médica</Text>
                            </GridItem>
                            <GridItem textAlign="right">
                                <Text>Fecha: <strong>{formatDate(prescription.date)}</strong></Text>
                                <Badge colorScheme="green" mt={2}>Receta Activa</Badge>
                            </GridItem>
                        </Grid>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <Text fontWeight="bold" mb={2}>Paciente:</Text>
                                <Box bg="gray.700" p={4} borderRadius="md">
                                    <Text>{prescription.patientName}</Text>
                                </Box>
                            </Box>

                            <Box>
                                <Text fontWeight="bold" mb={2}>Diagnóstico:</Text>
                                <Box bg="gray.700" p={4} borderRadius="md">
                                    <Text>{prescription.diagnosis}</Text>
                                </Box>
                            </Box>

                            <Box>
                                <Text fontWeight="bold" mb={2}>Medicamentos:</Text>
                                <VStack spacing={4} align="stretch">
                                    {prescription.medications && prescription.medications.map((medication, index) => (
                                        <Box key={index} bg="gray.700" p={4} borderRadius="md">
                                            <Heading size="sm" mb={2}>{medication.name} {medication.dosage && `- ${medication.dosage}`}</Heading>
                                            <Text>{medication.instructions || 'Sin instrucciones específicas'}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>

                            {prescription.notes && (
                                <Box>
                                    <Text fontWeight="bold" mb={2}>Notas Adicionales:</Text>
                                    <Box bg="gray.700" p={4} borderRadius="md">
                                        <Text>{prescription.notes}</Text>
                                    </Box>
                                </Box>
                            )}

                            <Divider my={6} />

                            <Box textAlign="center">
                                <Text fontWeight="bold">Dr. {localStorage.getItem('diagnow_user') ? JSON.parse(localStorage.getItem('diagnow_user')).name : 'Usuario'} {localStorage.getItem('diagnow_user') ? JSON.parse(localStorage.getItem('diagnow_user')).lastName : 'Demo'}</Text>
                                <Text fontSize="sm" color="gray.400">Médico General</Text>
                                <Text fontSize="sm" color="gray.400">Cédula Profesional: DEMO-12345</Text>
                            </Box>
                        </VStack>
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
                            Eliminar Receta
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro que deseas eliminar esta receta? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleDeletePrescription} ml={3}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Estilos para impresión */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .prescription-detail, .prescription-detail * {
                        visibility: visible;
                    }
                    .prescription-card {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background-color: white !important;
                        color: black !important;
                    }
                    /* Ocultar botones y elementos que no deben imprimirse */
                    button, .chakra-icon, nav {
                        display: none !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
};

export default PrescriptionDetail;