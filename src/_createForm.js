import React from 'react';
import PropTypes from 'prop-types';
import {
  addErrorMessages,
  clear,
  clearErrorMessages,
  mergeFields,
  setDefaultValue,
  setDefaultValues,
  setErrorMessages,
  setFormEnabledState,
  setFormIsSubmittingState,
  setValue,
  setValues,
} from './_actions';
import { CONTEXT_NAME } from './_constants';
import { formShape } from './_propTypes';
import {
  getDisplayName,
  throwAndLogError,
} from './_utils';

export const __createForm = (fields, fieldNames) => (formId, dispatch) => {
  const __fields = fields;
  const __fieldNames = fieldNames;
  const actionCreators = {
    lockSubmission: () => setFormIsSubmittingState(formId, true),
    unlockSubmission: () => setFormIsSubmittingState(formId, false),
    disable: () => setFormEnabledState(formId, false),
    enable: () => setFormEnabledState(formId, true),
    disableField(fieldName) {
      return this.disableFields([fieldName]);
    },
    enableField(fieldName) {
      return this.enableFields([fieldName]);
    },
    disableFields: fieldNames => mergeFields(formId, fieldNames.map(fieldName => ({
      fieldName,
      object: { isEnabled: false },
    }))),
    enableFields: fieldNames => mergeFields(formId, fieldNames.map(fieldName => ({
      fieldName,
      object: { isEnabled: true },
    }))),
    setValue: (fieldName, value) => setValue(formId, fieldName, value),
    setValues: values => setValues(formId, values),
    setDefaultValue: (fieldName, value) => setDefaultValue(formId, fieldName, value),
    setDefaultValues: values => setDefaultValues(formId, values),
    setErrors: (fieldName, errorMessages) => setErrorMessages(formId, fieldName, errorMessages),
    addErrors: errorMessages => addErrorMessages(formId, errorMessages),
    clearForm: () => clear(formId),
    clearErrors: fieldNames => clearErrorMessages(formId, fieldNames),
  };

  return {
    ...Object.keys(actionCreators).reduce((methods, name) => ({
      ...methods,
      [name]: (...args) => dispatch(actionCreators[name](...args)),
    }), {}),
    getFormId: () => formId,
    regField: (fieldNames, validateAll) => {
      __fields[fieldNames] = { validateAll };
      __fieldNames.push(fieldNames);
    },
    unregField: fieldNames => {
      delete __fields[fieldNames];
      const index = __fieldNames.findIndex(
        __fieldNames => __fieldNames.some(__fieldName => (
          fieldNames.some(fieldName => __fieldName === fieldName)
        ))
      );
      if (index !== -1) {
        __fieldNames.splice(index, 1);
      }
    },
    validateAll: () => {
      const promises = Object.keys(__fields).map(fieldName => __fields[fieldName].validateAll());
      return Promise.all(promises)
        .then(results => {
          let values = {};
          if (
            results.length > 0 &&
            results[0].name.length > 0 &&
            typeof results[0].name[0] === 'number'
          ) {
            values = [];
          }
          return results.reduce((newResult, result) => ({
            isValid: newResult.isValid && result.isValid,
            values: result.name.reduce((value, name, index) => {
              if (index === result.name.length - 1) {
                value[name] = result.value;
                return newResult.values;
              }
              if (!value.hasOwnProperty(name)) {
                value[name] = typeof result.name[index + 1] === 'number' ? [] : {};
              }
              return value[name];
            }, newResult.values),
          }), {
            isValid: true,
            values,
          });
        })
        .catch(throwAndLogError);
    },
    submit(submitFunc, validationFunc) {
      dispatch(clearErrorMessages(formId, __fieldNames));
      return this.validateAll()
        .then(result => {
          if (!result.isValid || !validationFunc) {
            submitFunc(result);
            return;
          }

          return Promise.resolve(validationFunc(result.values))
            .then(validationResult => {
              if (typeof validationResult === 'object' && !validationResult.isValid) {
                dispatch(addErrorMessages(formId, validationResult.errorMessages));
                result.isValid = false;
              }
              submitFunc(result);
            })
            .catch(error => {
              result.isValid = false;
              submitFunc(result);
              throwAndLogError(error);
            });
        })
        .catch(error => {
          throwAndLogError(error);
        });
    },
  };
};

export const _createForm = __createForm({}, []);

export default formId => Component => {
  class CreateForm extends React.Component {
    static displayName = getDisplayName('CreateForm', Component);

    static childContextTypes = {
      [CONTEXT_NAME]: formShape.isRequired,
    };

    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      formId: PropTypes.string,
    };

    getChildContext = () => ({
      [CONTEXT_NAME]: this.__form,
    });

    constructor(props, context) {
      super(props, context);
      this.__form = _createForm(formId || props.formId, props.dispatch);
    }

    render() {
      const props = { ...this.props };
      delete props.dispatch;
      delete props.formId;
      props.form = this.__form;
      return <Component {...props} />;
    }
  }
  return CreateForm;
};
