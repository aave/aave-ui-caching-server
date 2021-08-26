import crypto from 'crypto';

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const jsonParse = <ParsedType>(str: string) => {
  return JSON.parse(str) as ParsedType;
};

export const createHash = (data: any) => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('base64');
};
