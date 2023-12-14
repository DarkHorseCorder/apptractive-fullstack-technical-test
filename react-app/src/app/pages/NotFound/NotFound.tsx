import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Flex } from '../../components';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Flex>
      <Typography>{t('404NotFound', { ns: 'common' })}</Typography>
    </Flex>
  );
};

export default NotFound;
