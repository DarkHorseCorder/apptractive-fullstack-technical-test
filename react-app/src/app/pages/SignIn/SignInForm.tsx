import { useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  TextField,
} from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Flex } from '../../components';
import { Form } from '../../components/Form/Form';
import { SIGNUP_CODE_CHARS } from '../../constants/auth';
import { REGEX } from '../../constants/config';
import { AuthError, RequestStatus } from '../../types';

export interface SignInFormData {
  email?: string;
  code?: string;
  password?: string;
}

export interface ConfirmSignUpFormData {
  email: string;
  code: string;
  password: string;
}

export interface ConfirmMfaFormData {
  code: string;
}

interface SignInFormProps {
  mfaCodeRequired: boolean;
  authStatus: RequestStatus;
  authError: AuthError;
  codeDelivery: string;
  onSignIn: (data: SignInFormData) => void;
  onConfirmMfa: (data: ConfirmMfaFormData) => void;
  onConfirmSignUp: (data: ConfirmSignUpFormData) => void;
  onResendCode: () => void;
}

const SignInForm = ({
  mfaCodeRequired,
  authStatus,
  authError,
  codeDelivery,
  onSignIn,
  onConfirmMfa,
  onConfirmSignUp,
  onResendCode,
}: SignInFormProps) => {
  const { t } = useTranslation();
  //const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInput = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = useMemo(
    () => ({
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        type: 'email',
        placeholder: null,
        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      password: {
        label: t('passwordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: null,
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: null,
        type: 'number',
        defaultValue: '',
        rules: {
          required: t('codeRequired', { ns: 'common' }),
          minLength: {
            value: SIGNUP_CODE_CHARS,
            message: `${t('codeMustBe', {
              ns: 'common',
            })} ${SIGNUP_CODE_CHARS} ${t('characters', { ns: 'common' })}`,
          },
        },
      },
    }),
    [t]
  );

  /**
   * Handle form submit
   */
  const onSubmit = (data: any) => {
    // 2fa sign in
    if (mfaCodeRequired) {
      onConfirmMfa(data);
    }
    // complete sign up
    else if (codeDelivery) {
      onConfirmSignUp(data);
    }
    // sign in
    else {
      onSignIn(data);
    }
    //!codeDelivery ? onSignIn(data) : onConfirmSignUp(data);
  };

  /**
   * Renders the show / hide password for input
   *
   * @returns {*}
   */
  //const showHidePassword = (
  //  isPasswordVisible: boolean,
  //  onClick: (isPasswordVisible: boolean) => void
  //) => (
  //  <IconButton
  //    icon={isPasswordVisible ? 'EyeOff' : 'Eye'}
  //    onClick={() => onClick(!isPasswordVisible)}
  //  />
  //);

  /**
   * Reset code field and trigger resend new code
   */
  const onResendCodePress = async () => {
    setValue('code', '');

    onResendCode();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {codeDelivery || mfaCodeRequired ? (
        <Controller
          control={control}
          name={inputs.code.name}
          rules={inputs.code.rules}
          defaultValue={inputs.code.defaultValue}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              type={inputs.code.type}
              label={inputs.code.label}
              //placeholder={inputs.email.placeholder}
              error={!!(errors.code && errors.code.message)}
              helperText={
                ((errors.code && errors.code.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />
      ) : (
        <>
          <Controller
            control={control}
            name={inputs.email.name}
            rules={inputs.email.rules}
            defaultValue={inputs.email.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                type={inputs.email.type}
                label={inputs.email.label}
                autoComplete="username"
                //placeholder={inputs.email.placeholder}
                error={!!(errors.email && errors.email.message)}
                helperText={
                  ((errors.email && errors.email.message) as string) || ''
                }
                margin="dense"
              />
            )}
          />
          <Controller
            control={control}
            name={inputs.password.name}
            rules={inputs.password.rules}
            defaultValue={inputs.password.defaultValue}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                type="password"
                inputRef={passwordInput}
                autoComplete="current-password"
                label={inputs.password.label}
                //rightIcon={showHidePassword(
                //  isPasswordVisible,
                //  setIsPasswordVisible
                //)}
                error={!!(errors.password && errors.password.message)}
                helperText={
                  ((errors.password && errors.password.message) as string) || ''
                }
                margin="dense"
              />
            )}
          />
        </>
      )}

      {authError?.code && (
        <Alert
          title={t(authError.code, { ns: 'authentication' })!}
          severity="error"
        />
      )}

      <Flex mt={2} mb={1}>
        <Button
          type="submit"
          variant="contained"
          loading={authStatus === 'submitting'}
        >
          {!codeDelivery
            ? t('signInTitle', { ns: 'common' })
            : t('proceedTitle', { ns: 'common' })}
        </Button>
      </Flex>

      {codeDelivery && (
        <Flex justifyContent="center">
          <Button
            variant="text"
            type="button"
            onClick={onResendCodePress}
          >
            {t('resendCodeTitle', { ns: 'common' })}
          </Button>
        </Flex>
      )}
    </Form>
  );
};

export default SignInForm;
