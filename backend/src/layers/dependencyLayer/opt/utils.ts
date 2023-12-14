export const uniqueArray = (arr: any[]) => {
  return [...new Set(arr)];
};

/**
 *
 * @param arr
 * @param property
 * @returns {unknown[]}
 */
export const uniqueArrayOfObjects = (arr: any[], property: string) => {
  return [...new Map(arr.map((v) => [v[property], v])).values()];
};

export const sortObjectAlphabetical = (obj: Record<any, any>) => {
  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: obj[key],
      }),
      {}
    );
};

export const splitObjectIntoChunks = (
  object: Record<any, any>,
  len: number
) => {
  const values = Object.values(object);
  const final = [];
  let counter = 0;
  let portion: Record<any, any> = {};

  for (const key in object) {
    if (counter !== 0 && counter % len === 0) {
      final.push(portion);
      portion = {};
    }
    portion[key] = values[counter];
    counter++;
  }

  final.push(portion);
  return final;
};

export const convertPascalToUnderscore = (
  obj: Record<string, any>
): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertPascalToUnderscore(item));
  }

  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const underscoreKey = key
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();
      result[underscoreKey] = convertPascalToUnderscore(obj[key]);
    }
  }

  return result;
};

export const parseQueryParams = (url: string): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const params = queryString.split('&');
    params.forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        queryParams[key] = decodeURIComponent(value);
      }
    });
  }
  return queryParams;
};
