import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
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
    Image,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../../core/services/api';
import { useAuth } from '../../shared/contexts/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { login } = useAuth();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Email inválido')
            .required('El email es requerido'),
        password: Yup.string()
            .required('La contraseña es requerida'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.login(values);

                toast({
                    title: 'Inicio de sesión exitoso',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                login(response.data.user, response.data.token);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Credenciales inválidas. Inténtalo de nuevo.';

                toast({
                    title: 'Error de inicio de sesión',
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
        <Container maxW="md" py={12}>
            <VStack spacing={6} align="stretch">
                <VStack spacing={2} align="center">
                    <Box boxSize="100px" mb={2}>
                        <Image src="/logo-placeholder.png" alt="DiagNow Logo" fallbackSrc="https://via.placeholder.com/100?text=DiagNow" />
                    </Box>
                    <Heading color="medicine.blue" size="xl">DiagNow</Heading>
                    <Text color="gray.400">Acceso para Médicos</Text>
                </VStack>

                <Box as="form" onSubmit={formik.handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel>Correo electrónico</FormLabel>
                            <Input
                                name="email"
                                type="email"
                                placeholder="doctor@ejemplo.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup>
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

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Iniciando sesión..."
                            w="full"
                            mt={4}
                        >
                            Iniciar sesión
                        </Button>
                    </VStack>
                </Box>

                <Text align="center">
                    ¿No tienes una cuenta?{' '}
                    <Link as={RouterLink} to="/register" color="brand.500">
                        Regístrate
                    </Link>
                </Text>
            </VStack>
        </Container>
    );
};

export default Login;