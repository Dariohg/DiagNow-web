import React from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    Link,
    Stack,
    Text,
    VStack,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUser, FiFileText, FiClock, FiShield } from 'react-icons/fi';

const Feature = ({ icon, title, text }) => {
    return (
        <VStack
            align="start"
            p={6}
            bg="gray.800"
            borderRadius="lg"
            boxShadow="md"
            height="100%"
        >
            <Flex
                w={12}
                h={12}
                align="center"
                justify="center"
                rounded="full"
                bg="brand.500"
                mb={4}
            >
                <Icon as={icon} color="white" w={6} h={6} />
            </Flex>
            <Heading size="md" fontWeight="semibold" mb={2}>
                {title}
            </Heading>
            <Text color="gray.400">{text}</Text>
        </VStack>
    );
};

const Landing = () => {
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    return (
        <Box>
            {/* Navbar */}
            <Box as="nav" bg="gray.800" boxShadow="sm" position="fixed" width="full" zIndex={10}>
                <Container maxW="container.xl" py={4}>
                    <Flex justify="space-between" align="center">
                        <HStack spacing={2}>
                            <Box boxSize="40px">
                                <Image src="/logo-placeholder.png" alt="DiagNow Logo" fallbackSrc="https://via.placeholder.com/40?text=D" />
                            </Box>
                            <Heading size="md" color="medicine.blue">DiagNow</Heading>
                        </HStack>
                        <HStack spacing={4}>
                            <Link as={RouterLink} to="/login">
                                <Button variant="secondary" size="sm">Iniciar sesión</Button>
                            </Link>
                            <Link as={RouterLink} to="/register">
                                <Button variant="primary" size="sm">Registrarse</Button>
                            </Link>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box
                pt={{ base: '7rem', md: '8rem' }}
                pb={{ base: '4rem', md: '6rem' }}
                position="relative"
                overflow="hidden"
            >
                <Container maxW="container.xl">
                    <Flex
                        direction={{ base: 'column', lg: 'row' }}
                        align="center"
                        justify="space-between"
                        gap={10}
                    >
                        <Box flex={1} maxW={{ lg: '50%' }}>
                            <Heading
                                as="h1"
                                size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                fontWeight="bold"
                                mb={6}
                                lineHeight="shorter"
                            >
                                Gestiona tus pacientes y recetas médicas de forma{' '}
                                <Text as="span" color="brand.500">
                                    simple y segura
                                </Text>
                            </Heading>
                            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.400" mb={8}>
                                DiagNow es la plataforma diseñada para médicos que buscan optimizar su práctica con herramientas digitales modernas, simples y seguras.
                            </Text>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                spacing={4}
                                width={{ base: 'full', sm: 'auto' }}
                            >
                                <Button
                                    as={RouterLink}
                                    to="/register"
                                    variant="primary"
                                    size="lg"
                                    minW="10rem"
                                >
                                    Comenzar ahora
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to="/login"
                                    variant="secondary"
                                    size="lg"
                                >
                                    Iniciar sesión
                                </Button>
                            </Stack>
                        </Box>

                        {isDesktop && (
                            <Box flex={1} maxW="50%">
                                <Image
                                    src="https://via.placeholder.com/700x500?text=Doctor+Dashboard"
                                    alt="Dashboard DiagNow"
                                    boxShadow="xl"
                                    borderRadius="lg"
                                    objectFit="cover"
                                />
                            </Box>
                        )}
                    </Flex>
                </Container>
            </Box>

            {/* Features Section */}
            <Box bg="gray.900" py={20}>
                <Container maxW="container.xl">
                    <VStack spacing={10}>
                        <Box textAlign="center" maxW="container.md" mx="auto">
                            <Heading as="h2" size="xl" mb={4}>
                                Características principales
                            </Heading>
                            <Text fontSize="lg" color="gray.400">
                                Todo lo que necesitas para optimizar tu práctica médica en un solo lugar
                            </Text>
                        </Box>

                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            gap={8}
                            width="full"
                            wrap="wrap"
                        >
                            <Box width={{ base: '100%', md: '45%', lg: '22%' }} flex={1}>
                                <Feature
                                    icon={FiUser}
                                    title="Gestión de pacientes"
                                    text="Accede a la información de tus pacientes de forma rápida y organizada."
                                />
                            </Box>
                            <Box width={{ base: '100%', md: '45%', lg: '22%' }} flex={1}>
                                <Feature
                                    icon={FiFileText}
                                    title="Recetas digitales"
                                    text="Crea y envía recetas médicas digitales directamente a tus pacientes."
                                />
                            </Box>
                            <Box width={{ base: '100%', md: '45%', lg: '22%' }} flex={1}>
                                <Feature
                                    icon={FiClock}
                                    title="Acceso 24/7"
                                    text="Accede a la plataforma desde cualquier dispositivo en cualquier momento."
                                />
                            </Box>
                            <Box width={{ base: '100%', md: '45%', lg: '22%' }} flex={1}>
                                <Feature
                                    icon={FiShield}
                                    title="Seguridad garantizada"
                                    text="Tus datos y los de tus pacientes están protegidos con los más altos estándares."
                                />
                            </Box>
                        </Flex>
                    </VStack>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box py={20} bg="gray.800">
                <Container maxW="container.md" textAlign="center">
                    <Heading size="xl" mb={6}>
                        Únete a los médicos que confían en DiagNow
                    </Heading>
                    <Text fontSize="lg" color="gray.400" mb={8}>
                        Comienza hoy mismo y mejora la experiencia de tus pacientes con recetas digitales seguras y profesionales.
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/register"
                        variant="primary"
                        size="lg"
                        minW="10rem"
                    >
                        Crear cuenta gratis
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box bg="gray.900" py={10}>
                <Container maxW="container.xl">
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align={{ base: 'center', md: 'start' }}
                        textAlign={{ base: 'center', md: 'left' }}
                    >
                        <VStack align={{ base: 'center', md: 'start' }} mb={{ base: 6, md: 0 }}>
                            <HStack>
                                <Box boxSize="30px">
                                    <Image src="/logo-placeholder.png" alt="DiagNow Logo" fallbackSrc="https://via.placeholder.com/30?text=D" />
                                </Box>
                                <Heading size="sm" color="medicine.blue">DiagNow</Heading>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                                © {new Date().getFullYear()} DiagNow. Todos los derechos reservados.
                            </Text>
                        </VStack>

                        <HStack spacing={8}>
                            <Link fontSize="sm" color="gray.500" _hover={{ color: 'gray.300' }}>
                                Términos
                            </Link>
                            <Link fontSize="sm" color="gray.500" _hover={{ color: 'gray.300' }}>
                                Privacidad
                            </Link>
                            <Link fontSize="sm" color="gray.500" _hover={{ color: 'gray.300' }}>
                                Contacto
                            </Link>
                        </HStack>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;