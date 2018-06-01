import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { STATE_NAME } from './_constants';
import createSoyaFormSelector from './_selectors';
import { connect } from 'react-redux';
import { getDisplayName } from './_utils';

/**
 * Utilities
 * Write: recursively write a value according `path to value` array
 * read it more here : https://gist.github.com/fawwaz/b037a105e41fa8ed7292b324abb07f42
 */

const initArrayIfnotExist = (obj, key, expectedSize) => {
  if (!obj[key]) {
    obj[key] = [];
  }

  // Fill empty index with empty object
  if (obj[key].length < expectedSize) {
    const delta = expectedSize - obj[key].length;
    for (let i = 0; i < delta; i++) {
      obj[key].push({});
    }
  }

  return obj;
};

const write = (obj, keys, v) => {
  if (keys.length === 0) {
    return v;
  }
  if (keys.length === 1) {
    obj[keys[0]] = v;
  } else {
    const [key, ...remainingKeys] = keys;
    const nextKey = remainingKeys[0];
    const nextRemainingKeys = remainingKeys.slice(1);

    if (typeof nextKey === "number") {
      // create array
      const expectedSize = nextKey + 1; // because js index start from 0
      initArrayIfnotExist(obj, key, expectedSize);

      // recursively write the object
      obj[key][nextKey] = write(obj[key][nextKey], nextRemainingKeys, v);
    } else {
      // recursively write the object
      obj[key] = write(
        typeof obj[key] === "undefined" ? {} : obj[key],
        remainingKeys,
        v
      );
    }
  }

  return obj;
};

export default (FORM_ID, fieldNames) => Component => {
  const mapStateToProps = state => {
    let formValues = {};
    if (state[STATE_NAME]) {
      const soyaFormSelector = createSoyaFormSelector(state, FORM_ID);
      fieldNames.forEach(fieldName => {
        const value = soyaFormSelector.getFieldValue(fieldName);
        formValues = write(formValues, fieldName, value);
      });
    }
    return {
      formValues,
    };
  };

  return connect(mapStateToProps)(hoistStatics(class extends React.Component {
    static displayName = getDisplayName('WithFormValues', Component);

    render() {
      return (
        <Component
          {...this.props}
        />
      );
    }
  }, Component));
};
