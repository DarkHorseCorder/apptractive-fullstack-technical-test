export const NAVBAR_HEIGHT = 64;
export const FOOTER_HEIGHT = 116;

export const REGEX = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
  URL: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/gi,
};

export const TERMS_CONDITIONS_URL =
  'https://apptractive.com.au/terms-conditions';
export const PRIVACY_POLICY_URL = 'https://apptractive.com.au/privacy-policy';

export const PASSWORD_POLICY = {
  length: 8,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: true,
  strict: true,
};

export const SIGNUP_CODE_CHARS = 6;
