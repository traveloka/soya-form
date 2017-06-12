import { STATE_NAME } from '../src/_constants';
import createSelector from '../src/_selectors';

describe('simpleFormSelector', () => {
  const simpleFormId = 'simpleForm';
  const uninitializedFormId = 'uninitializedForm';
  const state = {
    [STATE_NAME]: {
      [simpleFormId]: {
        isEnabled: false,
        isSubmitting: false,
        fields: {
          foo: {
            bar: [
              {
                errorMessages: [],
                isEnabled: true,
                isValidating: false,
                touched: false,
                value: 'value 1',
              },
              {
                errorMessages: [],
                isEnabled: true,
                isValidating: false,
                touched: false,
                value: 'value 2',
              },
            ],
          },
        },
      },
      [uninitializedFormId]: {},
    },
  };
  const simpleFormSelector = createSelector(state, simpleFormId);
  const uninitializedFormSelector = createSelector(state, uninitializedFormId);
  const unknownFormSelector = createSelector(state, 'unknownForm');

  it('should get the values', () => {
    expect(uninitializedFormSelector.getValues()).toMatchSnapshot();
    expect(simpleFormSelector.getValues()).toMatchSnapshot();
  });

  it('should get the field', () => {
    expect(simpleFormSelector.getField(['foo', 'bar'])).toMatchSnapshot();
    expect(simpleFormSelector.getField(['foo', 'oof'])).toMatchSnapshot();
    expect(uninitializedFormSelector.getField(['foo', 'bar'])).toMatchSnapshot();
  });

  it('should get the field value', () => {
    expect(simpleFormSelector.getFieldValue(['foo', 'bar', 0])).toMatchSnapshot();
  });

  it('should get the form', () => {
    expect(unknownFormSelector.getForm()).toMatchSnapshot();
    expect(simpleFormSelector.getForm()).toMatchSnapshot();
  });

  it('should get the field length', () => {
    expect(simpleFormSelector.getLength(['foo', 'bar'])).toMatchSnapshot();
    expect(uninitializedFormSelector.getLength(['foo', 'bar'])).toMatchSnapshot();
  });

  it('should show whether the form has errors or not', () => {
    expect(uninitializedFormSelector.hasErrors()).toMatchSnapshot();
    expect(simpleFormSelector.hasErrors()).toMatchSnapshot();
  });

  it('should show whether the form is enabled or not', () => {
    expect(simpleFormSelector.isEnabled()).toMatchSnapshot();
  });

  it('should show whether the form is locking submission or not', () => {
    expect(simpleFormSelector.isSubmitting()).toMatchSnapshot();
  });
});
