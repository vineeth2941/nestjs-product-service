import { PipeTransform } from '@nestjs/common';

export class ParseValuePipe implements PipeTransform {
  transform(value: any) {
    return parseValue(value);
  }
}

const parseValue = function (obj: any = {}) {
  if (!obj) {
    return obj;
  }
  switch (typeof obj) {
    case 'string':
      if (!Number.isNaN(Number(obj))) {
        return Number(obj);
      }
      switch (obj) {
        case 'true':
          return true;
        case 'false':
          return false;
        case 'null':
          return null;
        case 'undefined':
          return undefined;
        default:
          return obj;
      }
    case 'object':
      if (Array.isArray(obj)) {
        return obj.map(parseValue);
      }
      const newObj = {};
      Object.entries(obj).forEach(([key, value]) => {
        Object.assign(newObj, { [key]: parseValue(value) });
      });
      return newObj;
    default:
      return obj;
  }
};
