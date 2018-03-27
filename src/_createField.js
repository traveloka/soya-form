import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { formShape } from './_propTypes';
import {
  createValidate,
  createValidateAsync,
  getDisplayName,
  throwAndLogError,
} from './_utils';

export default Component => hoistStatics(class extends React.Component {
  static displayName = getDisplayName('CreateField', Component);

  static propTypes = {
    form: formShape.isRequired,
    name: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ])).isRequired,
    isFormEnabled: PropTypes.bool.isRequired,
    isFormSubmitting: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    errorMessages: PropTypes.array.isRequired,
    isFieldEnabled: PropTypes.bool.isRequired,
    isValidating: PropTypes.bool.isRequired,
    touched: PropTypes.bool.isRequired,
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    setDefaultValue: PropTypes.func.isRequired,
    changeHandlers: PropTypes.arrayOf(PropTypes.func),
    changeValidators: PropTypes.arrayOf(PropTypes.func),
    createHandleChange: PropTypes.func.isRequired,
    asyncValidators: PropTypes.arrayOf(PropTypes.func),
    submitValidators: PropTypes.arrayOf(PropTypes.func),
    addErrorMessages: PropTypes.func.isRequired,
    mergeFields: PropTypes.func.isRequired,
    toggleLock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    changeHandlers: [],
    changeValidators: [],
    asyncValidators: [],
    submitValidators: [],
    parseValue: value => value,
  };

  constructor(props, context) {
    super(props, context);
    this.__form = props.form;
    this.__asyncValidators = [];
    this.__changeValidators = [];
    this.__submitValidators = [];
  }

  componentWillMount() {
    const handleValidateAll = this.createHandleValidateAll();
    this.__form.regField(this.props.name, handleValidateAll);
  }

  componentWillUnmount() {
    this.__form.unregField(this.props.name);
  }

  addErrorMessages = errorMessages => this.props.addErrorMessages(this.props.name)(errorMessages);

  mergeFields = object => this.props.mergeFields(this.props.name)(object);

  setDefaultValue = value => this.props.setDefaultValue(this.props.name)(value);

  toggleLock = shouldLock => this.props.toggleLock(this.props.name)(shouldLock);

  lock = () => this.toggleLock(true);

  unlock = () => this.toggleLock(false);

  resolveAsyncValidation = errorMessages => {
    this.addErrorMessages(errorMessages);
    this.unlock();
    return errorMessages;
  };

  rejectAsyncValidation = error => {
    this.unlock();
    throwAndLogError(error);
  };

  createHandleChange = validators => this.props.createHandleChange(this.props.name)(validators);

  createHandleAsyncValidation = (validators, asyncValidators) => () => {
    const errorMessages = createValidate(validators)(this.props.value);
    if (errorMessages.length > 0) {
      return Promise.resolve(false);
    }

    if (asyncValidators.length === 0) {
      return Promise.resolve(true);
    }

    this.lock();
    return createValidateAsync(asyncValidators)(this.props.value)
      .then(this.resolveAsyncValidation)
      .catch(this.rejectAsyncValidation);
  };

  createHandleValidateAll = () => () => {
    const validators = [
      ...this.props.changeValidators,
      ...this.__changeValidators,
    ];
    const asyncValidators = [
      ...this.props.asyncValidators,
      ...this.__asyncValidators,
      ...this.props.submitValidators,
      ...this.__submitValidators,
    ];
    const errorMessages = createValidate(validators)(this.props.value);
    const createResult = isValid => {
      const { parseValue } = this.props;

      if (typeof parseValue !== 'function') {
        throw Error('ParseValue should be function');
      }

      return {
        isValid,
        value: parseValue(this.props.value),
        name: this.props.name,
      };
    };
    if (errorMessages.length > 0) {
      this.mergeFields({ errorMessages });
      return Promise.resolve(createResult(false));
    }

    if (asyncValidators.length === 0) {
      return Promise.resolve(createResult(true));
    }

    this.lock();
    return createValidateAsync(asyncValidators)(this.props.value)
      .then(this.resolveAsyncValidation)
      .then(errorMessages => createResult(errorMessages.length === 0))
      .catch(this.rejectAsyncValidation);
  };

  registerAsyncValidators(asyncValidators) {
    this.__asyncValidators = this.__asyncValidators.concat(asyncValidators);
  }

  registerChangeValidators(changeValidators) {
    this.__changeValidators = this.__changeValidators.concat(changeValidators);
  }

  registerSubmitValidators(submitValidators) {
    this.__submitValidators = this.__submitValidators.concat(submitValidators);
  }

  render() {
    const {
      changeValidators,
      asyncValidators,
      ...props
    } = this.props;
    delete props.createHandleChange;
    delete props.setDefaultValue;
    delete props.changeHandlers;
    delete props.submitValidators;
    delete props.addErrorMessages;
    delete props.mergeFields;
    delete props.toggleLock;

    const validators = [
      ...changeValidators,
      ...this.__changeValidators,
    ];
    props.setDefaultValue = this.setDefaultValue;
    props.handleChange = this.createHandleChange(validators);
    props.handleAsyncValidation = this.createHandleAsyncValidation(validators, [
      ...asyncValidators,
      ...this.__asyncValidators,
    ]);
    props.registerChangeValidators = this.registerChangeValidators;
    props.registerAsyncValidators = this.registerAsyncValidators;
    props.registerSubmitValidators = this.registerSubmitValidators;

    return <Component {...props} />;
  }
}, Component);
