import { MouseEventHandler } from 'react';
import * as React from 'react';
import { Link as MUILink, Theme, SxProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  sx?: SxProps<Theme>;
  to: string | number;
  underline?: 'hover' | 'none' | 'always';
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLSpanElement>;
}


const Link = ({
  to,
  children,
  underline = 'hover',
  sx = {},
  onClick,
  replace = false,
}: LinkProps) => (
  // @ts-ignore: mui component type errors
  <MUILink
    component={RouterLink}
    to={to}
    underline={underline}
    sx={sx}
    replace={replace}
    onClick={onClick}
  >
    {children}
  </MUILink>
);
export { Link };
