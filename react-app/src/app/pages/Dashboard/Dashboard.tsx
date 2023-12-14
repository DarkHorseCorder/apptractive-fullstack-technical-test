import { Box, Typography } from '@mui/material';
import { Flex, PageContainer } from '../../components';
import { ConnectDisconnectXero } from '../../components/ConnectDisconnectXero/ConnectDisconnectXero';
import { Link } from '../../components';
import { PATHS } from '../../navigation/paths';

const Dashboard = () => {
  return (<PageContainer>
    <Flex flexDirection="column">
      <Typography>Allow user to connect their Xero account (the Demo Company) using oAuth 2</Typography>
      <Box mt={1}>
        <ConnectDisconnectXero/>
      </Box>
    </Flex>
    <Flex mt={3} flexDirection="column">
      <Box>
        <Typography>Allow user to view their transactions</Typography>
        <Box mt={1}>
          <Link
            to={PATHS.xeroTransactions}
          >
            Xero Transactions
          </Link>
        </Box>
      </Box>
    </Flex>
  </PageContainer>);
};

export default Dashboard;
