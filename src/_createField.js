import React from 'react';
import PropTypes from 'prop-types';
import {
  CONTEXT_NAME,
} from './_constants';
import { formShape } from './_propTypes';
import {
  getDisplayName,
} from './_utils';

export default (Component) => {
  class CreateField extends React.Component {
    static displayName = getDisplayName('CreateField', Component);

    static propTypes = {
      form: formShape.isRequired,
      name: PropTypes.arrayOf(PropTypes.string).isRequired,
      isFormEnabled: PropTypes.bool.isRequired,
      isFormSubmitting: PropTypes.bool.isRequired,
      isDisabled: PropTypes.bool.isRequired,
      errorMessages: PropTypes.array.isRequired,
      isFieldEnabled: PropTypes.bool.isRequired,
      isValidating: PropTypes.bool.isRequired,
      touched: PropTypes.bool.isRequired,
      value: PropTypes.any,
      changeHandlers: PropTypes.arrayOf(PropTypes.func),
      changeValidators: PropTypes.arrayOf(PropTypes.func),
      createHandleChange: PropTypes.func.isRequired,
      asyncValidators: PropTypes.arrayOf(PropTypes.func),
      createHandleAsyncValidation: PropTypes.func.isRequired,
      submitValidators: PropTypes.arrayOf(PropTypes.func),
      createHandleValidateAll: PropTypes.func.isRequired,
    };

    static defaultProps = {
      changeHandlers: [],
      changeValidators: [],
      asyncValidators: [],
      submitValidators: [],
    };

    constructor(props, context) {
      super(props, context);
      this.__form = props.form;
      this.__asyncValidators = [];
      this.__changeValidators = [];
      this.__submitValidators = [];
    }

    componentWillMount() {
      const handleValidateAll = this.props.createHandleValidateAll([
        ...this.props.changeValidators,
        ...this.__changeValidators,
      ], [
        ...this.props.asyncValidators,
        ...this.__asyncValidators,
        ...this.props.submitValidators,
        ...this.__submitValidators,
      ]);
      this.__form.regField(this.props.name, handleValidateAll);
    }

    componentWillUnmount() {
      this.__form.unregField(this.props.name);
    }

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
        createHandleChange,
        createHandleAsyncValidation,
        changeValidators,
        asyncValidators,
        ...props,
      } = this.props;
      delete props.changeHandlers;
      delete props.createHandleValidateAll;
      delete props.submitValidators;

      const validators = [
        ...changeValidators,
        ...this.__changeValidators,
      ];
      props.handleChange = createHandleChange(validators);
      props.handleAsyncValidation = createHandleAsyncValidation(validators, [
        ...asyncValidators,
        ...this.__asyncValidators,
      ]);
      props.registerChangeValidators = this.registerChangeValidators;
      props.registerAsyncValidators = this.registerAsyncValidators;
      props.registerSubmitValidators = this.registerSubmitValidators;

      return <Component {...props} />;
    }
  }

  return CreateField;
};
