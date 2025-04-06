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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../../core/services/api';
import { useAuth } from '../../shared/contexts/AuthContext';
import ResilientImage from "../../shared/components/ResilientImage.jsx";
import logoImage from '../../assets/Diagnow-logo.png';

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

                login(response.data, response.data.token);
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
        <Flex
            direction="column"
            align="center"
            justify="flex-start"
            minHeight="100vh"
            pt={{ base: "5vh", md: "8vh" }}
            bg="gray.900"
            px={4}
        >
            <Box width="220px" mb={6}>
                <ResilientImage
                    src="/logo-placeholder.png"
                    alt="DiagNow Logo"
                    fallbackSrc={logoImage}
                    width="100%"
                />
            </Box>

            <Text color="gray.400" mb={8}>Acceso para Médicos</Text>

            <Box maxW="400px" width="100%">
                <Box as="form" onSubmit={formik.handleSubmit}>
                    <VStack spacing={5} align="stretch">
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

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Iniciando sesión..."
                            w="full"
                            mt={4}
                            colorScheme="blue"
                            height="48px"
                        >
                            Iniciar sesión
                        </Button>
                    </VStack>
                </Box>

                <Box mt={6} textAlign="center">
                    <Text>
                        ¿No tienes una cuenta?{' '}
                        <Link as={RouterLink} to="/register" color="blue.400">
                            Regístrate
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default Login;