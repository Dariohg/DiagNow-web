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
import { FiPlus, FiSearch, FiMoreVertical, FiEdit, FiFileText, FiTrash2 } from 'react-icons/fi';
import { patientService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = patients.filter(
                patient =>
                    patient.name?.toLowerCase().includes(query) ||
                    patient.lastName?.toLowerCase().includes(query) ||
                    patient.email?.toLowerCase().includes(query)
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    const fetchPatients = async () => {
        try {
            setIsLoading(true);
            const response = await patientService.getPatients();
            setPatients(response.data || []);
            setFilteredPatients(response.data || []);
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

    const handleDeleteClick = (patient) => {
        setSelectedPatient(patient);
        onOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            // En implementación real, se llamaría a un endpoint para eliminar el paciente
            // await patientService.deletePatient(selectedPatient.id);

            // Simulamos la eliminación localmente
            const updatedPatients = patients.filter(p => p.id !== selectedPatient.id);
            setPatients(updatedPatients);

            toast({
                title: 'Paciente eliminado',
                description: 'El paciente ha sido eliminado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
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
                        Pacientes
                    </Heading>
                    <Button
                        as={RouterLink}
                        to="/patients/new"
                        leftIcon={<FiPlus />}
                        variant="primary"
                        size="sm"
                    >
                        Nuevo paciente
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
                                    placeholder="Buscar pacientes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </InputGroup>

                            <HStack spacing={4}>
                                <Select
                                    placeholder="Todos los estados"
                                    size="md"
                                    maxW="200px"
                                    bg="gray.700"
                                >
                                    <option value="active">Activos</option>
                                    <option value="inactive">Inactivos</option>
                                </Select>
                            </HStack>
                        </Flex>

                        {filteredPatients.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Nombre</Th>
                                            <Th>Email</Th>
                                            <Th>Estado</Th>
                                            <Th>Última consulta</Th>
                                            <Th width="100px">Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredPatients.map((patient) => (
                                            <Tr key={patient.id}>
                                                <Td>
                                                    <Text fontWeight="medium">
                                                        {patient.name} {patient.lastName}
                                                    </Text>
                                                </Td>
                                                <Td>{patient.email}</Td>
                                                <Td>
                                                    <Badge colorScheme="green">Activo</Badge>
                                                </Td>
                                                <Td>{new Date().toLocaleDateString()}</Td>
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
                                                                icon={<FiEdit />}
                                                                as={RouterLink}
                                                                to={`/patients/${patient.id}`}
                                                                bg="gray.800"
                                                                _hover={{ bg: 'gray.700' }}
                                                            >
                                                                Editar
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FiFileText />}
                                                                as={RouterLink}
                                                                to={`/prescriptions/new?patientId=${patient.id}`}
                                                                bg="gray.800"
                                                                _hover={{ bg: 'gray.700' }}
                                                            >
                                                                Nueva receta
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FiTrash2 />}
                                                                onClick={() => handleDeleteClick(patient)}
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
                                <Text color="gray.400" mb={4}>No se encontraron pacientes</Text>
                                <Button
                                    as={RouterLink}
                                    to="/patients/new"
                                    leftIcon={<FiPlus />}
                                    variant="primary"
                                    size="sm"
                                >
                                    Registrar nuevo paciente
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
                            ¿Estás seguro que deseas eliminar al paciente{' '}
                            <Text as="span" fontWeight="bold">
                                {selectedPatient?.name} {selectedPatient?.lastName}
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

export default PatientsList;