import { translations } from '../src/ui/i18n';
import difference from 'lodash/difference';

const keys = Object.keys(translations['en-US']);
const languages = Object.keys(translations);

languages.forEach(lang => {
  test(`has equal mappings for ${lang}`, () => {
    const diff = difference(keys, Object.keys(translations[lang]));
    expect(diff.length).toBe(0);
  });
});
