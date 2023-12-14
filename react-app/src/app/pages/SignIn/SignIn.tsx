import { gql, useLazyQuery } from '@apollo/client';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Flex, Link } from '../../components';
import { isLoggedInVar, subInVar } from '../../graphql';
import { PATHS } from '../../navigation/paths';
import { AuthError, RequestStatus } from '../../types';
import NewPasswordForm, { NewPasswordFormData } from './NewPasswordForm';
import SignInForm, {
  ConfirmMfaFormData,
  ConfirmSignUpFormData,
  SignInFormData,
} from './SignInForm';
import { getUser as GET_USER } from '../../graphql';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isNewPasswordRequired, setIsNewPasswordRequired] =
    useState<boolean>(false);
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [mfaCodeRequired, setMfaCodeRequired] = useState(false);
  const [authUser, setAuthUser] = useState<any>({});
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');

  const [getUser, { error: userError }] = useLazyQuery(gql(GET_USER));

  useEffect(() => {
    isLoggedInVar(false);
    localStorage.removeItem('sub');
  }, []);

  /**
   * Sign in a user
   *
   * @param data
   */
  const onSignIn = async (data: SignInFormData) => {
    setAuthStatus('submitting');
    setAuthError({});
    const { email, password } = data;

    if (email && password) {
      const params = {
        username: email?.toLowerCase()?.trim(),
        password,
      };

      let signInResponse;
      try {
        signInResponse = await Auth.signIn(params);
      } catch (err: any) {
        console.log('ERROR sign in: ', err);
        setAuthError(err);
        setAuthStatus('error');

        if (err.code === 'UserNotConfirmedException') {
          await resendCode({ email });
        }
      }

      if (signInResponse) {
        localStorage.setItem('sub', signInResponse.username as string);

        //mfa sign in
        // signInResponse.challengeName === 'SMS_MFA' ||
        if (signInResponse.challengeName === 'SOFTWARE_TOKEN_MFA') {
          setAuthUser(signInResponse);
          setMfaCodeRequired(true);
          setAuthStatus('success');
        }

        // sign in success
        else {
          await onSignInSuccess(signInResponse, password);
        }
      }
    }
  };

  const onSignInSuccess = async (signInResponse: any, password = '') => {
    let loggedInUserData;
    if (signInResponse?.challengeName !== 'NEW_PASSWORD_REQUIRED') {
      try {
        loggedInUserData = await getUser({
          variables: {
            id: signInResponse.username,
            skip: signInResponse?.challengeName === 'NEW_PASSWORD_REQUIRED',
          },
        });
      } catch (err) {
        console.log('ERROR getUser', err);
      }
    }

    const loggedInUser = loggedInUserData?.data?.getUser;
    console.log('loggedInUser: ', loggedInUser);

    setAuthStatus('success');
    if (signInResponse?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      setAuthUser(signInResponse);
      setSubmittedPassword(password);
      setIsNewPasswordRequired(true);
    } else {
      isLoggedInVar(true);
      subInVar(signInResponse.username);
      // redirect to dashboard if logged in
      navigate(PATHS.dashboard, { replace: true });
    }
  };

  const onSubmitNewPassword = async ({ newPassword }: NewPasswordFormData) => {
    setAuthStatus('submitting');
    try {
      await Auth.completeNewPassword(authUser, newPassword);

      // at this time the user is logged in if no MFA required
      localStorage.setItem('sub', authUser.username as string);

      isLoggedInVar(true);
      subInVar(authUser.username);
      navigate(PATHS.dashboard, { replace: true });
    } catch (err: any) {
      console.log('ERROR set new password: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  /**
   * Resend verification code for sign in
   */
  const resendCode = async ({ email }: { email: string }) => {
    setSubmittedEmail(email.toLowerCase().trim());

    try {
      const {
        CodeDeliveryDetails: { DeliveryMedium },
      } = await Auth.resendSignUp(email.toLowerCase().trim());
      setCodeDelivery(DeliveryMedium);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    alert(t('unverifiedEmailSendCode', { ns: 'common' }));
  };

  const onConfirmSignUp = async ({
    email,
    password,
    code,
  }: ConfirmSignUpFormData) => {
    setAuthStatus('submitting');
    setAuthError({});

    try {
      await Auth.confirmSignUp(email, code);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    try {
      const params = {
        username: email.toLowerCase().trim(),
        password,
      };

      const user = await Auth.signIn(params);

      localStorage.setItem('sub', user.username as string);
      isLoggedInVar(true);
      subInVar(user.username);
      setAuthStatus('success');
      navigate(PATHS.dashboard, { replace: true });
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onConfirmMfa = async ({ code }: ConfirmMfaFormData) => {
    setAuthStatus('submitting');
    try {
      const confirmSignInResponse = await Auth.confirmSignIn(
        authUser,
        code,
        'SOFTWARE_TOKEN_MFA'
      ); // SMS_MFA, SOFTWARE_TOKEN_MFA
      console.log('confirmSignInResponse: ', confirmSignInResponse);

      await onSignInSuccess(confirmSignInResponse);
    } catch (err: any) {
      console.log('ERROR mfa sign in: ', err);
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  const onResendCode = async () => {
    setAuthError({});
    setAuthStatus('idle');
    try {
      await Auth.resendSignUp(submittedEmail);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Card
        sx={{
          width: ['100%', '100%', '50%'],
          backgroundColor: 'background.paper',
          boxShadow: 5,
          borderRadius: 1,
          padding: 5,
        }}
      >
        {codeDelivery && (
          <Typography variant="h2" color="textSecondary">
            {t('verificationSent', { ns: 'common' })}
          </Typography>
        )}
        {!codeDelivery && !mfaCodeRequired && (
          <Typography variant="h2" color="textSecondary">
            {t('welcomeBack', { ns: 'signIn' })}
          </Typography>
        )}
        {mfaCodeRequired && (
          <Typography variant="h2" color="textSecondary">
            {t('mfaCodeRequired', { ns: 'authentication' })}
          </Typography>
        )}

        <Flex flexDirection="row" flexWrap="wrap">
          {mfaCodeRequired && (
            <Typography>
              {t('enterMfaCode', { ns: 'authentication' })}
            </Typography>
          )}
          {codeDelivery && !isNewPasswordRequired && (
            <Typography>
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              {submittedEmail}
            </Typography>
          )}

          {!codeDelivery && isNewPasswordRequired && (
            <Typography>
              {t('newPasswordContinue', { ns: 'common' })}
            </Typography>
          )}

          {!codeDelivery && !isNewPasswordRequired && !mfaCodeRequired && (
            <Typography color="textSecondary">
              {t('noAccount', { ns: 'signIn' })}{' '}
              <Link to={PATHS.signUp}>
                {t('signUpTitle', { ns: 'common' })}
              </Link>
            </Typography>
          )}
        </Flex>

        {!isNewPasswordRequired && (
          <SignInForm
            mfaCodeRequired={mfaCodeRequired}
            authError={authError}
            authStatus={authStatus}
            codeDelivery={codeDelivery}
            onSignIn={onSignIn}
            onConfirmSignUp={onConfirmSignUp}
            onConfirmMfa={onConfirmMfa}
            onResendCode={onResendCode}
          />
        )}

        {isNewPasswordRequired && (
          <NewPasswordForm
            submittedEmail={submittedEmail}
            authError={authError}
            authStatus={authStatus}
            oldPassword={submittedPassword}
            onSubmit={onSubmitNewPassword}
          />
        )}

        {userError?.message && (
          <Alert title={userError.message} severity="error" />
        )}
      </Card>
    </Flex>
  );
};

export default SignIn;
