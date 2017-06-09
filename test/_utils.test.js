import {
  isArray,
  isField,
  removeObject,
  updateArray,
  removeArray,
  moveArray,
  getFieldNames,
  getDisplayName,
  createValidate,
  createValidateAsync,
  createGetName,
} from '../src/_utils';

describe('utils', () => {
  it('isArray', () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(1)).toBe(false);
    expect(isArray('')).toBe(false);
  });

  it('isField', () => {
    expect(isField({
      errorMessages: [],
      isEnabled: true,
      isValidating: false,
      touched: false,
      value: null,
    })).toBe(true);
    expect(isField([])).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(1)).toBe(false);
    expect(isArray('')).toBe(false);
  });

  it('removeObject', () => {
    expect(removeObject({
      a: 1,
      b: 2,
    }, 'a')).toMatchSnapshot();
  });

  it('updateArray', () => {
    expect(updateArray([1, 2, 4], [3], -1)).toMatchSnapshot();
    expect(updateArray([1, 2, 4], [3], 2)).toMatchSnapshot();
    expect(updateArray([1, 2, 3], [4], 3)).toMatchSnapshot();
  });

  it('removeArray', () => {
    expect(removeArray([1, 2, 4], -1)).toMatchSnapshot();
    expect(removeArray([1, 2, 4], 2)).toMatchSnapshot();
    expect(removeArray([1, 2, 3], 3)).toMatchSnapshot();
  });

  it('moveArray', () => {
    expect(moveArray([1, 2, 4], 0, 2)).toMatchSnapshot();
    expect(moveArray([1, 2, 4], 3, -1)).toMatchSnapshot();
    expect(moveArray([1, 2, 3], -1, 4)).toMatchSnapshot();
  });

  it('getFieldNames', () => {
    expect(getFieldNames([])).toMatchSnapshot();
    expect(getFieldNames('foo')).toMatchSnapshot();
    expect(getFieldNames(['foo', 'bar'])).toMatchSnapshot();
  });

  it('getDisplayName', () => {
    expect(getDisplayName('Prefix', () => {})).toMatchSnapshot();
  });

  it('createValidate', () => {
    expect(createValidate([
      () => 'Error 1',
      () => ({}),
      () => 1,
      () => null,
    ])()).toMatchSnapshot();
  });

  it('createValidateAsync', async () => {
    expect(await createValidateAsync([
      () => Promise.resolve('Error 1'),
      () => Promise.resolve({}),
      () => Promise.resolve(1),
      () => Promise.resolve(null),
    ])()).toMatchSnapshot();
  });

  it('createGetName', () => {
    expect(createGetName(['foo', 'bar'], 0)()).toMatchSnapshot();
    expect(createGetName(['foo', 'bar'], 0)(0)).toMatchSnapshot();
  })
});
