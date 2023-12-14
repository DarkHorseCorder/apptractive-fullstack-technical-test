import { ReactNode } from 'react';
import { Flex } from '../Flex/Flex';
import { Link } from '../Link/Link';
import { NavContainer } from '../NavContainer/NavContainer';
import { Image } from '../Image/Image';
import { IMG_LOGO_FULL } from 'react-app/src/assets';

interface NavBarProps {
  homePath?: string;
  navRight?: ReactNode;
}

const NavBar = ({ navRight, homePath = '/' }: NavBarProps) => {

  return (
    <NavContainer
      elevation={1}
      color="inherit"
    >
      <Flex justifyContent="space-between" flex={1}>
        <Flex flex={1} alignItems="center">
          <Link to={homePath}>
            <Image
              src={IMG_LOGO_FULL}
              alt="logo"
              sx={{ maxHeight: '58px', p: 1 }}
            />
          </Link>
        </Flex>

        {navRight && (
          <Flex flex={1} justifyContent="flex-end" alignItems="center">
            {navRight}
          </Flex>
        )}
      </Flex>
    </NavContainer>
  );
};

export { NavBar };
