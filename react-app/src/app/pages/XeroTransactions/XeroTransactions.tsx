import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

export function XeroTransactions() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Typography variant="h1">
        {t('xeroTransactions', { ns: 'xero' })}
      </Typography>
    </PageContainer>
  );
}

export default XeroTransactions;
