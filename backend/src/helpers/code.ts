// resolves "The code contains one or more errors"
export const externalLibs = [
  'aws-sdk',
  '@aws-crypto/util',
  '@aws-appsync/utils',
  '@aws-sdk/client-lambda',
  'tslib'
];

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
