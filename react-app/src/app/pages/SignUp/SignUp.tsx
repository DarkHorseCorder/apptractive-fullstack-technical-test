import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from '../../components';
import { Box, Card, Typography } from '@mui/material';
import { isLoggedInVar, subInVar } from '../../graphql';
import { PATHS } from '../../navigation/paths';
import { AuthError, RequestStatus } from '../../types';
import SignUpForm, { SignUpFormData } from './SignUpForm';
import { Flex} from '../../components';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<RequestStatus>('idle');
  const [authError, setAuthError] = useState<AuthError>({});
  const [codeDelivery, setCodeDelivery] = useState<string>('');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const onSignUp = async ({ email, password, phone }: SignUpFormData) => {
    const params = {
      username: email.toLowerCase().trim(),
      password,
      attributes: {
        email: email.toLowerCase().trim(),
        phone_number: phone || null
      },
    };

    if (email) {
      setSubmittedEmail(email);
    }

    if (phone) {
      setSubmittedPhone(phone);
    }

    try {
      const { codeDeliveryDetails } = await Auth.signUp(params);
      setCodeDelivery(codeDeliveryDetails.DeliveryMedium);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    setAuthStatus('success');
  };

  const onConfirmSignUp = async ({ email, password, code }: SignUpFormData) => {
    let response;
    try {
      response = await Auth.confirmSignUp(email, code);
    } catch (err: any) {
      setAuthError(err);
      setAuthStatus('error');
    }

    if (response) {
      try {
        const params = {
          username: email.toLowerCase().trim(),
          password,
        };

        const user = await Auth.signIn(params);

        localStorage.setItem('sub', user.username as string);

        isLoggedInVar(true);
        subInVar(user.username);
        // redirect to dashboard if logged in
        navigate(PATHS.dashboard, { replace: true });
      } catch (err: any) {
        console.log('ERROR sign in: ', err);
        setAuthError(err);
        setAuthStatus('error');
      }
    }
  };

  /**
   * Handle submit sign up form
   */
  const onSubmit = (data: SignUpFormData) => {
    setAuthStatus('submitting');
    setAuthError({});
    !codeDelivery ? onSignUp(data) : onConfirmSignUp(data);
  };

  /**
   * Reset code field and trigger resend new code
   */
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
        <Typography variant="h2" color="textSecondary">
          {codeDelivery
            ? t('codeSent', { ns: 'common' })
            : t('createYourAccount', { ns: 'common' })}
        </Typography>

        <Box>
          {!codeDelivery && (
            <Typography color="textSecondary">
              {t('alreadyHaveAccount', { ns: 'signUp' })}{' '}
              <Link to={PATHS.signIn}>
                {t('signInTitle', { ns: 'common' })}
              </Link>{' '}
            </Typography>
          )}
          {codeDelivery && (
            <Typography>
              {t('enterVerificationCodeSent', { ns: 'common' })}{' '}
              <Box component="span" fontWeight={600}>
                {codeDelivery === 'EMAIL' ? submittedEmail : submittedPhone}
              </Box>
            </Typography>
          )}
        </Box>

        <SignUpForm
          authError={authError}
          authStatus={authStatus}
          codeDelivery={codeDelivery}
          onSubmit={onSubmit}
          onResendCode={onResendCode}
        />
      </Card>
    </Flex>
  );
};

export default SignUp;
