import { compose } from 'redux';
import { connect } from 'react-redux';
import { applyReducers } from 'soya-next/redux';
import reducers, { initialState } from './_reducers';
import {
  addErrorMessages,
  mergeFields,
  setDefaultValue,
  setIsValidating,
  setValue,
} from './_actions';
import createSelector from './_selectors';
import {
  createValidate,
  getFieldNames,
} from './_utils';
import withForm from './withForm';
import _createField from './_createField';

/* eslint-disable complexity */
const mapStateToProps = (state, props) => {
  const formId = props.form.getFormId();
  const fieldNames = getFieldNames(props.name);
  const selector = createSelector(state, formId);
  const form = selector.getForm() || initialState.form;
  const field = selector.getField(fieldNames) || initialState.field;

  return {
    name: fieldNames,
    isFormEnabled: form.isEnabled,
    isFormSubmitting: form.isSubmitting,
    isDisabled: field.isValidating || !form.isEnabled || !field.isEnabled || form.isSubmitting,
    errorMessages: field.errorMessages,
    isFieldEnabled: field.isEnabled,
    isValidating: field.isValidating,
    touched: field.touched,
    value: typeof (field.value) === 'undefined' || field.value === null ? '' : field.value
  };
};
/* eslint-enable complexity */

const mapDispatchToProps = (dispatch, props) => ({
  mergeFields: fieldNames => object => {
    dispatch(mergeFields(props.form.getFormId(), [{
      fieldName: fieldNames,
      object,
    }]));
  },
  toggleLock: fieldNames => shouldLock => {
    dispatch(setIsValidating(props.form.getFormId(), { [fieldNames]: shouldLock }));
  },
  addErrorMessages: fieldNames => errorMessages => {
    dispatch(addErrorMessages(props.form.getFormId(), [{
      fieldName: fieldNames,
      errorMessages,
    }]));
  },
  setDefaultValue: fieldNames => value => {
    dispatch(setDefaultValue(props.form.getFormId(), fieldNames, value));
  },
  createHandleChange: fieldNames => validators => value => {
    const formId = props.form.getFormId();
    const newValue = props.normalize && props.normalize(value) || value;
    const errorMessages = createValidate(validators)(newValue);
    if (errorMessages.length === 0) {
      dispatch(setValue(formId, fieldNames, newValue));
    } else {
      dispatch(mergeFields(formId, [{
        fieldName: fieldNames,
        object: {
          errorMessages,
          value: newValue,
          touched: true,
        },
      }]));
    }
    props.changeHandlers && props.changeHandlers.forEach(changeHandler => changeHandler(newValue));
  },
});

export default compose(
  withForm,
  applyReducers(reducers),
  connect(mapStateToProps, mapDispatchToProps),
  _createField
);
