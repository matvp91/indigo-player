import pickBy from 'lodash/pickBy';

export const exposeEnum: any = obj =>
  pickBy(obj, (type, key) => isNaN(key));
