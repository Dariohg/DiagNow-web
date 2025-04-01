import {
    Box,
    Flex,
    IconButton,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Avatar,
    Button,
    useBreakpointValue
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onOpen }) => {
    const { currentUser, logout } = useAuth();
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box
            px={4}
            height="60px"
            bg="gray.800"
            borderBottomWidth="1px"
            borderBottomColor="gray.700"
            pos="fixed"
            w="full"
            zIndex="1000"
        >
            <Flex h="100%" alignItems="center" justifyContent="space-between">
                {isMobile && (
                    <IconButton
                        icon={<FiMenu />}
                        variant="outline"
                        onClick={onOpen}
                        aria-label="Open menu"
                        color="gray.400"
                    />
                )}

                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="medicine.blue"
                    display={{ base: 'none', md: 'flex' }}
                >
                    DiagNow
                </Text>

                <HStack spacing={4}>
                    <IconButton
                        size="md"
                        variant="ghost"
                        aria-label="Notifications"
                        icon={<FiBell />}
                        color="gray.400"
                    />

                    <Menu>
                        <MenuButton
                            as={Button}
                            variant="ghost"
                            rightIcon={<FiChevronDown />}
                            px={2}
                        >
                            <HStack>
                                <Avatar
                                    size="sm"
                                    name={currentUser ? `${currentUser.name} ${currentUser.lastName}` : 'Doctor'}
                                    bg="brand.500"
                                />
                                <Box display={{ base: 'none', md: 'block' }}>
                                    <Text size="sm">{currentUser?.name} {currentUser?.lastName}</Text>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList bg="gray.800" borderColor="gray.700">
                            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>Perfil</MenuItem>
                            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>Configuración</MenuItem>
                            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={logout}>
                                Cerrar sesión
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;