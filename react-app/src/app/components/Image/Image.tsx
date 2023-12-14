import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ImageProps extends BoxProps {
  src: string;
  responsive?: boolean;
  stretchBackground?: boolean;
  sx?: object;
  alt?: string;
}

export const Image = ({
  alt,
  src,
  stretchBackground = false,
  responsive = false,
  sx = {},
}: ImageProps) => {
  const stretchSxProps = !stretchBackground
    ? {}
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      };

  const responseSxProps = !responsive
    ? {}
    : {
        width: '100%',
        height: 'auto',
      };

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        ...sx,
        ...stretchSxProps,
        ...responseSxProps,
      }}
    />
  );
};
