import { getUtf8Bytes } from 'src/util/encode';

test('getUtf8Bytes', () => {
  expect(getUtf8Bytes('a')).toEqual(getUtf8Bytes('a'));
});
