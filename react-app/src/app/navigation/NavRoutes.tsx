import { gql, useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components';
import { CSIsLoggedIn as IS_LOGGED_IN } from '../graphql';
import XeroRedirect from '../pages/XeroRedirect/XeroRedirect';
import { PATHS } from './paths';
import XeroTransactions from '../pages/XeroTransactions/XeroTransactions';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';

export const NavRoutes = () => {
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(
    () => loggedInData?.isLoggedIn || false,
    [loggedInData]
  );

  console.log('isLoggedIn: ', isLoggedIn);

  return (
    <Routes>
      <Route path={PATHS.xeroRedirect} element={<XeroRedirect/>}/>
      <Route element={<Layout/>}>
        {!isLoggedIn && <Route path={PATHS.root} element={<SignIn/>}/>}
        {isLoggedIn && <Route path={PATHS.root} element={<Dashboard/>}/>}
        <Route path={PATHS.dashboard} element={<Dashboard/>}/>
        <Route path={PATHS.signIn} element={<SignIn/>}/>
        <Route path={PATHS.signUp} element={<SignUp/>}/>
        <Route path={PATHS.xeroTransactions} element={<XeroTransactions/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  );
};
