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

export const transform = serverResponse => {
  return Object.keys(serverResponse).reduce((carry, key) => {
    // primitive value see: https://github.com/lodash/lodash/issues/1406
    if (!isObject(serverResponse[key])) {
      return [...carry, { fieldName: key, value: serverResponse[key] }];
    }

    // Array value
    if (isArray(serverResponse[key])) {
      return [...carry, ...transformArray(serverResponse[key], [key])];
    }

    // Object value
    if (isPlainObject(serverResponse[key])) {
      return [...carry, ...transformObject(serverResponse[key], [key])];
    }

    return carry;
  }, []);
};
