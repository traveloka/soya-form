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
import createSelector from './_selectors';
import {
  getFieldNames,
} from './_utils';
import withForm from './withForm';
import _createRepeatable from './_createRepeatable';

const mapStateToProps = (state, props) => {
  const fieldNames = getFieldNames(props.name);
  const selector = createSelector(state, props.form.getFormId());
  const length = selector.getLength(fieldNames);
  const minLength = (typeof props.minLength === 'number') && props.minLength >= 0 ? props.minLength : 1;

  return {
    length: length >= minLength ? length : minLength,
    name: fieldNames,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  addListItem: fieldNames => () => {
    dispatch(addListItem(props.form.getFormId(), fieldNames, props.minLength, props.maxLength));
  },
  removeListItem: fieldNames => index => {
    dispatch(removeListItem(props.form.getFormId(), fieldNames, index));
  },
  reorderListItem: fieldNames => (index, targetIndex) => {
    dispatch(reorderListItem(props.form.getFormId(), fieldNames, index, targetIndex));
  },
  reorderListItemDec: fieldNames => (index, amount) => {
    dispatch(reorderListItemDec(props.form.getFormId(), fieldNames, index, amount));
  },
  reorderListItemInc: fieldNames => (index, amount) => {
    dispatch(reorderListItemInc(props.form.getFormId(), fieldNames, index, amount));
  },
});

export default compose(
  withForm,
  applyReducers(reducers),
  connect(mapStateToProps, mapDispatchToProps),
  _createRepeatable,
);
