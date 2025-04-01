import {
    Box,
    CloseButton,
    Flex,
    Icon,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    DrawerOverlay,
    DrawerHeader,
    DrawerBody,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiHome, FiUsers, FiClipboard, FiPlusCircle } from 'react-icons/fi';

const SidebarContent = ({ onClose, ...rest }) => {
    const LinkItems = [
        { name: 'Dashboard', icon: FiHome, to: '/dashboard' },
        { name: 'Pacientes', icon: FiUsers, to: '/patients' },
        { name: 'Recetas', icon: FiClipboard, to: '/prescriptions' },
        { name: 'Nueva receta', icon: FiPlusCircle, to: '/prescriptions/new' },
    ];

    return (
        <Box
            transition="3s ease"
            bg="gray.800"
            borderRight="1px"
            borderRightColor="gray.700"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold" color="medicine.blue">
                    DiagNow
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color="gray.400" />
            </Flex>
            <VStack spacing={4} align="stretch" mt={6}>
                {LinkItems.map((link) => (
                    <NavItem key={link.name} icon={link.icon} to={link.to} onClick={onClose}>
                        {link.name}
                    </NavItem>
                ))}
            </VStack>
        </Box>
    );
};

const NavItem = ({ icon, children, to, onClick, ...rest }) => {
    return (
        <RouterLink to={to} onClick={onClick}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'brand.500',
                    color: 'white',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </RouterLink>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerOverlay />
                <DrawerContent bg="gray.800" color="white">
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;