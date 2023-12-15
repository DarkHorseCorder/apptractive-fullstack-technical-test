import React, { useState } from 'react';
import { gql, useQuery} from '@apollo/client'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Select, MenuItem, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import { 
  xeroListTransactions
} from '../../graphql';
import { SelectChangeEvent } from '@mui/material/Select';

const columns: GridColDef[] = [
  { 
    field: 'invoiceNumber', 
    headerName: 'Invoice Number', 
    filterable: false,
    width: 160,
  },
  {
    field: 'status',
    headerName: 'Invoice Status',
    width: 160,
  },
  {
    field: 'amountPaid',
    headerName: 'Amount Paid',
    filterable: false,
    width: 160,
  },
  {
    field: 'totalTax',
    headerName: 'Total Tax',
    filterable: false,
    type: 'number',
    width: 160,
  },
  {
    field: 'total',
    headerName: 'Total',
    filterable: false,
    type: 'number',
    width: 160,
  },
];

const statusOptions = [
  'DRAFT',
  'SUBMITTED',
  'DELETED',
  'AUTHORISED',
  'PAID',
  'VOIDED',
];

export function XeroTransactions() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const { loading, error, data, refetch } = useQuery(gql(xeroListTransactions), {
    variables: {
      input: {
        scopeSet: 'PROFILE',
        statuses: statusFilter === 'All' ? null : [statusFilter],
        page: 1,
      },
    },
  });

  const handleStatusFilterChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const selectedStatus = event.target.value as string;
    setStatusFilter(selectedStatus);
    refetch(); // Refetch data when the filter changes
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  const rows = data?.xeroListTransactions || [];
  return (
    <PageContainer>
      <Typography variant="h3">
        {t('xeroTransactions', { ns: 'xero' })}
      </Typography>

      <Box sx={{width: '100%', height: 40, display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Select value={statusFilter} onChange={handleStatusFilterChange} sx={{ width: "200px", height: "100%"}}>
          <MenuItem value="All">All</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.invoiceID}
        />
      </Box>
    </PageContainer>
  );
}

export default XeroTransactions;
