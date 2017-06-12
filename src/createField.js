import React from 'react';
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
import {
  STATE_NAME,
} from './_constants';
import createSelector from './_selectors';
import {
  createValidate,
  createValidateAsync,
  getFieldNames,
  throwAndLogError,
} from './_utils';
import withForm from './withForm';
import _createField from './_createField';

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
    value: field.value,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  setDefaultValue: (fieldNames) => (value) => {
    dispatch(setDefaultValue(props.form.getFormId(), fieldNames, value));
  },
  createHandleChange: (fieldNames) => (validators) => (value) => {
    const formId = props.form.getFormId();
    const errorMessages = createValidate(validators)(value);
    if (errorMessages.length === 0) {
      dispatch(setValue(formId, fieldNames, value));
    } else {
      dispatch(mergeFields(formId, [{
        fieldName: fieldNames,
        object: {
          errorMessages,
          value,
          touched: true,
        },
      }]));
    }
    props.changeHandlers.forEach((changeHandler) => changeHandler(value));
  },
});

const mergeProps = (stateProps, { dispatch, ...dispatchProps }, props) => {
  const formId = props.form.getFormId();
  const toggleLock = (shouldLock) => dispatch(setIsValidating(formId, { [stateProps.name]: shouldLock }));
  const lock = () => toggleLock(true);
  const unlock = () => toggleLock(false);
  const resolveAsyncValidation = (errorMessages) => {
    dispatch(addErrorMessages(formId, [{
      fieldName: stateProps.name,
      errorMessages,
    }]));
    unlock();
    return errorMessages;
  };
  const rejectAsyncValidation = (error) => {
    unlock();
    throwAndLogError(error);
  };

  return {
    ...props,
    ...stateProps,
    setDefaultValue: dispatchProps.setDefaultValue(stateProps.name),
    createHandleChange: dispatchProps.createHandleChange(stateProps.name),
    createHandleAsyncValidation: (validators, asyncValidators) => () => {
      const errorMessages = createValidate(validators)(stateProps.value);
      if (errorMessages.length > 0) {
        return Promise.resolve(false);
      }

      if (asyncValidators.length === 0) {
        return Promise.resolve(true);
      }

      lock();
      return createValidateAsync(asyncValidators)(stateProps.value)
        .then(resolveAsyncValidation)
        .catch(rejectAsyncValidation);
    },
    createHandleValidateAll: (validators, asyncValidators) => () => {
      const errorMessages = createValidate(validators)(stateProps.value);
      const createResult = (isValid) => ({
        isValid,
        value: stateProps.value,
        name: stateProps.name,
      });
      if (errorMessages.length > 0) {
        dispatch(mergeFields(formId, {
          fieldName: stateProps.name,
          object: { errorMessages },
        }));
        return Promise.resolve(createResult(false));
      }

      if (asyncValidators.length === 0) {
        return Promise.resolve(createResult(true));
      }

      lock();
      return createValidateAsync(asyncValidators)(stateProps.value)
        .then(resolveAsyncValidation)
        .then((errorMessages) => createResult(errorMessages.length === 0))
        .catch(rejectAsyncValidation);
    },
  };
};

export default compose(
  withForm,
  applyReducers({ [STATE_NAME]: reducers }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  _createField
);
