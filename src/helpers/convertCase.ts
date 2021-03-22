import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

type ToCase = (arg: string) => string;
function convertObjectCase(obj: any, toCase: ToCase): any {
  if (Array.isArray(obj)) {
    return obj.map(v => convertObjectCase(v, toCase));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toCase(key)]: convertObjectCase(obj[key], toCase),
      }),
      {},
    );
  }
  return obj;
}

function toCamelCase<R>(obj: any): R {
    return convertObjectCase(obj, camelCase)
}

function toSnakeCase<R>(obj: any): R {
    return convertObjectCase(obj, snakeCase)
}

export { toCamelCase, toSnakeCase }
