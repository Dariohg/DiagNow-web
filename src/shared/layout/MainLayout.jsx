import React from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex>
            <Sidebar isOpen={isOpen} onClose={onClose} />
            <Box flex="1" minH="100vh" bg="gray.900">
                <Navbar onOpen={onOpen} />
                <Box p={4} ml={{ base: 0, md: 60 }} mt="60px">
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};

export default MainLayout;