import pickBy from 'lodash/pickBy';

export const exposeEnum: any = obj =>
  pickBy(obj, type => typeof type === 'number');
