const base36Chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

const ID_LENGTH = 25;

const base36Id = (): string => {
  let str = '';
  for (let i = 0; i < ID_LENGTH; ++i) {
    str += base36Chars.charAt(Math.floor(Math.random() * 36));
  }
  return str;
};

export { base36Id };
