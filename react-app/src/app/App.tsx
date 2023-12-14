import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { DesignSystemContextProvider } from './components';
import { Amplify } from 'aws-amplify';
import { getTheme } from './constants/theme';
import { createEmotionCache } from './helpers/createEmotionCache';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { defaultTheme } from './helpers/defaultTheme';
import { NavRoutes } from './navigation/NavRoutes';
import './i18n';
import cdkOutput from './output.json';

const defaultCache = createEmotionCache();
const theme = getTheme(defaultTheme('light'));

Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_appsync_graphqlEndpoint: cdkOutput.FULAppSyncAPIStack.GraphQLAPIURL,
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_cognito_identity_pool_id: cdkOutput.FULAuthStack.IdentityPoolId,
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: cdkOutput.FULAuthStack.UserPoolId,
  aws_user_pools_web_client_id: cdkOutput.FULAuthStack.UserPoolClientId,
  aws_cognito_username_attributes: ['EMAIL', 'PHONE_NUMBER'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: [],
  aws_cognito_mfa_configuration: 'OPTIONAL',
  aws_cognito_mfa_types: ['SMS', 'OTP'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      'REQUIRES_LOWERCASE',
      'REQUIRES_UPPERCASE',
      'REQUIRES_NUMBERS',
      'REQUIRES_SYMBOLS',
    ],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
});

export function App() {
  return (<CacheProvider value={defaultCache}>
      <EmotionThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <DesignSystemContextProvider theme={theme}>
            <NavRoutes/>
          </DesignSystemContextProvider>
        </ThemeProvider>
      </EmotionThemeProvider>
    </CacheProvider>);
}

export default App;
