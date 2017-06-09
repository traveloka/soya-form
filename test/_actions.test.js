import {
  setFormEnabledState,
  setFormIsSubmittingState,
  setIsValidating,
  mergeFields,
  setValue,
  setValues,
  setDefaultValue,
  setDefaultValues,
  clearField,
  setErrorMessages,
  addErrorMessages,
  clearErrorMessages,
  clear,
  addListItem,
  addListItemWithValue,
  removeListItem,
  reorderListItem,
  reorderListItemDec,
  reorderListItemInc,
} from '../src/_actions';

describe('form actions', () => {
  const formId = 'simpleForm';

  it('should create an action to enable form', () => {
    expect(setFormEnabledState(formId, true)).toMatchSnapshot();
  });

  it('should create an action to disable form', () => {
    expect(setFormEnabledState(formId, false)).toMatchSnapshot();
  });

  it('should create an action to lock form submission', () => {
    expect(setFormIsSubmittingState(formId, true)).toMatchSnapshot();
  });

  it('should create an action to unlock form submission', () => {
    expect(setFormIsSubmittingState(formId, false)).toMatchSnapshot();
  });

  it('should create an action to set is validating form', () => {
    expect(setIsValidating(formId, {
      foo: false,
      bar: true,
    })).toMatchSnapshot();
  });

  it('should create an action to merge fields', () => {
    expect(mergeFields(formId, [{
      fieldName: ['foo'],
      object: {
        errorMessages: [],
        isEnabled: true,
        isValidating: false,
        touched: true,
        value: "Hello",
      },
    }])).toMatchSnapshot();
  });

  it('should create an action to set value', () => {
    expect(setValue(formId, ['foo'], 'Hello')).toMatchSnapshot();
    expect(setValue(formId, ['foo', 'bar'], 'Hello World')).toMatchSnapshot();
  });

  it('should create an action to set values', () => {
    expect(setValues(formId, [{
      fieldName: ['foo'],
      value: 'Hello'
    }, {
      fieldName: ['foo', 'bar'],
      value: 'Hello World'
    }])).toMatchSnapshot();
  });

  it('should create an action to set default value', () => {
    expect(setDefaultValue(formId, ['foo'], 'Hello')).toMatchSnapshot();
    expect(setDefaultValue(formId, ['foo', 'bar'], 'Hello World')).toMatchSnapshot();
  });

  it('should create an action to set default values', () => {
    expect(setDefaultValues(formId, [{
      fieldName: ['foo'],
      value: 'Hello'
    }, {
      fieldName: ['foo', 'bar'],
      value: 'Hello World'
    }])).toMatchSnapshot();
  });

  it('should create an action to clear field', () => {
    expect(clearField(formId, ['foo'])).toMatchSnapshot();
    expect(clearField(formId, ['foo', 'bar'])).toMatchSnapshot();
  });

  it('should create an action to set error messages', () => {
    expect(setErrorMessages(formId, ['foo'], ['Error 1', 'Error 2'])).toMatchSnapshot();
    expect(setErrorMessages(formId, ['foo', 'bar'], ['Error 1', 'Error 2', 'Error 3'])).toMatchSnapshot();
  });

  it('should create an action to add error messages', () => {
    expect(addErrorMessages(formId, [{
      fieldName: ['foo'],
      errorMessages: ['Error 1', 'Error 2'],
    }, {
      fieldName: ['foo', 'bar'],
      errorMessages: ['Error 1', 'Error 2', 'Error 3'],
    }])).toMatchSnapshot();
  });

  it('should create an action to clear error messages', () => {
    expect(clearErrorMessages(formId, ['foo'])).toMatchSnapshot();
    expect(clearErrorMessages(formId, ['foo', 'bar'])).toMatchSnapshot();
  });

  it('should create an action to clear form', () => {
    expect(clear(formId)).toMatchSnapshot();
  });

  it('should create an action to add list item', () => {
    expect(addListItem(formId, ['foo'])).toMatchSnapshot();
    expect(addListItem(formId, ['foo', 'bar'], 1)).toMatchSnapshot();
    expect(addListItem(formId, ['foo', 'bar', 0], 3, 5)).toMatchSnapshot();
  });

  it('should create an action to add list item with value', () => {
    expect(addListItemWithValue(formId, ['foo'], [{
      fieldName: ['bar'],
      value: 'Hello World'
    }])).toMatchSnapshot();
    expect(addListItemWithValue(formId, ['foo', 'bar'], [{
      fieldName: ['oof'],
      value: 'dlroW olleH'
    }])).toMatchSnapshot();
  });

  it('should create an action to remove list item', () => {
    expect(removeListItem(formId, ['foo'], 0)).toMatchSnapshot();
    expect(removeListItem(formId, ['foo', 'bar'], 0)).toMatchSnapshot();
  });

  it('should create an action to reorder list item', () => {
    expect(reorderListItem(formId, ['foo'], 0, 1)).toMatchSnapshot();
    expect(reorderListItem(formId, ['foo', 'bar'], 0, 1)).toMatchSnapshot();
  });

  it('should create an action to reorder list item incrementally', () => {
    expect(reorderListItemInc(formId, ['foo'], 0)).toMatchSnapshot();
    expect(reorderListItemInc(formId, ['foo'], 0, 2)).toMatchSnapshot();
    expect(reorderListItemInc(formId, ['foo', 'bar'], 0, 2)).toMatchSnapshot();
  });

  it('should create an action to reorder list item decrementally', () => {
    expect(reorderListItemDec(formId, ['foo'], 0)).toMatchSnapshot();
    expect(reorderListItemDec(formId, ['foo'], 0, 2)).toMatchSnapshot();
    expect(reorderListItemDec(formId, ['foo', 'bar'], 0, 2)).toMatchSnapshot();
  });
});
