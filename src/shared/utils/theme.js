import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            50: "#e6f1ff",
            100: "#b9d4ff",
            200: "#8cb7ff",
            300: "#5f9aff",
            400: "#327dff",
            500: "#0064ff", // Primary brand color
            600: "#0050cc",
            700: "#003c99",
            800: "#002866",
            900: "#001433",
        },
        medicine: {
            blue: "#0064ff",
            lightBlue: "#5f9aff",
            white: "#f7fafc",
        },
    },
    fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
    },
    components: {
        Button: {
            variants: {
                primary: {
                    bg: "brand.500",
                    color: "white",
                    _hover: {
                        bg: "brand.600",
                        _disabled: {
                            bg: "brand.500",
                        },
                    },
                },
                secondary: {
                    bg: "gray.700",
                    color: "white",
                    _hover: {
                        bg: "gray.600",
                        _disabled: {
                            bg: "gray.700",
                        },
                    },
                },
            },
        },
        Input: {
            variants: {
                outline: {
                    field: {
                        bg: "gray.800",
                        borderColor: "gray.600",
                        _hover: {
                            borderColor: "brand.500",
                        },
                        _focus: {
                            borderColor: "brand.500",
                            boxShadow: `0 0 0 1px #0064ff`,
                        },
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: "gray.800",
                    borderRadius: "md",
                    boxShadow: "md",
                },
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: "gray.900",
                color: "gray.100",
            },
        },
    },
});

export default theme;