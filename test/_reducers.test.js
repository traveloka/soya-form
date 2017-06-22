import {
  SET_ENABLED_STATE_ACTION_TYPE,
  SET_IS_SUBMITTING_ACTION_TYPE,
  SET_IS_VALIDATING_ACTION_TYPE,
  MERGE_FIELDS_ACTION_TYPE,
  SET_VALUE_ACTION_TYPE,
  SET_VALUES_ACTION_TYPE,
  SET_DEFAULT_VALUE_ACTION_TYPE,
  SET_DEFAULT_VALUES_ACTION_TYPE,
  CLEAR_FIELD_ACTION_TYPE,
  SET_ERRORS_ACTION_TYPE,
  ADD_ERRORS_ACTION_TYPE,
  CLEAR_ERRORS_ACTION_TYPE,
  CLEAR_FORM_ACTION_TYPE,
  ADD_LIST_ITEM_ACTION_TYPE,
  ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
  REMOVE_LIST_ITEM_ACTION_TYPE,
  REORDER_LIST_ITEM_ACTION_TYPE,
  REORDER_LIST_ITEM_DEC_ACTION_TYPE,
  REORDER_LIST_ITEM_INC_ACTION_TYPE,
} from '../src/_constants';
import reducers from '../src/_reducers';

describe('form reducers', () => {
  let formId, currentState;

  const reduceReducers = actions => actions.reduce((state, action) => reducers(state, action), undefined);
  const testReducers = actions => {
    actions.forEach(action => {
      const _previousState = currentState;
      currentState = reducers(currentState, action);
      expect({
        _previousState,
        currentState,
      }).toMatchSnapshot();
    });
  };
  const testErrorReducers = actions => {
    expect(() => reduceReducers(actions)).toThrowErrorMatchingSnapshot();
  };

  beforeEach(() => {
    formId = 'simpleForm';
    currentState = undefined;
  });

  it('should return initial state', () => {
    testReducers([{}]);
  });

  it('should handle SET_ENABLED_STATE_ACTION_TYPE', () => {
    testReducers([true, false].map(isEnabled => ({
      type: SET_ENABLED_STATE_ACTION_TYPE,
      formId,
      isEnabled,
    })));
  });

  it('should handle SET_IS_SUBMITTING_ACTION_TYPE', () => {
    testReducers([true, false].map(isSubmitting => ({
      type: SET_IS_SUBMITTING_ACTION_TYPE,
      formId,
      isSubmitting,
    })));
  });

  it('should handle SET_IS_VALIDATING_ACTION_TYPE', () => {
    testReducers([{
      foo: true,
    }, {
      foo: false,
    }].map(map => ({
      type: SET_IS_VALIDATING_ACTION_TYPE,
      formId,
      map,
    })));
  });

  it('should handle MERGE_FIELDS_ACTION_TYPE', () => {
    testReducers([{
      fields: [{
        fieldName: 'foo',
        object: {
          errorMessages: [],
          isEnabled: true,
          isValidating: false,
          touched: true,
          value: 'Hello',
        },
      }],
    }, {
      fields: [{
        fieldName: 'foo',
        object: {
          errorMessages: [
            'Error 1',
            'Error 2',
          ],
          isEnabled: false,
          isValidating: false,
          touched: true,
          value: 'Hello World',
        },
      }],
    }].map(action => ({
      type: MERGE_FIELDS_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle SET_VALUE_ACTION_TYPE', () => {
    testReducers([{
      fieldName: 'foo',
      value: 'Hello',
    }, {
      fieldName: 'foo',
      value: 'Hello World',
    }, {
      fieldName: 'foo',
      value: 'Hello World',
    }, {
      value: 'Hello World',
    }].map(action => ({
      type: SET_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle SET_VALUES_ACTION_TYPE', () => {
    testReducers([{
      values: [{
        fieldName: 'foo',
        value: 'Hello',
      }, {
        fieldName: 'bar',
        value: 'dlroW',
      }],
    }, {
      values: [{
        fieldName: 'foo',
        value: 'Hello World',
      }, {
        fieldName: 'bar',
        value: 'dlroW olleH',
      }],
    }].map(action => ({
      type: SET_VALUES_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle SET_DEFAULT_VALUE_ACTION_TYPE', () => {
    testReducers([{
      fieldName: 'foo',
      value: 'Hello',
    }, {
      fieldName: 'foo',
      value: 'Hello World',
    }].map(action => ({
      type: SET_DEFAULT_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle SET_DEFAULT_VALUES_ACTION_TYPE', () => {
    testReducers([{
      values: [{
        fieldName: 'foo',
        value: 'Hello',
      }, {
        fieldName: 'bar',
        value: 'dlroW',
      }],
    }, {
      values: [{
        fieldName: 'foo',
        value: 'Hello World',
      }, {
        fieldName: 'bar',
        value: 'dlroW olleH',
      }],
    }].map(action => ({
      type: SET_DEFAULT_VALUES_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle CLEAR_FIELD_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      type: SET_IS_VALIDATING_ACTION_TYPE,
      formId,
      map: {
        foo: false,
        bar: false,
      },
    }]);
    testReducers([{
      fieldName: 'foo',
    }, {
      fieldName: 'bar',
    }].map(action => ({
      type: CLEAR_FIELD_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle SET_ERRORS_ACTION_TYPE', () => {
    testReducers([{
      fieldName: 'foo',
      errorMessages: [
        'Error 1',
        'Error 2',
      ],
    }, {
      fieldName: 'foo',
      errorMessages: [
        'Error 3',
        'Error 4',
        'Error 5',
      ],
    }].map(action => ({
      type: SET_ERRORS_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle ADD_ERRORS_ACTION_TYPE', () => {
    testReducers([{
      errorMessages: [{
        fieldName: 'foo',
        errorMessages: [
          'Error 1',
          'Error 2',
        ],
      }, {
        fieldName: 'bar',
        errorMessages: [
          'Error 3',
          'Error 4',
        ],
      }],
    }, {
      errorMessages: [{
        fieldName: 'foo',
        errorMessages: [
          'Error 3',
          'Error 4',
          'Error 5',
        ],
      }, {
        fieldName: 'bar',
        errorMessages: [
          'Error 5',
          'Error 6',
        ],
      }],
    }].map(action => ({
      type: ADD_ERRORS_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle CLEAR_ERRORS_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      fieldName: 'foo',
      errorMessages: [
        'Error 1',
        'Error 2',
      ],
    }, {
      fieldName: 'bar',
      errorMessages: [
        'Error 3',
        'Error 4',
        'Error 5',
      ],
    }].map(action => ({
      type: SET_ERRORS_ACTION_TYPE,
      formId,
      ...action,
    })));
    testReducers([{
      fields: [{
        fieldName: 'foo',
      }],
    }, {
      fields: [{
        fieldName: 'bar',
      }],
    }].map(action => ({
      type: CLEAR_ERRORS_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle CLEAR_FORM_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      type: SET_IS_VALIDATING_ACTION_TYPE,
      formId,
      map: {
        foo: false,
        bar: false,
      },
    }]);
    testReducers([{
      type: CLEAR_FORM_ACTION_TYPE,
      formId,
    }]);
  });

  it('should handle ADD_LIST_ITEM_ACTION_TYPE', () => {
    testReducers([{
      fieldName: ['foo', 0],
    }, {
      fieldName: ['foo', 0],
    }, {
      fieldName: ['bar', 0],
      minLength: 3,
    }, {
      fieldName: ['bar', 0],
      maxLength: 3,
    }, {
      fieldName: ['bar', 0],
      maxLength: 2,
    }].map(action => ({
      type: ADD_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE', () => {
    testReducers([{
      values: [{
        fieldName: ['foo', 0],
        value: 'Hello',
      }, {
        fieldName: ['bar', 0],
        value: 'olleH',
      }],
    }, {
      values: [{
        fieldName: ['foo', 0],
        value: 'World',
      }, {
        fieldName: ['bar', 0],
        value: 'dlroW',
      }],
    }].map(action => ({
      type: ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle REMOVE_LIST_ITEM_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      fieldName: ['foo', 0],
    }, {
      fieldName: ['bar', 0],
    }].map(action => ({
      type: ADD_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));
    testReducers([{
      fieldName: ['foo', 0],
    }, {
      fieldName: ['bar', 0],
    }].map(action => ({
      type: REMOVE_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle REORDER_LIST_ITEM_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      values: [{
        fieldName: ['foo', 0],
        value: 'Hello',
      }, {
        fieldName: ['foo', 0],
        value: 'olleH',
      }, {
        fieldName: ['foo', 0],
        value: 'World',
      }, {
        fieldName: ['foo', 0],
        value: 'dlroW',
      }],
    }].map(action => ({
      type: ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
    testReducers([{
      fieldName: ['foo', 0],
      targetIndex: 2,
    }, {
      fieldName: ['foo', 3],
      targetIndex: 1,
    }].map(action => ({
      type: REORDER_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle REORDER_LIST_ITEM_DEC_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      values: [{
        fieldName: ['foo', 0],
        value: 'Hello',
      }, {
        fieldName: ['foo', 0],
        value: 'olleH',
      }, {
        fieldName: ['foo', 0],
        value: 'World',
      }, {
        fieldName: ['foo', 0],
        value: 'dlroW',
      }],
    }].map(action => ({
      type: ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
    testReducers([{
      fieldName: ['foo', 1],
      amount: 1,
    }, {
      fieldName: ['foo', 3],
      amount: 1,
    }].map(action => ({
      type: REORDER_LIST_ITEM_DEC_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should handle REORDER_LIST_ITEM_INC_ACTION_TYPE', () => {
    currentState = reduceReducers([{
      values: [{
        fieldName: ['foo', 0],
        value: 'Hello',
      }, {
        fieldName: ['foo', 0],
        value: 'olleH',
      }, {
        fieldName: ['foo', 0],
        value: 'World',
      }, {
        fieldName: ['foo', 0],
        value: 'dlroW',
      }],
    }].map(action => ({
      type: ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
    testReducers([{
      fieldName: ['foo', 0],
      amount: 1,
    }, {
      fieldName: ['foo', 2],
      amount: 1,
    }].map(action => ({
      type: REORDER_LIST_ITEM_INC_ACTION_TYPE,
      formId,
      ...action,
    })));
  });

  it('should throw error on inconsistent field', () => {
    testErrorReducers([{
      fieldName: ['foo'],
    }].map(action => ({
      type: ADD_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));

    testErrorReducers([{
      fieldName: ['foo', 0],
    }, {
      fieldName: ['foo', 'bar'],
    }].map(action => ({
      type: ADD_LIST_ITEM_ACTION_TYPE,
      formId,
      ...action,
    })));

    testErrorReducers([{
      fieldName: ['foo', 'bar'],
      value: 'Hello',
    }, {
      fieldName: ['foo', 'bar', 'oof'],
      value: 'Hello',
    }].map(action => ({
      type: SET_VALUE_ACTION_TYPE,
      formId,
      ...action,
    })));
  });
});
