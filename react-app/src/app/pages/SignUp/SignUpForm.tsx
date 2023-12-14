import { useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Flex } from '../../components';
import { Form } from '../../components/Form/Form';
import {
  REGEX,
  PASSWORD_POLICY,
  SIGNUP_CODE_CHARS,
  TERMS_CONDITIONS_URL,
  PRIVACY_POLICY_URL,
} from '../../constants/config';
import {
  Alert,
  Link,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { RequestStatus } from '../../types';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password: string;
  code: string;
}

interface SignUpFormProps {
  authError: any;
  authStatus: RequestStatus;
  codeDelivery: string;
  onSubmit: SubmitHandler<any>;
  onResendCode: () => void;
}

const SignUpForm = ({
  authError,
  authStatus,
  codeDelivery,
  onSubmit,
  onResendCode,
}: SignUpFormProps) => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
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
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      phone: {
        label: t('mobileTitle', { ns: 'common' }),
        name: 'phone',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('mobileRequired', { ns: 'common' }),
        },
      },
      password: {
        label: t('passwordTitle', { ns: 'common' }),
        name: 'password',
        type: 'password',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('passwordRequired', { ns: 'common' }),
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },
        },
      },
      code: {
        name: 'code',
        label: t('codeTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        type: 'number',
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
   * Reset code field and trigger resend new code
   */
  const onResendCodePress = async () => {
    setValue('code', '');

    onResendCode();
  };

  return (
    <>
      <Modal
        open={showInfo}
        onClose={() => setShowInfo(false)}
        sx={{ width: '95%' }}
      >
        <Flex flexDirection="column">
          <Typography variant="h3">
            {t('brandInfoTitle', { ns: 'signUp' })}
          </Typography>
          <Typography>
            {t('brandInfoDescription', { ns: 'signUp' })}
          </Typography>

          <Typography variant="h3" mt={3}>
            {t('journalistInfoTitle', { ns: 'signUp' })}
          </Typography>
          <Typography>
            {' '}
            {t('journalistInfoDescription', { ns: 'signUp' })}
          </Typography>
        </Flex>
      </Modal>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {codeDelivery ? (
          <Controller
            control={control}
            name={inputs.code.name}
            rules={inputs.code.rules}
            defaultValue={inputs.code.defaultValue}
            render={({ field }) => (
              <TextField
                {...field}
                type={inputs.code.type}
                label={inputs.code.label}
                //placeholder={inputs.email.placeholder}
                error={!!(errors.code && errors.code.message)}
                helperText={
                  ((errors.code && errors.code.message) || '') as string
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
              render={({ field }) => (
                <TextField
                  {...field}
                  type={inputs.email.type}
                  label={inputs.email.label}
                  //placeholder={inputs.email.placeholder}
                  error={!!(errors.email && errors.email.message)}
                  helperText={
                    ((errors.email && errors.email.message) as string) || ''
                  }
                  margin="dense"
                />
              )}
            />
            {/*<Controller*/}
            {/*  control={control}*/}
            {/*  name={inputs.phone.name}*/}
            {/*  rules={inputs.phone.rules}*/}
            {/*  defaultValue={inputs.phone.defaultValue}*/}
            {/*  render={({ field }) => (*/}
            {/*    <PHInput*/}
            {/*      {...field}*/}
            {/*      label={inputs.phone.label}*/}
            {/*      defaultCountry={"AU"}*/}
            {/*      withCountryCallingCode={true}*/}
            {/*      error={!!(errors.phone && errors.phone.message)}*/}
            {/*      helperText={(errors.phone && errors.phone.message) as string || ""}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*/>*/}
            <Controller
              control={control}
              name={inputs.password.name}
              rules={inputs.password.rules}
              defaultValue={inputs.password.defaultValue}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  //type={isPasswordVisible ? 'text' : 'password'}
                  inputRef={passwordInput}
                  label={inputs.password.label}
                  //rightIcon={
                  //  <IconButton
                  //    icon={isPasswordVisible ? 'EyeOff' : 'Eye'}
                  //    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  //  />
                  //}
                  error={!!(errors.password && errors.password.message)}
                  helperText={
                    ((errors.password && errors.password.message) as string) ||
                    ''
                  }
                  margin="dense"
                />
              )}
            />
          </>
        )}

        {!codeDelivery && (
          <Typography mb={1} mt={1}>
            {t('signUpAgreeTo', { ns: 'signUp' })}{' '}
            <Link href={TERMS_CONDITIONS_URL} target="_blank">
              {t('termsConditionsTitle', { ns: 'common' })}
            </Link>{' '}
            {t('and', { ns: 'signUp' })}{' '}
            <Link href={PRIVACY_POLICY_URL} target="_blank">
              {t('privacyPolicyTitle', { ns: 'common' })}
            </Link>
          </Typography>
        )}

        {authError?.code && (
          <Alert
            title={t(authError.code, { ns: 'authentication' })}
            severity="error"
          />
        )}

        <Flex>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 1 }}
            loading={authStatus === 'submitting'}>
            {codeDelivery
              ? t('signUpTitle', { ns: 'common' })
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
    </>
  );
};

export default SignUpForm;
