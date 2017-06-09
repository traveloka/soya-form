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

// Simple field related actions.
export const setFormEnabledState = (formId, isEnabled) => ({
  type: SET_ENABLED_STATE_ACTION_TYPE,
  formId,
  isEnabled,
});

export const setFormIsSubmittingState = (formId, isSubmitting) => ({
  type: SET_IS_SUBMITTING_ACTION_TYPE,
  formId,
  isSubmitting,
});

export const setIsValidating = (formId, map) => ({
  type: SET_IS_VALIDATING_ACTION_TYPE,
  formId,
  map,
});

export const mergeFields = (formId, fields) => ({
  type: MERGE_FIELDS_ACTION_TYPE,
  formId,
  fields,
});

export const setValue = (formId, fieldName, value) => ({
  type: SET_VALUE_ACTION_TYPE,
  formId,
  fieldName,
  value,
});

export const setValues = (formId, values) => ({
  type: SET_VALUES_ACTION_TYPE,
  formId,
  values,
});

export const setDefaultValue = (formId, fieldName, value) => ({
  type: SET_DEFAULT_VALUE_ACTION_TYPE,
  formId,
  fieldName,
  value,
});

export const setDefaultValues = (formId, values) => ({
  type: SET_DEFAULT_VALUES_ACTION_TYPE,
  formId,
  values,
});

export const clearField = (formId, fieldName) => ({
  type: CLEAR_FIELD_ACTION_TYPE,
  formId,
  fieldName,
});

export const setErrorMessages = (formId, fieldName, errorMessages) => ({
  type: SET_ERRORS_ACTION_TYPE,
  formId,
  fieldName,
  errorMessages,
});

export const addErrorMessages = (formId, errorMessages) => ({
  type: ADD_ERRORS_ACTION_TYPE,
  formId,
  errorMessages,
});

export const clearErrorMessages = (formId, fieldNames) => ({
  type: CLEAR_ERRORS_ACTION_TYPE,
  formId,
  fields: fieldNames.map(fieldName => ({ fieldName })),
});

export const clear = (formId) => ({
  type: CLEAR_FORM_ACTION_TYPE,
  formId,
});

// Repeatable field related action.
export const addListItem = (formId, fieldName, minLength, maxLength) => ({
  type: ADD_LIST_ITEM_ACTION_TYPE,
  formId,
  fieldName,
  minLength,
  maxLength,
});

export const addListItemWithValue = (formId, fieldName, values) => ({
  type: ADD_LIST_ITEM_WITH_VALUE_ACTION_TYPE,
  formId,
  values: values.map(value => ({
    ...value,
    fieldName: fieldName.concat(value.fieldName),
  })),
});

export const removeListItem = (formId, fieldName, index) => ({
  type: REMOVE_LIST_ITEM_ACTION_TYPE,
  formId,
  fieldName: fieldName.concat(index),
});

export const reorderListItemInc = (formId, fieldName, index, amount = 1) => ({
  type: REORDER_LIST_ITEM_INC_ACTION_TYPE,
  formId,
  fieldName: fieldName.concat(index),
  amount,
});

export const reorderListItemDec = (formId, fieldName, index, amount = 1) => ({
  type: REORDER_LIST_ITEM_DEC_ACTION_TYPE,
  formId,
  fieldName: fieldName.concat(index),
  amount,
});

export const reorderListItem = (formId, fieldName, index, targetIndex) => ({
  type: REORDER_LIST_ITEM_ACTION_TYPE,
  formId,
  fieldName: fieldName.concat(index),
  targetIndex,
});
