import PropTypes from 'prop-types';

export const formShape = PropTypes.shape([
  'lockSubmission',
  'unlockSubmission',
  'disable',
  'enable',
  'disableField',
  'enableField',
  'disableFields',
  'enableFields',
  'setValue',
  'setValues',
  'setDefaultValue',
  'setDefaultValues',
  'setErrors',
  'addErrors',
  'clearForm',
  'clearErrors',
  'getFormId',
  'regField',
  'unregField',
  'validateAll',
  'submit',
].reduce((propTypes, name) => ({
  ...propTypes,
  [name]: PropTypes.func.isRequired,
}), {}));
