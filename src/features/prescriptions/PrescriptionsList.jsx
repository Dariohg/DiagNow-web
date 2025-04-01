import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    Select,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiPlus, FiSearch, FiMoreVertical, FiEye, FiPrinter, FiTrash2 } from 'react-icons/fi';
import { prescriptionService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const PrescriptionsList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPrescriptions(prescriptions);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = prescriptions.filter(
                prescription =>
                    prescription.patientName?.toLowerCase().includes(query) ||
                    prescription.diagnosis?.toLowerCase().includes(query)
            );
            setFilteredPrescriptions(filtered);
        }
    }, [searchQuery, prescriptions]);

    // Datos de ejemplo para prescripciones
    const mockPrescriptions = [
        {
            id: '1',
            patientId: '1',
            patientName: 'Juan Pérez',
            date: '2025-03-29',
            diagnosis: 'Gripe estacional',
            status: 'active',
            medications: [
                { name: 'Paracetamol', dosage: '500mg', administrationRoute: 'oral', frequency: '8', days: '5' }
            ]
        },
        {
            id: '2',
            patientId: '2',
            patientName: 'María González',
            date: '2025-03-28',
            diagnosis: 'Hipertensión arterial',
            status: 'active',
            medications: [
                { name: 'Losartan', dosage: '50mg', administrationRoute: 'oral', frequency: '24', days: '30' }
            ]
        },
        {
            id: '3',
            patientId: '1',
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

    const fetchPrescriptions = async () => {
        try {
            setIsLoading(true);
            // En un entorno real, obtendríamos las recetas del backend
            // const response = await prescriptionService.getPrescriptions();
            // setPrescriptions(response.data || []);

            // Por ahora, usamos datos de ejemplo
            setTimeout(() => {
                setPrescriptions(mockPrescriptions);
                setFilteredPrescriptions(mockPrescriptions);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las recetas',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (prescription) => {
        setSelectedPrescription(prescription);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            // En implementación real, se llamaría a un endpoint para eliminar la receta
            // await prescriptionService.deletePrescription(selectedPrescription.id);

            // Simulamos la eliminación localmente
            const updatedPrescriptions = prescriptions.filter(p => p.id !== selectedPrescription.id);
            setPrescriptions(updatedPrescriptions);

            toast({
                title: 'Receta eliminada',
                description: 'La receta ha sido eliminada exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
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

    const formatDate = (dateString) => {
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
                    <Heading as="h1" size="lg" mb={{ base: 4, md: 0 }}>
                        Recetas médicas
                    </Heading>
                    <Button
                        as={RouterLink}
                        to="/prescriptions/new"
                        leftIcon={<FiPlus />}
                        variant="primary"
                        size="sm"
                    >
                        Nueva receta
                    </Button>
                </Flex>

                <Card bg="gray.800" borderRadius="lg" boxShadow="md" mb={6}>
                    <CardBody>
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            justify="space-between"
                            align={{ base: 'flex-start', md: 'center' }}
                            mb={4}
                            gap={4}
                        >
                            <InputGroup maxW={{ md: '320px' }}>
                                <InputLeftElement pointerEvents="none">
                                    <FiSearch color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Buscar recetas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </InputGroup>

                            <HStack spacing={4}>
                                <Select
                                    placeholder="Todas las fechas"
                                    size="md"
                                    maxW="200px"
                                    bg="gray.700"
                                >
                                    <option value="today">Hoy</option>
                                    <option value="week">Esta semana</option>
                                    <option value="month">Este mes</option>
                                </Select>
                            </HStack>
                        </Flex>

                        {filteredPrescriptions.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Paciente</Th>
                                            <Th>Fecha</Th>
                                            <Th>Diagnóstico</Th>
                                            <Th>Medicamentos</Th>
                                            <Th width="100px">Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredPrescriptions.map((prescription) => (
                                            <Tr key={prescription.id}>
                                                <Td>
                                                    <Text fontWeight="medium">
                                                        {prescription.patientName}
                                                    </Text>
                                                </Td>
                                                <Td>{formatDate(prescription.date)}</Td>
                                                <Td>
                                                    <Text noOfLines={1}>
                                                        {prescription.diagnosis}
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    <HStack>
                                                        <Badge colorScheme="blue">
                                                            {prescription.medications.length}
                                                        </Badge>
                                                        <Text>
                                                            {prescription.medications.map(med => med.name).join(', ')}
                                                        </Text>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Menu placement="bottom-end">
                                                        <MenuButton
                                                            as={IconButton}
                                                            icon={<FiMoreVertical />}
                                                            variant="ghost"
                                                            size="sm"
                                                        />
                                                        <MenuList bg="gray.800" borderColor="gray.700">
                                                            <MenuItem
                                                                icon={<FiEye />}
                                                                as={RouterLink}
                                                                to={`/prescriptions/${prescription.id}`}
                                                                bg="gray.800"
                                                                _hover={{ bg: 'gray.700' }}
                                                            >
                                                                Ver detalle
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FiPrinter />}
                                                                bg="gray.800"
                                                                _hover={{ bg: 'gray.700' }}
                                                            >
                                                                Imprimir
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FiTrash2 />}
                                                                onClick={() => handleDeleteClick(prescription)}
                                                                bg="gray.800"
                                                                _hover={{ bg: 'gray.700' }}
                                                                color="red.300"
                                                            >
                                                                Eliminar
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Box textAlign="center" py={10}>
                                <Text color="gray.400" mb={4}>No se encontraron recetas</Text>
                                <Button
                                    as={RouterLink}
                                    to="/prescriptions/new"
                                    leftIcon={<FiPlus />}
                                    variant="primary"
                                    size="sm"
                                >
                                    Crear nueva receta
                                </Button>
                            </Box>
                        )}
                    </CardBody>
                </Card>
            </Box>

            {/* Confirm Delete Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="gray.800">
                    <ModalHeader>Confirmar eliminación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            ¿Estás seguro que deseas eliminar la receta para el paciente{' '}
                            <Text as="span" fontWeight="bold">
                                {selectedPrescription?.patientName}
                            </Text>
                            ? Esta acción no se puede deshacer.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDeleteConfirm}>
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MainLayout>
    );
};

export default PrescriptionsList;