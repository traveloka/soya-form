import { initialState } from './_reducers';

export const isArray = Array.isArray && (value => Object.prototype.toString.call(value) === '[object Array]');
export const isField = field => (
  typeof field === 'object' &&
  Object.keys(initialState.field).every(prop => field.hasOwnProperty(prop))
);

export const removeObject = (object, targetKey) => Object.keys(object).reduce((newObject, key) => {
  if (key === targetKey) {
    return newObject;
  }
  return {
    ...newObject,
    [key]: object[key],
  };
}, {});

export const updateArray = (oldArray, newArray, index) => {
  if (index < 0) {
    return oldArray;
  }
  return [
    ...oldArray.slice(0, index),
    ...isArray(newArray) ? newArray : [newArray],
    ...oldArray.slice(index + 1),
  ];
};

export const removeArray = (array, index) => {
  if (index < 0 || index >= array.length) {
    return array;
  }
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1),
  ];
};

export const moveArray = (array, index, target) => {
  if (index < 0 || index >= array.length || target < 0 || target >= array.length) {
    return array;
  }
  const removedArray = removeArray(array, index);
  return [
    ...removedArray.slice(0, target),
    array[index],
    ...removedArray.slice(target),
  ];
};

export const getFieldNames = fieldName => {
  if (fieldName !== 0 && !fieldName) {
    return [];
  }
  return isArray(fieldName) ? fieldName : [fieldName];
};

export const getDisplayName = (prefix, Component) => `${prefix}(${Component.displayName || Component.name || 'Component'})`;

const isValidErrorMessage = errorMessage => (
  ['string', 'object'].indexOf(typeof errorMessage) !== -1
);

export const createValidate = validators => value => {
  const errorMessages = [];
  for (const validator of validators) {
    const errorMessage = validator(value);
    if (errorMessage === null) {
      break;
    } else if (isValidErrorMessage(errorMessage)) {
      errorMessages.push(errorMessage);
    }
  }
  return errorMessages;
};

export const createValidateAsync = validators => value => {
  const promises = [];
  for (const validator of validators) {
    promises.push(validator(value));
  }
  return Promise.all(promises)
    .then(results => {
      const errorMessages = [];
      for (const result of results) {
        if (result === null) {
          break;
        } else if (isValidErrorMessage(result)) {
          errorMessages.push(result);
        }
      }
      return errorMessages;
    });
};

export const throwAndLogError = error => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    if (console) {
      /* eslint-disable no-console */
      if (console.error) {
        console.error(error);
      } else {
        console.log(error, error.stack);
      }
      /* eslint-enable no-console */
    }
  }
  throw error;
};

export const createGetName = (names, index) => name => {
  const fieldNames = names.concat(index);
  if (!name && name !== 0) {
    return fieldNames;
  }
  return fieldNames.concat(name);
};
