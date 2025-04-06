import React, { useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import defaultLogo from '../../assets/logo.svg';

const ResilientImage = ({
                            src,
                            fallbackSrc = defaultLogo,
                            alt,
                            ...props
                        }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <Image
            src={imgSrc}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
};

export default ResilientImage;