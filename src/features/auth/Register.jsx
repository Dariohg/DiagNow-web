import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    VStack,
    Link,
    FormErrorMessage,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
    HStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../../core/services/api';
import { useAuth } from '../../shared/contexts/AuthContext';
import ResilientImage from "../../shared/components/ResilientImage.jsx";
import logoImage from '../../assets/Diagnow-logo.png';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        lastName: Yup.string().required('El apellido es requerido'),
        email: Yup.string().email('Email inválido').required('El email es requerido'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es requerida'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
            .required('Confirma tu contraseña'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const { confirmPassword, ...userData } = values;
                const response = await authService.register(userData);

                toast({
                    title: 'Registro exitoso.',
                    description: 'Has sido registrado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                login(response.data, response.data.token);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.';

                toast({
                    title: 'Error de registro',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <Flex
            direction="column"
            align="center"
            justify="flex-start"
            minHeight="100vh"
            pt={{ base: "3vh", md: "5vh" }}
            bg="gray.900"
            px={4}
        >
            <Box width="180px" mb={4}>
                <ResilientImage
                    src="/logo-placeholder.png"
                    alt="DiagNow Logo"
                    fallbackSrc={logoImage}
                    width="100%"
                />
            </Box>

            <Text color="gray.400" mb={6}>Registro de Médicos</Text>

            <Box maxW="500px" width="100%">
                <Box as="form" onSubmit={formik.handleSubmit}>
                    <VStack spacing={5} align="stretch">
                        <HStack spacing={4}>
                            <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                                <FormLabel>Nombre</FormLabel>
                                <Input
                                    name="name"
                                    placeholder="Juan"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="lg"
                                />
                                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={formik.touched.lastName && formik.errors.lastName}>
                                <FormLabel>Apellido</FormLabel>
                                <Input
                                    name="lastName"
                                    placeholder="Pérez"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="lg"
                                />
                                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel>Correo electrónico</FormLabel>
                            <Input
                                name="email"
                                type="email"
                                placeholder="doctor@ejemplo.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                size="lg"
                            />
                            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup size="lg">
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="******"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <InputRightElement>
                                    <IconButton
                                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}>
                            <FormLabel>Confirmar contraseña</FormLabel>
                            <InputGroup size="lg">
                                <Input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="******"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <InputRightElement>
                                    <IconButton
                                        icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Registrando..."
                            w="full"
                            mt={4}
                            colorScheme="blue"
                            height="48px"
                        >
                            Registrarme
                        </Button>
                    </VStack>
                </Box>

                <Box mt={6} textAlign="center">
                    <Text>
                        ¿Ya tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/login" color="blue.400">
                            Inicia sesión
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default Register;