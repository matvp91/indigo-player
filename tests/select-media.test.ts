import { selectMedia } from '../src/selectMedia';
import { Instance } from './__mocks__/Instance';

let instance;

beforeAll(() => {
  instance = new Instance();
});

test('can call media', () => {
  const media = selectMedia(instance, []);
  console.log(media);
});
