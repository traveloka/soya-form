import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isPlainObject from "lodash/isPlainObject";

export const transformObject = (operand, parentKeys) => {
  return Object.keys(operand).reduce((carry, key) => {
    // primitive value see: https://github.com/lodash/lodash/issues/1406
    if (!isObject(operand[key])) {
      return [
        ...carry,
        { fieldName: [...parentKeys, key], value: operand[key] }
      ];
    }

    // Array value
    if (isArray(operand[key])) {
      return [...carry, ...transformArray(operand[key], [...parentKeys, key])];
    }

    // Object value
    if (isPlainObject(operand[key])) {
      return [...carry, ...transformObject(operand[key], [...parentKeys, key])];
    }

    return carry;
  }, []);
};

export const transformArray = (operand, parentKeys) => {
  return operand.reduce((carry, arrayItem, currIdx) => {
    // primitive value see: https://github.com/lodash/lodash/issues/1406
    if (!isObject(arrayItem)) {
      return [
        ...carry,
        { fieldName: [...parentKeys, currIdx], value: arrayItem }
      ];
    }

    // Object value
    if (isPlainObject(arrayItem)) {
      return [
        ...carry,
        ...transformObject(arrayItem, [...parentKeys, currIdx])
      ];
    }

    return carry;
  }, []);
};

export const transform = (object, parentKeys) => {
  return Object.keys(object).reduce((carry, key) => {
    // primitive value see: https://github.com/lodash/lodash/issues/1406
    if (!isObject(object[key])) {
      return [...carry, { fieldName: key, value: object[key] }];
    }

    // Array value
    if (isArray(object[key])) {
      return [...carry, ...transformArray(object[key], [key])];
    }

    // Object value
    if (isPlainObject(object[key])) {
      return [...carry, ...transformObject(object[key], [key])];
    }

    return carry;
  }, []);
};
