import {
    Box,
    Flex,
    IconButton,
    Button,
    HStack,
    Text,
    Avatar,
    useBreakpointValue
} from '@chakra-ui/react';
import { FiMenu, FiLogOut } from 'react-icons/fi';
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
                    <Button
                        variant="ghost"
                        leftIcon={<FiLogOut />}
                        onClick={logout}
                        size="sm"
                    >
                        Cerrar sesión
                    </Button>

                    <Avatar
                        size="sm"
                        name={currentUser ? `${currentUser.name} ${currentUser.lastName}` : 'Doctor'}
                        bg="brand.500"
                    />
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;