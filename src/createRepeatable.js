import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { applyReducers } from 'soya-next/redux';
import reducers from './_reducers';
import {
  addListItem,
  removeListItem,
  reorderListItem,
  reorderListItemDec,
  reorderListItemInc,
} from './_actions';
import { STATE_NAME } from './_constants';
import createSelector from './_selectors';
import {
  getFieldNames,
} from './_utils';
import withForm from './withForm';
import _createRepeatable from './_createRepeatable';

const mapStateToProps = (state, props) => {
  const fieldNames = getFieldNames(props.name);
  const selector = createSelector(state);
  const length = selector.getLength(props.form.getFormId(), fieldNames);

  return {
    length: length > props.minLength ? length : props.minLength,
    name: fieldNames,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  addListItem: (fieldNames) => () => {
    dispatch(addListItem(props.form.getFormId(), fieldNames, props.minLength, props.maxLength));
  },
  removeListItem: (fieldNames) => (index) => {
    dispatch(removeListItem(props.form.getFormId(), fieldNames, index));
  },
  reorderListItem: (fieldNames) => (index, targetIndex) => {
    dispatch(reorderListItem(props.form.getFormId(), fieldNames, index, targetIndex));
  },
  reorderListItemDec: (fieldNames) => (index, amount) => {
    dispatch(reorderListItemDec(props.form.getFormId(), fieldNames, index, amount));
  },
  reorderListItemInc: (fieldNames) => (index, amount) => {
    dispatch(reorderListItemInc(props.form.getFormId(), fieldNames, index, amount));
  },
});

const mergeProps = (stateProps, dispatchProps, props) => ({
  ...props,
  ...stateProps,
  addListItem: dispatchProps.addListItem(stateProps.name),
  removeListItem: dispatchProps.removeListItem(stateProps.name),
  reorderListItem: dispatchProps.reorderListItem(stateProps.name),
  reorderListItemDec: dispatchProps.reorderListItemDec(stateProps.name),
  reorderListItemInc: dispatchProps.reorderListItemInc(stateProps.name),
});

export default compose(
  withForm,
  applyReducers({ [STATE_NAME]: reducers }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  _createRepeatable,
);
