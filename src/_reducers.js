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
} from './_constants';

import {
  isArray,
  isField,
  getFieldNames,
  removeObject,
  updateArray,
  removeArray,
  moveArray,
} from './_utils';

export const initialState = {
  field: {
    errorMessages: [],
    isEnabled: true,
    isValidating: false,
    touched: false,
    value: null,
  },
  fields: {
    array: [],
    object: {},
  },
  form: {
    isEnabled: true,
    isSubmitting: false,
  },
  forms: {},
};

const update = (reducer) => (state, action, fieldName) => {
  const newState = reducer(state[fieldName], action);
  if (isArray(state)) {
    return updateArray(state, newState, fieldName);
  }
  return {
    ...state,
    [fieldName]: newState,
  };
};

const field = (state = initialState.field, action) => {
  switch (action.type) {
    case SET_IS_VALIDATING_ACTION_TYPE:
      return {
        ...state,
        isValidating: action.isValidating,
        touched: true,
      };
    case SET_DEFAULT_VALUE_ACTION_TYPE:
    case SET_DEFAULT_VALUES_ACTION_TYPE:
    case SET_VALUE_ACTION_TYPE:
    case SET_VALUES_ACTION_TYPE:
    case ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE:
      if (state.value === action.value) {
        return state;
      }
      return {
        ...state,
        errorMessages: [],
        isEnabled: true,
        isValidating: false,
        touched: true,
        value: action.value,
      };
    case SET_ERRORS_ACTION_TYPE:
      return {
        ...state,
        errorMessages: action.errorMessages,
      };
    case ADD_ERRORS_ACTION_TYPE:
      return {
        ...state,
        errorMessages: state.errorMessages.concat(action.errorMessages),
      };
    case MERGE_FIELDS_ACTION_TYPE:
      return {
        ...state,
        ...action.object,
      };
    case CLEAR_ERRORS_ACTION_TYPE:
      return {
        ...state,
        errorMessages: [],
      };
    default:
      return state;
  }
};

const addField = (state, action) => {
  if (action.maxLength && state.length + 1 > action.maxLength) {
    if (state.length === action.maxLength) {
      return state;
    }
    return state.slice(0, action.maxLength);
  }
  const newState = update(field)(state, action, state.length);
  if (action.minLength && newState.length < action.minLength) {
    return addField(newState, action);
  }
  return newState;
};
const updateField = (state, action) => update(field)(state, action, action.fieldName);

const createFields = (initialState) => (state = initialState, action) => {
  const fieldName = action.fieldName[0];
  if (action.fieldName.length > 1) {
    if (isField(state[fieldName])) {
      throw new Error(`Unable to perform "${action.type}" action for "${action.fieldNames}" field, "${fieldName}" is a field`);
    }
    return updateFields(state, {
      ...action,
      fieldName: action.fieldName.slice(1),
    }, fieldName);
  }

  if (!isArray(state)) {
    switch (action.type) {
      case ADD_LIST_ITEM_ACTION_TYPE:
      case ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE:
      case REMOVE_LIST_ITEM_ACTION_TYPE:
      case REORDER_LIST_ITEM_ACTION_TYPE:
      case REORDER_LIST_ITEM_DEC_ACTION_TYPE:
      case REORDER_LIST_ITEM_INC_ACTION_TYPE:
        throw new Error(`"${action.type}" action expected an array state, got ${typeof state}`);
    }
  } else if (typeof fieldName !== 'number') {
    throw new Error(`"${fieldName}" field expected an object state, got array`);
  }

  const newAction = {
    ...action,
    fieldName,
  };

  switch (newAction.type) {
    case CLEAR_FIELD_ACTION_TYPE:
      return removeObject(state, fieldName);
    case SET_IS_VALIDATING_ACTION_TYPE:
    case SET_VALUE_ACTION_TYPE:
    case SET_VALUES_ACTION_TYPE:
    case SET_ERRORS_ACTION_TYPE:
    case ADD_ERRORS_ACTION_TYPE:
    case MERGE_FIELDS_ACTION_TYPE:
    case CLEAR_ERRORS_ACTION_TYPE:
      return updateField(state, newAction);
    case SET_DEFAULT_VALUE_ACTION_TYPE:
    case SET_DEFAULT_VALUES_ACTION_TYPE:
      if (state[fieldName]) {
        return state;
      }
      return updateField(state, newAction);
    case REMOVE_LIST_ITEM_ACTION_TYPE:
      return removeArray(state, fieldName);
    case ADD_LIST_ITEM_ACTION_TYPE:
    case ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE:
      return addField(state, newAction);
    case REORDER_LIST_ITEM_DEC_ACTION_TYPE:
      return moveArray(state, fieldName, fieldName - newAction.amount);
    case REORDER_LIST_ITEM_INC_ACTION_TYPE:
      return moveArray(state, fieldName, fieldName + newAction.amount);
    case REORDER_LIST_ITEM_ACTION_TYPE:
      return moveArray(state, fieldName, newAction.targetIndex);
  }
};

const arrayFields = createFields(initialState.fields.array);
const objectFields = createFields(initialState.fields.object);

const fields = (state, action) => {
  const fieldNames = getFieldNames(action.fieldName);
  if (fieldNames.length === 0) {
    return state;
  }
  const fieldName = fieldNames[0];
  const reducer = typeof fieldName === 'number' ? arrayFields : objectFields;
  return reducer(state, {
    ...action,
    fieldName: fieldNames,
    fieldNames: action.fieldNames || fieldNames.join('.'),
  });
};

const updateFields = update(fields);
const reduceFields = (state, action, values) => ({
  ...state,
  fields: values.reduce((state, valueAction) => fields(state, {
    ...action,
    ...valueAction,
  }), state.fields),
});

const form = (state = initialState.form, action) => {
  switch (action.type) {
    case SET_ENABLED_STATE_ACTION_TYPE:
      return {
        ...state,
        isEnabled: action.isEnabled,
      };
    case SET_IS_VALIDATING_ACTION_TYPE:
      return {
        ...state,
        fields: Object.keys(action.map).reduce((state, fieldName) => (
          fields(state, {
            ...action,
            fieldName,
            isValidating: action.map[fieldName],
          })
        ), state.fields),
      };
    case SET_IS_SUBMITTING_ACTION_TYPE:
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case CLEAR_FIELD_ACTION_TYPE:
      const newState = fields(state.fields, action);
      if (Object.keys(newState).length === 0) {
        return removeObject(state, 'fields');
      }
      return {
        ...state,
        fields: newState,
      };
    case SET_DEFAULT_VALUE_ACTION_TYPE:
    case SET_VALUE_ACTION_TYPE:
    case SET_ERRORS_ACTION_TYPE:
    case ADD_LIST_ITEM_ACTION_TYPE:
    case REMOVE_LIST_ITEM_ACTION_TYPE:
    case REORDER_LIST_ITEM_ACTION_TYPE:
    case REORDER_LIST_ITEM_DEC_ACTION_TYPE:
    case REORDER_LIST_ITEM_INC_ACTION_TYPE:
      return {
        ...state,
        fields: fields(state.fields, action),
      };
    case SET_DEFAULT_VALUES_ACTION_TYPE:
    case SET_VALUES_ACTION_TYPE:
    case ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE:
      return reduceFields(state, action, action.values);
    case ADD_ERRORS_ACTION_TYPE:
      return reduceFields(state, action, action.errorMessages);
    case CLEAR_ERRORS_ACTION_TYPE:
    case MERGE_FIELDS_ACTION_TYPE:
      return reduceFields(state, action, action.fields);
    case CLEAR_FORM_ACTION_TYPE:
      return {
        ...removeObject(state, 'fields'),
        isEnabled: true,
      };
  }
};

export default (state = initialState.forms, action) => {
  switch (action.type) {
    case SET_ENABLED_STATE_ACTION_TYPE:
    case SET_IS_VALIDATING_ACTION_TYPE:
    case SET_IS_SUBMITTING_ACTION_TYPE:
    case SET_DEFAULT_VALUE_ACTION_TYPE:
    case SET_DEFAULT_VALUES_ACTION_TYPE:
    case SET_VALUE_ACTION_TYPE:
    case SET_VALUES_ACTION_TYPE:
    case CLEAR_FIELD_ACTION_TYPE:
    case SET_ERRORS_ACTION_TYPE:
    case ADD_ERRORS_ACTION_TYPE:
    case MERGE_FIELDS_ACTION_TYPE:
    case CLEAR_FORM_ACTION_TYPE:
    case CLEAR_ERRORS_ACTION_TYPE:
    case ADD_LIST_ITEM_ACTION_TYPE:
    case ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE:
    case REMOVE_LIST_ITEM_ACTION_TYPE:
    case REORDER_LIST_ITEM_ACTION_TYPE:
    case REORDER_LIST_ITEM_DEC_ACTION_TYPE:
    case REORDER_LIST_ITEM_INC_ACTION_TYPE:
      return {
        ...state,
        [action.formId]: form(state[action.formId], action),
      };
    default:
      return state;
  }
};
