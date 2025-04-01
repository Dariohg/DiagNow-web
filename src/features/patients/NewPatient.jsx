import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { patientService } from '../../core/services/api';
import MainLayout from '../../shared/layout/MainLayout';

const NewPatient = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        lastName: Yup.string().required('El apellido es requerido'),
        email: Yup.string().email('Email inválido').required('El email es requerido'),
        phone: Yup.string(),
        birthDate: Yup.date(),
        gender: Yup.string(),
        address: Yup.string(),
        allergies: Yup.string(),
        medicalNotes: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            gender: '',
            address: '',
            allergies: '',
            medicalNotes: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                await patientService.createPatient(values);

                toast({
                    title: 'Paciente creado',
                    description: 'El paciente ha sido creado exitosamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                navigate('/patients');
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Error al crear el paciente';

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
                            onClick={() => navigate(-1)}
                            aria-label="Volver"
                        />
                        <Heading as="h1" size="lg">
                            Nuevo Paciente
                        </Heading>
                    </HStack>
                </Flex>

                <Box as="form" onSubmit={formik.handleSubmit}>
                    <Card bg="gray.800" borderRadius="lg" boxShadow="md" mb={6}>
                        <CardHeader>
                            <Heading size="md">Información del paciente</Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={6} align="stretch">
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                                        <FormLabel>Nombre</FormLabel>
                                        <Input
                                            name="name"
                                            placeholder="Nombre"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={formik.touched.lastName && formik.errors.lastName}>
                                        <FormLabel>Apellido</FormLabel>
                                        <Input
                                            name="lastName"
                                            placeholder="Apellido"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                                        <FormLabel>Correo electrónico</FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Teléfono</FormLabel>
                                        <Input
                                            name="phone"
                                            placeholder="Teléfono"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Fecha de nacimiento</FormLabel>
                                        <Input
                                            name="birthDate"
                                            type="date"
                                            value={formik.values.birthDate}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Género</FormLabel>
                                        <Select
                                            name="gender"
                                            placeholder="Seleccionar género"
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                        >
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                            <option value="otro">Otro</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl gridColumn={{ md: "span 2" }}>
                                        <FormLabel>Dirección</FormLabel>
                                        <Input
                                            name="address"
                                            placeholder="Dirección"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>

                                    <FormControl gridColumn={{ md: "span 2" }}>
                                        <FormLabel>Alergias</FormLabel>
                                        <Textarea
                                            name="allergies"
                                            placeholder="Alergias conocidas"
                                            rows={2}
                                            value={formik.values.allergies}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>

                                    <FormControl gridColumn={{ md: "span 2" }}>
                                        <FormLabel>Notas médicas</FormLabel>
                                        <Textarea
                                            name="medicalNotes"
                                            placeholder="Notas médicas relevantes"
                                            rows={3}
                                            value={formik.values.medicalNotes}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Flex justify="flex-end" mt={4}>
                        <HStack spacing={4}>
                            <Button variant="ghost" onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                leftIcon={<FiSave />}
                                isLoading={isSubmitting}
                                loadingText="Guardando..."
                            >
                                Guardar paciente
                            </Button>
                        </HStack>
                    </Flex>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default NewPatient;