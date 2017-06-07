export const isArray = Array.isArray && ((value) => Object.prototype.toString.call(value) === '[object Array]');

export const removeObject = (object, targetKey) => Object.keys(object).reduce((newObject, key) => {
  if (key === targetKey) {
    return newObject;
  }
  return {
    ...newObject,
    [key]: object[key],
  };
}, {});

export const updateArray = (oldArray, newArray, index) => ([
  ...oldArray.slice(0, index),
  ...isArray(newArray) ? newArray : [newArray],
  ...oldArray.slice(index + 1),
]);

export const removeArray = (array, index) => ([
  ...array.slice(0, index),
  ...array.slice(index + 1),
]);

export const moveArray = (array, index, target) => {
  if (target < 0 || target >= array.length) {
    return array;
  }
  const removedArray = removeArray(array, index);
  return [
    ...removedArray.slice(0, target),
    array[index],
    ...removedArray.slice(target),
  ];
};
