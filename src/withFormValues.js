import { set } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { STATE_NAME } from "./_constants";
import createSoyaFormSelector from "./_selectors";
import { getDisplayName } from "./_utils";

export default (FORM_ID, fieldNames) => Component => {
  const mapStateToProps = state => {
    let formValues = {};
    if (state[STATE_NAME]) {
      const soyaFormSelector = createSoyaFormSelector(state, FORM_ID);
      formValues = fieldNames.reduce((formValues, fieldName) => {
        const fieldPath = Array.isArray(fieldName) ? fieldName : [fieldName];
        const value = soyaFormSelector.getFieldValue(fieldPath);
        set(formValues, fieldPath, value);
        return formValues;
      }, {});
    }
    return { formValues };
  };

  return connect(mapStateToProps)(
    class extends React.Component {
      static displayName = getDisplayName("WithFormValues", Component);

      render() {
        const { formValues, ...props } = this.props;
        delete props.dispatch;
        return <Component formValues={formValues} {...props} />;
      }
    }
  );
};
