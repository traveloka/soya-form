import React from 'react';
import { CONTEXT_NAME } from './_constants';
import { formShape } from './_propTypes';
import { getDisplayName } from './_utils';

export default Component => class extends React.Component {
  static displayName = getDisplayName('WithForm', Component);

  static contextTypes = {
    [CONTEXT_NAME]: formShape.isRequired,
  };

  static propTypes = {
    form: formShape,
  };

  render() {
    return (
      <Component
        {...this.props}
        form={this.props.form || this.context[CONTEXT_NAME]}
      />
    );
  }
};
