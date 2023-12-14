export const ADMIN_GROUPS: string[] = ['SuperAdmins', 'Admins'];

export const COGNITO_ERRORS = [
  {
    code: 'UserNotFoundException',
    message: 'Email entered not registered',
    field: 'email',
  },
  {
    code: 'UserNotConfirmedException',
    message: 'Email entered is not verified',
    field: 'email',
  },
  {
    code: 'NotAuthorizedException',
    message: 'Incorrect username or password',
    field: 'password',
  },
  {
    code: 'UsernameExistsException',
    message: 'An account with entered email already exists',
    field: 'email',
  },
  {
    code: 'CodeMismatchException',
    message: 'Code you have entered does not match',
    field: 'code',
  },
  {
    code: 'ExpiredCodeException',
    message: 'Code you have entered has expired',
    field: 'code',
  },
  {
    code: 'InvalidParameterException',
    message:
      'Cannot reset password for the user as there is no registered / verified email or phone number',
    field: 'email',
  },
  {
    code: 'LimitExceededException',
    message: 'Attempt limit reached, please try again after some time',
    field: 'email',
  },
];

export const RESET_PASSWORD_ERRORS = [];

export const PASSWORD_POLICY = {
  length: 6,
  numbers: true,
  symbols: false,
  lowercase: false,
  uppercase: false,
  strict: true,
};

export const SIGNUP_CODE_CHARS = 6;

export const RESET_CODE_CHARS = 6;

export const MFA_ISSUER = 'Apptractive';
