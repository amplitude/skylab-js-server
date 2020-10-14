const encode = (unencoded) => {
  return Buffer.from(unencoded || '').toString('base64');
};

export const urlSafeBase64Encode = (s: string): string => {
  const encoded = encode(s);
  return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};
