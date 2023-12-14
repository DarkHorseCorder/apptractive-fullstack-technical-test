import {
  Alert,
  TextField,
} from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { useMemo, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PASSWORD_POLICY } from '../../constants/auth';
import { AuthError, RequestStatus } from '../../types';
import { Form } from '../../components/Form/Form';

export interface NewPasswordFormData {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

interface NewPasswordFormProps {
  authStatus: RequestStatus;
  authError: AuthError;
  oldPassword?: string;
  submittedEmail?: string;
  onSubmit: SubmitHandler<NewPasswordFormData>;
}

const NewPasswordForm = ({
  authStatus,
  authError,
  oldPassword,
  onSubmit,
}: NewPasswordFormProps) => {
  const { t } = useTranslation();
  //const [isOldVisible, setIsOldVisible] = useState(false);
  //const [isNewVisible, setIsNewVisible] = useState(false);
  //const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const oldPasswordInput = useRef(null);
  const newPasswordInput = useRef(null);
  const passwordConfirmInput = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<NewPasswordFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { newPassword } = watch();

  const inputs = useMemo(
    () => ({
      oldPassword: {
        label: t('oldPasswordTitle', { ns: 'common' }),
        name: 'oldPassword' as const,
        type: 'password',
        placeholder: '',
        defaultValue: oldPassword || '',
        rules: {
          required: t('oldPasswordRequired', { ns: 'common' }),
        },
      },
      newPassword: {
        label: t('newPasswordTitle', { ns: 'common' }),
        name: 'newPassword' as const,
        type: 'password',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('newPasswordRequired', { ns: 'common' }),
          minLength: {
            value: PASSWORD_POLICY.length,
            message: `${t('passwordMustBe', { ns: 'common' })} ${
              PASSWORD_POLICY.length
            } ${t('orMoreCharacters', { ns: 'common' })}`,
          },
        },
      },
      passwordConfirm: {
        name: 'passwordConfirm' as const,
        label: t('confirmPasswordTitle', { ns: 'common' }),
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('confirmPasswordRequired', { ns: 'common' }),
          validate: (value: string) =>
            value === newPassword || t('confirmNotMatch', { ns: 'common' }),
        },
      },
    }),
    [t, newPassword, oldPassword]
  );

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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField type="hidden" autoComplete="username" />

      <Controller
        control={control}
        name={inputs.oldPassword.name}
        rules={inputs.oldPassword.rules}
        defaultValue={inputs.oldPassword.defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            type="password"
            //type={isOldVisible ? 'text' : 'password'}
            inputRef={oldPasswordInput}
            label={inputs.oldPassword.label}
            autoComplete="current-password"
            //rightIcon={showHidePassword(isOldVisible, setIsOldVisible)}
            error={!!(errors.oldPassword && errors.oldPassword.message)}
            helperText={
              (errors.oldPassword && errors.oldPassword.message) || ''
            }
            margin="dense"
          />
        )}
      />

      <Controller
        control={control}
        name={inputs.newPassword.name}
        rules={inputs.newPassword.rules}
        defaultValue={inputs.newPassword.defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            type="password"
            //type={isNewVisible ? 'text' : 'password'}
            inputRef={newPasswordInput}
            label={inputs.newPassword.label}
            autoComplete="new-password"

            error={!!(errors.newPassword && errors.newPassword.message)}
            helperText={
              (errors.newPassword && errors.newPassword.message) || ''
            }
            margin="dense"
          />
        )}
      />

      <Controller
        control={control}
        name={inputs.passwordConfirm.name}
        rules={inputs.passwordConfirm.rules}
        defaultValue={inputs.passwordConfirm.defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            type="password"
            //type={isConfirmVisible ? 'text' : 'password'}
            inputRef={passwordConfirmInput}
            label={inputs.passwordConfirm.label}
            autoComplete="new-password"
            error={!!(errors.passwordConfirm && errors.passwordConfirm.message)}
            helperText={
              (errors.passwordConfirm && errors.passwordConfirm.message) || ''
            }
            margin="dense"
          />
        )}
      />

      <input hidden type="text" autoComplete="username" />

      {authError?.code && (
        <Alert
          title={t(authError.code, { ns: 'authentication' })!}
          severity="error"
        />
      )}

      <Button
        loading={authStatus === 'submitting'}
        sx={{
          mt: 1,
          alignSelf: 'flex-start',
        }}
      >
        {t('updateTitle', { ns: 'common' })}
      </Button>
    </Form>
  );
};

export default NewPasswordForm;
