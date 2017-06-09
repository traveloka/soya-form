import { STATE_NAME } from './_constants';
import { isArray, isField } from './_utils';

const getState = (state) => state[STATE_NAME];

const getForm = (state, formId) => () => getState(state)[formId] || {};

const getValues = (field) => {
  if (!field) {
    return null;
  }
  if (isField(field)) {
    return field.value;
  }
  let values = {};
  if (isArray(field)) {
    values = [];
  }
  for (const name in field) {
    values[name] = getValues(field[name]);
  }
  return values;
};

const hasErrors = (field) => {
  if (!field) {
    return false;
  }
  if (field.errorMessages) {
    return field.errorMessages.length > 0;
  }
  if (isArray(field)) {
    return field.some((field) => hasErrors(field));
  }
  const fieldNames = Object.keys(field);
  return fieldNames.some((name) => hasErrors(field[name]));
};

export default (state, formId) => {
  const getForm = getForm(state, formId);
  const getFields = () => getForm().fields || null;

  const getField = (fieldNames) => {
    let field = getFields();
    if (!field) {
      return null;
    }
    for (const fieldName of fieldNames) {
      field = field[fieldName];
      if (!field) {
        return null;
      }
    }
    return field;
  };

  return {
    getValues: () => getValues(getFields()),
    getField,
    getFieldValue: (fieldNames) => {
      const field = getField(fieldNames);
      return field && field.value;
    },
    getForm,
    getLength: (fieldNames) => {
      const field = getField(fieldNames);
      if (!field) {
        return 0;
      }
      return field.length;
    },
    hasErrors: () => hasErrors(getFields()),
    isEnabled: () => getForm().isEnabled || false,
    isSubmitting: () => getForm().isSubmitting || false,
  };
};
