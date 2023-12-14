import { forwardRef, ReactNode } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { Theme, SxProps } from '@mui/material';
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material';

interface LinkButtonProps extends MUIButtonProps {
  to?: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  variant?: 'text' | 'outlined' | 'contained';
}

const LinkBehavior = forwardRef<any, Omit<RouterLinkProps, 'to'>>(
  (props, ref) => <RouterLink ref={ref} to="/" {...props} role={undefined} />
);

export const LinkButton = ({
  to,
  children,
  sx,
  variant = 'text',
  ...props
}: LinkButtonProps) => {
  return (
    //@ts-ignore
    <MUIButton
      component={LinkBehavior}
      to={to}
      sx={sx}
      variant={variant}
      type="button"
      {...props}
    >
      {children}
    </MUIButton>
  );
};
