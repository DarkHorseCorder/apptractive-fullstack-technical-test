import { makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar<boolean | null>(
  !!window.localStorage.getItem('sub')
);

export const subInVar = makeVar<string | null>(
  window.localStorage.getItem('sub')
);
