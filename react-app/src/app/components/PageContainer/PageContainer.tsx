import { SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { Flex } from '../Flex/Flex';

export const PageContainer = ({
  children,
  sx = {},
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Flex p={2} sx={{ flexDirection: 'column', flex: 1, ...sx }}>
      {children}
    </Flex>
  );
};
